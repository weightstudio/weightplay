import {STAGES, validateStages} from './stage-data.js';
import {ShowtimeScene} from './stage-scene.js';
import {spotlightAvailable, spotlightGoals, spotlightStageIds} from './spotlight-remix.js';

const $=id=>document.getElementById(id);
const byCue=Object.freeze({N:'↑',E:'→',S:'↓',W:'←',WAIT:'Wait',BOW:'Bow',WAVE:'Wave'});
const STEP=Object.freeze({N:[0,-1],E:[1,0],S:[0,1],W:[-1,0]});
const saveKey='wp-robot-dog-showtime-v2';
const stages=STAGES;
let save=readSave(),screen='main',stageIndex=0,activeStageRange=0,selectedActor=0,selectedBeat=0,plan=[],scene=null,renderEpoch=0,rehearsing=false,focusBeforeDialog=null,activeRemix=false,remixFirstRehearsal=false;
const els={main:$('mainScreen'),stage:$('stageScreen'),battle:$('battleScreen'),rail:$('stageRail'),spotlightRail:$('spotlightRail'),summary:$('stageSummary'),label:$('battleLabel'),status:$('cueStatus'),beatRail:$('beatRail'),dogPlan:$('dogPlan'),foxPlan:$('foxPlan'),dogGoal:$('dogGoal'),foxGoal:$('foxGoal'),canvas:$('stage3d'),fallback:$('renderFallback'),help:$('helpDialog'),leave:$('leaveDialog'),result:$('resultDialog')};

