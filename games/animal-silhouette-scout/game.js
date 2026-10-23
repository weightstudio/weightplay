(() => {
  'use strict';
  const M = window.SilhouetteScoutModel, locales = window.ANIMAL_SILHOUETTE_SCOUT_LOCALES;
  const $ = id => document.getElementById(id);
  const poster = '/assets/interface7-redrawn/animal-silhouette-scout.webp';
  const atlas = '/games/animal-silhouette-scout/assets/scout-field-atlas-v10.webp';
  const forest = '/games/animal-silhouette-scout/assets/scout-clearing-v10.webp';
  const routeLocales = {en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
  function loadProgress() { try {return M.normalize(JSON.parse(localStorage.getItem(M.saveKey)));} catch {return M.normalize(null);} }
  function persist(progress) {localStorage.setItem(M.saveKey, JSON.stringify(progress));}
  function initialLocale() {
    const route = routeLocales[location.pathname.split('/')[1]];
    if (route) return route;
    try {return localStorage.getItem('weightPlayLocale') || localStorage.getItem('weightplayLocale') || 'en';} catch {return 'en';}
  }
  const state = {locale:initialLocale(),progress:loadProgress(),screen:'main',index:0,selected:[],options:[],checks:0,assisted:false,settled:false,lensUsed:false,result:null,saved:true};
  let frame, selector, browse=0, generation=0, resultTimer=0, previewTimer=0;
  const animations=new Set(), flights=new Set(), sounds=new Set(), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const t = (key, vars={}) => {
    let value=locales[state.locale]?.[key] || locales.en[key] || key;
    for(const [name,replacement] of Object.entries(vars)) value=value.replaceAll(`{${name}}`,String(replacement));
    return value;
  };
  const round=()=>M.rounds[state.index];
  function sound(id) {
    const handle=window.WeightPlayAudio?.play(id);
    if(handle){sounds.add(handle);Promise.resolve(handle.ended).finally(()=>sounds.delete(handle));}
  }
  function animate(node,frames,duration=180) {
    if(!node?.animate || reduced.matches) return;
    const animation=node.animate(frames,{duration,easing:'cubic-bezier(.2,.8,.2,1)'});
    animations.add(animation);animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));
  }
  function cancelEffects() {
    generation++;clearTimeout(resultTimer);clearTimeout(previewTimer);
    animations.forEach(a=>a.cancel());animations.clear();flights.forEach(n=>n.remove());flights.clear();
    sounds.forEach(h=>h.stop());sounds.clear();$('silhouette').classList.remove('is-preview');
  }
  function sprite(id,className='') {
    const node=document.createElement('span');node.className=`scout-sprite sprite-${id} ${className}`;node.setAttribute('aria-hidden','true');return node;
  }
  function progressUI() {
    const count=state.progress.cleared.length;
    $('progress').textContent=`${t('lookouts')}: ${count} / 30`;
    $('mainProgress').textContent=`${t('lookouts')}: ${count} / 30 · ${t('journal')}: ${state.progress.discovered.length} / 12`;
    $('discoveryCount').textContent=`${state.progress.discovered.length} / 12`;
    $('discoveryCount').setAttribute('aria-label',`${t('journal')}: ${state.progress.discovered.length} / 12`);
  }
  function show(screen) {
    cancelEffects();state.screen=screen;const scene=screen==='result'?'battle':screen;
    for(const key of ['main','stage','battle']) $(`${key}Screen`).hidden=scene!==key;
    $('gameGuide').hidden=screen!=='main';$('battlePlayWorkspace').hidden=screen==='result';$('battlePlayWorkspace').inert=screen==='result';
    $('resultScreen').hidden=screen!=='result';document.body.dataset.screen=screen;frame?.activate(scene);progressUI();
    if(scene==='stage') renderStages();
  }
  function stageRecord(index) {
    const r=M.rounds[index], mastery=state.progress.mastery[r.id]||0;
    let rewardState='unknown';
    try{if(window.WeightPlayCastle?.read().completions?.[`animal-silhouette-scout:stage-${r.id}`])rewardState='collected';}catch{}
    return {id:r.id,kicker:t('round',{n:r.id,total:30}),title:t(`mode_${r.mode}`),subtitle:`${r.arc} / 6`,
      status:index>=state.progress.unlocked?t('locked'):mastery?`${t('complete')} · ${'★'.repeat(mastery)}`:t('open'),
      summary:t(`rule_${r.mode}`),details:[t('masteryHelp'),t('lookCloser')],locked:index>=state.progress.unlocked,cleared:state.progress.cleared.includes(r.id),poster,rewardState};
  }
  function renderStages() {
    if(!selector) selector=window.WeightPlayPlayUI.mountStage({page:$('stageWorkspace'),rail:$('stageList'),selected:browse,
      config:{gameId:'animal-silhouette-scout',count:30,poster,background:'/assets/lobby-block-atmosphere.svg',stage:stageRecord},
      isActive:()=>state.screen==='stage'&&!document.querySelector('dialog[open]'),onSelect(index){browse=index;},onStart:startRound});
    else selector.refresh(browse);
  }
  function openStages(){show('stage');}
  function updateSelection() {
    for(const button of $('choiceGrid').children){
      const index=state.selected.indexOf(button.dataset.animal);button.setAttribute('aria-pressed',String(index>=0));
      button.querySelector('.choice-order').textContent=index<0?'':round().mode==='sequence'?String(index+1):'✓';button.disabled=state.settled;
    }
    $('checkBtn').disabled=state.settled||state.selected.length!==round().targets.length;
    $('clearBtn').disabled=state.settled||!state.selected.length;$('hintBtn').disabled=state.settled;
    $('checkCount').textContent=t('checks',{n:state.checks});
  }
  function choose(animal,node) {
    if(state.screen!=='battle'||state.settled)return;
    const at=state.selected.indexOf(animal);
    if(at>=0)state.selected.splice(at,1);
    else if(round().targets.length===1)state.selected=[animal];
    else if(state.selected.length<round().targets.length)state.selected.push(animal);
    else {$('battleStatus').textContent=t('selectionFull');sound('feedback.error');return;}
    updateSelection();sound('card.place');$('battleStatus').textContent=t('selectionCount',{n:state.selected.length,total:round().targets.length});
    animate(node,[{transform:'scale(.96)'},{transform:'scale(1)'}],140);
  }
  function renderBattle() {
    const r=round();$('roundLabel').textContent=`${r.id} / 30`;$('roundName').textContent=t(`mode_${r.mode}`);
    $('targetLabel').textContent=t(`mode_${r.mode}`);$('ruleText').textContent=t(`rule_${r.mode}`);$('clue').textContent=t('lookCloser');
    $('silhouette').className=`silhouette mode-${r.mode}`;$('silhouette').style.setProperty('--target-count',r.targets.length);
    $('silhouette').replaceChildren(...r.targets.map((id,index)=>{
      const target=document.createElement('div');target.className='target-animal';target.append(sprite(id,'target-sprite'));
      if(r.mode==='sequence'){const order=document.createElement('span');order.className='target-order';order.textContent=String(index+1);target.append(order);}
      target.setAttribute('role','img');target.setAttribute('aria-label',t('outlineNumber',{n:index+1}));return target;
    }));
    $('choiceGrid').style.setProperty('--choice-count',state.options.length);
    $('choiceGrid').replaceChildren(...state.options.map(id=>{
      const button=document.createElement('button');button.type='button';button.className='choice-btn';button.dataset.animal=id;
      const label=document.createElement('strong');label.textContent=t(id);const order=document.createElement('span');order.className='choice-order';order.setAttribute('aria-hidden','true');
      button.append(sprite(id),label,order);button.addEventListener('click',()=>choose(id,button));return button;
    }));updateSelection();
  }
  function startRound(index) {
    if(!Number.isInteger(index)||index<0||index>=30||index>=state.progress.unlocked)return;
    state.index=index;browse=index;state.selected=[];state.checks=0;state.assisted=false;state.settled=false;state.lensUsed=false;
    state.result=null;state.options=M.shuffle(round().options);$('clue').hidden=true;$('hintBtn').setAttribute('aria-expanded','false');
    show('battle');renderBattle();$('battleStatus').textContent=t('selectionCount',{n:0,total:round().targets.length});
    window.WonderAnalytics?.track('stage_start',{game_id:'animal-silhouette-scout',stage_id:round().id});
    sound('game.start');animate($('silhouette'),[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}]);
    $('choiceGrid').querySelector('button')?.focus({preventScroll:true});
  }
  function flyDiscovery() {
    if(reduced.matches||!state.result.newlyDiscovered.length)return;
    const from=$('silhouette').getBoundingClientRect(),to=$('discoveryCount').getBoundingClientRect(),node=sprite(state.result.newlyDiscovered[0],'discovery-flight');
    Object.assign(node.style,{left:`${from.x+from.width/2-28}px`,top:`${from.y+from.height/2-28}px`});document.body.append(node);flights.add(node);
    animate(node,[{opacity:1,transform:'translate(0,0) scale(1)'},{opacity:.25,transform:`translate(${to.x+to.width/2-from.x-from.width/2}px,${to.y+to.height/2-from.y-from.height/2}px) scale(.3)`}],440);
  }
  function check() {
    if(state.screen!=='battle'||state.settled||state.selected.length!==round().targets.length)return;
    state.checks++;
    if(!M.matches(round(),state.selected)){
      const selected=[...$('choiceGrid').querySelectorAll('[aria-pressed="true"]')], wrongOrder=round().mode==='sequence'&&round().targets.every(id=>state.selected.includes(id));
      state.selected=[];updateSelection();sound('feedback.error');$('battleStatus').textContent=t(wrongOrder?'rule_sequence':'tryAgain');
      selected.forEach(node=>animate(node,[{transform:'translateX(0)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],220));return;
    }
    state.settled=true;state.result=M.complete(state.progress,round(),state.checks,state.assisted);state.progress=state.result.progress;state.saved=true;
    try{persist(state.progress);}catch{state.saved=false;}
    if(state.saved)state.result.platformReward=window.WonderAnalytics?.completeStage(round().id);
    updateSelection();progressUI();$('battleStatus').textContent=t('correct');$('silhouette').classList.add('is-revealed');sound('puzzle.match');flyDiscovery();
    const ownGeneration=generation;resultTimer=setTimeout(()=>{if(generation===ownGeneration&&state.screen==='battle')showResult();},reduced.matches?120:600);
  }
  function renderResult() {
    $('resultTitle').textContent=t(state.progress.cleared.length===30?'resultTitle':'resultPartial');
    $('resultText').textContent=t('roundResult',{n:state.checks,count:state.progress.cleared.length});
    $('resultStars').textContent='★'.repeat(state.result.rating)+'☆'.repeat(3-state.result.rating);$('resultStars').setAttribute('aria-label',t('masteryCount',{n:state.result.rating}));
    $('resultDiscovery').textContent=state.result.newlyDiscovered.length?`${t('newDiscovery')}: ${state.result.newlyDiscovered.map(id=>t(id)).join(' · ')}`:t('masteryHelp');
    $('saveNotice').hidden=state.saved;$('resultPrimaryBtn').disabled=state.index===29;$('resultPrimaryBtn').textContent=t('next');
    window.WeightPlayScreenFrame?.showResultGet('animal-silhouette-scout',state.result.platformReward?.credited===true);
  }
  function showResult() {
    show('result');renderResult();sound(round().checkpoint?'game.checkpoint':'result.win');
    animate($('resultCard'),[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}]);
    (state.index===29?$('resultMapBtn'):$('resultPrimaryBtn')).focus({preventScroll:true});
  }
  function hint() {
    if(state.screen!=='battle'||state.settled)return;
    state.assisted=true;$('clue').hidden=!$('clue').hidden;$('hintBtn').setAttribute('aria-expanded',String(!$('clue').hidden));
    $('battleStatus').textContent=t('hintUsed');sound('feedback.hint');
    if(state.progress.lens&&!state.lensUsed){state.lensUsed=true;$('silhouette').classList.add('is-preview');const ownGeneration=generation;
      previewTimer=setTimeout(()=>{if(generation===ownGeneration)$('silhouette').classList.remove('is-preview');},1600);}
  }
  function showDialog(id){sound('ui.open');$(id).showModal();animate($(id),[{opacity:0},{opacity:1}],160);}
  function collectionSlot(item,id,collected) {
    const status=document.createElement('span');status.dataset.wpItemCollectionStatus='';
    const icon=document.createElement('span');icon.dataset.wpItemCollectionIcon='';const label=document.createElement('span');label.dataset.wpItemCollectionLabel='';status.append(icon,label);item.append(status);
    window.WeightPlayScreenFrame.setItemCollectionStatus(item,{itemId:id,state:collected?'collected':state.progress.discoveryHistoryKnown?'not-collected':'unknown',labels:{collected:t('discovered'),'not-collected':t('undiscovered'),unknown:t('historyUnknown')}});
  }
  function renderJournal() {
    $('journalSummary').textContent=`${state.progress.discovered.length} / 12 · ${Object.values(state.progress.mastery).reduce((sum,n)=>sum+n,0)} / 90 ★`;
    $('journalGrid').replaceChildren(...M.animals.map(id=>{
      const item=document.createElement('article');item.className='journal-item';const found=state.progress.discovered.includes(id),name=document.createElement('strong');name.textContent=t(id);
      item.append(sprite(id,found?'':'undiscovered-art'),name);collectionSlot(item,id,found);return item;
    }));
  }
  function renderGear() {
    let balance=0;try{balance=window.WeightPlayWallet?.read().diamonds||0;}catch{}
    $('diamondBalance').textContent=String(balance);$('buyLensBtn').textContent=state.progress.lens?t('owned'):t('buyLens',{n:M.lensCost});$('buyLensBtn').disabled=state.progress.lens;
    $('gearStatus').textContent=state.progress.lens?t('lensReady'):t('optionalLens');
  }
  function buyLens() {
    let result;
    try{result=M.purchaseLens({readProgress:loadProgress,saveProgress:persist,wallet:window.WeightPlayWallet});}catch{result={status:'storage',progress:state.progress};}
    state.progress=result.progress;renderGear();$('gearStatus').textContent=t(result.status==='insufficient'?'insufficient':result.status==='storage'?'saveFailed':'lensReady');
    sound(result.status==='purchased'?'shop.purchase':result.status==='owned'?'ui.tick':'feedback.error');
  }
  function applyLocale() {
    if(!locales[state.locale])state.locale='en';document.documentElement.lang=state.locale;document.documentElement.dir=state.locale==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-copy]').forEach(node=>node.textContent=t(node.dataset.copy));document.querySelectorAll('[data-copy-aria]').forEach(node=>node.setAttribute('aria-label',t(node.dataset.copyAria)));
    $('localeSelect').value=state.locale;$('localeSelect').setAttribute('aria-label',t('language'));$('mainPoster').alt=t('coverAlt');$('choiceGrid').setAttribute('aria-label',t('animalChoices'));
    $('stageList').setAttribute('aria-label',t('stageSelector'));$('gameGuide').setAttribute('aria-label',t('gameInfo'));progressUI();
    if(state.screen==='stage')renderStages();if(state.screen==='battle'||state.screen==='result')renderBattle();if(state.screen==='result')renderResult();renderGear();if($('journalDialog').open)renderJournal();
  }
  $('startBtn').onclick=()=>{if(state.saved)state.progress=loadProgress();browse=Math.min(29,state.progress.unlocked-1);openStages();};
  $('stageBackBtn').onclick=()=>show('main');$('battleBackBtn').onclick=()=>state.settled?openStages():showDialog('pauseDialog');
  $('resumeBtn').onclick=()=>$('pauseDialog').close();$('leaveBtn').onclick=()=>{$('pauseDialog').close();openStages();};
  $('resultMapBtn').onclick=openStages;$('resultPrimaryBtn').onclick=()=>{if(state.screen==='result'&&state.index<29)startRound(state.index+1);};
  $('resultReplayBtn').onclick=()=>{if(state.screen==='result')startRound(state.index);};$('checkBtn').onclick=check;$('hintBtn').onclick=hint;
  $('clearBtn').onclick=()=>{if(!state.settled){state.selected=[];updateSelection();$('battleStatus').textContent=t('selectionCount',{n:0,total:round().targets.length});sound('puzzle.clear');}};
  $('journalBtn').onclick=()=>{renderJournal();showDialog('journalDialog');};$('gearBtn').onclick=()=>{renderGear();showDialog('gearDialog');};
  $('stageTabButton').onclick=()=>selector?.refresh(browse);$('buyLensBtn').onclick=buyLens;
  document.querySelectorAll('[data-close-dialog]').forEach(button=>button.onclick=()=>{button.closest('dialog').close();sound('ui.close');});
  $('localeSelect').onchange=event=>{state.locale=event.target.value;try{localStorage.setItem('weightPlayLocale',state.locale);localStorage.setItem('weightplayLocale',state.locale);}catch{}
    applyLocale();window.dispatchEvent(new CustomEvent('wonder:locale-change',{detail:{locale:state.locale}}));};
  $('resultScreen').addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;const buttons=[...$('resultScreen').querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)return;cancelEffects();if(state.settled&&state.screen==='battle'){show('result');renderResult();}});
  reduced.addEventListener('change',()=>{cancelEffects();if(state.settled&&state.screen==='battle')showResult();});
  window.addEventListener('pagehide',event=>{cancelEffects();if(!event.persisted)selector?.destroy();});
  window.addEventListener('storage',event=>{if(event.key===M.saveKey&&state.screen!=='battle'){state.progress=loadProgress();progressUI();if(state.screen==='stage')renderStages();}if(event.key===window.WeightPlayWallet?.key)renderGear();});
  applyLocale();frame=window.mountAnimalSilhouetteScoutFrame();show('main');
  Promise.all([poster,atlas,forest,'/assets/weightplay-character-moon-cap-owl-block-v1.webp'].map(src=>{const image=new Image();image.src=src;return image.decode();}))
    .then(()=>{window.WeightPlayGameEntryLoader?.ready();window.addEventListener('load',()=>window.WeightPlayGameEntryLoader?.ready(),{once:true});})
    .catch(()=>window.WeightPlayGameEntryLoader?.fail());
})();
