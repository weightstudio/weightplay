import {STAGES,createRun,begin,tick,press,pause,resume,summary,normalizeSave,recordClear} from './model.mjs';
import {COPY,locale} from './copy.mjs';
import {createScene} from './scene.mjs';
const $=id=>document.getElementById(id),c=COPY[locale()]||COPY.en;
const KEY='weightplay.signal-snap.v1';let save,storageOkay=true;
try{save=normalizeSave(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{save=normalizeSave(null);storageOkay=false;}
let run=null,scene=null,selected=0,seed=1,warmupEnd=0,active='main',settingsPaused=false,raf=0,endedShown=false,storageTimer=0;
const scenes={};for(const name of ['main','stage','battle']){const root=$(name+'Scene');scenes[name]={root,header:root.querySelector('header'),content:$(name+'Content')};}
// The shared Main grid owns the poster/copy composition; Guide remains its sibling.
scenes.main.content=$('mainContent').querySelector('.wp-standard-main-composition');
scenes.main.content.querySelector('.wp-standard-main-copy').setAttribute('data-wp-frame-copy','');
const frame=window.WeightPlayScreenFrame.mount({root:$('app'),scenes,localeSelect:$('localeSource'),playUI:true});
for(const [id,label] of [['hudProgress',c.stage],['hudErrors',c.errors],['hudChain',c.chain]]){const node=document.createElement('div');node.id=id;node.innerHTML='<span></span><strong></strong>';node.firstElementChild.textContent=label;frame.battleTopUI.add(node);}
const routes={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
$('localeSource').addEventListener('change',e=>location.assign('/'+routes[e.target.value]+'/games/signal-snap/'));
const config={gameId:'signal-snap',poster:'/games/signal-snap/poster.png',background:'/assets/lobby-block-atmosphere.svg',count:30,stage(index){const s=STAGES[index];return {id:index+1,kicker:`${Math.floor(index/5)+1} / 6`,title:c.stage+' '+(index+1),subtitle:`◆ ${s.count} · ${s.window} ms`,summary:c.guide,details:[c.tap,c.hold],status:index>=save.unlocked?c.locked:(save.best[index]?'★'.repeat(save.best[index]):'◆'),locked:index>=save.unlocked,cleared:save.best[index]>0};}};
const stageUI=window.WeightPlayPlayUI.mountStage({page:$('stageContent'),rail:$('rail'),config,selected:0,onSelect(index){selected=index;},onStart(index){start(index);},isActive:()=>active==='stage'});
const audioScope=window.WeightPlayAudio?.createScope();
function audio(id){audioScope?.play(id);}
function notify(text){$('notice').textContent=text;$('notice').hidden=false;clearTimeout(storageTimer);storageTimer=setTimeout(()=>$('notice').hidden=true,4500);}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(save));}catch{storageOkay=false;notify(c.storage);}}
function show(name){active=name;for(const [key,s]of Object.entries(scenes))s.root.hidden=key!==name;frame.activate(name);if(name==='stage')stageUI.refresh(selected);}
function disposeScene(){audioScope?.stop();scene?.dispose();scene=null;}
function leave(){cancelAnimationFrame(raf);disposeScene();run=null;$('overlay').close();show('stage');}
function modal(title,text,actions){const d=$('overlay');$('overlayTitle').textContent=title;$('overlayText').textContent=text;$('overlayActions').replaceChildren();for(const [label,fn]of actions){const b=document.createElement('button');b.textContent=label;b.addEventListener('click',()=>{d.close();fn();},{once:true});$('overlayActions').append(b);}if(!d.open)d.showModal();$('overlayActions').firstElementChild?.focus();}
function resumeRun(){if(!run||run.phase==='ended')return;resume(run,performance.now()+1200);warmupEnd=performance.now()+1200;$('left').focus();}
function pauseDialog(help=false){if(!run||run.phase==='ended')return;pause(run,performance.now());modal(help?c.help:c.continue,c.guide,[[c.continue,resumeRun],[c.leave,leave]]);}
$('overlay').addEventListener('cancel',e=>{e.preventDefault();if(run?.phase==='ended')leave();else{$('overlay').close();resumeRun();}});
$('overlay').addEventListener('keydown',e=>{if(e.key!=='Tab')return;const buttons=[...$('overlayActions').querySelectorAll('button')];const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
$('mainScene').querySelector('[data-wp-return]').addEventListener('click',()=>location.assign('/'));
$('stageScene').querySelector('[data-wp-return]').addEventListener('click',()=>show('main'));
$('battleScene').querySelector('[data-wp-return]').addEventListener('click',()=>{if(run?.phase==='ended')leave();else pauseDialog();});
$('start').addEventListener('click',()=>{selected=Math.max(0,save.unlocked-1);show('stage');});
$('help').addEventListener('click',()=>pauseDialog(true));
function eventFeedback(e){if(!e)return;if(e.kind==='hit'){audio('feedback.success');scene?.feedback();$('signalStatus').textContent=c.hit+' '+e.ms+' ms';}else if(e.kind==='error'){if(run.phase!=='ended')audio('feedback.error');scene?.feedback();$('signalStatus').textContent=c[e.reason];}else if(e.kind==='hold'){$('signalStatus').textContent=c.hit;audio('feedback.success');}else if(e.kind==='rest')$('signalStatus').textContent=c.rest;if(e.kind==='cue'){const cue=run.sequence[run.cursor];scene?.cue(cue);$('signalStatus').textContent=cue.echo?c.hold:c.tap;}if(['hit','error','hold'].includes(e.kind)){scene?.cue(null);$('leftCue').textContent='';$('rightCue').textContent='';$('signalStatus').classList.remove('signal-flash');void $('signalStatus').offsetWidth;$('signalStatus').classList.add('signal-flash');}}
function input(side){if(active!=='battle'||$('overlay').open||warmupEnd>performance.now())return;const b=$(side);b.classList.add('pressed');setTimeout(()=>b.classList.remove('pressed'),100);eventFeedback(press(run,side,performance.now()));}
for(const side of ['left','right'])$(side).addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();input(side);});
window.addEventListener('keydown',e=>{if(active!=='battle'||$('overlay').open||e.repeat)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();input(e.key==='ArrowLeft'?'left':'right');}if(e.key==='Escape'){e.preventDefault();pauseDialog();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&active==='battle'&&run?.phase!=='ended'&&!$('overlay').open)pauseDialog();});
const settingsObserver=new MutationObserver(()=>{if(active!=='battle'||!run||run.phase==='ended'||$('overlay').open)return;const open=[...$('battleScene').querySelectorAll('.wp-frame-popover')].some(n=>!n.hidden&&n.getClientRects().length);if(open&&!settingsPaused){pause(run,performance.now());settingsPaused=true;}else if(!open&&settingsPaused){settingsPaused=false;resumeRun();}});settingsObserver.observe($('battleScene').querySelector('header'),{attributes:true,childList:true,subtree:true,attributeFilter:['hidden','class']});
function result(){endedShown=true;const r=summary(run);save=recordClear(save,selected,r);if(r.outcome==='success')persist();audio(r.outcome==='success'?'result.win':'result.lose');const body=`${r.outcome==='success'?'★'.repeat(r.stars):'◆'}\n${c.errors}: ${r.errors} / 3\n${c.chain}: ${r.bestStreak}\n${c.reaction}: ${r.median??'—'} ms`;const actions=[[c.retry,()=>start(selected)]];if(r.outcome==='success'&&selected<29)actions.push([c.next,()=>start(selected+1)]);actions.push([c.leave,leave]);modal(r.outcome==='success'?c.success:c.failure,body,actions);}
function animate(now){if(active!=='battle'||!run)return;const warm=now<warmupEnd;$('countdown').textContent=warm?c.ready+' '+Math.ceil((warmupEnd-now)/1000):'';const disabled=warm||run.pausedAt!==null||run.phase==='ended';$('left').disabled=$('right').disabled=disabled;
 if(!warm&&run.pausedAt===null){if(run.phase==='warmup')begin(run,now);eventFeedback(tick(run,now));}
 const cue=run.phase==='cue'?run.sequence[run.cursor]:null;for(const side of ['left','right']){const node=$(side+'Cue');node.textContent=cue?.side===side?(cue.echo?'⊠':'◆'):(cue?.distract?'⊠':'');node.classList.toggle('echo',Boolean(cue&&(cue.echo||cue.side!==side)));}scene?.cue(cue);
 $('timeTrack').firstElementChild.style.transform=`scaleX(${cue?Math.max(0,(run.deadline-(run.pausedAt??now))/run.stage.window):0})`;
 $('hudProgress').lastElementChild.textContent=`${selected+1} · ${Math.min(run.stage.count,Math.max(0,run.cursor+1))}/${run.stage.count}`;$('hudErrors').lastElementChild.textContent=`${run.errors}/3`;$('hudChain').lastElementChild.textContent=run.streak;
 if(run.phase==='ended'&&!endedShown)result();raf=requestAnimationFrame(animate);
}
function start(index){if(index>=save.unlocked){notify(c.locked);return;}cancelAnimationFrame(raf);disposeScene();selected=index;run=createRun(index,++seed);endedShown=false;settingsPaused=false;show('battle');$('signalStatus').textContent=c.ready;try{scene=createScene($('arena'));}catch(error){run=null;modal(c.failure,c.retry,[[c.retry,()=>start(selected)],[c.leave,leave]]);console.error(error);return;}audio('game.start');warmupEnd=performance.now()+2000;$('left').focus();raf=requestAnimationFrame(animate);}
$('arena').addEventListener('signal-renderer-lost',()=>{if(run){pause(run,performance.now());modal(c.failure,c.retry,[[c.retry,()=>start(selected)],[c.leave,leave]]);}});
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);clearTimeout(storageTimer);disposeScene();stageUI.destroy();settingsObserver.disconnect();frame.destroy();audioScope?.dispose();});
show('main');if(!storageOkay)notify(c.storage);

window.WeightPlayAudio?.preload(['game.start','feedback.success','feedback.error','result.win','result.lose']);
export function renderStats(){return scene?.stats()??null;}
