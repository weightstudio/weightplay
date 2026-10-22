import {SAVE_KEY,SHAPES,STAGES,tileKey,normalizeSave,newRun,remaining,choose,optionsFor,award,clueCells} from './core.mjs';
import {COPY} from './workshop-copy.mjs';
import {purchaseMoon,recoverPurchase} from './purchase.mjs';
const $=id=>document.getElementById(id);
const old=window.PATTERN_PATCH_LOCALES, locales=old.__localeKeys;
const segments=['en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar'];
let locale=locales[segments.indexOf(location.pathname.split('/')[1])]||'en';
if(!segments.includes(location.pathname.split('/')[1])){try{const preferred=localStorage.getItem('weightPlayLocale')||localStorage.getItem('weightplay-pattern-locale');if(locales.includes(preferred))locale=preferred;}catch{}}
const sound=window.WeightPlayAudio.createScope();
window.WeightPlayAudio.preload(['game.start','feedback.success','feedback.error','feedback.hint','result.win','reward.unlock']);
const t=(key,vars={})=>String(COPY[locale]?.[key]??old[locale]?.[key]??COPY.en[key]??old.en[key]??key).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??'');
const title=()=>window.WEIGHTPLAY_GAME_TITLES?.['animal-pattern-patch']?.[locale]||old[locale].title;
const name=stage=>stage.name[locale]||`${COPY[locale].arcs[stage.arc]} · ${String(stage.id).padStart(2,'0')}`;
const rule=stage=>COPY[locale].rules[stage.rule];
let save,storageOK=true;
try{save=normalizeSave(JSON.parse(localStorage.getItem(SAVE_KEY)||'null'));}catch{save=normalizeSave(null);storageOK=false;}
let purchaseBlocked=false;
try{const recovery=recoverPurchase(localStorage,window.WeightPlayWallet,save);save=recovery.save;purchaseBlocked=recovery.blocked;}catch{purchaseBlocked=true;}
let screen='main',run=null,selectedGap=0,selector=null,modal=null,busy=false,session=0;
const animations=new Set(),timers=new Set(),optionButtons=[];
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const play=id=>{if(!document.hidden)sound.play(id);};
function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));storageOK=true;return true;}catch{storageOK=false;return false;}}
function saveRun(){if(run?.status==='playing')save.run={stage:run.stage,filled:[...run.filled],mistakes:run.mistakes,hints:run.hints};persist();}
function tween(node,frames,duration=180){
  if(!node?.animate)return;
  const animation=node.animate(reduce()?[{opacity:.55},{opacity:1}]:frames,{duration:reduce()?80:duration,easing:'cubic-bezier(.18,.7,.22,1)',fill:'none'});
  animations.add(animation);animation.finished.then(()=>animations.delete(animation),()=>animations.delete(animation));return animation;
}
function cancelEffects(){animations.forEach(a=>a.cancel());animations.clear();$('boardEffects').replaceChildren();}
function schedule(callback,delay){const entry={callback,remaining:delay,start:performance.now(),id:0,session};timers.add(entry);if(!document.hidden&&!modal)entry.id=setTimeout(()=>{timers.delete(entry);if(entry.session===session)callback();},delay);return entry;}
function pauseTimers(){const now=performance.now();for(const e of timers){if(!e.id)continue;clearTimeout(e.id);e.id=0;e.remaining=Math.max(0,e.remaining-(now-e.start));}animations.forEach(a=>a.pause());}
function resumeTimers(){if(document.hidden||modal)return;for(const e of timers){if(e.id)continue;e.start=performance.now();e.id=setTimeout(()=>{timers.delete(e);if(e.session===session)e.callback();},e.remaining);}animations.forEach(a=>a.play());}
function clearTimers(){for(const e of timers)clearTimeout(e.id);timers.clear();busy=false;}
function announce(text){$('appStatus').textContent=text;}
function feedback(text,kind=''){const node=$('feedback');node.textContent=text;node.dataset.kind=kind;tween(node,[{opacity:.3},{opacity:1}],140);}
function medalIcon(filled=true){const node=document.createElement('span');node.className=`medal${filled?' earned':''}`;node.textContent=filled?'✦':'◇';return node;}
function art(value){const node=document.createElement('span');node.className=`glyph-set count-${value.count}`;node.dataset.shape=value.shape;for(let n=0;n<value.count;n++){const img=document.createElement('img');img.src=`/games/animal-pattern-patch/assets/glyph-${value.shape}.svg`;img.alt='';img.draggable=false;node.append(img);}return node;}
function tileLabel(value){const shape=old[locale]?.tokenNames?.[value.shape]||old.en.tokenNames?.[value.shape]||value.shape;return `${shape}${value.count>1?` × ${value.count}`:''}`;}
for(const key of locales)$('localeSelect').add(new Option(old.en.languageNames[key],key));
$('localeSelect').value=locale;
const frame=window.WeightPlayScreenFrame.mount({root:$('app'),localeSelect:$('localeSelect'),playUI:true,scenes:{
 main:{root:$('mainView'),header:$('mainView').querySelector('header'),content:$('mainContent')},
 stage:{root:$('stageView'),header:$('stageView').querySelector('header'),content:$('stageContent')},
 battle:{root:$('battleView'),header:$('battleView').querySelector('header'),content:$('battleContent'),headerInfo:$('battleInfo')},
}});
const stageGroup=window.WeightPlayScreenFrame.createGroup();stageGroup.add($('stageProgress'));frame.stageTopUI.add(stageGroup);
const infoGroup=window.WeightPlayScreenFrame.createGroup();[...$('battleInfo').children].forEach(n=>infoGroup.add(n));frame.battleTopUI.add(infoGroup);
frame.commonDownButton.add($('workshopButton'));frame.commonDownButton.add($('stagesTab'));
const stageConfig={gameId:'animal-pattern-patch',count:STAGES.length,poster:'/assets/interface7-redrawn/animal-pattern-patch.webp',background:'/assets/lobby-block-atmosphere.svg',stage(index){
 const stage=STAGES[index],medals=save.medals[index];
 return {id:stage.id,kicker:`${t('stages')} ${String(stage.id).padStart(2,'0')} / 30`,title:name(stage),subtitle:COPY[locale].arcs[stage.arc],status:stage.id>save.unlocked?t('locked'):save.run?.stage===stage.id?t('resume'):medals[0]?medals.map(v=>v?'✦':'◇').join(' '):stage.checkpoint?t('checkpoint'):'',summary:stage.checkpoint?t('checkpoint'):t('choose'),details:[t('howBody'),t('medalBody')],locked:stage.id>save.unlocked,cleared:medals[0]};
}};
function updateProgress(){const clears=save.medals.filter(m=>m[0]).length,total=save.medals.flat().filter(Boolean).length;$('mainProgress').textContent=`${t('progress')} ${clears} / 30 · ✦ ${total} / 90`;$('stageProgress').textContent=`${t('progress')} ${clears} / 30`;}
function translate(){
 document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=`${title()} | WeightPlay`;
 document.querySelectorAll('[data-copy]').forEach(n=>n.textContent=t(n.dataset.copy));document.querySelectorAll('[data-label]').forEach(n=>n.setAttribute('aria-label',t(n.dataset.label)));
 document.querySelectorAll('[data-wp-game-title]').forEach(n=>n.textContent=title());
 $('patternGrid').setAttribute('aria-label',t('patternGrid'));$('optionGrid').setAttribute('aria-label',t('choose'));
 $('localeSelect').value=locale;updateProgress();if(selector&&screen==='stage')selector.refresh();frame.refresh();
 if(run&&screen==='battle'){updateHUD();updateOptionLabels();}
}
$('localeSelect').addEventListener('change',()=>{locale=$('localeSelect').value;try{localStorage.setItem('weightplay-pattern-locale',locale);}catch{}window.WonderI18n?.setLocale?.(locale,{navigate:false});translate();});
window.addEventListener('wonder:locale-change',()=>{const next=window.WonderI18n?.actualLocale?.();if(locales.includes(next)&&next!==locale){locale=next;translate();}});
function changeScene(next){
 session++;clearTimers();cancelEffects();sound.stop();selector?.cancel();modal=null;
 for(const id of ['resultView','leaveDialog','helpDialog','workshopModal']){$(id).hidden=true;$(id).inert=true;}
 screen=next;document.body.dataset.screen=next;delete document.body.dataset.battleSubstate;
 for(const [id,type] of [['mainView','main'],['stageView','stage'],['battleView','battle']])$(id).hidden=type!==next;
 $('gameGuide').hidden=next!=='main';$('battleContent').inert=false;$('stageContent').inert=false;
 frame.activate(next);window.WeightPlayBattleCanvas?.sync?.();updateProgress();
 tween($(`${next}View`),[{opacity:.2},{opacity:1}],180);window.scrollTo(0,0);
 if(next==='main')$('startButton').focus({preventScroll:true});
 if(next==='stage'){
  if(!selector)selector=window.WeightPlayPlayUI.mountStage({page:$('stageContent'),rail:$('stageRail'),config:stageConfig,selected:save.unlocked-1,onStart:index=>start(index+1),isActive:()=>screen==='stage'&&!modal});
  else selector.refresh(save.unlocked-1);
  requestAnimationFrame(()=>$('stageRail').querySelector('[aria-current="true"]')?.focus({preventScroll:true}));
 }
}
function updateHUD(){const stage=STAGES[run.stage-1];$('roundLabel').textContent=`${t('stages')} ${stage.id} / 30`;$('fillCount').textContent=`${run.filled.length} / ${stage.holes.length}`;$('arcLabel').textContent=COPY[locale].arcs[stage.arc];$('stageTitle').textContent=name(stage);$('sealLabel').textContent=stage.checkpoint?t('checkpoint'):'';$('streakLabel').textContent=run.streak>1?`${t('streak')} × ${run.streak}`:'';$('gapLabel').textContent=run.status==='complete'?'✓':`${Math.floor(selectedGap/3)+1} · ${selectedGap%3+1}`;$('runMedals').replaceChildren(...[true,!run.mistakes,!run.hints].map(medalIcon));$('hintButton').disabled=run.status==='complete';}
function updateOptionLabels(){for(const button of optionButtons){if(!button._tile)continue;button.setAttribute('aria-label',t('option',{token:tileLabel(button._tile)}));}}
function renderBoard(){
 const stage=STAGES[run.stage-1];$('patternGrid').replaceChildren();
 stage.tiles.forEach((value,index)=>{
  const gap=stage.holes.includes(index)&&!run.filled.includes(index),node=document.createElement(gap?'button':'div');
  node.className=`pattern-tile${gap?' gap':''}`;node.dataset.cell=index;
  if(gap){node.type='button';node.append(Object.assign(document.createElement('span'),{className:'gap-symbol',textContent:'?'}));node.setAttribute('aria-label',`${t('missing')} ${Math.floor(index/3)+1}, ${index%3+1}`);node.addEventListener('click',()=>selectGap(index));}
  else{node.append(art(value));node.setAttribute('aria-label',t('patternTile',{row:Math.floor(index/3)+1,tile:index%3+1,token:tileLabel(value)}));}
  $('patternGrid').append(node);
 });
}
function renderOptions(){
 const options=optionsFor(STAGES[run.stage-1],selectedGap);
 if(!optionButtons.length)for(let i=0;i<4;i++){const button=document.createElement('button');button.type='button';button.className='option-token';button.dataset.option=i;button.addEventListener('click',()=>answer(button._tile,button));optionButtons.push(button);$('optionGrid').append(button);}
 options.forEach((value,index)=>{const button=optionButtons[index];button._tile=value;button.disabled=false;button.classList.remove('rejected','accepted');button.replaceChildren(art(value));const key=document.createElement('kbd');key.textContent=index+1;key.setAttribute('aria-hidden','true');button.append(key);});updateOptionLabels();
 tween($('optionGrid'),[{opacity:.2},{opacity:1}],160);
}
function selectGap(index){if(busy||modal||document.hidden||run?.status!=='playing'||!remaining(run).includes(index))return;selectedGap=index;$('patternGrid').querySelectorAll('.gap').forEach(n=>{const selected=Number(n.dataset.cell)===index;n.classList.toggle('selected',selected);n.setAttribute('aria-pressed',String(selected));});$('patternGrid').querySelectorAll('.clue').forEach(n=>n.classList.remove('clue'));renderOptions();updateHUD();}
function start(id,replay=false){
 if(!STAGES[id-1]||id>save.unlocked)return;
 const prior=!replay&&save.run?.stage===id?save.run:null;
 run=newRun(STAGES[id-1],prior);changeScene('battle');selectedGap=remaining(run)[0];renderBoard();selectGap(selectedGap);$('ruleReveal').hidden=true;feedback(storageOK?t('choose'):t('storage'));saveRun();play('game.start');optionButtons[0].focus({preventScroll:true});
 document.body.dataset.skin=save.skin;
}
function sparkle(cell){
 if(reduce()){tween(cell,[{opacity:.4},{opacity:1}],80);return;}
 const r=cell.getBoundingClientRect(),p=$('boardEffects').getBoundingClientRect(),scale=p.width/$('boardEffects').offsetWidth;
 for(let i=0;i<8;i++){const spark=document.createElement('i');spark.className='spark';spark.style.left=`${(r.left+r.width/2-p.left)/scale}px`;spark.style.top=`${(r.top+r.height/2-p.top)/scale}px`;$('boardEffects').append(spark);const angle=i*Math.PI/4;const animation=tween(spark,[{opacity:1,transform:'translate(-50%,-50%) scale(1)'},{opacity:0,transform:`translate(${Math.cos(angle)*65}px,${Math.sin(angle)*65}px) scale(.25)`}],550);animation?.finished.then(()=>spark.remove(),()=>spark.remove());}
}
function answer(value,button){
 if(screen!=='battle'||modal||document.hidden||busy||run?.status!=='playing'||button.disabled)return;
 const result=choose(run,selectedGap,value);run=result.run;
 if(result.outcome==='ignored')return;
 if(result.outcome==='wrong'){
  button.classList.add('rejected');button.disabled=true;const mark=document.createElement('b');mark.className='answer-mark';mark.textContent='×';mark.setAttribute('aria-hidden','true');button.append(mark);
  tween(button.querySelector('.glyph-set'),[{transform:'translateX(0)'},{transform:'translateX(-4px)',offset:.3},{transform:'translateX(4px)',offset:.6},{transform:'translateX(0)'}],240);
  feedback(t('wrong'),'wrong');play('feedback.error');saveRun();updateHUD();return;
 }
 busy=true;optionButtons.forEach(n=>n.disabled=true);button.classList.add('accepted');
 const node=$('patternGrid').querySelector(`[data-cell="${selectedGap}"]`);node.classList.remove('gap','selected');node.classList.add('restored');node.replaceChildren(art(value));node.setAttribute('aria-label',tileLabel(value));node.removeAttribute('aria-pressed');node.disabled=true;
 tween(node.querySelector('.glyph-set'),[{opacity:0,transform:'translateY(-12px) scale(.75)'},{opacity:1,transform:'translateY(0) scale(1)'}],320);sparkle(node);play('feedback.success');feedback(t('placed'),'correct');updateHUD();saveRun();
 if(run.status==='complete'){
  save=award(save,run);persist();$('ruleReveal').textContent=rule(STAGES[run.stage-1]);$('ruleReveal').hidden=false;
  schedule(finish,650);
 }else schedule(()=>{busy=false;selectGap(remaining(run)[0]);},300);
}
function hint(){if(modal||busy||document.hidden||run?.status!=='playing')return;run.hints++;saveRun();const stage=STAGES[run.stage-1];const cells=clueCells(stage,selectedGap);$('patternGrid').querySelectorAll('[data-cell]').forEach(n=>{n.classList.toggle('clue',cells.includes(Number(n.dataset.cell)));});feedback(rule(stage),'hint');play('feedback.hint');updateHUD();}
function finish(){
 if(run?.status!=='complete'||modal||screen!=='battle')return;
 clearTimers();const stage=STAGES[run.stage-1];$('resultEyebrow').textContent=`${COPY[locale].arcs[stage.arc]} · ${String(stage.id).padStart(2,'0')}`;$('resultTitle').textContent=t(stage.id===30?'allDone':'complete');$('resultRule').textContent=rule(stage);
 const earned=[true,run.mistakes===0,run.hints===0];$('resultMedals').replaceChildren(...earned.map((value,index)=>{const item=document.createElement('div');item.className=value?'earned':'unearned';item.append(medalIcon(value));const label=document.createElement('span');label.textContent=t(['clear','perfect','unassisted'][index]);item.append(label);return item;}));
 $('resultSummary').textContent=storageOK?`${t('progress')} ${save.medals.filter(m=>m[0]).length} / 30 · ✦ ${save.medals.flat().filter(Boolean).length} / 90`:t('storage');$('nextButton').disabled=stage.id===30||stage.id+1>save.unlocked;
 openModal('resultView');document.body.dataset.battleSubstate='result';play('result.win');$('resultMedals').querySelectorAll('.earned .medal').forEach((n,i)=>tween(n,[{opacity:0,transform:'scale(.65)'},{opacity:1,transform:'scale(1)'}],300+i*90));
}
function openModal(id){
 if(modal)return;modal=id;pauseTimers();const el=$(id);el.hidden=false;el.inert=false;
 if(screen==='battle'){$('battleContent').inert=true;frame.activate('battle',{covered:true});}else{$('stageContent').inert=true;frame.activate('stage',{covered:true});}
 tween(el,[{opacity:0},{opacity:1}],180);el.querySelector('button:not(:disabled)')?.focus({preventScroll:true});
}
function closeModal(){if(!modal||modal==='resultView')return;const previous=modal;const el=$(previous);el.hidden=true;el.inert=true;modal=null;$('battleContent').inert=false;$('stageContent').inert=false;frame.activate(screen);resumeTimers();$(previous==='workshopModal'?'workshopButton':previous==='helpDialog'?'helpButton':'homeFromBattle').focus({preventScroll:true});}
function showShop(){if(screen!=='stage'||modal)return;try{$('walletBalance').textContent=window.WeightPlayWallet.read().diamonds;}catch{$('walletBalance').textContent='—';}$('shopStatus').textContent=purchaseBlocked?t('storage'):save.moonOwned?t('owned'):'';$('purchaseSkin').textContent=save.moonOwned?t(save.skin==='moon'?'jade':'equip'):t('buy');$('purchaseSkin').disabled=purchaseBlocked;openModal('workshopModal');}
function buySkin(){
 if(modal!=='workshopModal'||busy||purchaseBlocked)return;busy=true;
 if(save.moonOwned){const next={...save,skin:save.skin==='moon'?'jade':'moon'};try{localStorage.setItem(SAVE_KEY,JSON.stringify(next));save=next;document.body.dataset.skin=save.skin;$('shopStatus').textContent=t('owned');}catch{$('shopStatus').textContent=t('storage');}}
 else{const result=purchaseMoon(localStorage,window.WeightPlayWallet,save);save=result.save;purchaseBlocked=result.blocked;$('shopStatus').textContent=t(result.ok?'owned':result.reason==='balance'?'notEnough':result.blocked?'storage':'purchaseFail');if(result.ok)play('reward.unlock');}
 $('walletBalance').textContent=window.WeightPlayWallet.read().diamonds;$('purchaseSkin').textContent=save.moonOwned?t(save.skin==='moon'?'jade':'equip'):t('buy');$('purchaseSkin').disabled=purchaseBlocked;document.body.dataset.skin=save.skin;busy=false;
}
function keydown(event){
 if(modal){
  if(event.key==='Escape'&&modal!=='resultView'){event.preventDefault();event.stopPropagation();closeModal();return;}
  if(event.key==='Tab'){const actions=[...$(modal).querySelectorAll('button:not(:disabled)')].filter(n=>n.getClientRects().length);const index=actions.indexOf(document.activeElement);event.preventDefault();actions[(index+(event.shiftKey?-1:1)+actions.length)%actions.length]?.focus();}return;
 }
 if(screen!=='battle'||event.defaultPrevented||event.repeat||event.ctrlKey||event.metaKey||event.altKey)return;
 if(document.querySelector('.wp-frame-popover:not([hidden])'))return;
 if(/^[1-4]$/.test(event.key)){event.preventDefault();const button=optionButtons[Number(event.key)-1];answer(button._tile,button);}
 else if(event.key.toLowerCase()==='h'){event.preventDefault();hint();}
 else if(event.key==='Escape'){event.preventDefault();openModal('leaveDialog');}
}
$('startButton').addEventListener('click',()=>changeScene('stage'));
$('stageBack').addEventListener('click',()=>changeScene('main'));
$('stagesTab').addEventListener('click',()=>selector?.refresh(save.unlocked-1));
$('homeFromBattle').addEventListener('click',()=>openModal('leaveDialog'));
$('continueBtn').addEventListener('click',closeModal);$('confirmLeaveBtn').addEventListener('click',()=>{saveRun();changeScene('stage');});
$('helpButton').addEventListener('click',()=>openModal('helpDialog'));$('closeHelp').addEventListener('click',closeModal);$('hintButton').addEventListener('click',hint);
$('homeFromResult').addEventListener('click',()=>changeScene('stage'));$('replayButton').addEventListener('click',()=>start(run.stage,true));$('nextButton').addEventListener('click',()=>start(run.stage+1));
$('workshopButton').addEventListener('click',showShop);$('closeWorkshop').addEventListener('click',closeModal);$('purchaseSkin').addEventListener('click',buySkin);
// The popup itself is the explicit, priced confirmation. No automatic spending.
window.addEventListener('keydown',keydown);
document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseTimers();saveRun();sound.stop();}else resumeTimers();});
window.addEventListener('pagehide',event=>{saveRun();pauseTimers();sound.stop();if(!event.persisted){clearTimers();cancelEffects();selector?.destroy();frame.destroy();sound.dispose();}});
window.addEventListener('pageshow',()=>{if(!document.hidden)resumeTimers();});
window.WonderI18n?.setLocale?.(locale,{navigate:false,dispatch:false});translate();changeScene('main');
