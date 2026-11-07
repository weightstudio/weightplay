import {STAGES} from './campaign.mjs?wp-media=a5465b2863a3bbab';
import {initial,degrees,cycleEdge,violations,hintFor} from './model.mjs?wp-media=a5465b2863a3bbab';
import {mountRenderer} from './render.mjs?wp-media=a5465b2863a3bbab';
import {createSave} from './save.mjs?wp-media=a5465b2863a3bbab';
import {LOCALES,ROUTES,text,gameTitle} from './copy.mjs?wp-media=a5465b2863a3bbab';
import {stageConfig} from './stage-config.mjs?wp-media=a5465b2863a3bbab';
import {LocalPractice} from '../../src/game-local-practice.mjs?wp-media=a5465b2863a3bbab';

const $=id=>{const node=document.getElementById(id);if(!node)throw Error(`TIDEWEAVE_NODE:${id}`);return node;};
const params=new URLSearchParams(location.search),local=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
const practice=local&&params.get('practice')==='1',preview=params.getAll('preview').length===1&&params.get('preview')==='1';
const route=ROUTES.indexOf(location.pathname.split('/')[1]);let locale=route<0?'en':LOCALES[route];
const t=(key,vars)=>text(locale,key,vars),roots={main:$('mainScreen'),stage:$('stageScreen'),battle:$('battleScreen')},SKU='tideweave:amber';
const abort=new AbortController(),on=(node,event,fn,options={})=>node.addEventListener(event,fn,{...options,signal:abort.signal}),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let frame=null,selector=null,screen='main',tab='stages',selected=0,run=null,renderer=null,generation=0,serial=0,dead=false,result=false,overlay=null,returnFocus=null,warning=false,purchasing=false,tutorial=null,focused=0,finishRaf=0;
let rendererCreates=0,rendererDisposals=0;const resourceHistory=[];
const save=createSave({isolated:practice,onWarning:()=>warning=true}),audio=window.WeightPlayAudio?.createScope();selected=save.unlocked-1;

