import {LEVELS,OBJECTS,SAVE_KEY,normalizeSave,createRun,choose,settle} from './levels.mjs';
import {GardenWorld} from './world.mjs';

function init() {
  const $=id=>document.getElementById(id), dictionaries=window.MEADOW_FIND_LOCALES;
  const segments={'zh-tw':'zh-Hant','zh-cn':'zh-Hans','pt-br':'pt-BR',en:'en',ja:'ja',ko:'ko',es:'es',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
  const storage={get:key=>{try{return localStorage.getItem(key);}catch{return null;}},set:(key,value)=>{try{localStorage.setItem(key,value);return true;}catch{return false;}}};
  let locale=segments[location.pathname.split('/')[1]]||storage.get('weightPlayLocale')||'en';if(!dictionaries[locale])locale='en';
  let save;try{save=normalizeSave(JSON.parse(storage.get(SAVE_KEY)));}catch{save=normalizeSave();}
  let run=null,screen='main',world=null,stageUI=null,selected=save.unlocked-1,modal='',focusBefore=null,finishTimer=0,pendingFinish=false,renderFrame=0,saveOK=true;
  const abort=new AbortController(),listen=(node,event,fn)=>node.addEventListener(event,fn,{signal:abort.signal});
  const frame=window.MeadowDifferenceFrame.frame;
  const t=(key,vars={})=>String(dictionaries[locale][key]??dictionaries.en[key]??key).replace(/\{(\w+)\}/g,(_,k)=>vars[k]??'');
  const sound=cue=>window.WeightPlayAudio?.play(cue),reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const title=level=>locale==='en'?level.en:locale==='zh-Hant'?level.zh:locale==='zh-Hans'?level.zhHans:`${dictionaries[locale].biomes[level.biome]} ${level.layout+1}`;
  const paused=()=>Boolean(modal||document.hidden||document.querySelector('.wp-frame-popover:not([hidden])'));
  const persist=()=>{saveOK=storage.set(SAVE_KEY,JSON.stringify(save));};
  function updateMain(){const done=save.stars.filter(Boolean).length;$('mainBestCount').textContent=`${done} / 30`;$('stageProgress').textContent=`${t('best')} ${done} / 30`;}
  function translate(){
    document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=`${t('title')} | WeightPlay`;
    document.querySelector('meta[name="description"]').content=t('subtitle');$('localeSelect').value=locale;
    document.querySelectorAll('[data-copy]').forEach(n=>{if(typeof dictionaries[locale][n.dataset.copy]==='string')n.textContent=t(n.dataset.copy);});
    document.querySelector('[data-wp-return="main"]').setAttribute('aria-label',t('backToLobby'));
    $('homeFromStage').setAttribute('aria-label',t('home'));$('homeFromBattle').setAttribute('aria-label',t('stages'));
    $('beforeGarden').setAttribute('aria-label',t('before'));$('afterGarden').setAttribute('aria-label',t('after'));updateMain();frame.refresh?.();
  }
  function render(){cancelAnimationFrame(renderFrame);renderFrame=requestAnimationFrame(()=>{
    if(screen!=='battle'||!world)return;
    const layout=$('compareLayout'),wide=matchMedia('(min-aspect-ratio:1/1)').matches,gap=parseFloat(getComputedStyle(layout).gap)||14;
    const width=wide?Math.min((layout.clientWidth-gap)/2,layout.clientHeight*1.5):Math.min(layout.clientWidth,(layout.clientHeight-gap)*.75);
    for(const id of ['beforePanel','afterPanel'])$(id).style.maxWidth=`${Math.max(1,width)}px`;
    world.render([$('beforeGarden'),$('afterGarden')]);
  });}
  const resize=new ResizeObserver(render);resize.observe($('compareLayout'));
  function cancelEffects(){clearTimeout(finishTimer);finishTimer=0;document.querySelectorAll('.garden-particle,.tap-echo').forEach(n=>n.remove());document.querySelectorAll('.is-hint').forEach(n=>n.classList.remove('is-hint'));}
  function changeScreen(next){
    cancelEffects();pendingFinish=false;modal='';$('leaveConfirm').hidden=true;$('battleView').querySelector('.battle-workspace').inert=false;
    if(next!=='stage')stageUI?.cancel();screen=next;document.body.dataset.screen=next;
    $('mainScreen').hidden=next!=='main';$('stageView').hidden=next!=='stage';$('battleView').hidden=next!=='battle';
    $('resultView').hidden=true;$('roundContent').hidden=false;$('roundContent').inert=false;$('battleView').classList.remove('is-result');
    const guide=document.querySelector('[data-game-owned-guide]');if(guide)guide.hidden=next!=='main';
    frame.activate(next);window.WeightPlayBattleCanvas?.sync?.();
    if(next!=='battle'){world?.clear();$('beforeGarden').replaceChildren();$('afterGarden').replaceChildren();}
    if(next==='main')updateMain();if(next==='stage')showStages();window.scrollTo(0,0);render();
  }
  const stageConfig={gameId:'animal-meadow-difference',count:LEVELS.length,poster:'/assets/interface7-redrawn/animal-meadow-difference.webp',background:'/assets/lobby-block-atmosphere.svg',stage(index){const level=LEVELS[index];return{id:level.id,kicker:`${t('stages')} ${String(level.id).padStart(2,'0')}`,title:title(level),subtitle:dictionaries[locale].biomes[level.biome],status:level.id>save.unlocked?t('locked'):save.stars[index]?'★'.repeat(save.stars[index])+'☆'.repeat(3-save.stars[index]):'',summary:t('instruction',{total:Object.keys(level.changes).length}),details:[t('howBody'),t('starBody')],locked:level.id>save.unlocked,cleared:save.stars[index]>0};}};
  function showStages(){updateMain();if(!stageUI)stageUI=window.WeightPlayPlayUI.mountStage({page:$('stageContent'),rail:$('stageRail'),config:stageConfig,selected,onSelect:index=>{selected=index;},onStart:index=>start(index),isActive:()=>screen==='stage'});else stageUI.refresh(selected);}
  function updateHUD(){
    $('checkCountTop').textContent=`${run.found.length} / ${Object.keys(run.level.changes).length}`;
    [...$('discoveryDots').children].forEach((n,i)=>n.classList.toggle('filled',i<run.found.length));
    $('hintCount').textContent=String(2-run.hints);$('hintButton').disabled=run.hints>=2||pendingFinish||run.settled;
  }
  function bindTargets(targets){
    [$('beforeGarden'),$('afterGarden')].forEach((panel,side)=>{
      panel.replaceChildren();OBJECTS.forEach((id,index)=>{const point=targets[side][id],button=document.createElement('button');
        button.type='button';button.className='garden-target';button.dataset.object=id;button.style.left=`${point.x}%`;button.style.top=`${point.y}%`;
        button.setAttribute('aria-label',`${t(side?'after':'before')} · ${dictionaries[locale].objects[index]}`);
        button.addEventListener('click',event=>{
          // Enlarged touch targets may touch on small screens. Resolve a pointer
          // to the nearest projected object instead of letting DOM order steal it.
          const target=event.detail===0?button:[...panel.children].reduce((best,node)=>{
            const r=node.getBoundingClientRect(),distance=Math.hypot(event.clientX-r.x-r.width/2,event.clientY-r.y-r.height/2);
            return distance<best.distance?{node,distance}:best;
          },{node:button,distance:Infinity}).node;
          pick(target.dataset.object,target);
        });panel.append(button);
      });
    });
  }
  function start(index){
    if(!Number.isInteger(index)||index<0||index>=save.unlocked||!LEVELS[index])return;
    selected=index;run=createRun(LEVELS[index]);changeScreen('battle');
    $('roundLabel').textContent=`${String(index+1).padStart(2,'0')} / 30`;$('gardenName').textContent=title(run.level);$('biomeName').textContent=dictionaries[locale].biomes[run.level.biome];
    $('instruction').textContent=t('instruction',{total:Object.keys(run.level.changes).length});$('feedback').textContent='';$('feedback').className='feedback';
    $('discoveryDots').replaceChildren(...Object.keys(run.level.changes).map(()=>document.createElement('i')));updateHUD();
    try{world ||= new GardenWorld($('sceneCanvas'),renderFailure);bindTargets(world.load(run.level));render();sound('game.start');}
    catch(error){console.error('MEADOW_RENDER',error);renderFailure();}
    window.dispatchEvent(new CustomEvent('weightplay:battle-open',{detail:{gameId:'animal-meadow-difference'}}));
  }
  function echo(button,kind){
    const ring=document.createElement('i');ring.className=`tap-echo ${kind}`;button.append(ring);ring.addEventListener('animationend',()=>ring.remove(),{once:true});
    if(kind!=='success'||reduce())return;
    for(let i=0;i<6;i++){const p=document.createElement('i');p.className='garden-particle';p.style.setProperty('--dx',`${Math.cos(i*Math.PI/3)*35}px`);p.style.setProperty('--dy',`${Math.sin(i*Math.PI/3)*35-12}px`);p.style.setProperty('--turn',`${i*47}deg`);button.append(p);p.addEventListener('animationend',()=>p.remove(),{once:true});}
  }
  function pick(id,button){
    if(screen!=='battle'||paused()||pendingFinish||run.settled)return;
    const result=choose(run,id);if(result==='ignored')return;
    $('feedback').className=`feedback ${result==='miss'?'is-wrong':'is-success'}`;$('feedback').textContent=t(result==='miss'?'wrong':'correct');
    sound(result==='miss'?'feedback.error':'feedback.success');
    if(result==='miss')echo(button,'miss');else document.querySelectorAll(`.garden-target[data-object="${id}"]`).forEach(n=>{n.classList.remove('is-hint');n.classList.add('is-found');n.setAttribute('aria-pressed','true');n.setAttribute('aria-disabled','true');echo(n,'success');});
    if(result==='complete'){pendingFinish=true;scheduleFinish();}updateHUD();
  }
  function scheduleFinish(){clearTimeout(finishTimer);if(pendingFinish&&!paused())finishTimer=setTimeout(finish,reduce()?180:720);}
  function finish(){
    if(!pendingFinish||paused())return;
    const stars=settle(run,save);if(stars===null)return;pendingFinish=false;persist();updateMain();
    $('resultStars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);$('resultSummary').textContent=t('summary',{total:run.found.length});
    $('resultMisses').textContent=String(run.mistakes);$('resultHints').textContent=String(run.hints);$('saveNotice').hidden=saveOK;$('saveNotice').textContent=t('saveWarning');
    $('nextButton').disabled=run.level.id>=LEVELS.length;$('resultView').hidden=false;$('roundContent').inert=true;$('battleView').classList.add('is-result');
    $('resultView').setAttribute('role','dialog');$('resultView').setAttribute('aria-modal','true');frame.activate('battle',{covered:true});sound('result.win');$('homeFromResult').focus();
  }
  function openModal(kind){
    if(modal)return;modal=kind;focusBefore=document.activeElement;clearTimeout(finishTimer);
    $('leaveTitle').textContent=t(kind==='help'?'how':kind==='error'?'retry':'leaveTitle');$('leaveBody').textContent=kind==='help'?`${t('howBody')} ${t('starBody')}`:t(kind==='error'?'error':'leaveBody');
    $('continuePlaying').textContent=t(kind==='help'?'close':kind==='error'?'retry':'continue');$('leaveBattle').hidden=kind==='help';
    $('leaveConfirm').hidden=false;$('battleView').querySelector('.battle-workspace').inert=true;frame.activate('battle',{covered:true});$('continuePlaying').focus();
  }
  function closeModal(){modal='';$('leaveConfirm').hidden=true;$('battleView').querySelector('.battle-workspace').inert=false;frame.activate('battle',{covered:run?.settled});focusBefore?.focus();scheduleFinish();}
  function renderFailure(){cancelEffects();if(screen==='battle'&&!modal)openModal('error');}
  function trap(event,container){if(event.key!=='Tab')return;const items=[...container.querySelectorAll('button:not([disabled])')].filter(n=>!n.hidden);if(!items.length)return;const at=items.indexOf(document.activeElement);if(event.shiftKey&&at<=0){event.preventDefault();items.at(-1).focus();}else if(!event.shiftKey&&at===items.length-1){event.preventDefault();items[0].focus();}}
  listen($('hintButton'),'click',()=>{if(paused()||run.settled||pendingFinish||run.hints>=2)return;const id=Object.keys(run.level.changes).find(id=>!run.found.includes(id));if(!id)return;run.hints++;updateHUD();document.querySelectorAll('.is-hint').forEach(n=>n.classList.remove('is-hint'));document.querySelectorAll(`.garden-target[data-object="${id}"]`).forEach(n=>n.classList.add('is-hint'));$('feedback').textContent=t('hint');sound('feedback.hint');});
  listen($('helpButton'),'click',()=>openModal('help'));listen($('startButton'),'click',()=>{selected=save.unlocked-1;changeScreen('stage');});listen($('stageTab'),'click',()=>stageUI?.refresh(selected));
  listen($('homeFromStage'),'click',()=>changeScreen('main'));listen($('homeFromBattle'),'click',()=>run?.settled?changeScreen('stage'):openModal('leave'));
  listen($('continuePlaying'),'click',()=>{if(modal==='error'){
    closeModal();world?.destroy();world=null;
    // A lost WebGL context belongs to its canvas. Retry on a fresh canvas so
    // recovery does not accidentally request that same permanently lost context.
    const canvas=$('sceneCanvas');canvas.replaceWith(canvas.cloneNode(false));start(selected);
  }else closeModal();});listen($('leaveBattle'),'click',()=>{closeModal();changeScreen('stage');});
  listen($('homeFromResult'),'click',()=>{selected=save.unlocked-1;changeScreen('stage');});listen($('replayButton'),'click',()=>start(selected));listen($('nextButton'),'click',()=>start(selected+1));
  listen(document,'keydown',e=>{if(modal){if(e.key==='Escape'&&modal!=='error'){e.preventDefault();closeModal();}trap(e,$('leaveConfirm'));}else if(run?.settled&&screen==='battle')trap(e,$('resultView'));});
  listen(document,'visibilitychange',()=>{if(document.hidden)cancelEffects();else{scheduleFinish();render();}});
  listen(window,'weightplay:interaction-state',scheduleFinish);
  listen($('localeSelect'),'change',()=>{const next=$('localeSelect').value;if(!dictionaries[next])return;locale=next;storage.set('weightPlayLocale',locale);window.WonderI18n?.setLocale?.(locale,{navigate:false,dispatch:false});const segment=Object.keys(segments).find(k=>segments[k]===locale);const preview=new URLSearchParams(location.search).get('preview')==='1'?'?preview=1':'';history.replaceState(history.state,'',`/${segment}/games/animal-meadow-difference/${preview}`);translate();});
  listen(window,'pagehide',e=>{if(e.persisted)return;cancelEffects();cancelAnimationFrame(renderFrame);resize.disconnect();stageUI?.destroy?.();world?.destroy();abort.abort();});
  window.WeightPlayAudio?.preload(['game.start','feedback.success','feedback.error','feedback.hint','result.win']);translate();changeScreen('main');window.WeightPlayGameEntryLoader?.ready?.();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
