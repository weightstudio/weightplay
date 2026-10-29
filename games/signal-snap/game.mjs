import {STAGES,createRun,begin,tick,press,pause,resume,summary,normalizeSave,commitClear,purchaseViolet} from './model.mjs?v=signal-v4';
import {COPY,locale} from './copy.mjs?v=signal-v3';
import {createScene} from './scene.mjs?v=signal-v3';
import {LocalPractice} from '../../src/game-local-practice.mjs';
const $=id=>document.getElementById(id),language=locale(),c=COPY[language]||COPY.en;
const KEY='weightplay.signal-snap.v1';
let save,storageOkay=true;
try{save=normalizeSave(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{save=normalizeSave(null);storageOkay=false;}
let run=null,scene=null,selected=0,seed=1,warmupEnd=0,active='main',settingsPaused=false,raf=0,endedShown=false,storageTimer=0,tab='stages',previewScene=null,practice=false,startGeneration=0,lastCountdown=-1,chosenSkin=save.skin;
const ownedTimers=new Set(),abort=new AbortController(),listen=(node,event,fn)=>node.addEventListener(event,fn,{signal:abort.signal});
const later=(fn,ms)=>{const id=setTimeout(()=>{ownedTimers.delete(id);fn();},ms);ownedTimers.add(id);return id;};
const scenes={};for(const name of ['main','stage','battle']){const root=$(name+'Scene');scenes[name]={root,header:root.querySelector('header'),content:$(name+'Content')};}
scenes.main.content=$('mainContent').querySelector('.wp-standard-main-composition');
const mainCopy=scenes.main.content.querySelector('.wp-standard-main-copy');mainCopy.setAttribute('data-wp-frame-copy','');
mainCopy.querySelector('p').setAttribute('data-wp-frame-summary','');mainCopy.querySelector('p').textContent=c.tap+' · '+c.hold;
$('start').textContent=c.start;for(const s of Object.values(scenes))s.header.querySelector('[data-wp-frame-title]').textContent=c.title;
const progress=document.createElement('p');progress.dataset.wpFrameProgress='';mainCopy.insertBefore(progress,$('start'));
const frame=window.WeightPlayScreenFrame.mount({root:$('app'),scenes,localeSelect:$('localeSource'),playUI:true});
for(const [index,name]of ['main','stage','battle'].entries())scenes[name].header.querySelector('[data-wp-return]').setAttribute('aria-label',c.back[index]);
$('left').textContent='← '+c.left;$('right').textContent=c.right+' →';$('help').textContent='?';$('help').setAttribute('aria-label',c.help);$('help').title=c.help;
const resultLayer=document.createElement('section');resultLayer.id='signalResult';resultLayer.className='signal-result result-panel';resultLayer.dataset.wpResultScreen='';resultLayer.hidden=true;
resultLayer.innerHTML='<div id="signalResultCard" class="signal-dialog result-card" data-wp-frame-result-card role="dialog" aria-modal="true" aria-labelledby="signalResultTitle" tabindex="-1"><div id="resultStars" aria-hidden="true"></div><h2 id="signalResultTitle"></h2><p id="signalResultText"></p><div id="signalResultActions" class="logic-result-actions"><button id="resultStages" data-wp-frame-action="primary"></button><button id="resultNext" data-wp-frame-action="primary"></button><button id="resultReplay" data-wp-frame-action="primary"></button></div></div>';
$('battleContent').append(resultLayer);
$('resultStages').textContent=c.stages;$('resultNext').textContent=c.next;$('resultReplay').textContent=c.replay;
const pauseLayer=document.createElement('section');pauseLayer.id='pauseLayer';pauseLayer.hidden=true;pauseLayer.append($('overlay'));$('battleContent').append(pauseLayer);
const combo=document.createElement('div');combo.id='comboFeedback';combo.setAttribute('aria-hidden','true');$('arena').append(combo);
const meter=document.createElement('div');meter.id='signalDots';meter.setAttribute('aria-hidden','true');$('arena').append(meter);
for(const [id,label]of [['hudProgress',c.stage],['hudErrors',c.errors],['hudChain',c.chain]]){const n=document.createElement('div');n.id=id;n.innerHTML='<span></span><strong></strong>';n.firstElementChild.textContent=label;frame.battleTopUI.add(n);}
const routes={en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
listen($('localeSource'),'change',e=>location.assign('/'+routes[e.target.value]+'/games/signal-snap/'+location.search));
const stageName=s=>language==='zh-Hant'?s.zh:language==='en'?s.name:c.arcs[s.chapter]+' '+s.id;
function ruleText(s){return s.rule.includes('charge')||s.rule==='mixed'||s.rule==='finale'?c.chargeGuide:s.chapter>=3?c.tap+' · '+c.hold:s.chapter>=1?c.hold:c.tap;}
const config={gameId:'signal-snap',poster:'/games/signal-snap/poster.webp?v=signal-v3',background:'/assets/lobby-block-atmosphere.svg',count:STAGES.length,stage(index){const s=STAGES[index];return {id:s.id,kicker:c.arcs[s.chapter],title:s.id+' · '+stageName(s),subtitle:(s.checkpoint?'◆ ':'')+s.count+' · '+s.window+' ms',summary:ruleText(s),details:[c.tap,c.hold,c.chargeGuide],status:!practice&&index>=save.unlocked?c.locked:(save.best[index]?'★'.repeat(save.best[index]):'◆'),locked:!practice&&index>=save.unlocked,cleared:save.best[index]>0};}};
const picker=document.createElement('div'),stagePage=document.createElement('div');picker.id='signalStagePicker';picker.append(stagePage);stagePage.append($('rail'));$('stageContent').append(picker);
const stageUI=window.WeightPlayPlayUI.mountStage({page:stagePage,rail:$('rail'),config,selected:0,onSelect(index){selected=index;},onStart(index){void start(index);},isActive:()=>active==='stage'&&tab==='stages'});
const emptyTrack=document.createElement('span');emptyTrack.setAttribute('aria-hidden','true');
const stagesTab=document.createElement('button'),stylesTab=document.createElement('button');stagesTab.textContent=c.stages;stylesTab.textContent=c.styleTab;
for(const n of [stagesTab,stylesTab])n.dataset.wpFrameAction='tab';
frame.commonDownButton.add(emptyTrack).add(stagesTab).add(stylesTab);
const nav=stylesTab.parentElement;nav.dataset.wpFrameStageNav='';nav.setAttribute('aria-label',c.stages);
const wardrobe=document.createElement('section');wardrobe.id='wardrobe';wardrobe.hidden=true;wardrobe.dataset.wpScrollOwner='';
wardrobe.innerHTML='<div class="style-summary"><h2></h2><span><img src="/assets/weightplay-diamond.svg" alt="" width="22" height="22"><strong id="diamondBalance"></strong></span></div><div id="stylePreview" role="img"></div><p id="styleDescription"></p><div id="styleChoices"></div><div class="style-action"><span id="styleRequirement"></span><button id="styleApply" data-wp-frame-action="primary"></button></div><p id="styleNotice" role="status"></p>';
wardrobe.querySelector('h2').textContent=c.outfit;$('stageContent').append(wardrobe);$('styleDescription').textContent=c.outfitHelp;
for(const skin of ['cyan','gold','violet']){const b=document.createElement('button');b.dataset.skin=skin;b.textContent=c.skins[skin];b.setAttribute('aria-pressed','false');listen(b,'click',()=>{chosenSkin=skin;previewScene?.setSkin(skin);refreshWardrobe();});$('styleChoices').append(b);}
const audioScope=window.WeightPlayAudio?.createScope(),audio=id=>audioScope?.play(id);
function notify(text){$('notice').textContent=text;$('notice').hidden=false;clearTimeout(storageTimer);storageTimer=setTimeout(()=>$('notice').hidden=true,4500);}
function persist(next=save){try{localStorage.setItem(KEY,JSON.stringify(next));save=next;return true;}catch{storageOkay=false;notify(c.storage);return false;}}
function mainProgress(){progress.textContent=c.stage+' '+save.unlocked+' / '+STAGES.length+' · '+'★ '+save.best.reduce((a,b)=>a+b,0);}
function stopPreview(){previewScene?.dispose();previewScene=null;}
function refreshWardrobe(){
 const stars=save.best.reduce((a,b)=>a+b,0),owned=chosenSkin==='cyan'||chosenSkin==='gold'&&stars>=15||chosenSkin==='violet'&&save.violet;
 $('diamondBalance').textContent=window.WeightPlayWallet?.read().diamonds??0;
 $('stylePreview').setAttribute('aria-label',c.skins[chosenSkin]);
 for(const b of $('styleChoices').children)b.setAttribute('aria-pressed',String(b.dataset.skin===chosenSkin));
 $('styleRequirement').textContent=chosenSkin==='gold'?c.earned+' · '+stars+'/15':chosenSkin==='violet'&&!save.violet?c.buy:c.skins[chosenSkin];
 $('styleApply').textContent=chosenSkin===save.skin?c.equipped:owned?c.equip:chosenSkin==='violet'?c.buy:c.earned;
 $('styleApply').disabled=practice||!storageOkay||chosenSkin===save.skin||chosenSkin==='gold'&&!owned;
}
function switchTab(name){
 if($('overlay').open)closeModal();
 tab=name;stopPreview();picker.hidden=name!=='stages';wardrobe.hidden=name!=='styles';
 stagesTab.setAttribute('aria-pressed',String(name==='stages'));stylesTab.setAttribute('aria-pressed',String(name==='styles'));
 if(name==='styles'){chosenSkin=save.skin;refreshWardrobe();try{previewScene=createScene($('stylePreview'),{skin:chosenSkin,preview:true});}catch{notify(c.retry);}}else stageUI.refresh(selected);
}
listen(stagesTab,'click',()=>switchTab('stages'));listen(stylesTab,'click',()=>switchTab('styles'));
listen($('styleApply'),'click',()=>{
 if(practice)return;
 if(chosenSkin==='violet'&&!save.violet){
  const before=document.activeElement;
  modal(c.confirm,c.skins.violet+'\n'+c.outfitHelp+'\n'+c.buy,[[c.cancel,()=>before?.focus()],[c.buy,async ()=>{
   const bought=(await purchaseViolet({storage:localStorage,wallet:window.WeightPlayWallet,key:KEY}));
   if(bought.ok){save=bought.save;audio(bought.charged?'shop.purchase':'ui.click');$('styleNotice').textContent=c.equipped;previewScene?.setSkin(save.skin);}
   else{$('styleNotice').textContent=bought.reason==='funds'?c.insufficient:c.storage;audio('feedback.error');}
   refreshWardrobe();$('styleApply').focus();
  }]],'stage');
 }else if(persist({...save,skin:chosenSkin})){audio('ui.click');$('styleNotice').textContent=c.equipped;refreshWardrobe();}
});
function show(name){if(name!=='stage')stopPreview();active=name;for(const [key,s]of Object.entries(scenes))s.root.hidden=key!==name;frame.activate(name);if(name==='stage')switchTab('stages');if(name==='main')mainProgress();}
function disposeScene(){for(const id of ownedTimers)clearTimeout(id);ownedTimers.clear();for(const id of ['signalStatus','hudErrors','hudChain','comboFeedback'])$(id).getAnimations().forEach(a=>a.cancel());audioScope?.stop();scene?.dispose();scene=null;}
function hideResult(){resultLayer.hidden=true;delete $('battleContent').dataset.resultOpen;for(const child of $('battleContent').children)child.inert=false;}
let modalOwned=[];
function closeModal(){for(const node of modalOwned)node.inert=false;modalOwned=[];const d=$('overlay');if(d.open)d.close();pauseLayer.hidden=true;pauseLayer.append(d);$('wardrobeModal')?.remove();if(active==='battle')frame.activate('battle');}
function leave(){++startGeneration;cancelAnimationFrame(raf);hideResult();closeModal();disposeScene();run=null;settingsPaused=false;show('stage');}
function resultStages(){selected=Math.max(0,save.unlocked-1);leave();}
listen($('resultStages'),'click',resultStages);listen($('resultNext'),'click',()=>{if(!$('resultNext').disabled)void start(selected+1);});listen($('resultReplay'),'click',()=>void start(selected));
function trap(e,root){const buttons=[...root.querySelectorAll('button:not(:disabled)')];if(!buttons.length)return;const first=buttons[0],last=buttons.at(-1);if(e.key==='Tab'&&((e.shiftKey&&document.activeElement===first)||(!e.shiftKey&&document.activeElement===last))){e.preventDefault();(e.shiftKey?last:first).focus();}}
listen(resultLayer,'keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();resultStages();}else trap(e,resultLayer);});
let modalCancel=null;
function modal(title,text,actions,owner='battle'){
 const d=$('overlay');if(d.open)d.close();
 if(owner==='stage'){let holder=$('wardrobeModal');if(!holder){holder=document.createElement('div');holder.id='wardrobeModal';holder.className='signal-modal-layer';$('stageContent').append(holder);}holder.append(d);modalOwned=[wardrobe,nav,scenes.stage.header];}else{pauseLayer.append(d);pauseLayer.hidden=false;frame.activate('battle',{covered:true});modalOwned=[...$('battleContent').children].filter(n=>n!==pauseLayer);}
 for(const node of modalOwned)node.inert=true;d.setAttribute('aria-modal','true');
 $('overlayTitle').textContent=title;$('overlayText').textContent=text;$('overlayActions').replaceChildren();
 modalCancel=actions[0][1];
 for(const [label,fn]of actions){const b=document.createElement('button');b.dataset.wpFrameAction='secondary';b.textContent=label;b.addEventListener('click',()=>{closeModal();fn();},{once:true});$('overlayActions').append(b);}
 d.show();$('overlayActions').firstElementChild?.focus();
}
function resumeRun(){if(!run||run.phase==='ended')return;const now=performance.now();resume(run,now+1000);warmupEnd=now+1000;scene?.pause(false);$('battleScene').querySelector('[data-wp-return]').focus({preventScroll:true});}
function pauseDialog(help=false){if(!run||run.phase==='ended')return;pause(run,performance.now());scene?.pause(true);modal(help?c.help:c.continue,help?c.guide:c.stage+' '+(selected+1)+'\n'+c.leaveNote,[[c.continue,resumeRun],[c.leave,leave]]);}
listen($('overlay'),'keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();const fn=modalCancel;closeModal();fn?.();}else trap(e,$('overlay'));});
listen($('mainScene').querySelector('[data-wp-return]'),'click',()=>location.assign('/'));
listen($('stageScene').querySelector('[data-wp-return]'),'click',()=>{closeModal();show('main');});
listen($('battleScene').querySelector('[data-wp-return]'),'click',()=>{if(run?.phase==='ended')leave();else pauseDialog();});
listen($('start'),'click',()=>{selected=Math.max(0,save.unlocked-1);show('stage');});listen($('help'),'click',()=>pauseDialog(true));
function eventFeedback(e){
 if(!e)return;
 if(e.kind==='hit'){audio('feedback.success');scene?.feedback('hit',e.side);$('signalStatus').textContent=(e.perfect?c.perfect:c.hit)+' '+e.ms+' ms';}
 else if(e.kind==='error'){if(run.phase!=='ended')audio('feedback.error');scene?.feedback('error',run.sequence[run.cursor]?.side);$('signalStatus').textContent=c[e.reason];}
 else if(e.kind==='hold'){scene?.feedback('hold',run.sequence[run.cursor].side);$('signalStatus').textContent=c.hit;audio('feedback.success');}
 else if(e.kind==='rest')$('signalStatus').textContent=c.rest;
 else if(e.kind==='charge')$('signalStatus').textContent=c.charge;
 else if(e.kind==='cue')$('signalStatus').textContent=e.cue.echo?c.hold:c.tap;
 if(['hit','hold','error'].includes(e.kind)){
  $('arena').dataset.feedback=e.kind;const flashes=[$('signalStatus'),$('hudErrors'),$('hudChain')];flashes.forEach(n=>n.classList.remove('signal-flash'));void $('signalStatus').offsetWidth;flashes.forEach(n=>n.classList.add('signal-flash'));
  combo.textContent=run.streak>=3?'×'+run.streak:'';combo.dataset.tier=String(Math.min(3,Math.floor(run.streak/3)));
  combo.classList.remove('signal-combo');void combo.offsetWidth;combo.classList.add('signal-combo');
 }
}
function input(side){if(active!=='battle'||!run||!resultLayer.hidden||$('overlay').open||settingsPaused||warmupEnd>performance.now())return;
 const b=$(side);b.classList.remove('pressed');void b.offsetWidth;b.classList.add('pressed');later(()=>b.classList.remove('pressed'),110);eventFeedback(press(run,side,performance.now()));
}
for(const side of ['left','right']){listen($(side),'pointerdown',e=>{if(e.button!==0)return;e.preventDefault();input(side);});listen($(side),'click',e=>{if(e.detail===0)input(side);});}
listen(window,'keydown',e=>{if(active!=='battle'||!resultLayer.hidden||$('overlay').open||e.repeat)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();input(e.key==='ArrowLeft'?'left':'right');}else if(e.key==='Escape'){e.preventDefault();pauseDialog();}});
listen(document,'visibilitychange',()=>{if(document.hidden&&active==='battle'&&run?.phase!=='ended'&&!$('overlay').open)pauseDialog();});
const settingsObserver=new MutationObserver(()=>{if(active!=='battle'||!run||run.phase==='ended'||$('overlay').open)return;const open=[...$('battleScene').querySelectorAll('.wp-frame-popover')].some(n=>!n.hidden&&n.getClientRects().length);if(open&&!settingsPaused){pause(run,performance.now());scene?.pause(true);settingsPaused=true;}else if(!open&&settingsPaused){settingsPaused=false;resumeRun();}});
settingsObserver.observe($('battleScene').querySelector('header'),{attributes:true,childList:true,subtree:true,attributeFilter:['hidden','class']});
function result(){
 endedShown=true;const r=summary(run);let obtained=false;
 if(!practice&&r.outcome==='success')try{const committed=commitClear(localStorage,KEY,save,selected,r,id=>window.WonderAnalytics?.completeStage?.(id));save=committed.save;obtained=committed.reward;}catch{storageOkay=false;notify(c.storage);}
 audio(r.outcome==='success'?'result.win':'result.lose');scene?.outcome(r.outcome);$('signalResultTitle').textContent=r.outcome==='success'?c.success:c.failure;$('resultStars').textContent=r.outcome==='success'?'★'.repeat(r.stars)+'☆'.repeat(3-r.stars):'◇';
 $('signalResultText').textContent=c.score+': '+r.score+'\n'+c.errors+': '+r.errors+' / 3\n'+c.chain+': '+r.bestStreak+' · '+c.reaction+': '+(r.median??'—')+' ms';
 $('resultNext').disabled=r.outcome!=='success'||selected>=STAGES.length-1||!practice&&selected+1>=save.unlocked;
 $('battleContent').dataset.resultOpen='';for(const child of $('battleContent').children)if(child!==resultLayer)child.inert=true;resultLayer.hidden=false;frame.activate('battle',{covered:true});$('signalResultCard').scrollTop=0;
 const icon=window.ShowResultGet?.('signal-snap',obtained);if(icon?.isConnected)window.WeightPlayCastle?.dismissRewardNotice?.('signal-snap');$('resultStages').focus({preventScroll:true});
}
function animate(now){
 if(active!=='battle'||!run)return;
 const warm=now<warmupEnd,paused=run.pausedAt!==null,count=warm?Math.ceil((warmupEnd-now)/1000):0;
 $('countdown').textContent=warm&&!paused?String(count):'';if(count&&count!==lastCountdown&&!paused)audio('ui.tick');lastCountdown=count;
 $('left').disabled=$('right').disabled=warm||paused||run.phase==='ended';
 if(!warm&&!paused){if(run.phase==='warmup')begin(run,now);eventFeedback(tick(run,now));}
 const cue=['cue','charge'].includes(run.phase)?run.sequence[run.cursor]:null;scene?.cue(cue,run.phase);
 const anchors=scene?.anchors()||[];
 for(const side of ['left','right']){const node=$(side+'Cue'),on=cue?.side===side;node.textContent=on?(run.phase==='charge'?'◇':cue.echo?'⊠':'◆'):cue?.distract?'⊠':'';
  node.classList.toggle('echo',Boolean(cue&&(cue.echo||!on)));node.classList.toggle('charging',run.phase==='charge');const anchor=anchors.find(n=>n.side===side);if(anchor){node.style.left=anchor.x+'%';node.style.top=anchor.y+'%';}
 }
 $('timeTrack').firstElementChild.style.transform='scaleX('+(cue?Math.max(0,(run.deadline-(run.pausedAt??now))/(run.phase==='charge'?cue.charge:run.stage.window)):0)+')';
 const shown=Math.min(run.stage.count,Math.max(0,run.cursor+1));$('hudProgress').lastElementChild.textContent=(selected+1)+' · '+shown+'/'+run.stage.count;$('hudErrors').lastElementChild.textContent=run.errors+'/3';$('hudChain').lastElementChild.textContent=run.streak;
 for(let i=0;i<meter.children.length;i++){meter.children[i].dataset.state=i<run.cursor?'done':i===run.cursor?'active':'waiting';}
 if(run.phase==='ended'&&!endedShown)result();raf=requestAnimationFrame(animate);
}
let cancelEntryWait=null;
function entryReady(){
 const ready=()=>document.readyState==='complete'&&document.documentElement.dataset.wpGameEntryLoaderActive!=='true'&&!document.querySelector('.wp-game-entry-loader');
 if(ready())return Promise.resolve(true);
 return new Promise(resolve=>{let done=false;const observer=new MutationObserver(check),timer=setTimeout(()=>finish(false),21000);
  function finish(value){if(done)return;done=true;observer.disconnect();clearTimeout(timer);window.removeEventListener('load',check);cancelEntryWait=null;resolve(value);}
  function check(){if(ready())finish(true);}
  cancelEntryWait=()=>finish(false);observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-wp-game-entry-loader-active']});window.addEventListener('load',check,{once:true});check();
 });
}
async function start(index){
 const generation=++startGeneration;
 if(practice&&!await LocalPractice.validate())return;
 if(!await entryReady())return;
 if(generation!==startGeneration)return;
 if(!Number.isInteger(index)||index<0||index>=STAGES.length||!practice&&index>=save.unlocked){notify(c.locked);return;}
 cancelAnimationFrame(raf);closeModal();hideResult();disposeScene();selected=index;run=createRun(index,++seed);endedShown=false;settingsPaused=false;lastCountdown=-1;show('battle');
 $('signalStatus').textContent=ruleText(run.stage);delete $('arena').dataset.feedback;combo.textContent='';meter.replaceChildren(...Array.from({length:run.stage.count},()=>document.createElement('i')));
 try{scene=createScene($('arena'),{skin:save.skin});}catch(error){run=null;modal(c.failure,c.retry,[[c.retry,()=>void start(selected)],[c.leave,leave]]);console.error(error);return;}
 if(!practice)window.WonderAnalytics?.track?.('stage_start',{stage_id:String(run.stage.id)});
 audio('game.start');warmupEnd=performance.now()+1800;$('left').focus({preventScroll:true});raf=requestAnimationFrame(animate);
}
listen($('arena'),'signal-renderer-lost',()=>{if(run){pause(run,performance.now());scene?.pause(true);modal(c.failure,c.retry,[[c.retry,()=>void start(selected)],[c.leave,leave]]);}});
listen(window,'pagehide',()=>{++startGeneration;cancelEntryWait?.();cancelAnimationFrame(raf);clearTimeout(storageTimer);closeModal();disposeScene();stopPreview();stageUI.destroy();settingsObserver.disconnect();frame.destroy();audioScope?.dispose();abort.abort();});
show('main');if(!storageOkay)notify(c.storage);
void LocalPractice.register({gameId:'signal-snap',stageIds:STAGES.map(s=>s.id),enable(value){practice=value;if(!value&&run){leave();notify(c.locked);}stageUI.refresh(selected);},startStage(id){return start(Number(id)-1);}});
window.WeightPlayAudio?.preload(['ui.click','game.start','ui.tick','feedback.success','feedback.error','result.win','result.lose','shop.purchase']);
export function renderStats(){return scene?.stats()??previewScene?.stats()??null;}