let actionGuide=null,lessonReplay=false,replayRequested=false;
const lessonDone=()=>{try{return actionGuide?.hasCompleted()||localStorage.getItem('weightplay_action_tutorial_tideweave_v1')==='1';}catch{return false;}};
function beginLesson(){if(practice||selected!==0||!lessonReplay&&lessonDone())return;
 if(!actionGuide){const host=document.createElement('div');host.className='ma-action-lesson';$('arena').append(host);
 actionGuide=window.WeightPlayTutorial.createActionGuide({gameId:'tideweave',revision:1,host,canPersist:()=>!practice,
steps:[1,2].map(n=>({id:'bridge-'+n,title:()=>t('help'),instruction:()=>t('routeRead',{a:1,b:2,n,max:2})+' · '+t('baseRule'),target:()=>$('boardGrid').children[run.selected===0?1:0]})),onComplete:()=>{hud();status();}});}
actionGuide.start({replay:lessonReplay});}
const owns=()=>window.WeightPlayWallet?.owns?.(SKU)===true;
const skin=()=>save.value.equipped==='amber'&&owns()?'amber':save.value.equipped==='moss'&&save.value.cleared[29]?'moss':'stone';
const sound=id=>audio?.play(id),fade=node=>node.animate?.([{opacity:.45},{opacity:1}],{duration:reduced.matches?50:170,easing:'ease-out'});
function observe(){window.WonderAnalytics?.game?.observeState?.(()=>({screen:frame?screen:null,node:roots[screen],locale,stageId:run?selected+1:null,stageIdAuthoritative:true,roundKey:run?.serial??null,started:!!run?.ready,paused:!!overlay||result,ended:!!run?.ended,outcome:run?.ended?'win':null,saveSucceeded:run?.persisted===true,rewardEligible:!practice,activityMode:'input',keyboardKeys:['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter','Space','z']}));}
function status(message=''){const n=$('status');n.textContent=[practice?t('practice'):'',warning?t('saveWarn'):message].filter(Boolean).join(' · ');if(message)fade(n);}
function labels(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=`${gameTitle(locale)} | WeightPlay`;
  document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));document.querySelectorAll('[data-name]').forEach(n=>n.textContent=gameTitle(locale));
  $('mainReturn').href=`/${ROUTES[LOCALES.indexOf(locale)]}/`;$('mainReturn').setAttribute('aria-label',t('returnLobby'));
  $('stageBackBtn').setAttribute('aria-label',t('returnMain'));$('battleBackBtn').setAttribute('aria-label',t('stages'));$('comingSoon').querySelector('a').href=`/${ROUTES[LOCALES.indexOf(locale)]}/`;
  $('mainProgress').textContent=t('progress',{n:save.unlocked});$('boardGrid').setAttribute('aria-label',t('baseRule'));$('gameGuide').setAttribute('aria-label',t('help'));
  document.querySelectorAll('img[alt="Tideweave"]').forEach(n=>n.alt=gameTitle(locale));management();if(run)hud();
}
function collection(id){try{const c=window.WeightPlayCastle?.read?.();return c?.completions?Object.hasOwn(c.completions,`tideweave:stage-${id}`)?'collected':'not-collected':'unknown';}catch{return 'unknown';}}
const config=()=>stageConfig({stages:STAGES,t,save,practice,practiceEnabled:()=>LocalPractice.enabled,collection});
function stopRender(){actionGuide?.stop();lessonReplay=false;cancelAnimationFrame(finishRaf);finishRaf=0;if(!renderer)return;renderer.dispose();resourceHistory.push(renderer.metrics());if(resourceHistory.length>6)resourceHistory.shift();renderer=null;rendererDisposals++;audio?.stop();}
function closeOverlay(restore=true){if(!overlay)return;tutorial?.hide();overlay.hidden=true;overlay=null;actionGuide?.pause(document.hidden);$('battleLive').inert=result||!!run?.finishing;$('stageWorkspace').inert=false;$('stageTabs').inert=false;renderer?.pause(document.hidden);frame?.activate(screen,{covered:result});if(restore&&returnFocus?.isConnected)returnFocus.focus({preventScroll:true});returnFocus=null;observe();}
function activate(next){
  generation++;closeOverlay(false);if(next!=='battle'){stopRender();run=null;result=false;$('resultPanel').hidden=true;}
  $('mainGroup').hidden=next!=='main';screen=next;document.body.dataset.screen=next;for(const [k,node]of Object.entries(roots))node.hidden=k!==next;
  selector?.setActive(next==='stage'&&tab==='stages');frame.activate(next,{covered:false});
  if(next==='stage'){selector.setConfig(config(),selected);selector.refresh(selected);}if(next==='main')$('mainProgress').textContent=t('progress',{n:save.unlocked});fade(roots[next]);observe();
}
function setTab(next){tab=next;for(const [k,id]of [['stages','stagePanel'],['team','teamPanel'],['equipment','equipmentPanel']])$(id).hidden=k!==next;for(const [k,id]of [['stages','tabStages'],['team','tabTeam'],['equipment','tabEquipment']])$(id).setAttribute('aria-selected',String(k===next));selector?.setActive(screen==='stage'&&next==='stages');if(next==='stages')selector?.refresh(selected);management();fade($(next==='stages'?'stagePanel':next==='team'?'teamPanel':'equipmentPanel'));}
function showOverlay(title,body,actions){
  closeOverlay(false);renderer?.pause(true);overlay=screen==='stage'?$('stageOverlay'):$('battleOverlay');returnFocus=document.activeElement;
  const h=overlay.querySelector('h2'),content=overlay.querySelector('.modal-body'),buttons=overlay.querySelector('.modal-actions');h.textContent=title;h.id=`${overlay.id}Title`;overlay.setAttribute('aria-labelledby',h.id);content.replaceChildren();
  if(typeof body==='string')content.textContent=body;else for(const row of body){const p=document.createElement('p');p.className='rule-line';if(row.icon){const art=document.createElement('span');art.className=`object-icon ${row.icon}-icon`;art.setAttribute('aria-hidden','true');p.append(art);}const text=document.createElement('span');text.textContent=row.text;p.append(text);content.append(p);}
  buttons.replaceChildren();for(const row of actions){const b=document.createElement('button');b.type='button';b.textContent=row.label;if(row.primary)b.dataset.wpFrameAction='primary';b.addEventListener('click',row.action,{once:true});buttons.append(b);}
  overlay.hidden=false;if(screen==='battle')$('battleLive').inert=true;else{$('stageWorkspace').inert=true;$('stageTabs').inert=true;}
  frame.activate(screen,{covered:true});fade(overlay.querySelector('.modal-card'));buttons.querySelector('button')?.focus({preventScroll:true});observe();
}
function trap(e){const root=overlay||(result?$('resultPanel'):null);if(!root)return false;if(e.key==='Escape'&&overlay){e.preventDefault();closeOverlay();return true;}if(e.key==='Tab'){const list=[...root.querySelectorAll('button:not(:disabled),[tabindex="0"]')].filter(n=>n.getBoundingClientRect().height>0),i=list.indexOf(document.activeElement);e.preventDefault();list[(i+(e.shiftKey?-1:1)+list.length)%list.length]?.focus({preventScroll:true});}return true;}
function help(force=false){
  if(!run?.ready||result||run.finishing)return;const b=STAGES[selected],key=selected>=40?'pairSeen':selected>=30?'tideSeen':'tutorialSeen';if(save.value[key]&&!force)return;
  tutorial??=window.WeightPlayTutorial.createEmbedded({gameId:'tideweave',open:()=>{},isSeen:()=>false,onComplete:()=>{},canPersist:()=>false});
  const rows=[{icon:'cedar',text:t('baseRule')}];if(b.edges.some(e=>e.max===1))rows.push({icon:'reed',text:t('narrowRule')});if(b.edges.some(e=>e.max===0))rows.push({icon:'reef',text:t('reefRule')});if(b.edges.some(e=>e.tide))rows.push({icon:'tide',text:t('tideRule')});if(b.pairs.length)rows.push({icon:'pair',text:t('pairRule')});if(b.fork)rows.push({icon:'fork',text:t('forkRule')});if(selected>=30)rows.push({icon:'pin',text:t('pinRule')});
  showOverlay(t('help'),rows,[{label:t('continue'),primary:true,action:()=>{tutorial.complete();if(!practice)save.write({...save.value,[key]:true});closeOverlay();$('boardGrid').querySelector('button')?.focus({preventScroll:true});}}},{label:t('help')+' ↻',action:()=>{closeOverlay(false);replayRequested=true;void start(0);}}]);overlay.querySelector('button').dataset.wpTutorialNext='';
}
function makeBoard(){
  const b=STAGES[selected],root=$('boardGrid');root.replaceChildren();$('routeMarks').replaceChildren();
  b.nodes.forEach((n,i)=>{const cell=document.createElement('button');cell.type='button';cell.dataset.cell=i;cell.tabIndex=i===0?0:-1;cell.innerHTML='<strong></strong><small></small>';on(cell,'focus',()=>{focused=i;});on(cell,'click',()=>islandInput(i));root.append(cell);});
  b.edges.forEach((e,i)=>{const mark=document.createElement('span');mark.className='route-mark';mark.dataset.edge=i;mark.hidden=true;
    const icon=e.max===0?'reef':e.tide?'tide':e.max===1?'reed':null;
    if(icon){const art=document.createElement('span');art.className=`object-icon ${icon}-icon`;mark.append(art);mark.hidden=false;}
    b.pairs.forEach((p,k)=>{if(p.includes(i)){const span=document.createElement('span');span.className='pair-code';span.textContent=`${k+1}=`;mark.append(span);mark.hidden=false;}});
    if(b.fork?.includes(i)){const span=document.createElement('span');span.className='fork-code';span.textContent='Y';mark.append(span);mark.hidden=false;}
    const note=document.createElement('span');note.className='pin-note';mark.append(note);$('routeMarks').append(mark);
  });
}
function project({nodes,edges}){if(!run)return;nodes.forEach((p,i)=>{const n=$('boardGrid').children[i];if(n){n.style.left=`${p.x}px`;n.style.top=`${p.y}px`;}});edges.forEach((p,i)=>{const n=$('routeMarks').children[i];if(n){n.style.left=`${p.x}px`;n.style.top=`${p.y}px`;}});}
function islandLabel(b,i,d){
  const n=b.nodes[i],notes=[t('island',{n:i+1,have:d[i],need:n.need}),t('positionRead',{r:n.y/2+1,c:n.x/2+1})];
  const adjacent=b.edges.flatMap((e,j)=>e.a===i||e.b===i?[j]:[]);
  for(const j of adjacent){const e=b.edges[j];notes.push(t('routeRead',{a:e.a+1,b:e.b+1,n:run.values[j],max:e.max}));if(e.max===0)notes.push(t('reefRule'));else if(e.max===1)notes.push(t('narrowRule'));if(e.tide)notes.push(t('tideRule'));}
  const relation=(key,ids)=>{const a=b.edges[ids[0]],c=b.edges[ids[1]];notes.push(t(key,{a:a.a+1,b:a.b+1,c:c.a+1,d:c.b+1}));};
  for(const pair of b.pairs)if(pair.some(j=>adjacent.includes(j)))relation('pairRead',pair);if(b.fork?.some(j=>adjacent.includes(j)))relation('forkRead',b.fork);
  return notes.join(' ');
}
function hud(){
  if(!run)return;const b=STAGES[selected],d=degrees(b,run.values),bad=run.bad||[];
  $('fillValue').textContent=`${d.filter((n,i)=>n===b.nodes[i].need).length}/${b.nodes.length}`;$('moveValue').textContent=run.moves;
  $('undo').disabled=!run.history.length||run.finishing;$('pin').disabled=selected<30||run.finishing;$('pin').setAttribute('aria-pressed',String(run.pinMode));
  [...$('boardGrid').children].forEach((node,i)=>{node.querySelector('strong').textContent=b.nodes[i].need;node.querySelector('small').textContent=`${d[i]}/${b.nodes[i].need}`;node.dataset.selected=String(i===run.selected);node.dataset.done=String(d[i]===b.nodes[i].need);node.dataset.bad=String(bad.includes(i)||d[i]>b.nodes[i].need);node.dataset.hint=String(run.hint>=0&&[b.edges[run.hint].a,b.edges[run.hint].b].includes(i));node.tabIndex=i===focused?0:-1;node.setAttribute('aria-label',islandLabel(b,i,d));});
  [...$('routeMarks').children].forEach((node,i)=>{node.querySelector('.pin-note').textContent=run.pins[i]?'×':'';node.dataset.pin=String(run.pins[i]);node.dataset.hint=String(i===run.hint);node.hidden=!(node.querySelector('.object-icon,.pair-code,.fork-code')||run.pins[i]||i===run.hint);});
  renderer?.sync(run.values,{pins:run.pins,selected:run.selected,hint:run.hint,bad});observe();
}
function mutable(){return run?.ready&&!overlay&&!result&&!run.finishing&&!document.hidden&&!roots.battle.querySelector('.wp-frame-popover:not([hidden])');}
function islandInput(i){
  if(!mutable())return;if(actionGuide?.active&&i!==0&&i!==1)return;actionGuide?.pause(false);focused=i;if(run.selected<0||run.selected===i){run.selected=run.selected===i?-1:i;run.hint=-1;hud();status(run.selected>=0?t('selected'):'');sound('ui.click');return;}
  const b=STAGES[selected],a=run.selected,edge=b.edges.findIndex(e=>e.a===a&&e.b===i||e.b===a&&e.a===i);run.selected=-1;
  if(edge<0){hud();status(t('notAligned'));sound('feedback.error');return;}
  if(run.pinMode){if(run.values[edge]){hud();status(t('pinOccupied'));return;}run.history.push({values:run.values.slice(),pins:run.pins.slice()});run.pins[edge]=!run.pins[edge];run.hint=-1;hud();status(t('pinState'));sound('ui.click');return;}
  if(run.pins[edge]){hud();status(t('pinClear'));sound('feedback.error');return;}
  if(actionGuide?.active&&(edge!==0||run.pinMode||run.values[0]!==Number(actionGuide.stepId.slice(-1))-1))return;const step=cycleEdge(b,run.values,edge);if(!step.ok){hud();status(t(step.reason==='reef'?'reefRule':'crossing'));sound('feedback.error');return;}
  run.history.push({values:run.values.slice(),pins:run.pins.slice()});if(run.history.length>220)run.history.shift();run.values=step.values;run.moves++;if(actionGuide?.active&&run.values[0]===Number(actionGuide.stepId.slice(-1)))actionGuide.accept(actionGuide.stepId,{accepted:true});run.hint=-1;run.bad=[];hud();status();sound('board.move');$('noriCompanion').animate?.(reduced.matches?[{opacity:.8},{opacity:1}]:[{transform:'translateY(0) rotate(0deg)'},{transform:'translateY(-5px) rotate(-3deg)'},{transform:'translateY(0) rotate(0deg)'}],{duration:reduced.matches?60:280,easing:'ease-out'});
  if(step.win)finish();
}
function undo(){if(actionGuide?.active)return;if(!mutable()||!run.history.length)return;const previous=run.history.pop();run.values=previous.values;run.pins=previous.pins;run.moves++;run.selected=-1;run.hint=-1;run.bad=[];hud();status();sound('board.undo');}
function hint(){if(actionGuide?.active)return;if(!mutable())return;const h=hintFor(STAGES[selected],run.values);if(!h)return;run.hints++;run.hint=h.edge;run.selected=-1;hud();const e=STAGES[selected].edges[h.edge];status(t('hintAt',{a:e.a+1,b:e.b+1,n:h.amount}));sound('feedback.hint');}
function check(){if(actionGuide?.active)return;
  if(!mutable())return;const bad=violations(STAGES[selected],run.values);if(!bad.length){finish();return;}run.checkErrors++;const first=bad[0];run.bad=first.island===undefined?[]:[first.island];hud();
  const msg=first.island!==undefined?t('countMismatch',{n:first.island+1,need:first.need,have:first.have}):t(first.rule==='connected'?'connected':first.rule==='crossing'?'crossing':first.rule==='pair'?'pairRule':first.rule==='fork'?'forkRule':first.rule==='tide'?'tideRule':'narrowRule');status(msg);sound('feedback.error');
}
function finish(){
  if(!run||run.finishing||result)return;run.finishing=true;run.finishMs=0;run.selected=-1;$('battleLive').dataset.finishing='true';$('battleLive').inert=true;renderer?.celebrate();$('noriCompanion').animate?.(reduced.matches?[{opacity:.7},{opacity:1}]:[{transform:'translateY(0)'},{transform:'translateY(-12px)'},{transform:'translateY(0)'}],{duration:reduced.matches?80:650,iterations:1});hud();status(t('win'));
  const token=run.serial,stamp=generation;let last=0;
  function tick(now){if(dead||!run||run.serial!==token||generation!==stamp)return;
    if(document.hidden||overlay){last=0;finishRaf=requestAnimationFrame(tick);return;}
    if(last)run.finishMs+=Math.min(50,now-last);last=now;
    if(run.finishMs>=850&&(renderer?.settled()||run.finishMs>=2000)){void settle(token);return;}finishRaf=requestAnimationFrame(tick);
  }finishRaf=requestAnimationFrame(tick);
}
async function settle(token){
  if(!run||run.serial!==token||result)return;run.ended=true;run.finishing=false;result=true;renderer?.pause(true);$('resultPanel').hidden=false;$('battleLive').inert=true;frame.activate('battle',{covered:true});$('resultTitle').textContent=t('win');$('resultText').textContent=t('moves')+': '+run.moves;$('resultNext').disabled=true;
  const stars=1+Number(run.checkErrors===0)+Number(run.hints===0);run.persisted=lessonReplay?true:practice?false:save.clear(selected+1,run.moves,stars);
  let reward=false;if(run.persisted&&!practice&&!lessonReplay){try{const got=await Promise.resolve(window.WonderAnalytics?.completeStage?.(selected+1));reward=got?.credited===true;}catch{}}
  if(!run||run.serial!==token||!result)return;
  $('resultTitle').textContent=t('win');$('resultText').textContent=warning?t('saveWarn'):`${practice?t('practice')+' · ':''}${t('stars',{n:stars})} · ${t('moves')}: ${run.moves}`;
  $('resultNext').disabled=lessonReplay||selected===STAGES.length-1||(!practice&&!run.persisted);window.ShowResultGet?.('tideweave',reward);window.WeightPlayCastle?.dismissRewardNotice?.('tideweave');$('resultStages').focus({preventScroll:true});fade($('resultPanel').querySelector('.modal-card'));sound('result.win');observe();
}
async function start(index){
  if(dead||index<0||index>=STAGES.length)return;if(practice&&!(await LocalPractice.validate()))return;if(!practice&&index>=save.unlocked)return;
  closeOverlay(false);stopRender();lessonReplay=replayRequested;replayRequested=false;selected=index;run={values:initial(STAGES[index]),pins:STAGES[index].edges.map(()=>false),pinMode:false,history:[],moves:0,hints:0,checkErrors:0,ready:false,ended:false,persisted:false,finishing:false,serial:++serial,selected:-1,hint:-1,bad:[]};focused=0;result=false;$('resultPanel').hidden=true;$('battleLive').inert=false;$('battleLive').dataset.finishing='false';activate('battle');makeBoard();
  const stamp=generation;try{renderer=mountRenderer($('arena'),{reduced:reduced.matches,onContextLost:contextLost,onProject:project});rendererCreates++;renderer.setBoard(STAGES[index],run.values,skin());await renderer.ready;if(stamp!==generation)return;run.ready=true;hud();status();sound('game.start');$('boardGrid').querySelector('button')?.focus({preventScroll:true});if(index===0)beginLesson();else help();observe();}catch(error){if(stamp===generation&&!dead){console.error(error);contextLost();}}
}
function contextLost(){if(dead||!run)return;run.ready=false;showOverlay(t('contextTitle'),t('contextText'),[{label:t('restore'),primary:true,action:async()=>{closeOverlay();stopRender();const stamp=generation;try{renderer=mountRenderer($('arena'),{reduced:reduced.matches,onContextLost:contextLost,onProject:project});rendererCreates++;renderer.setBoard(STAGES[selected],run.values,skin());await renderer.ready;if(stamp!==generation)return;run.ready=true;hud();if(run.finishing){run.finishing=false;finish();}}catch{activate('stage');}}},{label:t('stages'),action:()=>{activate('stage');}}]);}
function leave(){if(result||!run){setTab('stages');activate('stage');return;}showOverlay(t('leaveTitle'),t('leaveText'),[{label:t('continue'),primary:true,action:()=>closeOverlay()},{label:t('stages'),action:()=>{setTab('stages');activate('stage');}}]);}
function management(){const wallet=window.WeightPlayWallet?.read?.();$('walletBalance').textContent=wallet?.diamonds??0;$('mastery').textContent=`${save.value.cleared.filter(Boolean).length}/60`;$('ownership').textContent=owns()?t('owned'):t('buy');for(const [id,name]of [['chooseStone','stone'],['chooseMoss','moss'],['chooseAmber','amber']])$(id).setAttribute('aria-pressed',String(skin()===name));$('chooseMoss').setAttribute('aria-disabled',String(!save.value.cleared[29]));$('chooseAmber').setAttribute('aria-disabled',String(!owns()));$('buySkin').disabled=owns()||practice||purchasing;if(warning)$('managementStatus').textContent=t('saveWarn');}
function chooseSkin(value){if(practice)return;if(value==='moss'&&!save.value.cleared[29]){$('managementStatus').textContent=t('mossLocked');return;}if(value==='amber'&&!owns()){$('managementStatus').textContent=t('buy');return;}save.write({...save.value,equipped:value});management();fade($('equipmentPanel'));}
function purchase(){
  if(practice||purchasing||overlay||owns())return;showOverlay(t('amber'),`${t('buy')}\n\n${t('faqA1')}\n${t('owned')}`,[{label:t('cancel'),primary:true,action:()=>closeOverlay()},{label:t('confirm'),action:async()=>{if(purchasing)return;purchasing=true;overlay.querySelectorAll('button').forEach(b=>b.disabled=true);
    try{const r=await window.WeightPlayWallet?.purchasePermanent(SKU,5);if(r?.ok&&owns()){save.write({...save.value,equipped:'amber'});$('managementStatus').textContent=t('purchaseOk');sound('shop.purchase');}else{$('managementStatus').textContent=t('purchaseFail');sound('feedback.error');}}catch{$('managementStatus').textContent=t('purchaseFail');}finally{purchasing=false;closeOverlay();management();(owns()?$('chooseAmber'):$('buySkin')).focus({preventScroll:true});}
  }}]);
}
labels();
if(true){
  $('comingSoon').hidden=true;$('gameFrame').hidden=false;
  frame=window.WeightPlayScreenFrame.mount({root:$('gameFrame'),playUI:true,scenes:{main:{root:roots.main,header:$('mainHeader'),content:$('mainHero')},stage:{root:roots.stage,header:$('stageHeader'),content:$('stageWorkspace')},battle:{root:roots.battle,header:$('battleHeader'),content:$('battleLive')}}});
  const group=window.WeightPlayScreenFrame.createGroup();group.add($('fillStat')).add($('moveStat'));frame.battleTopUI.add(group);
  selector=window.WeightPlayPlayUI.mountStage({page:$('stagePage'),rail:$('stageRail'),selected,config:config(),isActive:()=>screen==='stage'&&tab==='stages',onSelect:i=>selected=i,onStart:i=>void start(i)});
  on($('startBtn'),'click',()=>{selected=save.unlocked-1;setTab('stages');activate('stage');});on($('stageBackBtn'),'click',()=>activate('main'));on($('battleBackBtn'),'click',leave);
  for(const [id,name]of [['tabTeam','team'],['tabStages','stages'],['tabEquipment','equipment']])on($(id),'click',()=>setTab(name));
  for(const [id,fn]of [['undo',undo],['hint',hint],['check',check],['pin',()=>{if(!mutable()||selected<30)return;if(actionGuide?.active)return;run.pinMode=!run.pinMode;run.selected=-1;hud();status(run.pinMode?t('pinOn'):'');}],['retry',()=>void start(selected)],['help',()=>help(true)],['resultStages',()=>{setTab('stages');activate('stage');}],['resultNext',()=>{if(!$('resultNext').disabled)void start(selected+1);}],['resultReplay',()=>void start(selected)],['chooseStone',()=>chooseSkin('stone')],['chooseMoss',()=>chooseSkin('moss')],['chooseAmber',()=>chooseSkin('amber')],['buySkin',purchase]])on($(id),'click',fn);
  on(document,'keydown',e=>{if(e.defaultPrevented||trap(e)||screen!=='battle'||!mutable()||document.activeElement?.closest('.wp-frame-popover,input,select,textarea'))return;
    const direction={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];
    if(direction){e.preventDefault();const b=STAGES[selected],p=b.nodes[focused],candidates=b.nodes.map((n,i)=>({i,dx:n.x-p.x,dy:n.y-p.y})).filter(n=>direction[0]?n.dx*direction[0]>0:n.dy*direction[1]>0).sort((a,b)=>(Math.abs(a.dx)+Math.abs(a.dy)*2)-(Math.abs(b.dx)+Math.abs(b.dy)*2));if(candidates.length){focused=candidates[0].i;hud();$('boardGrid').children[focused].focus({preventScroll:true});}}
    else if(e.key.toLowerCase()==='z'){e.preventDefault();undo();}
  });
  on(document,'visibilitychange',()=>{if(document.hidden){audio?.stop();renderer?.pause(true);}else if(run?.ready&&!overlay&&!result)showOverlay(t('continue'),'',[{label:t('continue'),primary:true,action:()=>closeOverlay()}]);});
  on(window,'weightplay:wallet-change',management);on(window,'wonder:locale-change',e=>{if(LOCALES.includes(e.detail?.locale)){locale=e.detail.locale;labels();selector.setConfig(config(),selected);frame.refresh();}});
  on(window,'pagehide',()=>{dead=true;generation++;stopRender();actionGuide?.destroy();tutorial?.destroy();selector.destroy();frame.destroy();audio?.dispose();abort.abort();});
  activate('main');await LocalPractice.register({gameId:'tideweave',stageIds:STAGES.map(b=>b.id),enable:()=>selector.setConfig(config(),selected),startStage:id=>start(Number(id)-1)});
  async function entryReady(){try{await Promise.all([$('mainHero').querySelector('img').decode(),new Promise((resolve,reject)=>{const im=new Image();im.onload=resolve;im.onerror=reject;im.src='/games/tideweave/assets/tools.webp?wp-media=a5465b2863a3bbab';})]);if(dead)return;$('startBtn').disabled=false;window.WeightPlayGameEntryLoader?.ready();}catch{window.WeightPlayGameEntryLoader?.fail();}}
  await entryReady();
}else{$('mainGroup').hidden=true;try{await $('comingSoon').querySelector('img').decode();window.WeightPlayGameEntryLoader?.ready();}catch{window.WeightPlayGameEntryLoader?.fail();}}
Object.defineProperty(window,'TideweaveMetrics',{value:()=>({screen,stage:selected+1,practice,ready:run?.ready,moves:run?.moves,ended:run?.ended,finishing:run?.finishing,finishMs:run?.finishMs,rendererCreates,rendererDisposals,renderer:renderer?.metrics()??null,history:resourceHistory.slice()}),configurable:true});
