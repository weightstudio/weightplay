import {STAGES} from './stage-config.mjs';
import {createRace,advance,step,segmentFor,useFeather,bridgeOpen} from './simulation.mjs';
import {createStore,highestUnlocked} from './save.mjs';
import {createRenderer} from './render.mjs';

const W=window, $=id=>document.getElementById(id), store=createStore();
const labels={plain:'Steady rhythm',slow:'Slow steps',fast:'Quick steps',headfast:'Quick steps · headwind',headwind:'Headwind',tailwind:'Tailwind',left:'Left-foot gate',right:'Right-foot gate',bridge:'Step when bridge glows',fork:'Choose left or right',forkleft:'Choose left',forkright:'Choose right',forkwindbridge:'Left: wind · Right: bridge',forkgates:'Choose a gate',forkfast:'Choose left',forkslow:'Choose right',forkmaster:'Choose bridge or gate'};
const goals={finish:'Reach the finish',steady3:'Make three steady steps',balance40:'Finish with balance 40 or more',combo4:'Make four steady steps in a row','steady-no-stumble':'Three steady steps, no stumbles',balance35:'Finish with balance 35 or more',balance30:'Finish with balance 30 or more',stumble2:'No more than two stumbles',gates:'Pass each gate with the marked foot'};
const feedback={ready:'',steady:'Good step',timing:'Adjust your rhythm','same-foot':'Alternate feet','bridge-closed':'Wait for the bridge light',stumble:'Regain your balance',feather:'Bridge held open'};
const SKU='lantern-stride:star-trail';
let frame,rail,renderer=null,race=null,screen='main',tab='stages',modal=null,selected=highestUnlocked(store.progress),raf=0,last=0,saved=false,pending=null;
const audio=id=>W.WeightPlayAudio?.play(id);
const settingsOpen=()=>!!document.querySelector('#wp-frame-battle-settings:not([hidden])');
const config=()=>({gameId:'lantern-stride',count:STAGES.length,poster:'/games/lantern-stride/assets/cover.webp',background:'/assets/lobby-block-atmosphere.svg',stage:index=>{
  const s=STAGES[index],r=store.progress.records[s.id],locked=s.id>highestUnlocked(store.progress);
  return {id:s.id,kicker:`Chapter ${s.chapter}`,title:`Stage ${s.id}`,subtitle:s.checkpoint?'Festival challenge':'Forest course',status:locked?'Locked':r?`${r.stars}/3 stars`:'Ready',locked,cleared:!!r,rewardState:r?'collected':'not-collected',summary:goals[s.objective],details:[`${s.distance} m · ${s.limit} s`,s.route.map(x=>labels[x]).join(' → ')],poster:'/games/lantern-stride/assets/cover.webp'};
}});
function activate(next){
  cancelAnimationFrame(raf);raf=0;last=0;if(modal){$(modal).hidden=true;modal=null;}
  if(next!=='battle'){renderer?.dispose();renderer=null;race=null;}
  screen=next;document.body.dataset.screen=next;
  $('mainGroup').hidden=next!=='main';$('mainScreen').hidden=next!=='main';$('stageScreen').hidden=next!=='stage';$('battleScreen').hidden=next!=='battle';
  frame.activate(next);
  if(next==='stage'){setTab('stages');rail.setConfig(config(),selected-1);rail.refresh(selected-1);}
  $('mainProgress').textContent=`Stage ${highestUnlocked(store.progress)} / 60`;
}
function openModal(id){if(screen!=='stage'&&!race)return;modal=id;$(id).hidden=false;cancelAnimationFrame(raf);raf=0;last=0;$(id).querySelector('button')?.focus();}
function closeModal(){if(!modal)return;$(modal).hidden=true;modal=null;last=0;if(race?.status==='running'&&!document.hidden){$('leftBtn').focus({preventScroll:true});schedule();}}
function setTab(name){
  rail?.cancel();tab=name;
  for(const id of ['shoes','stages','collection']){const active=id===name,panel=$(id+'Panel');panel.hidden=!active;panel.classList.toggle('hidden',!active);panel.inert=!active;panel.setAttribute('aria-hidden',String(!active));$(id+'Tab').setAttribute('aria-selected',String(active));$(id+'Tab').tabIndex=active?0:-1;}
  if(name==='stages')rail?.refresh(selected-1);else renderManagement();
}
function renderManagement(){
  const entries=[['balanced','Balanced','Available from the start',0],['steady','Steady','Less penalty, slower acceleration',5],['swift','Swift','Faster acceleration, larger penalty',15]];
  $('shoeCards').replaceChildren(...entries.map(([id,name,effect,required],index)=>{
    const card=document.createElement('article'), art=document.createElement('div'), title=document.createElement('h3'), text=document.createElement('p'),button=document.createElement('button');
    card.className='item-card';art.className='item-art';art.style.setProperty('--ix',`${index*50}%`);art.style.setProperty('--iy','0%');art.setAttribute('role','img');art.setAttribute('aria-label',name);
    title.textContent=name;text.textContent=effect;const unlocked=!required||!!store.progress.records[required];
    button.type='button';button.disabled=!unlocked;button.textContent=!unlocked?`Clear stage ${required}`:store.progress.equippedShoe===id?'In use':'Equip';
    button.addEventListener('click',async()=>{const result=await store.equip(id);$('shoeStatus').textContent=result.ok?'Shoe saved':'Could not save selection';renderManagement();});card.append(art,title,text,button);return card;
  }));
  const wallet=W.WeightPlayWallet?.read(),owned=W.WeightPlayWallet?.owns(SKU)===true;
  $('walletBalance').textContent=wallet?.available?String(wallet.diamonds):'—';$('trailBtn').textContent=owned?(store.progress.equippedTrail==='star'?'In use':'Equip'):'Buy';$('trailBtn').disabled=!wallet?.available;
}
function schedule(){if(!raf&&screen==='battle'&&race?.status==='running'&&!modal&&!document.hidden&&!settingsOpen())raf=requestAnimationFrame(tick);}
function update(){
  if(!race)return;const part=segmentFor(race);
  $('distance').textContent=`${Math.floor(race.distance)} / ${race.stage.distance} m`;
  $('balance').textContent=`${Math.round(race.balance)}%`;
  $('time').textContent=`${Math.max(0,race.stage.limit-race.elapsed).toFixed(1)} s`;
  const bridge=part.rule==='bridge'?` · ${bridgeOpen(race)?'GO':'WAIT'}`:'';
  $('routeCue').textContent=`${goals[race.stage.objective]} · ${labels[part.choice?part.rule:part.original]||part.rule}${bridge}`;
  $('feedback').textContent=feedback[race.lastFeedback]||'';
  $('featherBtn').disabled=race.feather<=0||part.rule!=='bridge';
}
function tick(now){raf=0;if(screen!=='battle'||!race||modal||document.hidden||settingsOpen())return;const dt=last?Math.min(.05,(now-last)/1000):0;last=now;advance(race,dt);renderer.draw(race,matchMedia('(prefers-reduced-motion: reduce)').matches);update();if(race.status==='finished')void finish();else schedule();}
function action(foot){if(screen!=='battle'||!race||modal||document.hidden||settingsOpen())return;const out=step(race,foot);if(out.accepted)audio(out.clean?'movement.step':'feedback.error');update();}
async function persist(){if(!pending||pending.busy)return;const item=pending;item.busy=true;const result=await store.complete(item.id,item.outcome);item.busy=false;if(result.ok){W.WonderAnalytics?.completeStage?.(`stage-${item.id}`);if(pending===item)pending=null;}if(item.owner!==race||screen!=='battle'||modal!=='resultPanel')return;saved=result.ok;$('saveStatus').textContent=saved?'Progress saved':'Could not save progress. Retry while this page is open.';$('retrySave').hidden=saved;$('resultNext').disabled=!saved||item.id>=60;}
async function finish(){
  audio(race.result.won?'result.win':'result.lose');saved=false;pending=race.result.won?{id:selected,owner:race,outcome:{...race.result},busy:false}:null;
  $('resultTitle').textContent=race.result.won?'Course complete':'Try again';
  $('resultDetails').textContent=`${race.result.elapsed.toFixed(1)} s · ${race.result.stars} / 3 stars · ${race.result.reason}`;
  $('saveStatus').textContent='';$('retrySave').hidden=true;$('resultNext').disabled=true;openModal('resultPanel');
  if(pending)await persist();
}
function startStage(id){
  if(id<1||id>highestUnlocked(store.progress))return;
  selected=id;activate('battle');race=createRace(id,store.progress.equippedShoe);pending=null;saved=false;
  try{renderer=createRenderer($('arena'));renderer.setTrail(store.progress.equippedTrail==='star'&&W.WeightPlayWallet?.owns(SKU)===true);renderer.draw(race);update();audio('game.start');if(id===1&&!store.progress.tutorialComplete)openModal('helpPanel');else schedule();}
  catch(error){console.error('Renderer could not start',error);$('feedback').textContent='Graphics could not start. Return to stages and retry.';openModal('leavePanel');}
}
function toStages(){selected=Math.min(60,highestUnlocked(store.progress));activate('stage');}
function bind(){
  $('startBtn').addEventListener('click',()=>{audio('ui.click');selected=highestUnlocked(store.progress);activate('stage');});
  for(const name of ['shoes','stages','collection'])$(name+'Tab').addEventListener('click',()=>setTab(name));
  $('trailBtn').addEventListener('click',async()=>{if(W.WeightPlayWallet?.owns(SKU)){const result=await store.equipTrail('star',true);$('shopStatus').textContent=result.ok?'Appearance saved':'Could not save selection';renderManagement();}else openModal('buyPanel');});
  $('defaultTrail').addEventListener('click',async()=>{const result=await store.equipTrail('default',true);$('shopStatus').textContent=result.ok?'Appearance saved':'Could not save selection';renderManagement();});
  $('cancelBuy').addEventListener('click',closeModal);$('confirmBuy').addEventListener('click',async()=>{const button=$('confirmBuy');button.disabled=true;const result=await W.WeightPlayWallet.purchasePermanent(SKU,10);button.disabled=false;closeModal();if(result.ok&&W.WeightPlayWallet.owns(SKU)){const savedTrail=await store.equipTrail('star',true);$('shopStatus').textContent=savedTrail.ok?'Purchased and equipped':'Purchased; retry equipment save';audio('shop.purchase');}else{$('shopStatus').textContent=result.reason==='insufficient'?'Not enough diamonds':'Purchase unavailable';audio('feedback.error');}renderManagement();});
  $('stageBack').addEventListener('click',()=>activate('main'));$('battleBack').addEventListener('click',()=>openModal('leavePanel'));
  $('helpBtn').addEventListener('click',()=>openModal('helpPanel'));$('helpClose').addEventListener('click',async()=>{if(!store.progress.tutorialComplete)await store.completeTutorial();closeModal();});
  $('continueBtn').addEventListener('click',closeModal);$('leaveBtn').addEventListener('click',toStages);
  $('resultStages').addEventListener('click',toStages);$('resultReplay').addEventListener('click',()=>startStage(selected));$('resultNext').addEventListener('click',()=>{if(saved)startStage(selected+1);});$('retrySave').addEventListener('click',()=>void persist());
  for(const [id,foot] of [['leftBtn','left'],['rightBtn','right']])$(id).addEventListener('click',()=>action(foot));
  $('featherBtn').addEventListener('click',()=>{if(race&&useFeather(race)){audio('feedback.success');update();}});
  document.addEventListener('keydown',e=>{if(screen!=='battle'||modal||e.repeat)return;if(e.code==='ArrowLeft'||e.code==='KeyA'){e.preventDefault();action('left');}else if(e.code==='ArrowRight'||e.code==='KeyD'){e.preventDefault();action('right');}else if(e.code==='Escape'){e.preventDefault();openModal('leavePanel');}});
  W.addEventListener('blur',()=>{if(screen==='battle'&&race?.status==='running'&&!modal)openModal('leavePanel');});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&screen==='battle'&&race?.status==='running'&&!modal)openModal('leavePanel');});
  W.addEventListener('weightplay:interaction-state',()=>{if(settingsOpen()){cancelAnimationFrame(raf);raf=0;last=0;}else{last=0;schedule();}});
  W.addEventListener('resize',()=>renderer?.resize());W.addEventListener('storage',()=>{store.refresh();if(screen==='stage')rail.refresh(selected-1);});
  W.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);renderer?.dispose();renderer=null;});
}
async function boot(){
  if(!W.WeightPlayScreenFrame||!W.WeightPlayPlayUI)throw new Error('SHARED_RUNTIME_MISSING');
  W.WeightPlayGameEntryLoader?.begin(1);
  const scene=name=>({root:$(name+'Screen'),header:$(name+'Screen').querySelector('header'),content:$(name+'Content')});
  frame=W.WeightPlayScreenFrame.mount({root:$('gameFrame'),playUI:true,scenes:{main:scene('main'),stage:scene('stage'),battle:{...scene('battle'),headerInfo:$('battleInfo')}}});
  const info=W.WeightPlayScreenFrame.createGroup();for(const node of [...$('battleInfo').children])info.add(node);frame.battleTopUI.add(info);
  const tabs=W.WeightPlayScreenFrame.createGroup();for(const node of [...$('stageTabs').children])tabs.add(node);frame.commonDownButton.clear().add(tabs);frame.commonDownButton.element.setAttribute('role','tablist');$('stageTabs').hidden=true;
  rail=W.WeightPlayPlayUI.mountStage({page:$('stagesPanel'),rail:$('stageRail'),config:config(),selected:selected-1,onSelect:index=>{selected=index+1;},onStart:index=>{if(screen==='stage'&&tab==='stages')startStage(index+1);},isActive:()=>screen==='stage'&&tab==='stages'&&!modal});
  bind();activate('main');await $('poster').decode();W.WeightPlayGameEntryLoader?.assetProgress(1,1);$('startBtn').disabled=false;W.WeightPlayGameEntryLoader?.ready();
}
boot().catch(error=>{console.error(error);W.WeightPlayGameEntryLoader?.fail?.('load');});