function readSave(){try{const raw=JSON.parse(localStorage.getItem(saveKey)||'{}');return{unlocked:Math.max(1,Math.min(30,Number(raw.unlocked)||1)),cleared:Array.isArray(raw.cleared)?raw.cleared.filter(n=>Number.isInteger(n)&&n>=1&&n<=30):[],drafts:raw.drafts&&typeof raw.drafts==='object'?raw.drafts:{},remixCleared:Array.isArray(raw.remixCleared)?raw.remixCleared.filter(n=>spotlightStageIds.includes(n)):[],remixFirstTry:Array.isArray(raw.remixFirstTry)?raw.remixFirstTry.filter(n=>spotlightStageIds.includes(n)):[],remixAttempted:Array.isArray(raw.remixAttempted)?raw.remixAttempted.filter(n=>spotlightStageIds.includes(n)):[]}}catch{return{unlocked:1,cleared:[],drafts:{},remixCleared:[],remixFirstTry:[],remixAttempted:[]}}}
function persist(){try{localStorage.setItem(saveKey,JSON.stringify(save))}catch{setStatus('Progress could not be saved in this browser. You can keep playing this stage.')}}
function setStatus(text,bad=false){els.status.textContent=text;els.status.dataset.kind=bad?'error':'info'}
function syncScreen(next){screen=next;document.body.dataset.screen=next;els.main.hidden=next!=='main';els.stage.hidden=next!=='stage';els.battle.hidden=next!=='battle';if(next==='battle')els.battle.querySelector('.battle-canvas')?.setAttribute('data-wp-logical-battle-canvas','')}
function stageName(stage){return `Stage ${stage.id} · ${stage.arc}`}
function renderMain(){const cleared=save.cleared.length;$('mainProgress').textContent=cleared?`${cleared} / 30 cleared · Stage ${save.unlocked} ready`:'Stage 1 · ready'}
function setStageRange(range){activeStageRange=Math.max(0,Math.min(2,Number(range)||0));const first=activeStageRange*10+1,last=first+9;
  for(const tab of document.querySelectorAll('[data-stage-range]')){const selected=Number(tab.dataset.stageRange)===activeStageRange;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1}
  for(const card of els.rail.querySelectorAll('.stage-card')){const id=Number(card.dataset.stageId);card.hidden=id<first||id>last}
  const resetRail=()=>els.rail.scrollTo({left:0,top:0,behavior:'instant'});
  resetRail();requestAnimationFrame(()=>requestAnimationFrame(resetRail))
}
function renderMap(){els.summary.textContent=`${save.cleared.length} cleared · ${save.unlocked} unlocked`;els.rail.replaceChildren();els.spotlightRail.replaceChildren();activeStageRange=Math.floor((save.unlocked-1)/10);
  for(const stage of stages){const b=document.createElement('button');b.type='button';b.className='stage-card';b.dataset.stageId=String(stage.id);b.disabled=stage.id>save.unlocked;b.setAttribute('aria-label',`${stageName(stage)}${b.disabled?', locked':''}`);if(stage.id===stageIndex+1)b.setAttribute('aria-current','true');b.innerHTML=`<span class="num">${String(stage.id).padStart(2,'0')}</span><span class="arc">${stage.arc}</span><span class="state">${save.cleared.includes(stage.id)?'Cleared':b.disabled?'Locked':'Play'}</span>`;b.addEventListener('click',()=>startBattle(stage.id-1));els.rail.append(b)}
  for(const stage of stages.filter(item=>spotlightAvailable(item.id,save.cleared))){const remix=document.createElement('button');remix.type='button';remix.className='stage-remix';remix.dataset.remixStage=String(stage.id);remix.textContent=save.remixFirstTry.includes(stage.id)?`Stage ${stage.id} · first try!`:save.remixCleared.includes(stage.id)?`Replay Mix · Stage ${stage.id}`:`Spotlight Mix · Stage ${stage.id}`;remix.setAttribute('aria-label',`${save.remixCleared.includes(stage.id)?'Replay':'Try'} Spotlight Mix on Stage ${stage.id}${save.remixFirstTry.includes(stage.id)?', first rehearsal clear':''}`);remix.addEventListener('click',()=>startBattle(stage.id-1,{remix:true}));els.spotlightRail.append(remix)}
  els.spotlightRail.hidden=els.spotlightRail.childElementCount===0;setStageRange(activeStageRange);
}
function draftFor(stage,remix=false){const source=save.drafts[remix?`${stage.id}:spotlight`:String(stage.id)];return Array.from({length:stage.beats},(_,i)=>Array.from({length:2},(_,actor)=>ACTIONS_SAFE(source?.[i]?.[actor])))}
function ACTIONS_SAFE(value){return Object.hasOwn(byCue,value)?value:null}
function saveDraft(){save.drafts[activeRemix?`${stageIndex+1}:spotlight`:String(stageIndex+1)]=plan.map(pair=>[...pair]);persist()}
function currentStage(){return stages[stageIndex]}
function currentGoals(stage=currentStage()){return activeRemix?spotlightGoals(stage.goals):stage.goals}
function showBattleScene(epoch){try{if(epoch!==renderEpoch||screen!=='battle')return;scene=new ShowtimeScene(els.canvas);scene.setState({positions:currentStage().starts,goals:currentGoals(),walls:currentStage().walls});els.fallback.hidden=true}catch(error){console.error('Robot Dog Showtime 3D initialization failed',error);els.fallback.hidden=false}}
function destroyScene(){renderEpoch++;scene?.dispose();scene=null}
function startBattle(index,{remix=false}={}){if(index<0||index>=stages.length||index>=save.unlocked)return;const stage=stages[index];if(remix&&!spotlightAvailable(stage.id,save.cleared))return;stageIndex=index;activeRemix=remix;remixFirstRehearsal=remix&&!save.remixAttempted.includes(stage.id);selectedActor=0;selectedBeat=0;plan=draftFor(stage,remix);syncScreen('battle');
  const s=currentStage(),goals=currentGoals(s);els.label.textContent=`${stageName(s)}${remix?' · Spotlight Mix':''}`;els.dogGoal.textContent=`Mark ${goals[0]+1}`;els.foxGoal.textContent=`Mark ${goals[1]+1}`;
  $('selectDog').setAttribute('aria-pressed','true');$('selectFox').setAttribute('aria-pressed','false');renderPlan();setStatus(remix?`Spotlight Mix · goals are swapped. Plan ${s.beats} beats.`:`Plan ${s.beats} beats. Choose a performer, beat, and cue.`);renderMain();
  try{window.WeightPlayAudio?.play('game.start')}catch{};
  if(scene){scene.activate();scene.setState({positions:s.starts,goals,walls:s.walls});els.fallback.hidden=true}else showBattleScene(renderEpoch)
}
function cueName(cue){return cue?byCue[cue]:'—'}
function renderPlan(){const s=currentStage();els.beatRail.replaceChildren();
  for(let i=0;i<s.beats;i++){const b=document.createElement('button');b.type='button';b.className='beat-button';b.textContent=String(i+1);b.setAttribute('aria-label',`Beat ${i+1}`);b.setAttribute('aria-pressed',String(i===selectedBeat));b.addEventListener('click',()=>{selectedBeat=i;renderPlan();setStatus(`Beat ${i+1} selected for ${selectedActor===0?'Robot Pup':'Fox Partner'}.`)});els.beatRail.append(b)}
  const words=plan.map((row,i)=>`${i+1}: ${cueName(row[0])}, ${cueName(row[1])}`);els.dogPlan.textContent=words.map((w,i)=>`${i+1}:${cueName(plan[i][0])}`).join(' · ');els.foxPlan.textContent=words.map((w,i)=>`${i+1}:${cueName(plan[i][1])}`).join(' · ');
  $('selectDog').setAttribute('aria-pressed',String(selectedActor===0));$('selectFox').setAttribute('aria-pressed',String(selectedActor===1));
  for(const b of document.querySelectorAll('[data-cue],#clearCue,#resetPlan,#rehearseButton'))b.disabled=rehearsing;
}
function chooseActor(actor){if(rehearsing)return;selectedActor=actor;renderPlan();setStatus(`${actor===0?'Robot Pup':'Fox Partner'} selected · Beat ${selectedBeat+1}.`)}
function setCue(cue){if(rehearsing)return;plan[selectedBeat][selectedActor]=cue;saveDraft();renderPlan();setStatus(`${cueName(cue)} placed · ${selectedActor===0?'Robot Pup':'Fox Partner'} · Beat ${selectedBeat+1}.`)}
function clearCue(){if(rehearsing)return;plan[selectedBeat][selectedActor]=null;saveDraft();renderPlan();setStatus(`Cue cleared · Beat ${selectedBeat+1}.`)}
function resetPlan(){if(rehearsing)return;plan=Array.from({length:currentStage().beats},()=>[null,null]);saveDraft();renderPlan();setStatus('Plan reset. Add cues, then rehearse.');scene?.setState({positions:currentStage().starts,goals:currentGoals(),walls:currentStage().walls})}
function nextCell(cell,cue,stage){if(!STEP[cue])return{cell,reason:null};const x=cell%4,y=Math.floor(cell/4),[dx,dy]=STEP[cue],nx=x+dx,ny=y+dy;
  if(nx<0||nx>3||ny<0||ny>2)return{cell,reason:'would leave the stage'};const next=ny*4+nx;if(stage.walls.includes(next))return{cell,reason:'mark is blocked'};return{cell:next,reason:null}}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function rehearse(){if(rehearsing||!scene)return;rehearsing=true;renderPlan();const stage=currentStage(),goals=currentGoals(stage),positions=[...stage.starts];let failure=null;
  scene.setState({positions,goals,walls:stage.walls,gestures:[]});setStatus('Rehearsal starting.');
  try{for(let i=0;i<stage.beats;i++){if(screen!=='battle')return;const cues=plan[i].map(c=>c||'WAIT'),moves=cues.map((cue,actor)=>nextCell(positions[actor],cue,stage));
      const invalid=moves.findIndex(result=>result.reason);if(invalid>=0){failure={beat:i,actor:invalid,reason:moves[invalid].reason};break}
      const next=moves.map(result=>result.cell);if(next[0]===next[1]){failure={beat:i,actor:1,reason:'both performers would share a mark'};break}
      if(next[0]===positions[1]&&next[1]===positions[0]&&next[0]!==next[1]){failure={beat:i,actor:1,reason:'the two routes cross at once'};break}
      positions.splice(0,2,...next);scene.setState({positions,goals,walls:stage.walls,activeActor:selectedActor,gestures:cues});setStatus(`Beat ${i+1} · ${cueName(cues[0])} / ${cueName(cues[1])}`);await wait(matchMedia('(prefers-reduced-motion: reduce)').matches?25:360);
    }
    if(failure){if(activeRemix){if(!save.remixAttempted.includes(stage.id))save.remixAttempted.push(stage.id);persist();remixFirstRehearsal=false}const name=failure.actor===0?'Robot Pup':'Fox Partner';setStatus(`Beat ${failure.beat+1}: ${name} ${failure.reason}. Your plan is ready to edit.`,true);window.WeightPlayAudio?.play('feedback.error');return}
    const inFormation=positions[0]===goals[0]&&positions[1]===goals[1];
    const syncOk=!stage.bow||(plan.at(-1)?.[0]==='BOW'&&plan.at(-1)?.[1]==='BOW');
    if(!inFormation||!syncOk){if(activeRemix){if(!save.remixAttempted.includes(stage.id))save.remixAttempted.push(stage.id);persist();remixFirstRehearsal=false}setStatus(!inFormation?'The final formation is off its marks. Edit the routes and rehearse again.':'Both partners need a Bow cue on the closing beat.',true);window.WeightPlayAudio?.play('feedback.error');return}
    clearStage(stage);scene.setState({positions,goals,walls:stage.walls,gestures:stage.bow?['BOW','BOW']:[]});window.WeightPlayAudio?.play('result.win');openResult(stage);
  }finally{rehearsing=false;renderPlan()}}
