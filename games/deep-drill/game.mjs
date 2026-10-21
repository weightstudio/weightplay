import {STAGES,ROCKS,seams} from './stages.mjs';
import {HEADS,UPGRADES,AUTO,normalize,buy,upgradeCost,newRun,capacity,goalMet,settle,tick,cellState,selectRoute} from './model.mjs';
import {createWorld} from './world.mjs';
import {REGIONS,MODULES,CREW,TOOLS} from './content.mjs';
import {runSeams,sealState,activeSeal,useTool} from './systems.mjs';
import {renderBase} from './base.mjs';
const $=id=>document.getElementById(id),KEY='weightplay.deep-drill.v1';
let save;try{save=normalize(JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{save=normalize();}
let run=null,screen='main',held=false,last=0,accumulator=0,stageIndex=save.unlocked-1,world=null,thumbnails={},rockImages={},lastSeam='',shopFocus=null,baseTab='rig',damageTTL=0,beamArmed=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const sound=id=>window.WeightPlayAudio?.play(id);
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(save));$('saveWarning').hidden=true;}catch{$('saveWarning').hidden=false;}};
const arcNames=REGIONS.map(r=>r.name);
const goalText=s=>s.checkpoint?`解除${REGIONS[s.arc].seal}`:({depth:'前進 100m',copper:`採集 ${s.quota} 塊銅礦`,gold:`採集 ${s.quota} 塊金礦`,cargo:`採集 ${s.quota} 塊礦石`,balanced:`採銅 ${s.quota}、金 ${Math.ceil(s.quota/2)}`,coolant:`找到 ${s.quota} 處冷卻泉`,safe:'避開全部熔岩，抵達終點',crystal:`採集 ${s.quota} 塊水晶`,quality:`取得 ${s.quota} 塊完整水晶`,vent:`成功洩壓 ${s.quota} 次`,mastery:`完整水晶 ${s.quota}、冷泉 3、洩壓 3`})[s.goal];
const advice=s=>'鑽機會自動選路、短鑽水晶與洩壓。你只要選擇升級；庫存工具只按工坊設定的每趟上限使用。'+(s.arc>=2?'深入地層需要更強鑽頭與鑽力；先回打賺取改裝費。':'礦艙滿會帶回全部收益，升級後再挑戰。');
// One shared frame owns Return/Settings and Stage actions.
const sceneSpecs=Object.fromEntries(['main','stage','battle'].map(name=>[name,{root:$(name),header:$(name).querySelector('header'),content:$(name+'Content')}]));
const frame=WeightPlayScreenFrame.mount({root:$('app'),scenes:sceneSpecs,localeSelect:$('localeSelect'),playUI:true});
const stageProgress=document.createElement('span');frame.stageTopUI.add(stageProgress);
const bank=document.createElement('span');frame.battleTopUI.add(bank);
const depart=document.createElement('button');depart.id='depart';depart.textContent='開始探勘';depart.className='primary';
const workshopButton=document.createElement('button');workshopButton.id='openShop';workshopButton.textContent='鑽機工坊';
frame.commonDownButton.add(depart);frame.commonDownButton.add(workshopButton);
const stageUI=WeightPlayPlayUI.mountStage({page:$('stagePage'),rail:$('stageRail'),selected:stageIndex,isActive:()=>screen==='stage',
 config:{count:30,poster:'/games/deep-drill/art/poster.png',background:'/assets/lobby-block-atmosphere.svg',stage:i=>{
  const s=STAGES[i];return {id:s.id,kicker:`${String(s.id).padStart(2,'0')} / ${arcNames[s.arc]}`,title:s.zh,subtitle:goalText(s),status:s.id>save.unlocked?'尚未解鎖':save.cleared.includes(s.id)?`已完成 · ${save.records[s.id]?.stars||1}/3 星`:'準備出發',locked:s.id>save.unlocked,cleared:save.cleared.includes(s.id),summary:goalText(s),details:[s.checkpoint?REGIONS[s.arc].hint:advice(s),`${(s.id-1)*100}–${s.id*100}m · ${s.decision}`,'裝備、材料、夥伴和購買的自動化功能永久保留。']};}},
 onSelect:i=>{stageIndex=i;refreshStage();},onStart:i=>brief(i)});
