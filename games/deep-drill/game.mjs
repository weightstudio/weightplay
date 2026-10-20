import {STAGES,ROCKS,seams} from './stages.mjs';
import {HEADS,UPGRADES,AUTO,normalize,buy,upgradeCost,newRun,capacity,goalMet,settle,tick} from './model.mjs';
import {createWorld} from './world.mjs';
const $=id=>document.getElementById(id),KEY='weightplay.deep-drill.v1';
let save;try{save=normalize(JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{save=normalize();}
let run=null,screen='main',held=false,last=0,accumulator=0,stageIndex=save.unlocked-1,world=null,thumbnails={},rockImages={},lastSeam='',shopFocus=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const sound=id=>window.WeightPlayAudio?.play(id);
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(save));$('saveWarning').hidden=true;}catch{$('saveWarning').hidden=false;}};
const arcNames=['表層礦脈','冷泉迴路','熔岩邊境','水晶洞窟','高壓深層','地心裂隙'];
const goalText=s=>({depth:'抵達 100m',copper:`採集 ${s.quota} 塊銅礦`,gold:`採集 ${s.quota} 塊金礦`,cargo:`採集 ${s.quota} 塊礦石`,balanced:`採銅 ${s.quota}、金 ${Math.ceil(s.quota/2)}`,coolant:`找到 ${s.quota} 處冷卻泉`,cool:`抵達時熱度 ≤ ${s.quota}%`,safe:'避開全部熔岩，抵達終點',crystal:`採集 ${s.quota} 塊水晶`,quality:`取得 ${s.quota} 塊完整水晶`,vent:`成功洩壓 ${s.quota} 次`,mastery:`完整水晶 ${s.quota}、冷泉 3、洩壓 3`})[s.goal];
const advice=s=>s.arc>=4?'鬆開下鑽可洩壓；水晶需短按分段鑽開。':s.arc>=3?'水晶要分段短按（每次不超過 1.5 秒）才會完整。':s.arc>=2?'紅色熔岩大幅加熱；冷卻泉可以降低熱度。':s.arc>=1?'選擇青色冷卻泉可降低熱度，再前往高價礦脈。':'左右選礦脈；按住下鑽、鬆開散熱，隨時返航賣礦。';
// One shared frame owns Return/Settings and Stage actions.
const sceneSpecs=Object.fromEntries(['main','stage','battle'].map(name=>[name,{root:$(name),header:$(name).querySelector('header'),content:$(name+'Content')}]));
const frame=WeightPlayScreenFrame.mount({root:$('app'),scenes:sceneSpecs,playUI:true});
const stageProgress=document.createElement('span');frame.stageTopUI.add(stageProgress);
const bank=document.createElement('span');frame.battleTopUI.add(bank);
const depart=document.createElement('button');depart.id='depart';depart.textContent='開始探勘';depart.className='primary';
const workshopButton=document.createElement('button');workshopButton.id='openShop';workshopButton.textContent='鑽機工坊';
frame.commonDownButton.add(depart);frame.commonDownButton.add(workshopButton);
const stageUI=WeightPlayPlayUI.mountStage({page:$('stagePage'),rail:$('stageRail'),selected:stageIndex,isActive:()=>screen==='stage',
 config:{count:30,poster:'/games/deep-drill/art/poster.png',background:'/assets/lobby-block-atmosphere.svg',stage:i=>{
  const s=STAGES[i];return {id:s.id,kicker:`${String(s.id).padStart(2,'0')} / ${arcNames[s.arc]}`,title:s.zh,subtitle:goalText(s),status:s.id>save.unlocked?'尚未解鎖':save.cleared.includes(s.id)?'已完成 · 可重玩':'準備出發',locked:s.id>save.unlocked,cleared:save.cleared.includes(s.id),summary:goalText(s),details:[advice(s),'本關 100m。完成目標並抵達終點才會解鎖下一區。','裝備與購買的自動化功能永久保留。']};}},
 onSelect:i=>{stageIndex=i;refreshStage();},onStart:i=>startRun(i)});