function clearStage(stage){if(activeRemix){if(!save.remixCleared.includes(stage.id))save.remixCleared.push(stage.id);if(remixFirstRehearsal&&!save.remixFirstTry.includes(stage.id))save.remixFirstTry.push(stage.id);if(!save.remixAttempted.includes(stage.id))save.remixAttempted.push(stage.id);delete save.drafts[`${stage.id}:spotlight`]}else{if(!save.cleared.includes(stage.id))save.cleared.push(stage.id);save.unlocked=Math.max(save.unlocked,Math.min(30,stage.id+1));delete save.drafts[String(stage.id)]}persist();renderMain()}
function openResult(stage){$('resultKicker').textContent=activeRemix?'SPOTLIGHT MIX CLEARED':stage.id%5===0?'CHECKPOINT CLEARED':'SHOW COMPLETE';$('resultTitle').textContent=activeRemix?'New spotlight, new route!':stage.id===30?'Opening Night!':'Great formation!';$('resultText').textContent=activeRemix?`The swapped goals are saved${save.remixFirstTry.includes(stage.id)?' · first rehearsal clear':''}. Your regular campaign is unchanged.`:`The pup and fox reached their marks on Stage ${stage.id}. Progress is saved.`;$('nextStage').disabled=stage.id===30;$('spotlightResult').hidden=activeRemix||!spotlightStageIds.includes(stage.id)||!save.cleared.includes(stage.id);els.result.hidden=false;focusBeforeDialog=document.activeElement;$('spotlightResult').hidden?$('nextStage').focus():$('spotlightResult').focus()}
function closeDialog(dialog,focus){dialog.hidden=true;if(focus?.isConnected)focus.focus()}
function openHelp(){if(rehearsing)return;focusBeforeDialog=document.activeElement;els.help.hidden=false;$('closeHelp').focus()}
function goMap(){if(rehearsing)return;closeDialog(els.leave);closeDialog(els.result);scene?.suspend();syncScreen('stage');renderMap();$('stageBack').focus()}
function closeToMap(){if(rehearsing)return;scene?.suspend();closeDialog(els.leave);closeDialog(els.help);syncScreen('stage');renderMap();$('stageBack').focus()}