function refreshStage(){stageProgress.textContent=`${save.coins.toLocaleString()} 金幣 · ${save.unlocked}/30 區`;depart.disabled=stageIndex>=save.unlocked;}
function show(name){held=false;lastSeam='';if(screen==='stage')stageUI.cancel();screen=name;document.body.dataset.screen=name;
 for(const s of ['main','stage','battle'])$(s).hidden=s!==name;
 frame.activate(name);if(name==='stage'){stageUI.refresh(save.unlocked-1);stageIndex=save.unlocked-1;refreshStage();}
 world?.resize();}
function ensureWorld(){if(world)return true;try{world=createWorld($('world'));for(let i=0;i<4;i++)thumbnails[i]=world.thumbnail(i);for(const k of Object.keys(ROCKS))rockImages[k]=world.thumbnail(k);for(const k of Object.keys(MODULES))rockImages[`module:${k}`]=world.thumbnail(`module:${k}`);for(const k of Object.keys(TOOLS))rockImages[`tool:${k}`]=world.thumbnail(`tool:${k}`);REGIONS.forEach((_,i)=>rockImages[`relic:${i}`]=world.thumbnail(`relic:${i}`));for(const key of Object.keys(TOOLS))$('tool-'+key).src=rockImages[`tool:${key}`];return true;}catch(error){console.error('Deep Drill WebGL:',error);$('renderError').hidden=false;return false;}}
function brief(index){if(index>=save.unlocked)return;stageIndex=index;const s=STAGES[index],region=REGIONS[s.arc];$('briefRegion').textContent=`${s.id}/30 · ${region.name} · ${(s.id-1)*100}–${s.id*100}m`;$('briefTitle').textContent=s.zh;$('briefStory').textContent=region.intro;$('briefGoal').textContent=goalText(s);$('briefAdvice').textContent=s.checkpoint?region.hint:advice(s);$('briefLoadout').textContent=`${HEADS[save.head].zh} · ${save.activeCrew?CREW[save.activeCrew].name+'同行':'菲亞獨行'} · ${save.equipped.length}/2 模組`;$('briefing').hidden=false;$('launch').focus();}
for(let i=0;i<25;i++){const b=document.createElement('button');b.className='tile-target';b.dataset.cell=i;b.innerHTML='<span class=cell-name></span><span class=cell-hp></span>';b.onclick=()=>{if(!run||run.ended||run.paused)return;const row=run.row+Math.floor(i/5),lane=i%5;if(beamArmed){activateTool('beam',{row,lane});}else if(i<5){selectLane(lane);run.plannedRow=run.row;}else{$('notice').textContent='已顯示前方五層；鑽機會逐層前進';}};$('tileTargets').append(b);}
function startRun(index){beamArmed=false;if(index>=save.unlocked)return;stageIndex=index;run=newRun(save,index);$('result').hidden=true;$('pausePanel').hidden=true;show('battle');
 if(!ensureWorld()){run.paused=true;return;}$('notice').textContent=' ';$('zoneName').textContent=`${String(index+1).padStart(2,'0')} · ${run.stage.zh}`;$('depthTarget').textContent=(index+1)*100;
 $('pressureLine').hidden=!run.stage.pressure;lastSeam='';sound('game.start');renderHud();$('drill').focus({preventScroll:true});}