function refreshStage(){stageProgress.textContent=`${save.coins.toLocaleString()} 金幣 · ${save.unlocked}/30 區`;depart.disabled=stageIndex>=save.unlocked;}
function show(name){held=false;lastSeam='';if(screen==='stage')stageUI.cancel();screen=name;document.body.dataset.screen=name;
 for(const s of ['main','stage','battle'])$(s).hidden=s!==name;
 frame.activate(name);if(name==='stage'){stageUI.refresh(save.unlocked-1);stageIndex=save.unlocked-1;refreshStage();}
 world?.resize();}
function ensureWorld(){if(world)return true;try{world=createWorld($('world'));for(let i=0;i<4;i++)thumbnails[i]=world.thumbnail(i);for(const k of Object.keys(ROCKS))rockImages[k]=world.thumbnail(k);return true;}catch(error){console.error('Deep Drill WebGL:',error);$('renderError').hidden=false;return false;}}
function startRun(index){if(index>=save.unlocked)return;stageIndex=index;run=newRun(save,index);$('result').hidden=true;$('pausePanel').hidden=true;show('battle');
 if(!ensureWorld()){run.paused=true;return;}$('notice').textContent=advice(run.stage);$('zoneName').textContent=`${String(index+1).padStart(2,'0')} · ${run.stage.zh}`;
 $('pressureLine').hidden=!run.stage.pressure;lastSeam='';sound('game.start');renderHud();$('drill').focus({preventScroll:true});}
function selectLane(lane){if(!run||run.ended||run.paused)return;const n=Math.max(0,Math.min(2,lane));if(run.lane!==n){run.lane=n;run.progress=0;run.held=0;lastSeam='';}renderHud();}
function release(){held=false;document.body.classList.remove('drilling');}
function pause(){if(!run||run.ended||screen!=='battle')return;release();run.paused=true;$('pausePanel').hidden=false;$('resume').focus();}
function resume(){if(!run||run.ended)return;$('pausePanel').hidden=true;run.paused=false;release();last=performance.now();$('drill').focus();}
function finish(reason){if(!run||run.ended)return;settle(save,run,reason);processEvents();renderHud();}
function result(){release();persist();$('pausePanel').hidden=true;$('result').hidden=false;
 const won=run.clear,reason=run.reason;
 $('resultTitle').textContent=won?'礦區突破！':reason==='overheat'?'緊急救援完成':reason==='full'?'礦艙滿載，安全返航':reason==='complete'?'抵達終點，目標未完成':'返航成功';
 $('resultText').textContent=`深入 ${run.depth}m · ${run.stage.zh} · ${goalText(run.stage)}`;
 $('resultCoins').textContent=`+ ${run.banked.toLocaleString()}`;
 $('resultTip').textContent=reason==='overheat'?'熱度或壓力達到上限，保住 65% 未出售礦物。試著多散熱，或升級冷卻系統。':won?'永久保存本區進度。下一次，再往深處一點。':reason==='complete'?'已出售全部礦物。查看礦區目標，換條路線再試。':'礦物已出售。到工坊改裝，再來挑戰。';
 $('next').hidden=!won||run.stage.id===30;$('retry').hidden=won&&run.stage.id<30;
 sound(won?'result.win':reason==='overheat'?'result.lose':'reward.coin');
 (won&&run.stage.id<30?$('next'):$('retry')).focus();}
function processEvents(){if(!run)return;for(const e of run.events.splice(0)){
 if(e.type==='break'){world?.burst(e.lane,ROCKS[e.kind].color,reduced.matches);sound(e.kind==='X'?'impact.glass':'impact.stone');
  $('notice').textContent=e.kind==='W'?'冷卻泉：熱度下降':e.kind==='X'?(e.gentle?'完整水晶入艙！':'水晶受損；分段短按可保完整'):`${ROCKS[e.kind].zh}入艙 · 價值 ${e.value}`;
  $('battleContent').classList.remove('collecting');void $('oreFlight').offsetWidth;$('battleContent').classList.add('collecting');lastSeam='';}
 if(e.type==='sold'){persist();$('notice').textContent='自動出售完成，繼續下鑽';sound('reward.coin');}
 if(e.type==='result')result();
 }}