$('startButton').addEventListener('click',()=>{syncScreen('stage');renderMap();$('stageBack').focus()});
$('stageScreen').querySelector('.stage-tabs').addEventListener('click',event=>{const tab=event.target.closest('[data-stage-range]');if(tab)setStageRange(tab.dataset.stageRange)});
$('stageScreen').querySelector('.stage-tabs').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const next=Math.max(0,Math.min(2,activeStageRange+(event.key==='ArrowRight'?1:-1)));setStageRange(next);document.querySelector(`[data-stage-range="${next}"]`).focus()});
$('stageBack').addEventListener('click',()=>{syncScreen('main');renderMain();$('startButton').focus()});
$('selectDog').addEventListener('click',()=>chooseActor(0));$('selectFox').addEventListener('click',()=>chooseActor(1));
for(const b of document.querySelectorAll('[data-cue]'))b.addEventListener('click',()=>setCue(b.dataset.cue));
$('clearCue').addEventListener('click',clearCue);$('resetPlan').addEventListener('click',resetPlan);$('rehearseButton').addEventListener('click',rehearse);
$('battleBack').addEventListener('click',()=>{if(rehearsing)return;focusBeforeDialog=document.activeElement;els.leave.hidden=false;$('continueBattle').focus()});
$('continueBattle').addEventListener('click',()=>closeDialog(els.leave,focusBeforeDialog));$('returnMap').addEventListener('click',closeToMap);
$('helpButton').addEventListener('click',openHelp);$('closeHelp').addEventListener('click',()=>closeDialog(els.help,focusBeforeDialog));
  $('resultMap').addEventListener('click',goMap);$('nextStage').addEventListener('click',()=>{closeDialog(els.result);if(stageIndex<29)startBattle(stageIndex+1);else goMap()});$('spotlightResult').addEventListener('click',()=>{closeDialog(els.result);startBattle(stageIndex,{remix:true})});
$('retryRender').addEventListener('click',()=>{destroyScene();showBattleScene(renderEpoch)});
for(const dialog of [els.help,els.leave,els.result])dialog.addEventListener('keydown',event=>{if(event.key==='Escape'&&dialog!==els.result){event.preventDefault();closeDialog(dialog,focusBeforeDialog)}});
window.addEventListener('keydown',event=>{if(screen!=='battle'||rehearsing||els.help.hidden===false||els.leave.hidden===false||els.result.hidden===false)return;const cue=({ArrowUp:'N',ArrowRight:'E',ArrowDown:'S',ArrowLeft:'W'})[event.key];if(cue){event.preventDefault();setCue(cue)}});
window.addEventListener('pagehide',destroyScene,{once:true});

renderMain();
const authoringIssues=validateStages();if(authoringIssues.length)console.error('Stage data authoring issues',authoringIssues);
window.__robotDogShowtime={stages:()=>stages.map(s=>({id:s.id,arc:s.arc,beats:s.beats,solution:s.solution})),snapshot:()=>({screen,stage:stageIndex+1,remix:activeRemix,goals:[...currentGoals()],plan:plan.map(x=>[...x]),selectedActor,selectedBeat,save:{...save},gestures:[...(scene?.gestures||[])],renderer:scene?.stats()||null}),start:(index,options)=>startBattle(index,options),setCue,clearStage,solveIssues:authoringIssues};
