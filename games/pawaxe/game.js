import { stages,gear } from './campaign.js?v=4';
import { Combat } from './combat.js?v=5';
import { LOCALES,copy } from './locales.js?v=4';
import { loadSave,storeSave } from './save.js?v=4';
import { Expedition } from './expedition.js?v=4';
import { rollLoot,collectGear,promoteGear,shardsNeeded,MAX_RANK,dropChance,tier } from './loot.js?v=4';
import { expeditionCopy } from './expedition-copy.js?v=4';
import { companions,rollCompanion,collectCompanion,promoteCompanion } from './companions.js?v=4';
import { collectionCopy } from './collection-copy.js?v=4';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const save=loadSave();
try{const locale=localStorage.getItem('weightPlayLocale');if(LOCALES.includes(locale))save.locale=locale;}catch{}
if(!LOCALES.includes(save.locale))save.locale='zh-Hant';
let selected=save.unlocked, combat=null,renderer=null,raf=0,last=0,acc=0,node=0,runHp=0,runEnergy=100;
let state='idle',screen='main',runGeneration=0,transitionRemaining=0,modalKind='',resumeAction=null;
let feedbackUntil=0,feedbackText='',rendererModule=null;
let journey=null,runKit=null,runReward=0,runKills=0,runDrops=0,runCombo=0;
const t=k=>expeditionCopy[save.locale]?.[k]||copy[save.locale]?.[k]||copy.en[k]||k;
const zh=()=>save.locale==='zh-Hant'||save.locale==='zh-Hans';
const cc=()=>collectionCopy[save.locale]||collectionCopy.en;
const msg=(en,tw)=>zh()?tw:en;
const name=e=>zh()?(e.zh||e.name):e.name;
function persist(){if(!storeSave(save))feedback(msg('Storage unavailable: keep this tab open.','無法儲存，請保留此分頁。'),5);}
const locale=$('#locale');
locale.innerHTML=LOCALES.map(l=>`<option value="${l}">${({'zh-Hant':'繁體中文','zh-Hans':'简体中文',en:'English',ja:'日本語',ko:'한국어',ar:'العربية'})[l]||l}</option>`).join('');
locale.value=save.locale;
const frame=window.WeightPlayScreenFrame.mount({root:$('#frame'),localeSelect:locale,scenes:{
  main:{root:$('#main'),header:$('#main header'),content:$('.hero')},
  stage:{root:$('#stage'),header:$('#stage header'),content:$('.workspace'),headerInfo:$('#stageInfo')},
  battle:{root:$('#battle'),header:$('#battle header'),content:$('.battle-area'),headerInfo:$('#battleInfo')}
}});
let rail=null;
function fit(){
  if(screen==='main')return;
  const vv=visualViewport,w=Math.min(920,vv?.width||innerWidth),h=vv?.height||innerHeight;
  const scale=Math.min(w/390,h/780);
  const root=$('#'+screen);
  Object.assign(root.style,{width:`${w/scale}px`,height:`${h/scale}px`,left:`${((vv?.width||innerWidth)-w)/2+(vv?.offsetLeft||0)}px`,top:`${vv?.offsetTop||0}px`,transform:`scale(${scale})`});
  if(screen==='stage')rail?.center();
  renderer?.resize();
}
function stopLoop(){cancelAnimationFrame(raf);raf=0;}
function startLoop(){stopLoop();last=performance.now();acc=0;raf=requestAnimationFrame(loop);}
function disposeRun(){runGeneration++;stopLoop();renderer?.dispose();renderer=null;combat=null;state='idle';}
function show(id){
  if(id!=='battle')disposeRun();
  screen=id;['main','stage','battle'].forEach(x=>$('#'+x).hidden=x!==id);
  document.body.dataset.screen=id;document.documentElement.classList.toggle('playing',id!=='main');
  document.documentElement.style.overflow=id==='main'?'':'hidden';document.documentElement.style.overscrollBehavior=id==='main'?'contain':'none';
  document.body.style.overflow=id==='main'?'':'hidden';document.body.style.overscrollBehavior=id==='main'?'contain':'none';
  $('#modal').hidden=true;modalKind='';$('.battle-area').inert=false;frame.activate(id);fit();
  if(id==='stage'){selected=save.unlocked;selectTab('stage');renderStage();}
  if(id==='main')$('#progress').textContent=`${t('stages')} ${save.unlocked} / 30`;
}
function localize(){
  document.documentElement.lang=save.locale;document.documentElement.dir=save.locale==='ar'?'rtl':'ltr';
  $$('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  $('#progress').textContent=`${t('stages')} ${save.unlocked} / 30`;
  $('#stageHint').textContent=msg('Drag to explore · tap a stage to play','左右拖曳探索 · 點選關卡開始');
  $('#allyDescription').textContent=cc().rosterHint;
  const sections=[[t('companion'),cc().rosterHint],[t('equipment'),`${t('dropRate')}: 2.5% → 7% · ${t('boss')}: 18%.`],[t('journey'),t('leaveText')]];
  $('#guideDetails').replaceChildren(...sections.map(([h,p])=>{const s=document.createElement('section');const title=document.createElement('h3');title.textContent=h;const text=document.createElement('p');text.textContent=p;s.append(title,text);return s;}));
  frame.refresh();renderEquipment();renderCompanions();if(rail)rail.refresh();
}
function renderStage(){
  $('#stageNum').textContent=`${save.unlocked}/30`;
  if(!rail)rail=window.WeightPlayStageV6.install($('#rail'),{total:()=>stages.length,poolSize:9,initialIndex:()=>save.unlocked-1,
    bind:(card,i)=>{const s=stages[i];card.className='stage-card';card.setAttribute('aria-disabled',String(s.id>save.unlocked));
      card.innerHTML=`<div data-wp-item-content><strong>${t('stages')} ${s.id}</strong><h3>${name(s)}</h3><div>${s.checkpoint?t('boss'):t('forest')}</div><small>${save.cleared.includes(s.id)?t('cleared'):s.id<=save.unlocked?t('ready'):t('locked')}</small></div>`;},
    activate:i=>{if(i+1<=save.unlocked){selected=i+1;startRun();}}
  });
  else rail.refresh();
  requestAnimationFrame(()=>{rail?.center(save.unlocked-1);fit();});renderEquipment();
  renderCompanions();
}
function objectImage(id){const img=document.createElement('img');img.className='object-icon';img.src=`art/objects/${id}.png`;img.alt='';img.width=80;img.height=80;return img;}
function renderCompanions(){
  $('#companions').replaceChildren(...companions.map((c,i)=>{
    const d=document.createElement('article'),item=save.companions[c.id],rank=item?.rank||0;d.className='gear companion';d.dataset.companion=c.id;d.classList.toggle('unowned',!item);
    const title=document.createElement('b');title.textContent=cc().names[i];
    const ability=document.createElement('p');ability.className='ability';ability.textContent=`${cc().skills[i]} · ${cc().descriptions[i]}`;
    const stat=document.createElement('p');stat.textContent=`${t('rank')} ${rank+1} · +${rank*8}%`;
    const shards=document.createElement('p');shards.className='shards';shards.textContent=item?`${t('shards')} ${item.shards}/${shardsNeeded(rank)}`:`${t('dropFrom')} ${c.unlock}`;
    const equip=document.createElement('button');equip.textContent=save.companion===c.id?t('equipped'):t('equip');equip.disabled=!item||save.companion===c.id;
    equip.onclick=()=>{save.companion=c.id;persist();renderCompanions();};
    const upgrade=document.createElement('button');upgrade.textContent=rank===MAX_RANK?`${t('rank')} MAX`:t('promote');upgrade.disabled=!item||rank===MAX_RANK||item.shards<shardsNeeded(rank);
    upgrade.onclick=()=>{if(promoteCompanion(save,c.id)){persist();renderCompanions();}};
    d.append(objectImage(c.id),title,ability,stat,shards,equip,upgrade);return d;
  }));
}
const gearZh=['旅途斧','破盾斧','輕快斧','旅途兜帽','稜鏡面罩','斥候背心','樹皮護甲','旅途手套','鐵護腕','旅途靴','沼澤靴','橡果護符','月光護符','銅戒','節拍環'];
function renderEquipment(){
  $('#coins').textContent=`${t('collection')} ${Object.keys(save.collection).length} / ${gear.length}`;
  $('#equipment').replaceChildren(...gear.map(g=>{
    const d=document.createElement('div');d.className='gear';const i=gear.indexOf(g),equipped=save.loadout.includes(g.id),item=save.collection[g.id],level=item?.rank||0;
    d.dataset.gear=g.id;d.dataset.tier=tier(g);d.classList.toggle('unowned',!item);
    const icon=objectImage(g.id);
    const b=document.createElement('b');b.textContent=zh()?gearZh[i]:g.name;
    const p=document.createElement('p');
    const power=Math.round(((g.slot==='axe'?.12:.025)*level+(g.slot==='axe'?.15:.035)*tier(g))*100);
    const weaponBase={'trail-axe':24,'breaker-axe':28,'quick-axe':18},healthBase=g.id==='bark-vest'?25:g.id==='scout-vest'?10:0;
    p.textContent=`${t('rank')} ${level+1} · ${t('attackPower')} ${g.slot==='axe'?Math.round(weaponBase[g.id]*(1+power/100)):`+${power}%`}${g.slot==='axe'?'':` · ${t('healthPower')} +${healthBase+level*6+tier(g)*8}`}`;
    const shards=document.createElement('p');shards.className='shards';shards.textContent=item?`${t('shards')} ${item.shards}/${shardsNeeded(level)}`:`${t('dropFrom')} ${Math.max(1,g.unlock)}`;
    const ability=document.createElement('p');ability.className='ability';ability.textContent=cc().abilities[i];
    d.append(icon,b,ability,p,shards);
    const equip=document.createElement('button');equip.textContent=equipped?t('equipped'):t('equip');equip.disabled=equipped||!item;
    equip.onclick=()=>{save.loadout=save.loadout.filter(id=>gear.find(x=>x.id===id)?.slot!==g.slot);save.loadout.push(g.id);persist();renderEquipment();};d.append(equip);
    const u=document.createElement('button');u.textContent=level===MAX_RANK?`${t('rank')} MAX`:t('promote');u.disabled=!item||level===MAX_RANK||item.shards<shardsNeeded(level);
    u.onclick=()=>{if(promoteGear(save,g.id)){persist();renderEquipment();}};d.append(u);return d;
  }));
}
function selectTab(tab){$$('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));['ally','stage','equip'].forEach(x=>$('#'+x+'Panel').hidden=x!==tab);if(tab==='stage')requestAnimationFrame(()=>rail?.center());}
function sound(kind,strong=false){
  const cue={hit:"weapon.axe.hit",critical:"combat.critical",break:"combat.shield.break",hurt:"player.hurt",perfect:"combat.critical",block:"combat.block",ally:"magic.cast",defeat:"enemy.defeat",counter:"combat.critical",heal:"magic.heal",swing:"weapon.axe.swing"}[kind];
  if(cue)return window.WeightPlayAudio?.play(cue);
}
function feedback(text,seconds=1.4){feedbackText=text;feedbackUntil=performance.now()+seconds*1000;$('#feedback').textContent=text;}
async function startRun(){
  disposeRun();node=0;runHp=0;runEnergy=100;runReward=0;runKills=0;runDrops=0;runCombo=0;
  journey=new Expedition(stages[selected-1]);runKit=JSON.parse(JSON.stringify({loadout:save.loadout,mode:save.mode,collection:save.collection,companion:save.companion,companions:save.companions}));show('battle');state='loading';
  lootQueue.length=0;$('#lootToast').hidden=true;$('#damageNumbers').replaceChildren();updateProgress();
  const generation=runGeneration;dialog(t('title'),msg('Preparing the forest…','正在準備森林…'),[], 'loading');
  try{
    if(!rendererModule){let timer;try{rendererModule=await Promise.race([import('./renderer-3d.js?v=4'),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('LOAD_TIMEOUT')),15000);})]);}finally{clearTimeout(timer);}}
    if(generation!==runGeneration||screen!=='battle')return;
    renderer=new rendererModule.PawRenderer($('#canvas'));renderer.setCompanion(runKit.companion);renderer.setRegion(Math.floor((selected-1)/5));
    closeDialog();startEncounter();
    if(!save.tutorial){dialog(t('guide'),t('guideText'),[[t('continue'),()=>{save.tutorial=true;persist();resume();}]],'tutorial');}
  }catch(error){if(generation!==runGeneration)return;renderer?.dispose();renderer=null;state='error';dialog(msg('Forest unavailable','森林載入失敗'),msg('This game needs WebGL 2. Retry, or return to stages.','此遊戲需要 WebGL 2。你可以重試或返回關卡。'),[[t('replay'),startRun],[t('returnStages'),()=>show('stage')]],'error');console.warn('Pawaxe renderer:',error.message);}
}
function startEncounter(){
  const stage={...stages[selected-1],encounters:[journey.encounter()]};
  combat=new Combat(stage,runKit.loadout,runKit.mode,0,{}, {collection:runKit.collection,autoAttack:save.autoAttack,companion:runKit.companion,companionRank:runKit.companions[runKit.companion].rank});
  combat.slashes=runCombo;
  if(runHp>0)combat.hp=Math.min(combat.maxHp,runHp);combat.energy=runEnergy;
  renderer.setEnemies(combat.alive());state='live';transitionRemaining=0;
  $('#targets').classList.toggle('two-rows',combat.enemies.some(e=>e.slot>=3));
  $('.arena').classList.toggle('two-rows',combat.enemies.some(e=>e.slot>=3));
  $('#allyPortrait').src=`art/objects/${runKit.companion}.png`;
  $('#hudStage').textContent=`${selected}/30`;updateProgress();updateHud();startLoop();
}
function resume(){closeDialog();state='live';startLoop();$('#canvas').focus();}
function loop(now){
  if(!renderer||!combat||!['live','transition'].includes(state))return;
  if(now>lootUntil){$('#lootToast').hidden=true;if(lootQueue.length)showLoot(lootQueue.shift());}
  for(const n of $('#damageNumbers').children)if(now>Number(n.dataset.until))n.remove();
  const delta=Math.min(.1,Math.max(0,(now-last)/1000));last=now;
  if(document.querySelector('.wp-frame-popover:not([hidden])')){last=now;raf=requestAnimationFrame(loop);return;}
  if(state==='transition'){
    transitionRemaining-=delta;renderer.walk(delta,.9-transitionRemaining);renderer.render(delta,combat);
    if(transitionRemaining<=0){journey.advance();node=journey.wave;startEncounter();return;}
  }else{
    acc=Math.min(acc+delta,.12);
    while(acc>=1/60){combat.tick(1/60);acc-=1/60;}
    for(const e of combat.events.splice(0)){
      renderer.event(e);sound(e.critical?'critical':e.type,e.critical||e.heavy);
      if(e.type==='defeat'){
        runKills++;
        const id=e.summon?null:rollLoot(selected,e.boss);
        if(id){const item=collectGear(save,id);runDrops++;persist();showLoot(item);}
        const companionId=e.summon?null:rollCompanion(selected,e.boss);
        if(companionId){const item=collectCompanion(save,companionId);runDrops++;persist();showLoot(item);}
      }
      const labels={perfect:msg('Perfect guard! Counter now.','完美格擋！趁隙反擊'),block:msg('Blocked · counter window','格擋成功 · 反擊窗口'),break:msg('Shield broken!','護盾破碎！'),counter:msg('Counter strike!','反擊重擊！'),interrupt:msg('Cast interrupted','施法已打斷'),reflect:msg('Reflected! Use Nibs first.','亮面反彈！先用栗栗解除'),exhausted:msg('Stamina empty — recover','耐力耗盡 · 解除守勢恢復'),phase:msg('Guardian changes phase','首領進入下一階段'),heal:msg('Health restored','生命恢復')};
      if(labels[e.type])feedback(labels[e.type]);
      if(e.type==='dodge')feedback(cc().status[4]);
      if(e.type==='absorb')feedback(`${cc().status[5]} ${e.amount}`);
      if(e.type==='hit'||e.type==='hurt'){
        const box=$('#damageNumbers'),key=e.type==='hurt'?'player':String(e.uid);
        box.querySelector(`[data-target="${key}"]`)?.remove();
        const n=document.createElement('strong'),point=e.type==='hurt'?{x:50,y:74}:renderer.impactPoint(e.uid);
        n.dataset.target=key;n.dataset.until=now+(e.critical?850:600);n.className=e.type==='hurt'?'hurt':e.critical?'critical':'';
        n.style.left=`${point.x}%`;n.style.top=`${point.y}%`;
        const amount=e.type==='hurt'?`−${e.amount} HP`:e.amount>0?`${e.amount}`:`${msg('Shield','盾')} −${e.shield}`;
        if(e.critical){const label=document.createElement('small');label.textContent=t('critical');n.append(label,document.createTextNode(amount));}else n.textContent=amount;
        box.append(n);while(box.children.length>4)box.firstElementChild.remove();
      }
    }
    renderer.setEnemies(combat.alive());updateHud();renderer.render(delta,combat);
    if(combat.lost){finish(false);return;}if(combat.won){encounterWon();return;}
  }
  raf=requestAnimationFrame(loop);
}
function updateHud(){
  $('#hp').textContent=Math.ceil(combat.hp);
  const playerHp=$('#playerHp');playerHp.max=combat.maxHp;playerHp.value=combat.hp;playerHp.setAttribute('aria-valuetext',`${Math.ceil(combat.hp)} / ${Math.ceil(combat.maxHp)}`);
  $('#barrierStatus').textContent=combat.barrier>0?cc().status[5]:'';
  $('#attackValue').textContent=`${t('combo')} ${combat.slashes} · ${combat.slashes%8}/8`;
  $('#auto').classList.toggle('active',save.autoAttack);$('#auto').setAttribute('aria-pressed',String(save.autoAttack));
  $('#autoValue').textContent=save.autoAttack?t('on'):t('off');$('#energy').textContent=`${Math.floor(combat.energy)} / 100`;
  $('#allyName').textContent=cc().names[companions.findIndex(c=>c.id===runKit.companion)];
  $('#allyMeter').value=combat.energy;$('#ally').disabled=combat.energy<100||combat.allyCd>0;
  const enemies=combat.alive(),box=$('#targets');
  for(const b of [...box.children])if(!enemies.some(e=>e.uid===+b.dataset.uid))b.remove();
  enemies.forEach((e,i)=>{
    let b=box.querySelector(`[data-uid="${e.uid}"]`);
    if(!b){b=document.createElement('button');b.className='target';b.dataset.uid=e.uid;b.innerHTML='<strong></strong><progress class="enemy-hp" aria-label="Enemy health"></progress><progress class="enemy-shield" max="1" aria-label="Enemy shield"></progress><small></small><progress class="enemy-clock" max="1" aria-label="Enemy attack warning"></progress>';b.onclick=()=>{if(state==='live'){combat.target=combat.alive().findIndex(x=>x.uid===e.uid);action('attack');}};box.append(b);}
    b.style.gridColumn=String(e.slot>=3?e.slot-2:e.slot+1);b.style.gridRow=e.slot>=3?'2':'1';
    b.setAttribute('aria-pressed',String(i===combat.target));b.classList.toggle('warn',e.warned);b.classList.toggle('boss',e.boss);b.querySelector('strong').textContent=`${e.boss?`${t('boss')} · `:''}${name(e)}`;
    const healthBar=b.querySelector('.enemy-hp');healthBar.max=e.maxHp;healthBar.value=e.hp;
    const shieldBar=b.querySelector('.enemy-shield');shieldBar.max=Math.max(1,e.maxShield||1);shieldBar.value=e.shield;shieldBar.hidden=e.shield<=0;
    const protectedBySupport=e.boss&&enemies.some(x=>x!==e&&['anchor','mirror-left','mirror-right','root-drain','root-crack'].includes(x.id));
    b.querySelector('small').textContent=protectedBySupport?msg('Destroy support first','先擊破支援目標'):e.id==='boss-heart'&&e.phase===3&&e.opening<=0?msg('Core opens after attack','出招後心核會暴露'):e.reflect>0?msg('Mirror armor','鏡面護甲'):e.opening>0?msg('Opening!','破綻！'):e.shield>0?msg('Shield active','護盾中'):'';
    b.querySelector('.enemy-clock').value=e.warned?1-Math.max(0,e.t)/e.warn:0;
  });
  const threat=enemies.filter(e=>e.warned).sort((a,b)=>a.t-b.t)[0];
  $('#warning').textContent=threat?`${name(threat)} · ${msg('Incoming','即將出手')} ${Math.max(0,threat.t).toFixed(1)} s`:t('tap');
  $('#status').textContent=[combat.barrier>0?`${cc().status[0]} ${Math.ceil(combat.barrier)}`:'',...Object.entries(combat.status).filter(([,v])=>v>0).map(([k,v])=>`${k==='crack'?msg('Crack','裂痕'):cc().status[k==='burn'?1:2]} ${v.toFixed(1)}s`)].filter(Boolean).join(' · ');
  if(performance.now()>feedbackUntil)$('#feedback').textContent='';else $('#feedback').textContent=feedbackText;
}
function encounterWon(){
  stopLoop();
  // A cleared wave gives a small breather, while keeping early-stage farming
  // meaningful instead of restoring a full bar after every encounter.
  runHp=Math.min(combat.maxHp,combat.hp+combat.maxHp*.05);runEnergy=Math.min(100,combat.energy+18);runCombo=combat.slashes;
  if(journey.clear()){
    const first=!save.cleared.includes(selected);
    runReward=first?stages[selected-1].reward*(stages[selected-1].checkpoint?2:1):5;
    if(first)save.cleared.push(selected);save.coins=Math.min(999999,save.coins+runReward);save.unlocked=Math.max(save.unlocked,Math.min(30,selected+1));persist();
  }
  updateProgress();state='transition';transitionRemaining=.9;feedback(t('moving'),.9);startLoop();
}
function updateProgress(){
  const percent=Math.round((journey?.progress||0)*100),complete=journey?.completed===true;
  $('#routeProgress').value=percent;$('#routeProgress').setAttribute('aria-label',t('journey'));
  $('#routeLabel').textContent=complete?t('farm'):`${t('journey')} ${Math.min(journey?.cleared||0,journey?.length||12)}/${journey?.length||12}`;
  $('#routePercent').textContent=`${percent}%`;
  $('#claim').disabled=!complete;$('#claim').textContent=complete?`✓ ${t('claim')}`:'—';
  $('#claim').classList.toggle('complete',complete);
}
let lootUntil=0;const lootQueue=[];
function showLoot(item){
  if(!$('#lootToast').hidden){lootQueue.push(item);if(lootQueue.length>8)lootQueue.shift();return;}
  const g=gear.find(g=>g.id===item.id),index=gear.indexOf(g);
  $('#lootIcon').src=`art/objects/${item.id}.png`;
  const title=item.kind==='companion'?cc().names[companions.findIndex(c=>c.id===item.id)]:zh()?gearZh[index]:g.name;
  const label=item.kind==='companion'?(item.fresh?cc().newAlly:cc().allyShard):(item.fresh?t('newItem'):t('loot'));
  $('#lootText').textContent=`${label} · ${title}${item.fresh?'':` · ${item.shards}/${shardsNeeded(item.rank)}`}`;
  $('#lootToast').hidden=false;lootUntil=performance.now()+1800;
}
function finish(win){
  stopLoop();state='result';win=win||journey.completed;
  const text=win?`${name(stages[selected-1])}\n${t('reward')} +${runReward} · ${t('kills')} ${runKills} · ${cc().lootTotal} ${runDrops}`:t('failText');
  dialog(win?t('victory'):t('fail'),text,[[t('returnStages'),()=>show('stage')],[t('next'),()=>{selected++;startRun();},!win||selected===30],[t('replay'),startRun]],'result');
}
function closeDialog(){
  $('#modal').hidden=true;$('.battle-area').inert=false;modalKind='';frame.activate('battle');
}
function dialog(title,text,actions,kind='pause'){
  stopLoop();modalKind=kind;$('#modalTitle').textContent=title;$('#modalText').textContent=text;$('#modalActions').replaceChildren();
  for(const [label,fn,disabled=false] of actions){const b=document.createElement('button');b.textContent=label;b.disabled=disabled;b.onclick=()=>{closeDialog();fn();};$('#modalActions').append(b);}
  $('.battle-area').inert=true;frame.activate('battle',{covered:true});$('#modal').hidden=false;
  $('#modalActions button:not(:disabled)')?.focus();
}
function pause(){
  if(screen!=='battle'||!['live','transition'].includes(state)||modalKind)return;
  const before=state;resumeAction=()=>{closeDialog();state=before;startLoop();};
  dialog(t('leaveTitle'),`${t('stages')} ${selected} · ${t('leaveText')}`,[[t('continue'),resumeAction],[t('returnStages'),()=>show('stage')]],'pause');
}
function action(kind){if(screen!=='battle'||state!=='live'||modalKind||document.querySelector('.wp-frame-popover:not([hidden])'))return;combat[kind]();updateHud();}
$('#start').onclick=()=>show('stage');$('#stageBack').onclick=()=>show('main');$('#battleBack').onclick=pause;
$('#attack').onclick=()=>action('attack');$('#ally').onclick=()=>action('ally');
$('#auto').onclick=()=>{if(modalKind||screen!=='battle'||!['live','transition'].includes(state)||document.querySelector('.wp-frame-popover:not([hidden])'))return;save.autoAttack=!save.autoAttack;combat.autoAttack=save.autoAttack;persist();updateHud();};
$('#claim').onclick=()=>{if(journey?.completed&&!modalKind)finish(true);};
$$('.tabs button').forEach(b=>b.onclick=()=>selectTab(b.dataset.tab));
locale.onchange=()=>{save.locale=locale.value;try{localStorage.setItem('weightPlayLocale',save.locale);}catch{}persist();localize();};
$('#canvas').tabIndex=0;
$('#canvas').addEventListener('pointerdown',e=>{if(state!=='live'||modalKind||e.button!==0)return;const uid=renderer.pick(e.clientX,e.clientY);const i=combat.alive().findIndex(x=>x.uid===uid);if(i>=0)combat.target=i;action('attack');});
$('#canvas').addEventListener('webglcontextlost',e=>{e.preventDefault();if(screen!=='battle'||!renderer)return;stopLoop();state='error';dialog(msg('Graphics interrupted','畫面暫時中斷'),msg('Restart this run safely, or return to stages.','可以安全重試本關，或返回關卡。'),[[t('replay'),startRun],[t('returnStages'),()=>show('stage')]],'error');});
document.addEventListener('keydown',e=>{
  if(e.defaultPrevented)return;
  if(modalKind){
    const buttons=$$('#modalActions button:not(:disabled)');
    if(e.key==='Tab'&&buttons.length){const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();e.preventDefault();}
    if(e.key==='Escape'&&modalKind==='pause'){e.preventDefault();resumeAction?.();}return;
  }
  if(e.repeat||screen!=='battle'||state!=='live'||e.target.matches('input,select,textarea'))return;
  if(e.code==='Space'){e.preventDefault();if(e.target.tagName!=='BUTTON')action('attack');}else if(e.code==='KeyJ')action('ally');else if(e.code==='KeyF')$('#auto').click();
  else if(['KeyA','KeyD','ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();const n=combat.alive().length;combat.target=(combat.target+(['KeyA','ArrowLeft'].includes(e.code)?-1:1)+n)%n;updateHud();}
  else if(e.key==='Escape')pause();
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
window.addEventListener('resize',fit);visualViewport?.addEventListener('resize',fit);
window.addEventListener('pagehide',()=>{disposeRun();audio?.close();audio=null;});
window.addEventListener('pageshow',e=>{if(e.persisted)show('main');});
// Read-only local diagnostics: never grant progress or alter the simulation.
if(['localhost','127.0.0.1','[::1]'].includes(location.hostname))window.PawaxeDiagnostics=Object.freeze({snapshot:()=>({screen,state,modal:modalKind,stage:selected,node,hp:combat?.hp,energy:combat?.energy,time:combat?.time,auto:save.autoAttack,slashes:combat?.slashes,kills:runKills,drops:runDrops,progress:journey?.progress,completed:journey?.completed,unlocked:save.unlocked,coins:save.coins,raf:Boolean(raf),renderer:renderer?.metrics()||null,targets:combat?.alive().map(e=>({id:e.id,hp:e.hp,shield:e.shield,t:e.t,warn:e.warn,reflect:e.reflect}))||[]})});
localize();show('main');