function selectLane(lane){if(!run||run.ended||run.paused)return;const n=Math.max(0,Math.min(4,lane));if(run.lane!==n){selectRoute(run,n);lastSeam='';}renderHud();}
function release(){held=false;document.body.classList.remove('drilling');}
function pause(){if(!run||run.ended||screen!=='battle')return;release();run.paused=true;$('pausePanel').hidden=false;$('resume').focus();}
function resume(){if(!run||run.ended)return;$('pausePanel').hidden=true;run.paused=false;release();last=performance.now();$('drill').focus();}
function finish(reason){if(!run||run.ended)return;settle(save,run,reason);processEvents();renderHud();}
function result(){release();persist();$('pausePanel').hidden=true;$('result').hidden=false;
 const won=run.clear,reason=run.reason;
 $('resultTitle').textContent=won&&run.stage.id===30?'地心燈塔已點亮':won?'礦區突破！':['pressure','hull'].includes(reason)?'緊急救援完成':reason==='full'?'礦艙滿載，安全返航':reason==='complete'?'抵達終點，目標未完成':'返航成功';
 $('resultText').textContent=`抵達 ${(run.stage.id-1)*100+run.depth}m · ${run.stage.zh}\n${goalText(run.stage)}${won?` · ${save.records[run.stage.id]?.stars||1}/3 勘探星`:''}\n材料：銅 ${run.bankedMaterials.copper} · 晶 ${run.bankedMaterials.crystal} · 零件 ${run.bankedMaterials.salvage}`;
 $('resultCoins').textContent=`+ ${run.banked.toLocaleString()}`;
 $('resultTip').textContent=['pressure','hull'].includes(reason)?'救援隊已回收部分收益。升級鑽頭與鑽力後再深入。':won&&run.stage.checkpoint?`${REGIONS[run.stage.arc].discovery}\n遺物已存入文明檔案。`:won?'礦物與材料已入庫，下一區已解鎖。到基地製作模組、邀請夥伴或領取成就獎勵。':reason==='complete'?'已出售全部礦物。查看任務進度，換條路線再試。':reason==='full'?'收益已全部帶回。升級礦艙，下一次就能挖得更遠。':reason==='service'?'低機殼自動保全返航，收益完整帶回。升級鑽頭後再挑戰。':'收益已入庫。升級鑽力與轉速，回打也能持續成長。';
 $('next').hidden=!won||run.stage.id===30;$('retry').hidden=won&&run.stage.id<30;
 sound(won?'result.win':['pressure','hull'].includes(reason)?'result.lose':'reward.coin');
 $('resultTitle').tabIndex=-1;$('resultTitle').focus({preventScroll:true});$('resultTitle').closest('.panel').scrollTop=0;}
function processEvents(){if(!run)return;for(const e of run.events.splice(0)){
 if(e.type==='break'){world?.burst(e.lane,ROCKS[e.kind].color,reduced.matches,e.row||0);sound(e.kind==='X'?'impact.glass':'impact.stone');$('breakGain').textContent=`+${e.value}`;$('breakGain').classList.remove('gain-pop');void $('breakGain').offsetWidth;$('breakGain').classList.add('gain-pop');
  $('notice').textContent=e.kind==='W'?'冷泉：壓力下降':e.kind==='X'?(e.gentle?'完整水晶入艙！':'水晶受損；分段短按可保完整'):`${ROCKS[e.kind].zh}入艙 · 價值 ${e.value}`;
  const point=world.projectCell(e.row||0,e.lane),mine=$('world').getBoundingClientRect(),dest=$('cargoBar').getBoundingClientRect();$('oreFlight').style.left=point.x+'px';$('oreFlight').style.top=point.y+'px';$('oreFlight').style.setProperty('--fly-x',`${dest.x+dest.width-mine.x-point.x}px`);$('oreFlight').style.setProperty('--fly-y',`${dest.y-mine.y-point.y}px`);
  $('battleContent').classList.remove('collecting');void $('oreFlight').offsetWidth;$('battleContent').classList.add('collecting');lastSeam='';}
 if(e.type==='hit'&&!e.seal){world?.contact(e.lane,reduced.matches);const n=$('hitNumber'),point=world.projectCell(e.row||0,e.lane);n.style.left=point.x+'px';n.style.top=(point.y-12)+'px';n.textContent=`−${e.damage}`;n.classList.remove('hit-pop');void n.offsetWidth;n.classList.add('hit-pop');}
 if(e.type==='beam'){world?.beam(e.lane,e.row,reduced.matches);sound('impact.metal');}
 if(e.type==='sold'){persist();$('notice').textContent='自動出售完成，繼續下鑽';sound('reward.coin');}
 if(e.type==='tool'){persist();$('notice').textContent=e.text;if(e.key!=='beam')sound(e.key==='blast'?'explosion.small':e.key==='repair'?'mechanism.screw':'water.splash');}
 if(e.type==='discovery'||e.type==='relic'){persist();$('notice').textContent=e.text;sound('game.checkpoint');}
 if(e.type==='hurt'){damageTTL=.3;$('notice').textContent=e.text;sound('player.hurt');}
 if(e.type==='seal-block'){$('notice').textContent=e.text;sound('combat.block');}
 if(e.type==='seal-start'){$('notice').textContent=e.text;sound('alert.boss');}
 if(e.type==='seal-hit'){$('notice').textContent=e.text;world?.burst(e.lane,REGIONS[run.stage.arc].color,reduced.matches);sound(e.phase===3?'combat.shield.break':'impact.metal');lastSeam='';}
 if(e.type==='result')result();
 }}