function renderHud(){if(!run)return;const kinds=seams(run.stage,run.row),key=`${run.row}-${run.lane}-${kinds.join('')}`;
 $('depth').textContent=run.depth;$('heatLabel').textContent=`熱度 ${Math.round(run.heat)}%`;$('heatBar').value=run.heat;
 $('cargoLabel').textContent=`礦艙 ${run.cargo}/${capacity(save)} · ${run.value} 金`;$('cargoBar').max=capacity(save);$('cargoBar').value=run.cargo;
 $('pressureLabel').textContent=`壓力 ${Math.round(run.pressure)}%`;$('pressureBar').value=run.pressure;
 $('rockProgress').style.width=`${Math.min(100,run.progress*100)}%`;
 $('autoToggle').disabled=!save.auto.drill;$('autoToggle').textContent=save.auto.drill?`自動：${run.auto?(run.autoCooling?'冷卻中':'開啟'):'關閉'}`:'自動：未購買';
 bank.textContent=`${save.coins} 金 · ${HEADS[save.head].zh}`;
 $('mining-label').textContent=run.paused?'鑽機待命中':run.autoCooling?'自動冷卻 / 洩壓中':`${ROCKS[kinds[run.lane]].zh} · ${goalText(run.stage)}`;
 document.body.classList.toggle('drilling',!run.paused&&!run.ended&&(held||run.auto)&&!run.autoCooling);
 if(key!==lastSeam){lastSeam=key;document.querySelectorAll('[data-lane]').forEach((b,i)=>{const k=kinds[i],rock=ROCKS[k];b.replaceChildren();
  if(rockImages[k]){const image=new Image();image.src=rockImages[k];image.alt='';b.append(image);}
  const text=document.createElement('span');text.textContent=rock.zh;const detail=document.createElement('small');detail.textContent=k==='W'?'降低熱度':k==='L'?'高熱 · 高價':k==='X'?'短按保完整':`${rock.value} 金`;text.append(detail);b.append(text);b.setAttribute('aria-pressed',String(i===run.lane));});}
}
function shop(){shopFocus=document.activeElement;ensureWorld();$('shopNotice').textContent='所有購買只使用遊戲內金幣';renderShop();$('workshop').hidden=false;$('closeShop').focus();}
function renderShop(){
 $('shopCoins').textContent=save.coins.toLocaleString();const root=$('shopItems');root.replaceChildren();
 const title=text=>{const h=document.createElement('h3');h.textContent=text;root.append(h);};
 function card({image,name,desc,label,action,owned=false}){const row=document.createElement('div');row.className='shop-card';
  const img=new Image();img.src=image||thumbnails[save.head]||'art/poster.png';img.alt=name;const copy=document.createElement('div'),b=document.createElement('b'),s=document.createElement('small');b.textContent=name;s.textContent=desc;copy.append(b,s);
  const btn=document.createElement('button');btn.textContent=label;btn.disabled=owned;btn.onclick=action;row.append(img,copy,btn);root.append(row);}
 function purchase(type,key){const ok=buy(save,type,key);if(ok){persist();renderShop();refreshStage();sound(type==='upgrade'?'reward.upgrade':'shop.purchase');$('shopNotice').textContent=type==='head'?'鑽頭已裝備，下次出發生效':'改裝完成，下次出發生效';}else{sound('feedback.error');$('shopNotice').textContent='金幣不足，先採礦返航賣礦吧';}}
 title('01 / 更換鑽頭');HEADS.forEach((h,i)=>card({image:thumbnails[i],name:h.zh,desc:[ '可靠的起步鑽頭 · 均衡型','岩石鑽速額外 +40% · 基礎鑽力 ×1.6','水晶收入 +60% · 基礎鑽力 ×2.1','熔岩接觸熱量降低 75% · 基礎鑽力 ×2.8'][i],label:save.head===i?'已裝備':save.heads.includes(i)?'裝備':`${h.price} 金`,owned:save.head===i,action:()=>purchase('head',i)}));
 title('02 / 永久升級');Object.entries(UPGRADES).forEach(([k,u],i)=>card({image:thumbnails[Math.min(i,3)],name:`${u.zh} Lv.${save.upgrades[k]}`,desc:{power:'每級 +0.2 基礎鑽力',speed:'每級 +12% 轉速',cooling:'降低產熱，加快冷卻',cargo:'每級增加 12 格礦艙'}[k],label:save.upgrades[k]>=20?'已滿級':`${upgradeCost(save,k)} 金`,owned:save.upgrades[k]>=20,action:()=>purchase('upgrade',k)}));
 title('03 / 自動化設備');Object.entries(AUTO).forEach(([k,a])=>card({image:thumbnails[k==='drill'?1:k==='cool'?2:3],name:a.zh,desc:{drill:'持續鑽掘，可隨時開關；仍需管理熱度',cool:'熱度/壓力過高時停鑽，冷卻後繼續',sell:'滿艙即出售，不需中止探勘'}[k],label:save.auto[k]?'已購買':`${a.price} 金`,owned:save.auto[k],action:()=>purchase('auto',k)}));
}
$('start').onclick=()=>{show('stage');};depart.onclick=()=>startRun(stageIndex);workshopButton.onclick=shop;
$('closeShop').onclick=()=>{$('workshop').hidden=true;shopFocus?.focus();};
$('stage').querySelector('[data-wp-return]').onclick=()=>show('main');
$('battle').querySelector('[data-wp-return]').onclick=pause;
$('left').onclick=()=>selectLane(run.lane-1);$('right').onclick=()=>selectLane(run.lane+1);
document.querySelectorAll('[data-lane]').forEach(b=>b.onclick=()=>selectLane(Number(b.dataset.lane)));
$('drill').onpointerdown=e=>{if(!run||run.ended||run.paused)return;e.preventDefault();held=true;$('drill').setPointerCapture(e.pointerId);};
for(const e of ['pointerup','pointercancel','lostpointercapture'])$('drill').addEventListener(e,release);
$('drill').oncontextmenu=e=>e.preventDefault();$('pause').onclick=pause;$('resume').onclick=resume;
$('return').onclick=()=>finish('return');$('exitRun').onclick=()=>{finish('return');};
$('autoToggle').onclick=()=>{if(!run||!save.auto.drill||run.ended||run.paused)return;run.auto=!run.auto;release();renderHud();};
$('retry').onclick=()=>startRun(stageIndex);$('next').onclick=()=>startRun(Math.min(29,stageIndex+1));
$('backStages').onclick=()=>{$('result').hidden=true;show('stage');};
window.addEventListener('keydown',e=>{
 const modal=[...document.querySelectorAll('.overlay')].find(n=>!n.hidden);
 if(e.key==='Tab'&&modal){const buttons=[...modal.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}
 if(e.key==='Escape'){if(!$('workshop').hidden)$('closeShop').click();else if(!$('pausePanel').hidden)resume();else pause();return;}
 if(screen!=='battle'||modal||run?.paused||run?.ended||e.target.closest('select,input,.wp-frame-popover'))return;
 if(e.code==='Space'){e.preventDefault();held=true;}if(e.key==='ArrowLeft'){e.preventDefault();selectLane(run.lane-1);}if(e.key==='ArrowRight'){e.preventDefault();selectLane(run.lane+1);}
});
window.addEventListener('keyup',e=>{if(e.code==='Space')release();});window.addEventListener('blur',release);
document.addEventListener('visibilitychange',()=>{release();if(document.hidden&&screen==='battle')pause();});
window.addEventListener('weightplay:interaction-state',()=>{if(document.querySelector('.wp-frame-popover:not([hidden])'))pause();});
window.addEventListener('pagehide',()=>{persist();release();world?.destroy();});
$('world').addEventListener('webglcontextlost',e=>{e.preventDefault();pause();$('renderError').hidden=false;persist();});
let warned=false;
function loop(now){const dt=Math.min(.05,(now-(last||now))/1000);last=now;
 if(screen==='battle'&&run&&world){accumulator=Math.min(.1,accumulator+dt);while(accumulator>=1/60){tick(save,run,1/60,held);accumulator-=1/60;}processEvents();renderHud();
  const active=!run.paused&&!run.ended&&(held||run.auto)&&!run.autoCooling;world.update(save,run,dt,active,reduced.matches);
  if(run.heat>78&&!warned){warned=true;sound('alert.warning');}if(run.heat<65)warned=false;
 }
 requestAnimationFrame(loop);
}
window.WeightPlayAudio?.preload(['game.start','impact.stone','impact.glass','shop.purchase','reward.upgrade','reward.coin','alert.warning','result.win','result.lose','feedback.error']);
refreshStage();show('main');requestAnimationFrame(loop);
// Read-only diagnostics supplement local geometry/resource checks; never clear a run.
window.DeepDrill=Object.freeze({snapshot:()=>({screen,save:structuredClone(save),run:run?structuredClone(run):null,render:world?.stats()||null})});
