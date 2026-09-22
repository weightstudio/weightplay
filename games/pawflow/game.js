import {RULES,createState,tick,dispatch,hint,rewind,stars,capture} from './engine.mjs';
import {getLevel,dailyLevel,dailyKey,COLORS,SYMBOLS} from './levels.mjs';
import {createStore,restoreState,SAVE_KEY} from './save.mjs';
import {COPY,LOCALES,LABELS,ROUTES,translator} from './locales.mjs';
import {mountScreens} from './screens.mjs';
const $=id=>{const n=document.getElementById(id);if(!n)throw Error(`PAWFLOW_SLOT:${id}`);return n;};
const locale=document.documentElement.lang,d={...COPY[locale],title:window.WEIGHTPLAY_GAME_TITLES?.pawflow?.[locale]||COPY[locale].title},t=translator(locale);mountScreens(d);
const life=new AbortController(),listen=(node,event,fn,options={})=>node.addEventListener(event,fn,{...options,signal:life.signal});
const text=(node,value)=>{const s=String(value);if(node.textContent!==s)node.textContent=s;};
let storage;try{storage=localStorage;}catch{}const store=createStore(storage);
let scene='main',epoch=0,runEpoch=0,state=null,level=null,arena=null,raf=0,last=0,acc=0,modal=null,settingsPaused=false,disposed=false,loadTimer=0,rendererImport=null,rendererAttempts=0,portraitURLs=[],lastResources=null,lastCheckpoint=0;
let selectedHint=null,message='',messageUntil=0,modalButtons=[],dialogCallbacks=[],lastFocus=null,rail=null;
window.WeightPlayAudio?.preload(["board.move","board.undo","feedback.error","feedback.hint","game.start","impact.soft","puzzle.match","result.lose","result.win","reward.unlock","ui.click"]);
let analyticsRound=0;
function measure(){window.WonderAnalytics?.game?.observeState(()=>({screen:scene,roundKey:state?analyticsRound:null,started:Boolean(state),ended:state&&state.status!=='running',outcome:state?.status==='won'?'win':'lose',paused:Boolean(modal)||settingsPaused||!arena,activityMode:'state',locale,keyboardKeys:['1','2','3','4','5','6','7','8']}));}
listen(window,'weightplay:analytics-ready',measure);
const soundTimes=new Map();function sound(name,interval=0){const now=performance.now();if(now-(soundTimes.get(name)??-Infinity)<interval)return;soundTimes.set(name,now);try{window.WeightPlayAudio?.play?.(name);}catch{}}
const localeSelect=$('localeSelect');localeSelect.replaceChildren(...LOCALES.map((code,i)=>{const o=document.createElement('option');o.value=code;o.textContent=LABELS[i];return o;}));localeSelect.value=locale;
listen(localeSelect,'change',()=>{const next=localeSelect.value;try{storage?.setItem('weightPlayLocale',next);}catch{}const url=new URL(`/${ROUTES[next]}/games/pawflow/`,location.origin);url.search=location.search;location.assign(url.href);});
const frame=window.WeightPlayScreenFrame.mount({root:$('app'),localeSelect,scenes:{main:{root:$('mainScreen'),header:$('mainHeader'),content:$('mainContent')},stage:{root:$('stageCanvas'),header:$('stageHeader'),content:$('stageContent'),headerInfo:$('stageHud')},battle:{root:$('battleCanvas'),header:$('battleHeader'),content:$('battleContent'),headerInfo:$('battleHud')}}});
const stageNodes=new WeakMap();
function bindCard(card,index){let nodes=stageNodes.get(card);if(!nodes){const wrap=document.createElement('div');wrap.dataset.wpItemContent='';nodes={};for(const [key,tag] of [['number','strong'],['name','strong'],['rule','span'],['record','span']]){const n=document.createElement(tag);n.className=`stage-${key}`;nodes[key]=n;wrap.append(n);}card.append(wrap);stageNodes.set(card,nodes);}const daily=index===0,unlocked=daily||index<=store.value.unlocked;
 card.type='button';card.disabled=false;card.classList.add('stage-card');card.dataset.stageIndex=index;card.dataset.wpStageRecommended=String(index===store.value.unlocked);card.setAttribute('aria-disabled',String(!unlocked));
 const key=dailyKey(),record=store.value.daily.find(x=>x.key===key);
 text(nodes.number,daily?'☀':index);text(nodes.name,daily?d.daily:d.names[index-1]);text(nodes.rule,daily?key:d.chapters[Math.floor((index-1)/5)]);text(nodes.record,unlocked?`${d.stars} ${daily?(record?.stars||0):store.value.stars[index-1]}/3`:d.locked);card.setAttribute('aria-label',`${daily?d.daily+' '+key:t('stage',{n:index})+': '+d.names[index-1]}. ${nodes.record.textContent}`);
}
// The daily puzzle is the one card before Stage 1, not a counterfeit management tab.
rail=window.WeightPlayStageV6.install($('stageRail'),{total:31,poolSize:9,bind:bindCard,initialIndex:()=>store.value.unlocked,activate:index=>{if(index===0)void startBattle(dailyLevel(dailyKey()));else if(index<=store.value.unlocked)void startBattle(getLevel(index));}});if(!rail)throw Error('PAWFLOW_SHARED_RAIL');
function progress(){text($('mainProgress'),`${t('stage',{n:store.value.unlocked})} / 30`);text($('stageProgress'),`${store.value.unlocked} / 30`);text($('stageStars'),`${store.value.stars.reduce((a,b)=>a+b,0)} / 90`);text($('storageNote'),t(store.available?'saved':'noStorage'));}
function setTab(){rail.center(store.value.unlocked);progress();}
listen($('missionTab'),'click',()=>{sound('ui.click');setTab();});
function stop(){cancelAnimationFrame(raf);raf=0;last=0;acc=0;}
function activate(next){epoch++;stop();frame.close();scene=next;for(const [key,root] of [['main','mainGroup'],['stage','stageScreen'],['battle','battleScreen']]){$(root).hidden=key!==next;$(root).inert=key!==next;}$('mainScreen').hidden=next!=='main';$('gameGuide').hidden=next!=='main';$('gameGuide').inert=next!=='main';document.body.dataset.screen=next;frame.activate(next);measure();window.dispatchEvent(new Event('resize'));const token=epoch;requestAnimationFrame(()=>{if(disposed||token!==epoch)return;if(next==='stage'){rail.refresh();rail.center(store.value.unlocked);$('stageRail').querySelector('[tabindex="0"]')?.focus({preventScroll:true});}if(next==='main')$('start').focus({preventScroll:true});arena?.resize();});}
function releaseArena(){if(arena){lastResources=arena.stats();arena.dispose();lastResources={...lastResources,contexts:0,disposed:true};arena=null;}portraitURLs=[];}
function clearRun(){runEpoch++;clearTimeout(loadTimer);stop();releaseArena();state=null;level=null;modal=null;selectedHint=null;settingsPaused=false;message='';$('battleDialog').hidden=true;$('battleContent').inert=false;}
function toStages(){store.clearAttempt();clearRun();progress();activate('stage');setTab(false);}
listen($('start'),'click',()=>{sound('ui.click');progress();activate('stage');setTab(false);});
listen($('mainHeader').querySelector('[data-wp-return="main"]'),'click',()=>location.assign(`/${ROUTES[locale]}/?preview=1`));
listen($('stageHeader').querySelector('[data-wp-return="stage"]'),'click',()=>{sound('ui.click');activate('main');});
listen($('battleHeader').querySelector('[data-wp-return="battle"]'),'click',()=>{sound('ui.click');if(state?.status==='running')openDialog('leave',d.leave,d.leaveText,[{label:d.stages,fn:toStages},{label:d.resume,fn:closeDialog},{label:d.replay,fn:()=>void startBattle(level,true)}]);else toStages();});
function actionable(){return scene==='battle'&&state?.status==='running'&&arena&&!modal&&!settingsPaused&&!document.hidden&&!disposed;}
function feedback(key,values={}){message=t(key,values);messageUntil=(state?.ticks||0)+180;text($('feedback'),message);}
function checkpoint(){if(state&&level)store.checkpoint(state,level);}
function closeDialog(){if(!modal||modal==='result')return;modal=null;$('battleDialog').hidden=true;$('battleContent').inert=false;frame.activate('battle');lastFocus?.focus?.({preventScroll:true});lastFocus=null;if(actionable())startLoop();renderHUD();}
function openDialog(kind,title,body,buttons,stats=''){
 stop();if(!modal)lastFocus=document.activeElement;modal=kind;frame.close();settingsPaused=false;frame.activate('battle',{covered:true});$('battleContent').inert=true;$('battleDialog').hidden=false;text($('dialogTitle'),title);text($('dialogBody'),body);text($('dialogStats'),stats);
 dialogCallbacks=buttons.map(b=>b.fn);modalButtons=['modalLeft','modalMiddle','modalRight'].map((id,i)=>{const button=$(id),b=buttons[i];text(button,b?.label||'—');button.disabled=!b?.fn;return button;});modalButtons.find((b,i)=>i===1&&!b.disabled)?.focus({preventScroll:true});if(modalButtons[1].disabled)modalButtons.find(b=>!b.disabled)?.focus({preventScroll:true});checkpoint();
}
for(const [i,id] of ['modalLeft','modalMiddle','modalRight'].entries())listen($(id),'click',()=>{sound('ui.click');dialogCallbacks[i]?.();});
listen($('battleDialog'),'keydown',e=>{if(e.key!=='Tab')return;const available=modalButtons.filter(b=>!b.disabled),first=available[0],last=available.at(-1);if(e.shiftKey&&(document.activeElement===first||!$('battleDialog').contains(document.activeElement))){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}});
async function moduleRenderer(){if(rendererImport)return rendererImport;rendererAttempts++;if(rendererAttempts>2)throw Error('RELOAD_REQUIRED');rendererImport=import(`./renderer.mjs?v=1-${rendererAttempts}`).catch(e=>{rendererImport=null;throw e;});return rendererImport;}
function graphicsFailure(){if(disposed||scene!=='battle')return;stop();releaseArena();openDialog('graphics',d.pause,d.contextLost,[{label:d.stages,fn:toStages},{label:d.resume,fn:()=>void loadGraphics(true)},{label:d.reload,fn:()=>{checkpoint();location.reload();}}]);}
async function loadGraphics(recover=false,needsResume=false){
 const token=++runEpoch;releaseArena();openDialog('loading',d.loading,'',[{label:d.stages,fn:toStages},{label:d.loading},{label:d.reload,fn:()=>{checkpoint();location.reload();}}]);
 let timedOut=false;clearTimeout(loadTimer);loadTimer=setTimeout(()=>{if(token!==runEpoch||disposed)return;timedOut=true;runEpoch++;graphicsFailure();},15000);
 try{const {Arena}=await moduleRenderer();if(token!==runEpoch||disposed||timedOut)return;arena=new Arena($('arenaHost'),{onLost:graphicsFailure,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches});if(token!==runEpoch){releaseArena();return;}portraitURLs=arena.portraits();arena.draw(state,[],0);clearTimeout(loadTimer);renderHUD();if(state.status!=='running'){result();return;}
  if(needsResume)openDialog('resume',d.restore,d.restoreText,[{label:d.stages,fn:toStages},{label:d.resume,fn:closeDialog},{label:d.replay,fn:()=>void startBattle(level,true)}]);
  else if(recover)openDialog('pause',d.pause,d.encourage,[{label:d.stages,fn:toStages},{label:d.resume,fn:closeDialog},{label:d.replay,fn:()=>void startBattle(level,true)}]);
  else {sound('game.start');closeDialog();}
 }catch(error){clearTimeout(loadTimer);if(token!==runEpoch||disposed)return;console.warn('Pawflow graphics:',error?.message);graphicsFailure();}
}
async function startBattle(nextLevel,fresh=false){
 if(!nextLevel.daily&&(nextLevel.id<1||nextLevel.id>store.value.unlocked))return;
 const attempt=store.value.attempt;clearRun();level=nextLevel;
 const match=!fresh&&attempt&&attempt.levelId===level.id&&attempt.daily===(level.daily||null)&&attempt.signature===level.signature;
 const restored=match?restoreState(attempt.state,level):null;analyticsRound++;state=restored||createState(level);lastCheckpoint=state.ticks;store.checkpoint(state,level);activate('battle');text($('ruleLine'),d.rules[level.rule]);await loadGraphics(false,Boolean(restored));
}
const queues=[],reserves=[];
function makeButton(source,index){const button=document.createElement('button');button.type='button';button.className='courier-button';const top=document.createElement('span');top.className='courier-top';const img=document.createElement('img');img.alt='';img.hidden=true;const count=document.createElement('b');top.append(img,count);button.append(top);const preview=document.createElement('span');preview.className='courier-preview';if(source==='queue')button.append(preview);listen(button,'click',()=>send(source,index));$(source==='queue'?'supplyButtons':'reserveButtons').append(button);return {button,img,count,preview};}
for(let i=0;i<3;i++)queues.push(makeButton('queue',i));for(let i=0;i<5;i++)reserves.push(makeButton('reserve',i));
function send(source,index){if(!actionable())return;const result=dispatch(state,source,index);if(result.ok){selectedHint=null;message='';sound('board.move');checkpoint();}else{feedback(['beltFull','spacing'].includes(result.reason)?result.reason:'empty');sound('feedback.error',200);}renderHUD();}
function renderHUD(){
 if(!state||!level)return;measure();text($('battleLevel'),level.daily?d.daily:level.id);text($('battlePixels'),state.leftHP);text($('battleDispatch'),`${state.launches} / ${level.par}`);text($('beltInfo'),`${d.belt} ${state.active.length}/4`);text($('keyInfo'),level.requiredKeys?`${d.keys} ${state.keys}/${level.requiredKeys}`:'');text($('gateInfo'),state.shutters?d[gatePhaseKey()]:`${d.color} A–E`);
 text($('supplyCount'),state.queues.reduce((n,q)=>n+q.length,0));text($('reserveCount'),`${state.reserve.filter(Boolean).length}/5`);$('reserveCount').dataset.risk=String(state.reserve.filter(Boolean).length>=4);
 const ready=Boolean(actionable());
 for(const [source,list] of [['queue',queues],['reserve',reserves]])list.forEach((view,i)=>{const u=source==='queue'?state.queues[i][0]:state.reserve[i];view.button.disabled=!ready||!u;view.button.style.setProperty('--courier-color',u?COLORS[u.color]:'#70828c');view.button.dataset.hint=String(selectedHint?.source===source&&selectedHint?.index===i);text(view.count,u?`${SYMBOLS[u.color]} ${u.ammo}`:'—');const position=source==='queue'?i+1:i+4;view.button.setAttribute('aria-label',u?t('unit',{color:`${d.colors[u.color]} ${SYMBOLS[u.color]}`,ammo:u.ammo,n:position}):`${d.empty} ${position}`);view.img.hidden=!u||!portraitURLs[u.color];if(u&&portraitURLs[u.color]&&view.img.src!==portraitURLs[u.color])view.img.src=portraitURLs[u.color];
  if(source==='queue'){const next=state.queues[i].slice(1,3);text(view.preview,next.map(v=>`${SYMBOLS[v.color]} ${v.ammo}`).join(' · '));view.preview.setAttribute('aria-label',next.map(v=>t('preview',{color:d.colors[v.color],ammo:v.ammo})).join('. '));}
 });
 for(const id of ['pause','help','hint'])$(id).disabled=!ready;$('rewind').disabled=!ready||!state.rewindAllowed||state.rewindUsed||!state.previous;
 if(state.ticks>messageUntil){message='';selectedHint=null;}text($('feedback'),message);
}
function gatePhaseKey(){return Math.floor((state.ticks+state.phaseOffset)/state.gateTicks)%2===0?'gate0':'gate1';}
listen($('pause'),'click',()=>{sound('ui.click');openDialog('pause',d.pause,d.encourage,[{label:d.stages,fn:toStages},{label:d.resume,fn:closeDialog},{label:d.replay,fn:()=>void startBattle(level,true)}]);});
listen($('help'),'click',()=>{sound('ui.click');openDialog('help',d.help,Array.from(document.querySelectorAll('#gameGuide [data-play-rules]')).map(n=>n.textContent).join('\n\n')||d.rules.join('\n'),[{label:d.stages,fn:toStages},{label:d.resume,fn:closeDialog},{label:d.replay,fn:()=>void startBattle(level,true)}]);});
listen($('hint'),'click',()=>{if(!actionable())return;const chosen=hint(state);if(chosen?.wait)feedback('wait');else if(chosen){selectedHint=chosen;feedback('hintLine',{color:`${d.colors[chosen.unit.color]} ${SYMBOLS[chosen.unit.color]}`,n:chosen.source==='queue'?chosen.index+1:chosen.index+4});}checkpoint();sound('feedback.hint',100);renderHUD();});
listen($('rewind'),'click',()=>{if(!actionable())return;if(rewind(state)){feedback('undoDone');sound('board.undo');selectedHint=null;checkpoint();arena?.draw(state,[],0);}else feedback('noUndo');renderHUD();});
function result(){stop();const rating=stars(state,level.par),won=state.status==='won';if(won)store.settle(state,level);else store.clearAttempt();progress();sound(won?'result.win':'result.lose');openDialog('result',won?(level.id===30?d.complete:d.won):d.lost,won?d.encourage:d[state.reason], [{label:d.stages,fn:toStages},{label:d.next,fn:won&&!level.daily&&level.id<30?()=>void startBattle(getLevel(level.id+1),true):null},{label:d.replay,fn:()=>void startBattle(level,true)}],`${d.stars} ${rating}/3 · ${d.dispatches} ${state.launches} / ${level.par}\n${t(state.hintUsed||state.rewindUsed?'assist':'noAssist')}`);}
function startLoop(){if(raf||!actionable())return;last=0;acc=0;raf=requestAnimationFrame(loop);renderHUD();}
function loop(now){raf=0;if(!actionable())return;const delta=last?Math.min(.1,Math.max(0,(now-last)/1000)):0;last=now;acc+=delta;let steps=0;while(acc>=1/60&&steps<6&&state.status==='running'){tick(state);acc-=1/60;steps++;}if(steps===6)acc=0;
 const events=state.events.splice(0);for(const e of events){if(e.type==='hit')sound(e.armor?'impact.soft':'puzzle.match',110);if(e.type==='key')sound('reward.unlock',600);if(e.type==='park')checkpoint();}
 try{arena.draw(state,events,delta);}catch(error){console.warn('Pawflow draw:',error?.message);graphicsFailure();return;}renderHUD();if(state.status!=='running'){result();return;}if(state.ticks-lastCheckpoint>=120){lastCheckpoint=state.ticks;checkpoint();}if(actionable())raf=requestAnimationFrame(loop);
}
const sizeObserver=new ResizeObserver(()=>{if(disposed)return;const node=$('battleContent');node.dataset.wide=String(node.clientWidth>=680);});sizeObserver.observe($('battleContent'));
listen(window,'weightplay:interaction-state',()=>{if(scene!=='battle'||modal||!state)return;const open=Boolean($('battleHeader').querySelector('.wp-frame-popover:not([hidden])'));settingsPaused=open;if(open){stop();checkpoint();}else startLoop();renderHUD();});
function backgroundPause(){if(actionable()){checkpoint();openDialog('pause',d.pause,d.encourage,[{label:d.stages,fn:toStages},{label:d.resume,fn:closeDialog},{label:d.replay,fn:()=>void startBattle(level,true)}]);}else stop();}
listen(document,'visibilitychange',()=>{if(document.hidden){if(state?.status==='running'&&!modal&&scene==='battle'){checkpoint();openDialog('pause',d.pause,d.encourage,[{label:d.stages,fn:toStages},{label:d.resume,fn:closeDialog},{label:d.replay,fn:()=>void startBattle(level,true)}]);}stop();}});
listen(window,'blur',backgroundPause);
listen(window,'storage',event=>{if(event.key===SAVE_KEY&&scene!=='battle'){store.refresh();progress();rail.refresh();}});
listen(document,'keydown',e=>{if(e.defaultPrevented||scene!=='battle')return;if(e.key==='Tab')return;if(e.repeat){if(/^[1-8]$/.test(e.key)||['Escape',' '].includes(e.key))e.preventDefault();return;}if(e.key==='Escape'){e.preventDefault();if(modal&&['pause','help','leave','resume'].includes(modal))closeDialog();else if(!modal)backgroundPause();return;}if(!actionable()||e.ctrlKey||e.metaKey||e.altKey)return;const key=Number(e.key);if(key>=1&&key<=8){e.preventDefault();key<=3?send('queue',key-1):send('reserve',key-4);}});
function destroy(){if(disposed)return;checkpoint();disposed=true;runEpoch++;epoch++;clearTimeout(loadTimer);stop();releaseArena();sizeObserver.disconnect();rail?.destroy();frame.destroy();life.abort();soundTimes.clear();}
listen(window,'pagehide',e=>{checkpoint();if(!e.persisted){destroy();return;}runEpoch++;clearTimeout(loadTimer);stop();releaseArena();frame.close();});
listen(window,'pageshow',e=>{if(e.persisted&&!disposed){if(scene==='battle'&&state)graphicsFailure();else{frame.activate(scene);progress();}}});
window.PawflowDiagnostics=Object.freeze({snapshot:()=>({version:2,locale,scene,modal,loopActive:Boolean(raf),stage:level?.id,daily:level?.daily||null,status:state?.status,remaining:state?.leftHP,dispatches:state?.launches,active:state?.active.length,reserve:state?.reserve.filter(Boolean).length,resources:arena?.stats()||lastResources}),state:()=>state?capture(state):null});
progress();activate('main');$('start').disabled=false;$('bootError').hidden=true;document.documentElement.dataset.pawflowReady='true';
