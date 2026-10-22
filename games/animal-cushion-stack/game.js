(() => {
  'use strict';
  const base=new URL('.',document.currentScript.src);
  const $=id=>document.getElementById(id);
  const LEGACY='weightplay-animal-cushion-stack-campaign-v1';
  const SAVE='weightplay-animal-cushion-stack-atelier-v2';
  const localeMap={en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
  const localeLabels={en:'English','zh-Hant':'繁體中文','zh-Hans':'简体中文',ja:'日本語',ko:'한국어',es:'Español','pt-BR':'Português',fr:'Français',de:'Deutsch',it:'Italiano',ru:'Русский',hi:'हिन्दी',ar:'العربية'};
  const en={
    title:'Cushion Stack',kicker:'TARO’S CLOUD ATELIER',intro:'A little balance. A tower of possibilities.',
    summary:'Build real cushion towers across 30 handcrafted lookouts. Find your rhythm, follow the wind, and land that perfect stack.',start:'Start Game',
    stages:'Choose a lookout',stageMap:'Stages',back:'Back',lobbyReturn:'Return to WeightPlay',best:'Stars collected',noBest:'0',
    felt:'Moss felt',linen:'Golden linen',cloud:'Rose cloud',feltNote:'Forgiving',linenNote:'Precise · +45%',cloudNote:'Wide · +20%',
    drop:'Drop cushion',aim:'Drag to aim · release to drop',ready:'Align with the glowing landing mark',perfect:'PERFECT!',steady:'Soft landing',miss:'Too little support. Try closer to the tower.',
    score:'Score',layers:'Layers',attempts:'Chances',alignment:'Alignment',combo:'Combo',wind:'Wind',calm:'Calm air',
    next:'Next stage',replay:'Replay',win:'A little higher!',final:'Your sky palace is ready!',lose:'Every tower starts again.',
    winNote:'Your lookout is saved. Keep building or chase another star.',loseNote:'Your earlier clears are safe. Try a gentler, more centered landing.',
    help:'How to play',pause:'Pause',continue:'Keep building',leave:'Return to stages',leaveTitle:'Take a little break?',
    leaveText:'Leaving discards this unfinished tower. Saved stages, stars and fabrics stay with you.',
    helpText:'Tap Drop as the cushion lines up with the golden mark. For careful placement, drag anywhere in the scene and release. Arrow keys aim; Space drops. Felt is forgiving, linen scores more, and cloud keeps a wider support. Follow the material request when shown. Three misses end this attempt.',
    close:'Got it',studio:'Fabric studio',studioText:'Collect a permanent fabric palette. A new look, with the same fair rules.',
    garden:'Garden fabrics',moon:'Moonlight fabrics',free:'Free · always owned',permanent:'Permanent palette · 12 diamonds',
    equip:'Use palette',equipped:'In use',buy:'Unlock · 12',confirmBuy:'Confirm · 12 diamonds',owned:'Owned forever',
    balance:'Diamond balance',insufficient:'Not enough diamonds. Garden fabrics remain free.',storage:'Storage is unavailable. You can play, but progress cannot be saved.',
    saved:'Saved',request:'Requested fabric',stars:'Stars',bestScore:'Stage best',engine:'The 3D scene could not load. Please retry or return to stages.',retry:'Retry loading',
    purchased:'Moonlight fabrics are yours!',chapter:'CHAPTER',check:'CHECKPOINT',goal:'Build {n} layers',progress:'Lookout {n} / 30',
    tutorial:'Find your balance',startBuild:'Let’s build',controls:'Tap to time · drag for precision',arc0:'Meadow beginnings',arc1:'Breeze workshop',arc2:'Lantern trail',arc3:'Cloud spires',arc4:'Patchwork atelier',arc5:'Sky palace',
    guideTitle:'Make room for a little wonder',guideIntro:'Help Moss Shell Taro turn a handful of soft cushions into a sky-high lookout.',
    guide1:'Place, feel, repeat',guide1Text:'Pick a fabric, line up with the golden landing mark, and drop. The transparent cushion shows where the wind will carry your landing. Enough overlap keeps it on the tower; a perfect alignment builds your combo.',
    guide2:'Three fabrics. Real choices.',guide2Text:'Moss felt accepts a smaller overlap. Golden linen gives more points for a narrower landing. Rose cloud is wider but needs more support. Later lookouts request a particular fabric and shift the landing mark.',
    guide3:'A trail worth returning to',guide3Text:'Thirty authored stages introduce wind, offset landings, narrow supports and fabric orders. Every fifth lookout combines what you learned. Earn up to three stars with precise, clean runs; each best score and unlocked stage is saved in this browser.',
    guide4:'Take your time',guide4Text:'There is no countdown. Use touch, mouse or keyboard. Open Help or Pause whenever you need a break. Sound settings and reduced-motion preferences are respected. Optional permanent fabrics only change the appearance.',
  };
  const zh={
    title:'軟墊堆堆樂',kicker:'塔羅的雲端工坊',intro:'一點點平衡，堆出大大的可能。',summary:'用真正的軟墊堆起 30 座瞭望台。掌握節奏、看準風向，享受每一次完美落下。',start:'開始遊戲',
    stages:'選擇瞭望台',stageMap:'關卡',back:'返回',lobbyReturn:'返回 WeightPlay',best:'收集星星',noBest:'0',
    felt:'苔綠毛氈',linen:'金色亞麻',cloud:'玫瑰雲墊',feltNote:'寬容好上手',linenNote:'精準 · +45%',cloudNote:'寬幅 · +20%',
    drop:'放下軟墊',aim:'拖曳瞄準 · 放手落下',ready:'對準發光的落點標記',perfect:'完美落下！',steady:'穩穩接住',miss:'支撐不足，再靠近塔身一點。',
    score:'分數',layers:'層數',attempts:'機會',alignment:'對齊',combo:'連擊',wind:'風向',calm:'風平浪靜',
    next:'下一關',replay:'再玩一次',win:'又高了一點！',final:'你的天空城完成了！',lose:'每座高塔，都從再試一次開始。',
    winNote:'瞭望台已保存。繼續向上，或挑戰更多星星。',loseNote:'先前的通關都還在。試著更靠近落點，輕輕放下。',
    help:'玩法說明',pause:'暫停',continue:'繼續堆疊',leave:'返回關卡',leaveTitle:'休息一下嗎？',leaveText:'離開會放棄這座尚未完成的塔。已解鎖關卡、星星和布料都會保留。',
    helpText:'軟墊對準金色標記時按「放下軟墊」。想精準擺放，可在場景中拖曳，放手就落下。方向鍵瞄準、空白鍵落下。毛氈比較寬容，亞麻分數較高，雲墊能保留較寬的支撐。出現布料訂單時，請選指定布料。失手三次會結束這次挑戰。',
    close:'知道了',studio:'布料工坊',studioText:'收藏永久布料配色。換個心情，玩法一樣公平。',garden:'花園布料',moon:'月光布料',free:'免費 · 永久擁有',permanent:'永久配色 · 12 顆鑽石',
    equip:'使用配色',equipped:'使用中',buy:'解鎖 · 12',confirmBuy:'確認購買 · 12 顆鑽石',owned:'已永久收藏',balance:'鑽石餘額',insufficient:'鑽石不足，花園布料仍可免費使用。',storage:'目前無法儲存，仍可遊玩，但這次進度不會保存。',
    saved:'已保存',request:'本層布料',stars:'星星',bestScore:'本關最佳',engine:'3D 場景載入失敗，請重試或返回關卡。',retry:'重新載入',purchased:'月光布料已加入收藏！',chapter:'章節',check:'挑戰關',goal:'堆起 {n} 層',progress:'瞭望台 {n} / 30',
    tutorial:'找到你的平衡',startBuild:'開始堆吧',controls:'輕點抓節奏 · 拖曳求精準',arc0:'草地初見',arc1:'微風工坊',arc2:'燈火小徑',arc3:'雲端高塔',arc4:'拼布工坊',arc5:'天空之城',
    guideTitle:'為生活，堆起一點想像',guideIntro:'和苔殼塔羅一起，把柔軟的墊子變成高高的瞭望台。',
    guide1:'放下、感受，再堆一層',guide1Text:'選擇布料，對準金色標記，再放下軟墊。半透明的預覽會顯示風把墊子送到哪裡。足夠的重疊就能站穩；精準落在標記中心，則能累積完美連擊。',
    guide2:'三種布料，三種選擇',guide2Text:'苔綠毛氈允許較小的重疊；金色亞麻較窄，精準堆疊可得更多分數；玫瑰雲墊較寬，也需要更多支撐。後段關卡會指定布料，或讓落點偏向一側。',
    guide3:'值得回來的旅程',guide3Text:'30 個手工設計的關卡，逐步加入風向、偏移落點、窄塔與布料訂單。每五關都有綜合挑戰。精準、少失誤的通關最多可得三顆星；最佳分數與解鎖進度儲存在這個瀏覽器。',
    guide4:'慢慢來，也很好',guide4Text:'沒有倒數計時。觸控、滑鼠、鍵盤都能遊玩，隨時可打開說明或暫停。遊戲尊重音效與減少動態效果設定。選購的永久布料只改變外觀，不會影響關卡公平性。',
  };
  let locale=localeMap[location.pathname.split('/')[1]] || (()=>{try{return localStorage.getItem('weightPlayLocale');}catch{return null;}})() || 'en';
  const state={screen:'main',index:0,browse:0,core:null,view:null,save:null,run:null,selector:null,frame:null,modal:null,raf:0,last:0,ready:false,storage:true,buying:false,confirmBuy:false,lifecycle:null};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const t=(key,vars={})=>{let s=(locale.startsWith('zh')?zh[key]:null)||en[key]||window.CUSHION_LOCALES?.[locale]?.[key]||key;for(const [k,v] of Object.entries(vars))s=s.replaceAll(`{${k}}`,String(v));return s;};
  const audio=window.WeightPlayAudio?.createScope();
  const sound=id=>audio?.play(id);
  const read=key=>{try{return JSON.parse(localStorage.getItem(key)||'null');}catch(e){if(!(e instanceof SyntaxError))state.storage=false;return null;}};
  const persist=()=>{try{localStorage.setItem(SAVE,JSON.stringify(state.save));return true;}catch{state.storage=false;return false;}};
  const stageName=s=>locale.startsWith('zh')?s.zh:s.name;
  const stageInfo=s=>`${t('goal',{n:s.layers})} · ${t('arc'+s.arc)}`;
  const canPlay=()=>state.ready&&state.screen==='battle'&&!state.modal&&!document.hidden&&!document.querySelector('.wp-shell-settings-button[aria-expanded="true"]')&&(state.lifecycle?.active??true);
  function copyUI(){
    document.documentElement.lang=locale==='zh-Hant'?'zh-TW':locale;
    document.documentElement.dir=locale==='ar'?'rtl':'ltr';
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
      if(!r.manual)r.x=Math.sin((r.time-r.sweepOrigin)*s.speed-Math.PI/2)*2.6;
      updateAim();$('alignmentValue').textContent=String(r.alignment);$('alignmentFill').style.width=`${r.alignment}%`;
      $('alignmentMeter').dataset.good=String(r.alignment>=85);
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
        catch(e){state.save.moonOwned=false;state.save.palette='garden';persist();if(e.message==='balance'){$('studioStatus').textContent=t('insufficient');return;}throw e;}
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
    diagnostics(){return {ready:state.ready,screen:state.screen,phase:state.run?.phase,renderer:state.view?.stats()};},
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
