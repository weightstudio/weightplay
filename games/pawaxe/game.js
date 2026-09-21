import { stages,gear } from './campaign.js';
import { Combat } from './combat.js';
import { LOCALES,copy } from './locales.js';
import { loadSave,storeSave } from './save.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const save=loadSave();
try{const locale=localStorage.getItem('weightPlayLocale');if(LOCALES.includes(locale))save.locale=locale;}catch{}
if(!LOCALES.includes(save.locale))save.locale='zh-Hant';
let selected=save.unlocked, combat=null,renderer=null,raf=0,last=0,acc=0,node=0,runHp=0,runEnergy=100;
let state='idle',screen='main',runGeneration=0,transitionRemaining=0,modalKind='',resumeAction=null;
let feedbackUntil=0,feedbackText='',runStats={blocks:0,perfects:0},resultPaid=false,rendererModule=null;
const t=k=>copy[save.locale]?.[k]||copy.en[k]||k;
const zh=()=>save.locale==='zh-Hant'||save.locale==='zh-Hans';
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
  const scale=Math.min(w/390,h/(screen==='battle'?480:390));
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
  $('[data-mode="break"]').textContent=msg('Break Formation','破陣');$('[data-mode="guard"]').textContent=msg('Guardian','守護');
  $('#allyDescription').textContent=msg('Nibs uses 100 energy. Break Formation strips shields, clears reflection and hits every enemy. Guardian heals 10% HP and removes one harmful status.','栗栗消耗 100 能量。破陣削盾、解除亮面並攻擊全體；守護恢復 10% 生命並解除一項負面狀態。');
  const sections=zh()?[
    ['森林心核之旅','與菲雅和栗栗完成森林路線。每關包含兩次遭遇、免費補給、兩次遭遇；清完最後敵人即通關。'],
    ['看招、格擋、反擊','菲雅會自動揮斧。敵人卡片的金色讀條走滿時出招；按防禦進入守勢，再按一次解除。維持防禦會消耗耐力，解除後恢復。接觸前一瞬防禦可完美格擋，普通格擋也能保命並創造反擊窗口。'],
    ['重擊與夥伴','重擊有前搖及六秒冷卻，反擊窗口內傷害更強，還可打斷修補與召喚。亮面會反彈重擊，先用栗栗解除，或等待亮面消失。防禦可取消尚未接觸的揮擊，冷卻不退還。'],
    ['敵人與首領','點敵人或上方目標卡切換目標。先拆供盾符樁，或打斷修補者與召喚者；格擋荊棘攻擊可避免裂痕。鐘衛、根爐、鏡鹿、織衛、指揮官與心核各有不同支援或階段規則。'],
    ['裝備與進度','關卡頁可配置夥伴及七個裝備部位。首次通關得到較多金幣並解鎖後關與指定裝備，重玩通關得五金幣，失敗不扣永久資源。每個部位可強化三次，費用 30／60／100；換裝保留同部位強化。'],
    ['操作與恢復','觸控或滑鼠點選操作。鍵盤 G 防禦、H 重擊、J 夥伴，A／D 切換目標。返回及切到背景會暫停。離開只放棄本次未結算路線；已通關、裝備及金幣留在此瀏覽器。無需登入或付費。'],
    ['常見問題','為什麼不能重擊？確認冷卻和收招是否完成。為什麼栗栗不能施放？需要滿能量，且施放至少間隔四秒。如何回血？選補給回血或守護模式。清除瀏覽器資料會刪除本機進度。']
  ]:[
    ['The forest heart','Journey with Fia and Nibs through four encounters and a free supply choice in each stage. Clear the final enemies to finish.'],
    ['Read, guard, counter','Fia swings automatically. Enemy gold meters fill toward contact. Toggle Guard to block; toggle it off to recover stamina. A last-moment guard prevents all damage, but ordinary blocks also protect you and create a counter window.'],
    ['Heavy and ally','Heavy Strike has a wind-up and six-second cooldown. It rewards openings and interrupts menders and callers. Mirror stance reflects heavy attacks: clear it with Nibs or wait. Guard cancels an uncommitted swing without refunding its cooldown.'],
    ['Target priority','Tap an enemy or target card. Destroy shield-supplying roots, interrupt support and block thorn attacks to prevent Crack. Six guardians mix telegraphs, support objects, reflection, summoning and phases.'],
    ['Equipment and progress','Choose Nibs mode and seven equipment slots in Stage. First clears unlock stages and gear; replay clears grant five coins. Failure costs no permanent resources. Slot upgrades cost 30, 60 and 100 coins and remain when changing equipment.'],
    ['Controls and recovery','Touch, mouse and keyboard: G guard, H heavy, J ally, A/D targets. Back and backgrounding pause. Leaving discards only the unsettled run. Progress lives in this browser when storage is available; no login or purchase.'],
    ['FAQ','Heavy unavailable? Wait for cooldown and recovery. Ally unavailable? Fill energy and wait four seconds between casts. Heal with supply or Guardian mode. Clearing browser data removes local progress.']
  ];
  $('#guideDetails').replaceChildren(...sections.map(([h,p])=>{const s=document.createElement('section');const title=document.createElement('h3');title.textContent=h;const text=document.createElement('p');text.textContent=p;s.append(title,text);return s;}));
  frame.refresh();renderEquipment();if(rail)rail.refresh();
}
function renderStage(){
  $('#stageNum').textContent=save.unlocked;
  if(!rail)rail=window.WeightPlayStageV6.install($('#rail'),{total:()=>stages.length,poolSize:9,initialIndex:()=>save.unlocked-1,
    bind:(card,i)=>{const s=stages[i];card.className='stage-card';card.setAttribute('aria-disabled',String(s.id>save.unlocked));
      card.innerHTML=`<div data-wp-item-content><strong>${t('stages')} ${s.id}</strong><h3>${name(s)}</h3><div>${s.checkpoint?t('boss'):t('forest')}</div><small>${save.cleared.includes(s.id)?t('cleared'):s.id<=save.unlocked?t('ready'):t('locked')}</small></div>`;},
    activate:i=>{if(i+1<=save.unlocked){selected=i+1;startRun();}}
  });
  else rail.refresh();
  requestAnimationFrame(()=>{rail?.center(save.unlocked-1);fit();});renderEquipment();
  $$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===save.mode));
}
const gearZh=['旅途斧','破盾斧','輕快斧','旅途兜帽','稜鏡面罩','斥候背心','樹皮護甲','旅途手套','鐵護腕','旅途靴','沼澤靴','橡果護符','月光護符','銅戒','節拍環'];
const effects=['24 · 1.0s','28 · 1.15s · +20 shield','18 · 0.75s','Crack −20%','Perfect +6 energy','HP +10','HP +25 · stamina −5/s','Heavy → +5 energy','Block stamina −5','Guard → attack','Root penalty ÷2','Ally shield +8','Ally cleanse','Defeat +12 energy','Every 3rd hit ×1.5'];
const effectsZh=['攻擊 24 · 週期 1 秒','攻擊 28 · 1.15 秒 · 重擊削盾 +20','攻擊 18 · 週期 0.75 秒','裂痕持續時間 −20%','完美格擋額外能量 +6','最大生命 +10','生命 +25 · 耐力恢復 −5／秒','重擊後普攻能量 +5','格擋耐力消耗 −5','解除防禦後快速起手','纏根的恢復懲罰減半','夥伴額外削盾 +8','施放夥伴解除一項狀態','擊敗必要敵人能量 +12','每第三次普攻傷害 ×1.5'];
function renderEquipment(){
  $('#coins').textContent=msg('Route coins: ','路線金幣：')+save.coins;
  $('#equipment').replaceChildren(...gear.filter(g=>!g.unlock||save.cleared.includes(g.unlock)).map(g=>{
    const d=document.createElement('div');d.className='gear';const i=gear.indexOf(g),equipped=save.loadout.includes(g.id),level=save.upgrades[g.slot]||0;
    const icon=document.createElement('span');icon.className='gear-icon';icon.style.backgroundPosition=`${(i%4)*100/3}% ${Math.floor(i/4)*100/3}%`;icon.setAttribute('aria-hidden','true');
    const b=document.createElement('b');b.textContent=zh()?gearZh[i]:g.name;
    const p=document.createElement('p');p.textContent=zh()?effectsZh[i]:effects[i];d.append(icon,b,p);
    const equip=document.createElement('button');equip.textContent=equipped?msg('Equipped','使用中'):msg('Equip','裝備');equip.disabled=equipped;
    equip.onclick=()=>{save.loadout=save.loadout.filter(id=>gear.find(x=>x.id===id)?.slot!==g.slot);save.loadout.push(g.id);persist();renderEquipment();};d.append(equip);
    if(equipped){const u=document.createElement('button'),cost=[30,60,100][level];u.textContent=level===3?msg('Maximum upgrade','已滿級'):`${msg('Upgrade','強化')} ${level} → ${level+1} · ${cost}`;u.disabled=level===3||save.coins<cost;u.onclick=()=>{if(save.coins<cost||save.upgrades[g.slot]!==level)return;save.coins-=cost;save.upgrades[g.slot]++;persist();renderEquipment();};d.append(u);}return d;
  }));
}
function selectTab(tab){$$('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));['ally','stage','equip'].forEach(x=>$('#'+x+'Panel').hidden=x!==tab);if(tab==='stage')requestAnimationFrame(()=>rail?.center());}
let audio=null;
function sound(kind){
  if(window.WonderSound?.isMuted())return;
  try{audio||=new AudioContext();audio.resume();const frequencies={hit:170,break:310,hurt:85,perfect:720,block:210,ally:520,defeat:370,counter:440,heal:620};
    if(!frequencies[kind])return;const o=audio.createOscillator(),g=audio.createGain(),at=audio.currentTime;
    o.type=kind==='hurt'?'triangle':'sine';o.frequency.setValueAtTime(frequencies[kind],at);o.frequency.exponentialRampToValueAtTime(frequencies[kind]*.45,at+.12);
    g.gain.setValueAtTime(.055*((window.WonderSound?.getEffectsVolume()??80)/100),at);g.gain.exponentialRampToValueAtTime(.001,at+.16);o.connect(g).connect(audio.destination);o.start(at);o.stop(at+.16);
  }catch{}
}
function feedback(text,seconds=1.4){feedbackText=text;feedbackUntil=performance.now()+seconds*1000;$('#feedback').textContent=text;}
async function startRun(){
  disposeRun();node=0;runHp=0;runEnergy=100;runStats={blocks:0,perfects:0};resultPaid=false;show('battle');state='loading';
  const generation=runGeneration;dialog(t('title'),msg('Preparing the forest…','正在準備森林…'),[], 'loading');
  try{
    if(!rendererModule){let timer;try{rendererModule=await Promise.race([import('./renderer-3d.js'),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('LOAD_TIMEOUT')),15000);})]);}finally{clearTimeout(timer);}}
    if(generation!==runGeneration||screen!=='battle')return;
    renderer=new rendererModule.PawRenderer($('#canvas'));renderer.setRegion(Math.floor((selected-1)/5));
    closeDialog();startEncounter();
    if(!save.tutorial){dialog(t('guide'),t('guideText'),[[t('continue'),()=>{save.tutorial=true;persist();resume();}]],'tutorial');}
  }catch(error){if(generation!==runGeneration)return;renderer?.dispose();renderer=null;state='error';dialog(msg('Forest unavailable','森林載入失敗'),msg('This game needs WebGL 2. Retry, or return to stages.','此遊戲需要 WebGL 2。你可以重試或返回關卡。'),[[t('replay'),startRun],[t('returnStages'),()=>show('stage')]],'error');console.warn('Pawaxe renderer:',error.message);}
}
function startEncounter(){
  combat=new Combat(stages[selected-1],save.loadout,save.mode,node,save.upgrades);
  if(runHp>0)combat.hp=Math.min(combat.maxHp,runHp);combat.energy=runEnergy;
  renderer.setEnemies(combat.alive());state='live';transitionRemaining=0;
  $('#hudStage').textContent=selected;$('#node').textContent=`${[1,2,4,5][node]} / 5`;
  feedback(name(stages[selected-1]),2);updateHud();startLoop();
}
function resume(){closeDialog();state='live';startLoop();$('#battleBack').focus();}
function loop(now){
  if(!renderer||!combat||!['live','transition'].includes(state))return;
  const delta=Math.min(.1,Math.max(0,(now-last)/1000));last=now;
  if(document.querySelector('.wp-frame-popover:not([hidden])')){last=now;raf=requestAnimationFrame(loop);return;}
  if(state==='transition'){
    transitionRemaining-=delta;renderer.render(delta,combat);
    if(transitionRemaining<=0){startEncounter();return;}
  }else{
    acc=Math.min(acc+delta,.12);
    while(acc>=1/60){combat.tick(1/60);acc-=1/60;}
    for(const e of combat.events.splice(0)){
      renderer.event(e);sound(e.type);
      const labels={perfect:msg('Perfect guard! Counter now.','完美格擋！趁隙反擊'),block:msg('Blocked · counter window','格擋成功 · 反擊窗口'),break:msg('Shield broken!','護盾破碎！'),counter:msg('Counter strike!','反擊重擊！'),interrupt:msg('Cast interrupted','施法已打斷'),reflect:msg('Reflected! Use Nibs first.','亮面反彈！先用栗栗解除'),exhausted:msg('Stamina empty — recover','耐力耗盡 · 解除守勢恢復'),phase:msg('Guardian changes phase','首領進入下一階段'),heal:msg('Health restored','生命恢復')};
      if(labels[e.type])feedback(labels[e.type]);
      if(e.type==='hit'||e.type==='hurt'){const n=document.createElement('strong');n.className=e.type==='hurt'?'hurt':'';n.textContent=e.type==='hurt'?`−${e.amount} HP`:e.amount>0?`${e.amount}`:`${msg('Shield','盾')} −${e.shield}`;$('#damageNumbers').replaceChildren(n);}
    }
    renderer.setEnemies(combat.alive());updateHud();renderer.render(delta,combat);
    if(combat.lost){finish(false);return;}if(combat.won){encounterWon();return;}
  }
  raf=requestAnimationFrame(loop);
}
function updateHud(){
  $('#hp').textContent=Math.ceil(combat.hp);$('#stamina').value=combat.stamina;$('#guardValue').textContent=`${Math.floor(combat.stamina)} / 100`;
  $('#guard').classList.toggle('active',combat.guard);$('#guard').setAttribute('aria-pressed',String(combat.guard));
  $('#heavyValue').textContent=combat.heavyCd>0?`${combat.heavyCd.toFixed(1)} s`:t('ready');$('#heavyMeter').value=6-combat.heavyCd;
  $('#heavy').disabled=combat.heavyCd>0||combat.recovery>0;$('#energy').textContent=`${Math.floor(combat.energy)} / 100`;
  $('#allyMeter').value=combat.energy;$('#ally').disabled=combat.energy<100||combat.allyCd>0;
  const enemies=combat.alive(),box=$('#targets');
  for(const b of [...box.children])if(!enemies.some(e=>e.uid===+b.dataset.uid))b.remove();
  enemies.forEach((e,i)=>{
    let b=box.querySelector(`[data-uid="${e.uid}"]`);
    if(!b){b=document.createElement('button');b.className='target';b.dataset.uid=e.uid;b.innerHTML='<strong></strong><progress></progress><small></small><progress class="enemy-clock" max="1"></progress>';b.onclick=()=>{if(state==='live')combat.target=combat.alive().findIndex(x=>x.uid===e.uid);};box.append(b);}
    b.setAttribute('aria-pressed',String(i===combat.target));b.classList.toggle('warn',e.warned);b.querySelector('strong').textContent=name(e);
    b.querySelector('progress').max=e.maxHp;b.querySelector('progress').value=e.hp;
    const protectedBySupport=e.boss&&enemies.some(x=>x!==e&&['anchor','mirror-left','mirror-right','root-drain','root-crack'].includes(x.id));
    b.querySelector('small').textContent=protectedBySupport?msg('Destroy support first','先擊破支援目標'):e.id==='boss-heart'&&e.phase===3&&e.opening<=0?msg('Guard to expose core','格擋後心核才會暴露'):e.reflect>0?msg('REFLECT — no heavy','亮面 · 勿重擊'):e.opening>0?msg('COUNTER!','反擊窗口！'):e.shield>0?`${msg('Shield','盾')} ${Math.ceil(e.shield)}`:`${Math.ceil(e.hp)} / ${e.maxHp}`;
    b.querySelector('.enemy-clock').value=e.warned?1-Math.max(0,e.t)/e.warn:0;
  });
  const threat=enemies.filter(e=>e.warned).sort((a,b)=>a.t-b.t)[0];
  $('#warning').textContent=threat?`${name(threat)} · ${msg('Incoming','即將出手')} ${Math.max(0,threat.t).toFixed(1)} s`:msg('Read the tell · guard near contact · release to attack','判讀預警 · 接觸前防禦 · 解除後揮斧');
  $('#status').textContent=Object.entries(combat.status).filter(([,v])=>v>0).map(([k,v])=>`${k==='crack'?msg('Crack','裂痕'):msg('Root','纏根')} ${v.toFixed(1)}s`).join(' · ');
  if(performance.now()>feedbackUntil)$('#feedback').textContent='';else $('#feedback').textContent=feedbackText;
}
function encounterWon(){
  stopLoop();runHp=combat.hp;runEnergy=combat.energy;runStats.blocks+=combat.blocks;runStats.perfects+=combat.perfects;
  if(node===3){finish(true);return;}
  if(node===1){state='supply';dialog(t('supply'),msg('Choose one free benefit for the remaining encounters.','為後半段路線選擇一項免費補給。'),[[t('heal'),()=>{runHp=Math.min(combat.maxHp,runHp+combat.maxHp*.2);node++;startEncounter();}],[t('charge'),()=>{runEnergy=Math.min(100,runEnergy+50);node++;startEncounter();}]],'supply');return;}
  node++;state='transition';transitionRemaining=.7;feedback(msg('Path cleared · moving forward','道路已清空 · 繼續前進'),.7);startLoop();
}
function finish(win){
  stopLoop();state='result';let reward=0;
  if(win&&!resultPaid){resultPaid=true;const first=!save.cleared.includes(selected);reward=first?stages[selected-1].reward*(stages[selected-1].checkpoint?2:1):5;
    if(first)save.cleared.push(selected);save.coins+=reward;save.unlocked=Math.max(save.unlocked,Math.min(30,selected+1));persist();}
  const text=win?`${name(stages[selected-1])} · +${reward} ${msg('coins','金幣')}\n${msg('Blocks','格擋')} ${runStats.blocks} · ${msg('Perfect','完美')} ${runStats.perfects}`
    :msg('Try shorter guards to recover stamina. Interrupt support, and save Nibs for shields or reflection. Permanent progress is safe.','縮短守勢來恢復耐力，打斷支援者，把栗栗留給護盾或亮面。永久進度已保留。');
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
$('#guard').onclick=()=>action('toggleGuard');$('#heavy').onclick=()=>action('heavy');$('#ally').onclick=()=>action('ally');
$$('.tabs button').forEach(b=>b.onclick=()=>selectTab(b.dataset.tab));
$$('[data-mode]').forEach(b=>b.onclick=()=>{save.mode=b.dataset.mode;persist();$$('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));});
locale.onchange=()=>{save.locale=locale.value;try{localStorage.setItem('weightPlayLocale',save.locale);}catch{}persist();localize();};
$('#canvas').addEventListener('pointerdown',e=>{if(state!=='live'||modalKind)return;const uid=renderer.pick(e.clientX,e.clientY);const i=combat.alive().findIndex(x=>x.uid===uid);if(i>=0){combat.target=i;updateHud();}});
$('#canvas').addEventListener('webglcontextlost',e=>{e.preventDefault();if(screen!=='battle'||!renderer)return;stopLoop();state='error';dialog(msg('Graphics interrupted','畫面暫時中斷'),msg('Restart this run safely, or return to stages.','可以安全重試本關，或返回關卡。'),[[t('replay'),startRun],[t('returnStages'),()=>show('stage')]],'error');});
document.addEventListener('keydown',e=>{
  if(e.defaultPrevented)return;
  if(modalKind){
    const buttons=$$('#modalActions button:not(:disabled)');
    if(e.key==='Tab'&&buttons.length){const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();e.preventDefault();}
    if(e.key==='Escape'&&modalKind==='pause'){e.preventDefault();resumeAction?.();}return;
  }
  if(e.repeat||screen!=='battle'||state!=='live'||e.target.matches('input,select,textarea'))return;
  if(e.code==='KeyG')action('toggleGuard');else if(e.code==='KeyH')action('heavy');else if(e.code==='KeyJ')action('ally');
  else if(['KeyA','KeyD','ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();const n=combat.alive().length;combat.target=(combat.target+(['KeyA','ArrowLeft'].includes(e.code)?-1:1)+n)%n;updateHud();}
  else if(e.key==='Escape')pause();
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
window.addEventListener('resize',fit);visualViewport?.addEventListener('resize',fit);
window.addEventListener('pagehide',()=>{disposeRun();audio?.close();audio=null;});
window.addEventListener('pageshow',e=>{if(e.persisted)show('main');});
// Read-only local diagnostics: never grant progress or alter the simulation.
if(['localhost','127.0.0.1','[::1]'].includes(location.hostname))window.PawaxeDiagnostics=Object.freeze({snapshot:()=>({screen,state,modal:modalKind,stage:selected,node,hp:combat?.hp,energy:combat?.energy,guard:combat?.guard,time:combat?.time,unlocked:save.unlocked,coins:save.coins,raf:Boolean(raf),renderer:renderer?.metrics()||null,targets:combat?.alive().map(e=>({id:e.id,hp:e.hp,shield:e.shield,t:e.t,warn:e.warn,reflect:e.reflect}))||[]})});
localize();show('main');