function renderHud(){if(!run)return;const seal=sealState(run),kinds=runSeams(run),key=`${run.row}-${run.lane}-${kinds.join('')}`;
 $('depth').textContent=(run.stage.id-1)*100+run.depth;$('miningPower').textContent=`${run.pilotStatus} · 助手 ${save.helpers}`;$('hullLabel').textContent=`機殼 ${Math.ceil(run.hull)}%`;$('hullLabel').style.color=run.hull<35?'#ff9375':'';
 $('cargoLabel').textContent=`礦艙 ${run.cargo}/${capacity(save)} · ${run.value} 金`;$('cargoBar').max=capacity(save);$('cargoBar').value=run.cargo;
 $('pressureLabel').textContent=`壓力 ${Math.round(run.pressure)}%`;$('pressureBar').value=run.pressure;
 $('pressureLine').hidden=!(run.stage.pressure||run.pressure>0);$('missionGoal').textContent=goalText(run.stage);$('missionProgress').textContent=objectiveProgress(run);$('sealCue').textContent=seal?`${seal.status} · 弱點：${`第 ${seal.lane+1} 列`}`:run.buff>0?'能量增幅啟動':run.frost>0?'冰層阻力：暫時減速':run.stage.checkpoint?'95m 處有地層封印':'';document.body.classList.toggle('seal-active',Boolean(seal));
 for(const key of Object.keys(TOOLS)){$('count-'+key).textContent=save.tools[key];const button=document.querySelector(`[data-tool="${key}"]`);button.disabled=!save.tools[key]||run.paused||run.ended||run.toolCooldown>0||(['blast','beam'].includes(key)&&activeSeal(run));}
 $('rockProgress').style.width=`${Math.min(100,run.progress*100)}%`;
 $('helpersToggle').disabled=!save.helpers;$('helpersToggle').textContent=save.helpers?`助手：${run.helpersOn?'工作中':'暫停'} ×${save.helpers}`:'助手：未僱用';
 $('autoToggle').disabled=!save.auto.drill;$('autoToggle').textContent=save.auto.drill?`自動：${run.auto?(run.autoCooling?'洩壓中':'開啟'):'關閉'}`:'自動：未購買';
 bank.textContent=`${save.coins} 金 · ${HEADS[save.head].zh}`;
 $('mining-label').textContent=run.paused?'鑽機待命中':run.autoCooling?'自動洩壓中':`${ROCKS[kinds[run.lane]].zh} · ${run.toolAllowance?`備用 ${run.toolsUsed}/${run.toolAllowance}`:'庫存保留'}`;
 document.body.classList.toggle('drilling',!run.paused&&!run.ended&&run.drilling);
 if(key!==lastSeam){lastSeam=key;document.querySelectorAll('[data-lane]').forEach((b,i)=>{const k=kinds[i],rock=ROCKS[k];b.replaceChildren();
  if(rockImages[k]){const image=new Image();image.src=rockImages[k];image.alt='';b.append(image);}
  const text=document.createElement('span');text.textContent=rock.zh;const detail=document.createElement('small');detail.textContent=k==='W'?'洩壓泉':k==='L'?'機殼風險':k==='X'?'短按保完整':`${rock.value} 金`;text.append(detail);b.append(text);b.setAttribute('aria-pressed',String(i===run.lane));});}
}
function renderCells(){if(!run||!world)return;document.querySelectorAll('[data-cell]').forEach((b,i)=>{const row=run.row+Math.floor(i/5),lane=i%5,point=world.projectCell(Math.floor(i/5),lane);b.hidden=row>=20||activeSeal(run);if(b.hidden)return;const cell=cellState(run,row,lane);b.style.left=point.x+'px';b.style.top=point.y+'px';b.style.width=point.width+'px';b.style.height=point.height+'px';b.classList.toggle('selected',i<5&&lane===run.lane);b.classList.toggle('beam-target',beamArmed);b.classList.toggle('mined',cell.hp===0);b.setAttribute('aria-label',`${Math.floor(i/5)+1}排${lane+1}列 ${ROCKS[cell.kind].zh} ${Math.ceil(cell.hp)}/${cell.max}`);b.querySelector('.cell-name').textContent=ROCKS[cell.kind].zh;const bar=b.querySelector('.cell-hp');bar.hidden=cell.hp===cell.max||cell.hp===0;bar.textContent=`${Math.ceil(cell.hp)} / ${cell.max}`;bar.style.setProperty('--hp',`${cell.hp/cell.max*100}%`);});document.querySelector('[data-tool="beam"]').setAttribute('aria-pressed',String(beamArmed));}
let shopPausedRun=false;
function shop(){shopPausedRun=screen==='battle'&&run&&!run.ended&&!run.paused;if(shopPausedRun)run.paused=true;shopFocus=document.activeElement;ensureWorld();$('shopNotice').textContent='所有購買只使用遊戲內金幣';renderShop();$('workshop').hidden=false;$('closeShop').focus();}
function renderShop(){
 $('shopCoins').textContent=save.coins.toLocaleString();
 const images={...thumbnails,...rockImages};$('materials').replaceChildren();
 for(const [key,label,icon] of [['copper','銅','C'],['crystal','晶','X'],['salvage','零件','B'],['core','核心','E']]){
  const span=document.createElement('span'),img=new Image();img.src=rockImages[icon];img.alt='';span.append(img,document.createTextNode(`${label} ${save.materials[key]}`));$('materials').append(span);
 }
 document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===baseTab)));
 renderBase({s:save,tab:baseTab,root:$('shopItems'),images,onChange:()=>{persist();renderShop();refreshStage();},feedback:(text,ok)=>{$('shopNotice').textContent=text;sound(ok?'shop.purchase':'feedback.error');}});
}
function objectiveProgress(r){
 if(r.stage.checkpoint)return `${r.seal.phase}/3 封印`;
 const q=r.stage.quota,s=r.stats;switch(r.stage.goal){
  case'copper':return `${s.copper}/${q}`;case'gold':return `${s.gold}/${q}`;case'crystal':return `${s.crystal}/${q}`;case'quality':return `${s.quality}/${q}`;
  case'coolant':return `${s.coolant}/${q}`;case'cargo':return `${s.copper+s.gold+s.crystal}/${q}`;case'balanced':return `銅 ${s.copper}/${q} · 金 ${s.gold}/${Math.ceil(q/2)}`;
  case'vent':return `${s.vent}/${q} 次`;case'safe':return s.magma===0?'未觸碰熔岩':'已碰熔岩，需重試';default:return `${r.depth}/100m`;
 }
}
function activateTool(key,target){if(key==='beam'&&!target){beamArmed=!beamArmed;$('notice').textContent=beamArmed?'光束已就緒：點選一格普通地磚':'取消光束瞄準';renderHud();return;}if(useTool(save,run,key,target)){beamArmed=false;release();persist();processEvents();renderHud();}else{$('notice').textContent=['blast','beam'].includes(key)&&activeSeal(run)?'封印需要依提示解除，鑽彈無法直接破壞':'沒有可用補給，或目前不需要此工具';sound('feedback.error');}}
$('start').onclick=()=>{show('stage');};depart.onclick=()=>brief(stageIndex);workshopButton.onclick=shop;
$('closeShop').onclick=()=>{$('workshop').hidden=true;if(shopPausedRun&&run&&!run.ended){run.paused=false;last=performance.now();shopPausedRun=false;}shopFocus?.focus();};
$('launch').onclick=()=>{$('briefing').hidden=true;startRun(stageIndex);};$('briefCancel').onclick=()=>{$('briefing').hidden=true;depart.focus();};
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{baseTab=b.dataset.tab;renderShop();$('workshop').querySelector('.panel').scrollTop=0;});
document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>activateTool(b.dataset.tool));
$('stage').querySelector('[data-wp-return]').onclick=()=>show('main');
$('battle').querySelector('[data-wp-return]').onclick=pause;
$('left').onclick=()=>selectLane(run.lane-1);$('right').onclick=()=>selectLane(run.lane+1);
document.querySelectorAll('[data-lane]').forEach(b=>b.onclick=()=>selectLane(Number(b.dataset.lane)));
$('drill').onclick=shop;$('pause').onclick=pause;$('resume').onclick=resume;
$('return').onclick=()=>finish('return');$('exitRun').onclick=()=>{finish('return');};
$('autoToggle').onclick=()=>{if(!run||!save.auto.drill||run.ended||run.paused)return;run.auto=!run.auto;release();renderHud();};
$('helpersToggle').onclick=()=>{if(!run||run.ended||run.paused)return;run.helpersOn=!run.helpersOn;renderHud();};
$('retry').onclick=()=>startRun(stageIndex);$('next').onclick=()=>startRun(Math.min(29,stageIndex+1));
$('backStages').onclick=()=>{$('result').hidden=true;show('stage');};
window.addEventListener('keydown',e=>{
 const modal=[...document.querySelectorAll('.overlay')].find(n=>!n.hidden);
 if(e.key==='Tab'&&modal){const buttons=[...modal.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}
 if(e.key==='Escape'){if(!$('briefing').hidden){$('briefCancel').click();return;}if(!$('workshop').hidden)$('closeShop').click();else if(!$('pausePanel').hidden)resume();else pause();return;}
 if(screen!=='battle'||modal||run?.paused||run?.ended||e.target.closest('select,input,.wp-frame-popover'))return;
 if(e.code==='Space'&&!e.repeat){e.preventDefault();shop();}

});
window.addEventListener('keyup',e=>{if(e.code==='Space')release();});window.addEventListener('blur',release);
document.addEventListener('visibilitychange',()=>{release();if(document.hidden&&screen==='battle')pause();});
window.addEventListener('weightplay:interaction-state',()=>{if(document.querySelector('.wp-frame-popover:not([hidden])'))pause();});
window.addEventListener('pagehide',event=>{persist();release();if(!event.persisted)world?.destroy();});
$('world').addEventListener('webglcontextlost',e=>{e.preventDefault();pause();$('renderError').hidden=false;persist();});
let warned=false;
function loop(now){const dt=Math.min(.05,(now-(last||now))/1000);last=now;
 if(screen==='battle'&&run&&world){accumulator=Math.min(.1,accumulator+dt);while(accumulator>=1/60){tick(save,run,1/60,held);accumulator-=1/60;}processEvents();renderHud();
  const active=!run.paused&&!run.ended&&run.drilling;world.update(save,run,dt,active,reduced.matches);renderCells();damageTTL=Math.max(0,damageTTL-dt);document.body.classList.toggle('hurt',damageTTL>0);
  if(run.pressure>78&&!warned){warned=true;sound('alert.warning');}if(run.pressure<65)warned=false;
 }
 requestAnimationFrame(loop);
}
window.WeightPlayAudio?.preload(['game.start','impact.stone','impact.glass','shop.purchase','reward.upgrade','reward.coin','alert.warning','alert.boss','result.win','result.lose','feedback.error','player.hurt','combat.block','combat.shield.break','impact.metal','explosion.small','mechanism.screw','water.splash','game.checkpoint']);
refreshStage();show('main');requestAnimationFrame(loop);
// Read-only diagnostics supplement local geometry/resource checks; never clear a run.
window.DeepDrill=Object.freeze({snapshot:()=>({screen,save:structuredClone(save),run:run?structuredClone(run):null,render:world?.stats()||null})});
