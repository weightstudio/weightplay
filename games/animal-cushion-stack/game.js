(() => {
  'use strict';
  const base=new URL('.',document.currentScript.src);
  const $=id=>document.getElementById(id);
  const LEGACY='weightplay-animal-cushion-stack-campaign-v1';
  const SAVE='weightplay-animal-cushion-stack-atelier-v2';
  const localeMap={en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
  const localeLabels={en:'English','zh-Hant':'繁體中文','zh-Hans':'简体中文',ja:'日本語',ko:'한국어',es:'Español','pt-BR':'Português',fr:'Français',de:'Deutsch',it:'Italiano',ru:'Русский',hi:'हिन्दी',ar:'العربية'};
  const en=window.CUSHION_ATELIER_BASE_COPY.en,zh=window.CUSHION_ATELIER_BASE_COPY['zh-Hant'];
  let locale=localeMap[location.pathname.split('/')[1]] || (()=>{try{return localStorage.getItem('weightPlayLocale');}catch{return null;}})() || 'en';
  const state={screen:'main',index:0,browse:0,core:null,view:null,save:null,run:null,selector:null,frame:null,modal:null,raf:0,last:0,ready:false,storage:true,buying:false,confirmBuy:false,lifecycle:null};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const t=(key,vars={})=>{let s=window.CUSHION_ATELIER_LOCALES?.[locale]?.[key]||(locale.startsWith('zh')?zh[key]:null)||(key==='title'?window.CUSHION_LOCALES?.[locale]?.title:null)||en[key]||key;for(const [k,v] of Object.entries(vars))s=s.replaceAll(`{${k}}`,String(v));return s;};
  const audio=window.WeightPlayAudio?.createScope();
  const sound=id=>audio?.play(id);
  const read=key=>{try{return JSON.parse(localStorage.getItem(key)||'null');}catch(e){if(!(e instanceof SyntaxError))state.storage=false;return null;}};
  const persist=(rollback=false)=>{try{
    if(!rollback)state.save=state.core.mergeSaves(state.save,state.core.normalizeSave(read(SAVE)));
    localStorage.setItem(SAVE,JSON.stringify(state.save));return true;
  }catch{state.storage=false;return false;}};
  const stageName=s=>locale.startsWith('zh')?s.zh:locale==='en'?s.name:`${t('arc'+s.arc)} · ${s.id}`;
  const stageInfo=s=>`${t('goal',{n:s.layers})} · ${t('arc'+s.arc)}`;
  const canPlay=()=>state.ready&&state.screen==='battle'&&!state.modal&&!document.hidden&&!document.querySelector('.wp-shell-settings-button[aria-expanded="true"]')&&(state.lifecycle?.active??true);
  function copyUI(){
    document.documentElement.lang=locale==='zh-Hant'?'zh-TW':locale;
    document.documentElement.dir=locale==='ar'?'rtl':'ltr';
    document.title=`${t('title')} | WeightPlay`;
    document.querySelectorAll('[data-copy]').forEach(n=>{n.textContent=t(n.dataset.copy);});
    $('localeSelect').value=locale;
    $('mainProgress').textContent=t('progress',{n:state.save?.unlocked||1});
    $('bestValue').textContent=String(state.save?.stars.reduce((a,b)=>a+b,0)||0)+' / 90';
    $('stageBackBtn').setAttribute('aria-label',t('back'));
    $('battleBackBtn').setAttribute('aria-label',t('pause'));
    $('mainReturnBtn').setAttribute('aria-label',t('lobbyReturn'));
    $('helpBtn').setAttribute('aria-label',t('help'));
    $('arena').setAttribute('aria-label',t('helpText'));
    for(let i=0;i<3;i++){$(`materialName${i}`).textContent=t(['felt','linen','cloud'][i]);$(`materialNote${i}`).textContent=t(['feltNote','linenNote','cloudNote'][i]);}
    state.selector?.refresh(state.browse);
    if(state.run)updateHUD();
    if(state.screen==='result')renderResult();
  }
  function stop(){cancelAnimationFrame(state.raf);state.raf=0;state.last=0;}
  function startLoop(){if(!state.raf&&canPlay())state.raf=requestAnimationFrame(frame);}
  function show(name){
    stop();audio?.stop();closeModal(false);state.screen=name;
    const scene=name==='stages'?'stage':name==='result'?'battle':name;
    for(const key of ['main','stage','battle'])$(`${key}Screen`).hidden=key!==scene;
    $('battlePlay').inert=name==='result';$('battlePlay').hidden=name==='result';$('resultScreen').hidden=name!=='result';
    document.querySelector('[data-wp-game-guide]').hidden=name!=='main';
    document.body.dataset.screen=name==='stages'?'stage':name;
    state.frame?.activate(scene);state.lifecycle?.setPaused('scene-away',name!=='battle');
    copyUI();if(name==='battle'){state.view?.resize();startLoop();}
  }
  function map(){state.browse=Math.max(0,state.save.unlocked-1);show('stages');state.selector?.refresh(state.browse);}
  function stageStart(index){
    if(!state.ready||index<0||index>=state.save.unlocked)return;
    state.index=index;state.browse=index;
    $('contactToast').classList.remove('show');$('contactToast').textContent='';
    const s=state.core.STAGES[index];
    state.run={stage:index,goal:s.layers,time:0,phase:'aim',phaseTime:0,material:0,score:0,perfects:0,misses:0,combo:0,placed:[],
      supportX:0,supportWidth:s.base,x:-2.6,width:s.base*.96,target:0,predictedX:-2.6,alignment:0,supportRatio:0,manual:false,won:false,drift:0,committed:false};
    state.view.reset(s,state.save.palette==='moon');
    prepareCushion();show('battle');sound('game.start');
    $('battleStatus').textContent=t('ready');
    if(!state.save.tutorialSeen)openModal('tutorial');
  }
  function prepareCushion(){
    const r=state.run,s=state.core.STAGES[r.stage];
    r.phase='aim';r.phaseTime=0;r.manual=false;
    const required=s.order.length?s.order[r.placed.length%s.order.length]:null;
    r.required=required;
    if(required)r.material=state.core.MATERIALS.findIndex(m=>m.id===required);
    r.width=state.core.nextCushion(r.supportWidth,r.material);
    r.target=state.core.landingTarget(s,r.placed.length,r.supportX);
    r.x=(r.placed.length%2?1:-1)*2.6;
    r.sweepOrigin=r.time;
    updateAim();updateHUD();
  }
  function updateAim(){
    const r=state.run,s=state.core.STAGES[r.stage];
    r.drift=s.wind*(.65+.35*Math.sin(r.time*.6+r.placed.length));
    r.predictedX=state.core.clamp(r.x+r.drift,-3.5,3.5);
    const a=state.core.evaluateLanding({x:r.predictedX,width:r.width,supportX:r.supportX,supportWidth:r.supportWidth,material:r.material,target:r.target});
    r.alignment=Math.max(0,Math.round(100-Math.abs(r.predictedX-r.target)*100));r.supportRatio=a.fraction;
    $('alignmentValue').textContent=String(r.alignment);$('alignmentFill').style.width=`${r.alignment}%`;
    $('alignmentMeter').dataset.good=String(r.alignment>=85);
  }
  function material(index){
    if(!canPlay()||state.run.phase!=='aim')return;
    const r=state.run;
    if(r.required&&state.core.MATERIALS[index].id!==r.required){feedback(`${t('request')}: ${t(r.required)}`,'miss');sound('feedback.error');return;}
    r.material=index;r.width=state.core.nextCushion(r.supportWidth,index);updateAim();updateHUD();sound('ui.click');
  }
  function drop(){
    if(!canPlay()||state.run.phase!=='aim')return;
    const r=state.run;updateAim();r.dropX=r.x;r.landingX=r.predictedX;r.phase='drop';r.phaseTime=0;updateHUD();
  }
  function feedback(message,kind){
    $('battleStatus').textContent=message;$('battleStatus').dataset.kind=kind;
    $('contactToast').textContent=message;$('contactToast').dataset.kind=kind;
    $('contactToast').classList.remove('show');void $('contactToast').offsetWidth;$('contactToast').classList.add('show');
  }
  function contact(){
    const r=state.run;
    const result=state.core.evaluateLanding({x:r.landingX,width:r.width,supportX:r.supportX,supportWidth:r.supportWidth,material:r.material,target:r.target});
    r.phaseTime=0;
    if(!result.success){r.misses++;r.combo=0;r.phase='miss';sound('feedback.error');feedback(t('miss'),'miss');}
    else {
      r.phase='settle';r.combo=result.perfect?r.combo+1:0;r.perfects+=Number(result.perfect);
      const points=state.core.MATERIALS[r.material].points+(result.perfect?75+Math.min(5,r.combo)*25:0);
      r.score+=points;r.placed.push({x:r.landingX,width:r.width,material:r.material,perfect:result.perfect});
      r.supportX=r.landingX;r.supportWidth=r.width;
      sound('impact.soft');if(result.perfect)sound('feedback.success');
      feedback(`${result.perfect?t('perfect'):t('steady')}  +${points}`,result.perfect?'perfect':'steady');
      state.view.burst(r.supportX,.5+(r.placed.length-1)*.65,result.perfect);
    }
    updateHUD();
  }
  function finish(won){
    const r=state.run;if(r.committed)return;r.committed=true;r.won=won;r.phase=won?'win':'lose';r.phaseTime=0;
    if(won){state.save=state.core.recordClear(state.save,r);persist();sound('result.win');}
    else sound('result.lose');
    updateHUD();
  }
  function updateHUD(){
    const r=state.run;if(!r)return;const s=state.core.STAGES[r.stage];
    $('roundLabel').textContent=`${String(s.id).padStart(2,'0')} / 30`;
    $('sessionPicks').textContent=String(r.score);
    $('layerValue').textContent=`${r.placed.length} / ${r.goal}`;
    $('chanceValue').textContent='●'.repeat(3-r.misses)+'○'.repeat(r.misses);
    $('chanceValue').setAttribute('aria-label',`${t('attempts')} ${3-r.misses}`);
    $('sceneName').textContent=stageName(s);
    $('sceneChapter').textContent=`${t('arc'+s.arc)}${s.checkpoint?' · '+t('check'):''}`;
    $('windValue').textContent=s.wind?`${s.wind<0?'←':'→'} ${t('wind')}`:t('calm');
    $('fabricRequest').textContent=r.required?`${t('request')}: ${t(r.required)}`:t('aim');
    $('comboValue').textContent=r.combo>=2?`${t('combo')} ×${r.combo}`:t('controls');
    $('dropBtn').disabled=r.phase!=='aim';
    for(let i=0;i<3;i++){
      const b=$(`material${i}`);b.setAttribute('aria-pressed',String(r.material===i));
      b.setAttribute('aria-disabled',String(r.phase!=='aim'||Boolean(r.required&&state.core.MATERIALS[i].id!==r.required)));
    }
    $('towerProgress').style.width=`${100*r.placed.length/r.goal}%`;
  }
  function frame(time){
    state.raf=0;if(!canPlay()){state.last=0;return;}
    const dt=Math.min(.04,state.last?(time-state.last)/1000:0);state.last=time;
    const r=state.run,s=state.core.STAGES[r.stage];r.time+=dt;r.phaseTime+=dt;
    if(r.phase==='aim'){
      if(!r.manual)r.x=Math.sin((r.time-r.sweepOrigin)*s.speed-Math.PI/2)*2.6*(r.placed.length%2?-1:1);
      updateAim();
    } else if(r.phase==='drop'&&r.phaseTime>=.34)contact();
    else if(r.phase==='settle'&&r.phaseTime>=.3){if(r.placed.length>=r.goal)finish(true);else prepareCushion();}
    else if(r.phase==='miss'&&r.phaseTime>=.45){if(r.misses>=3)finish(false);else prepareCushion();}
    else if((r.phase==='win'||r.phase==='lose')&&r.phaseTime>=.85){show('result');renderResult();return;}
    state.view.render(r,dt,reduced.matches);
    state.raf=requestAnimationFrame(frame);
  }
  function renderResult(){
    const r=state.run;if(!r)return;const stars=state.core.starsFor(r);
    $('resultHeading').textContent=r.won?(r.stage===29?t('final'):t('win')):t('lose');
    $('resultKicker').textContent=`${String(r.stage+1).padStart(2,'0')} / 30 · ${stageName(state.core.STAGES[r.stage])}`;
    $('resultText').textContent=state.storage?(r.won?t('winNote'):t('loseNote')):t('storage');
    $('resultStars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);
    $('resultStars').setAttribute('aria-label',`${stars} / 3 ${t('stars')}`);
    $('resultScore').textContent=String(r.score);$('resultPerfects').textContent=`${r.perfects} / ${r.goal}`;
    $('resultBest').textContent=String(state.save.bests[r.stage]);
    $('resultNextBtn').disabled=!r.won||r.stage===29;
    $('resultScreen').dataset.outcome=r.won?'win':'lose';
    $('resultMapBtn').focus({preventScroll:true});
  }
  let focusBefore=null,pointerId=null;
  function openModal(kind){
    if(state.modal)return;state.modal=kind;focusBefore=document.activeElement;stop();audio?.stop();
    state.lifecycle?.setPaused('game-modal',true);
    const inStage=state.screen==='stages',dialog=inStage?$('studioDialog'):$('playDialog');
    $(inStage?'stageScreen':'battleScreen').querySelector('header').inert=true;
    if(inStage){renderStudio();$('stagePage').inert=true;}
    else {
      $('battlePlay').inert=true;
      $('dialogTitle').textContent=t(kind==='pause'?'leaveTitle':kind==='tutorial'?'tutorial':'help');
      $('dialogText').textContent=t(kind==='pause'?'leaveText':'helpText');
      $('dialogContinue').textContent=t(kind==='pause'?'continue':kind==='tutorial'?'startBuild':'close');
      $('dialogLeave').hidden=kind!=='pause';
    }
    dialog.hidden=false;dialog.querySelector('button').focus({preventScroll:true});
  }
  function closeModal(resume=true){
    const kind=state.modal;state.modal=null;
    $('playDialog').hidden=true;$('studioDialog').hidden=true;$('battlePlay').inert=state.screen==='result';$('stagePage').inert=false;
    $('stageScreen').querySelector('header').inert=false;$('battleScreen').querySelector('header').inert=false;
    if(kind==='tutorial'){state.save.tutorialSeen=true;persist();}
    state.lifecycle?.setPaused('game-modal',false);
    if(resume){focusBefore?.focus({preventScroll:true});startLoop();}
  }
  function renderStudio(){
    $('diamondBalance').textContent=String(window.WeightPlayWallet?.read().diamonds||0);
    $('gardenBtn').textContent=t(state.save.palette==='garden'?'equipped':'equip');
    $('moonBtn').textContent=t(state.save.moonOwned?(state.save.palette==='moon'?'equipped':'equip'):(state.confirmBuy?'confirmBuy':'buy'));
    $('moonDetail').textContent=t(state.save.moonOwned?'owned':'permanent');
    $('moonBtn').disabled=state.buying||!state.storage;
  }
  async function moonPurchase(){
    if(state.buying)return;
    if(state.save.moonOwned){state.save.palette='moon';persist();renderStudio();return;}
    if(!state.confirmBuy){state.confirmBuy=true;renderStudio();return;}
    state.buying=true;renderStudio();
    const transact=()=>{
      try {
        const latest=state.core.normalizeSave(read(SAVE));
        if(latest.moonOwned){state.save={...latest,palette:'moon'};persist();return;}
        if(!state.storage||!persist())throw Error('storage');
        if(window.WeightPlayWallet.read().diamonds<12){$('studioStatus').textContent=t('insufficient');sound('feedback.error');return;}
        // Save delivery first; a refused/failed debit rolls it back. No paid item can be lost after debit.
        state.save.moonOwned=true;state.save.palette='moon';
        if(!persist()){state.save.moonOwned=false;state.save.palette='garden';throw Error('storage');}
        try {if(!window.WeightPlayWallet.spendDiamonds(12))throw Error('balance');}
        catch(e){state.save.moonOwned=false;state.save.palette='garden';persist(true);if(e.message==='balance'){$('studioStatus').textContent=t('insufficient');return;}throw e;}
        $('studioStatus').textContent=t('purchased');sound('shop.purchase');
      } catch {state.storage=false;$('studioStatus').textContent=t('storage');}
    };
    try{if(navigator.locks)await navigator.locks.request('weightplay-cushion-purchase',transact);else transact();}
    finally{state.buying=false;state.confirmBuy=false;renderStudio();}
  }
  function bind(){
    $('startBtn').addEventListener('click',map);$('stageBackBtn').addEventListener('click',()=>show('main'));
    $('battleBackBtn').addEventListener('click',()=>state.screen==='result'?map():openModal('pause'));
    $('dropBtn').addEventListener('click',drop);$('helpBtn').addEventListener('click',()=>openModal('help'));
    for(let i=0;i<3;i++)$(`material${i}`).addEventListener('click',()=>material(i));
    $('resultMapBtn').addEventListener('click',map);$('resultNextBtn').addEventListener('click',()=>{if(state.run.won&&state.index<29)stageStart(state.index+1);});
    $('resultReplayBtn').addEventListener('click',()=>stageStart(state.index));
    $('dialogContinue').addEventListener('click',()=>closeModal());$('dialogLeave').addEventListener('click',map);
    $('atelierBtn').addEventListener('click',()=>{state.confirmBuy=false;openModal('studio');});$('studioClose').addEventListener('click',()=>closeModal());
    $('gardenBtn').addEventListener('click',()=>{state.save.palette='garden';persist();renderStudio();});$('moonBtn').addEventListener('click',moonPurchase);
    $('localeSelect').replaceChildren(...Object.entries(localeLabels).map(([key,label])=>{const o=document.createElement('option');o.value=key;o.textContent=label;return o;}));
    $('localeSelect').addEventListener('change',e=>{locale=e.target.value;try{localStorage.setItem('weightPlayLocale',locale);}catch{}copyUI();});
    const arena=$('arena');
    arena.addEventListener('pointerdown',e=>{if(!canPlay()||state.run.phase!=='aim'||pointerId!==null)return;pointerId=e.pointerId;arena.setPointerCapture(pointerId);state.run.manual=true;aimPointer(e);});
    function aimPointer(e){state.run.x=state.core.clamp(state.view.inputX(e.clientX)-state.run.drift,-3.4,3.4);updateAim();}
    arena.addEventListener('pointermove',e=>{if(e.pointerId===pointerId&&canPlay())aimPointer(e);});
    arena.addEventListener('pointerup',e=>{if(e.pointerId!==pointerId)return;pointerId=null;if(canPlay()){aimPointer(e);drop();}});
    arena.addEventListener('pointercancel',()=>{pointerId=null;});arena.addEventListener('lostpointercapture',()=>{pointerId=null;});
    document.addEventListener('keydown',e=>{
      if(state.modal){
        if(e.key==='Escape'){e.preventDefault();closeModal();return;}
        if(e.key==='Tab'){const d=state.modal==='studio'?$('studioDialog'):$('playDialog');const buttons=[...d.querySelectorAll('button:not(:disabled)')].filter(b=>!b.hidden);const i=buttons.indexOf(document.activeElement);if((e.shiftKey&&i<=0)||(!e.shiftKey&&i===buttons.length-1)){e.preventDefault();buttons[e.shiftKey?buttons.length-1:0].focus();}}return;
      }
      if(!canPlay()||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
      if(e.key==='Escape'){e.preventDefault();openModal('pause');return;}
      if(['ArrowLeft','ArrowRight','a','d'].includes(e.key)&&state.run.phase==='aim'){e.preventDefault();state.run.manual=true;state.run.x=state.core.clamp(state.run.x+(['ArrowLeft','a'].includes(e.key)?-.12:.12),-3.4,3.4);updateAim();}
      if(e.code==='Space'&&!e.repeat&&e.target.tagName!=='BUTTON'){e.preventDefault();drop();}
      if(['1','2','3'].includes(e.key))material(Number(e.key)-1);
    });
    document.addEventListener('visibilitychange',()=>{pointerId=null;if(document.hidden)stop();else startLoop();});
    window.addEventListener('blur',()=>{pointerId=null;});
    const settingsObserver=new MutationObserver(()=>{if(canPlay())startLoop();else stop();});
    settingsObserver.observe(document.body,{attributes:true,attributeFilter:['aria-expanded'],subtree:true});
    window.addEventListener('pagehide',e=>{stop();if(!e.persisted){settingsObserver.disconnect();state.lifecycle?.dispose();state.view?.dispose();audio?.dispose();}},{once:true});
    window.addEventListener('pageshow',()=>startLoop());
  }
  function registerLifecycle(){if(!window.WeightPlayLifecycle)return;state.lifecycle=window.WeightPlayLifecycle.register('animal-cushion-stack',{background:'pause',onStateChange:active=>{if(active)startLoop();else stop();}});state.lifecycle.setPaused('scene-away',state.screen!=='battle');}
  window.addEventListener('weightplay:lifecycle-ready',registerLifecycle,{once:true});
  window.AnimalCushionStackI9=Object.freeze({
    get selectedStage(){return state.browse;},get stageCount(){return 30;},get screen(){return state.screen;},
    stageRecord(i){const s=state.core?.STAGES[i];if(!s)return {id:i+1,kicker:`${i+1} / 30`,title:'',subtitle:'',summary:'',details:[],poster:'/assets/interface7-redrawn/animal-cushion-stack.webp',locked:i>0,cleared:false};
      return {id:s.id,kicker:`${t('chapter')} ${s.arc+1} · ${String(s.id).padStart(2,'0')}`,title:stageName(s),subtitle:stageInfo(s),
        status:i>=state.save.unlocked?'🔒':state.save.stars[i]?'★'.repeat(state.save.stars[i]):state.save.cleared[i]?t('saved'):'',summary:stageInfo(s),details:[t('arc'+s.arc)],poster:'/assets/interface7-redrawn/animal-cushion-stack.webp',locked:i>=state.save.unlocked,cleared:state.save.cleared[i]};},
    selectStage(i){state.browse=Math.max(0,Math.min(29,Math.round(i)));},startStage:stageStart,
    setStageSelector(s){state.selector=s;},setFrame(f){state.frame=f;show(state.screen);},
    // Read-only diagnostics for bounded engine/resource regression, never gameplay mutation.
    diagnostics(){return {ready:state.ready,screen:state.screen,phase:state.run?.phase,clock:state.run?.time,renderer:state.view?.stats()};},
  });
  bind();copyUI();$('startBtn').disabled=true;registerLifecycle();
  async function init(){
    window.WeightPlayGameEntryLoader?.begin(3);
    try {
      state.core=await import(new URL('stack-core.mjs?v=14',base));window.WeightPlayGameEntryLoader?.assetProgress(1,3);
      const {StackView}=await import(new URL('stack-view.mjs?v=14',base));window.WeightPlayGameEntryLoader?.assetProgress(2,3);
      state.save=state.core.normalizeSave(read(SAVE),read(LEGACY));
      if(!read(SAVE)&&!read(LEGACY)){
        const old=read('weightplay-animal-cushion-stack-best-v2');
        if(Number(old)>0){state.save.unlocked=4;state.save.cleared.fill(true,0,3);}
      }
      state.view=new StackView($('arena'),()=>{state.ready=false;stop();window.WeightPlayGameEntryLoader?.fail(t('engine'),()=>location.reload());});
      const thumbs=state.view.thumbnails();for(let i=0;i<3;i++)$(`materialArt${i}`).src=thumbs[i];$('gardenPreview').src=thumbs[0];$('moonPreview').src=thumbs[3];
      const poster=document.querySelector('[data-wp-frame-poster]');if(poster&&!poster.complete)await new Promise((resolve,reject)=>{poster.addEventListener('load',resolve,{once:true});poster.addEventListener('error',reject,{once:true});});
      state.ready=true;$('startBtn').disabled=false;copyUI();window.WeightPlayGameEntryLoader?.assetProgress(3,3);window.WeightPlayGameEntryLoader?.ready();
      window.WeightPlayAudio?.preload(['impact.soft','feedback.success','feedback.error','game.start','result.win','result.lose','shop.purchase']);
    }catch(e){console.error('Cushion Stack initialization failed',e);window.WeightPlayGameEntryLoader?.fail(t('engine'),()=>location.reload());}
  }
  void init();
})();
