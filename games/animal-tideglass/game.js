/* Tide Level Calibration v4 / shared Interface 7. Game-owned content only. */
(function () {
  'use strict';
  const R=window.TideglassRules,C=window.TIDEGLASS_LOCALES,$=id=>document.getElementById(id),app=$('app');
  if(!app||app.dataset.tideglassMounted)return;
  app.dataset.wpFrameRoot='';app.dataset.tideglassMounted='true';
  const locale=C?.__localeKeys.find(key=>C[key].segment===location.pathname.split('/').filter(Boolean)[0])||document.documentElement.lang||'en';
  const copy=C?.[locale];
  if(!R||!copy||!window.WeightPlayScreenFrame?.mount||!window.WeightPlayStageV6?.install||!window.TideglassMotion){$('loadError').hidden=false;return;}
  const t=(key,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),copy[key]);
  const format=(template,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)),template);
  const store={get(key){try{return localStorage.getItem(key);}catch{return null;}},set(key,value){try{localStorage.setItem(key,value);return true;}catch{return false;}}};
  const progress=R.readProgress(store.get(R.SAVE_KEY));
  const motion=new window.TideglassMotion(),life=new AbortController();
  const listen=(node,event,handler)=>node.addEventListener(event,handler,{signal:life.signal});
  const make=(tag,id,cls)=>{const n=document.createElement(tag);if(id)n.id=id;if(cls)n.className=cls;return n;};
  const button=(id,key,primary=false)=>{const n=make('button',id);n.type='button';n.dataset.wpFrameAction=primary?'primary':'secondary';n.textContent=t(key);return n;};
  let frame,stageController,scene='main',run=null,epoch=0,busy=false,modal=null,focusBefore=null,saveOK=true,visualWater=0;
  const audio=id=>{try{window.WeightPlayAudio?.play?.(id)?.catch?.(()=>{});}catch{/* Audio cannot block a move. */}};
  const main=$('mainView'),mainHeader=$('mainHeader'),mainContent=$('mainContent');
  const sourceSelect=$('localeSelect');sourceSelect.value=locale;
  function header(name){
    const h=make('header',name+'Header'),back=button(name+'Back','leave');back.removeAttribute('data-wp-frame-action');back.dataset.wpReturn=name;back.setAttribute('aria-label',name==='stage'?copy.title:t('stages'));back.textContent='←';
    const title=make('strong');title.dataset.wpFrameTitle='';title.textContent=copy.title;h.append(back,title);return h;
  }
  // Main, Stage and Battle are constructed once. All later transitions change state, not control identity.
  const stage=make('section','stageView','stage-canvas');stage.hidden=true;stage.dataset.screen='stage';stage.dataset.wpStandardStageScreen='';stage.dataset.wpStageLandscapeWidth='760';stage.dataset.wpStageLandscapeHeight='334';
  stage.dataset.wpStageArt=$('poster').getAttribute('src');stage.style.setProperty('--wp-stage-art',`url("${$('poster').src}")`);
  const stageHeader=header('stage'),workspace=make('div','stageWorkspace','tg-stage-workspace'),rail=make('div','stageRail','stage-rail');
  rail.dataset.wpStageRail='';rail.dataset.wpStageVirtualDrag='true';rail.setAttribute('aria-label',t('stages'));workspace.append(rail);
  const nav=make('nav');nav.dataset.wpFrameStageNav='';nav.setAttribute('aria-label',t('stages'));
  const tab=button('stageTab','stages');tab.dataset.wpFrameAction='tab';tab.dataset.wpFrameStageSlot='stages';tab.setAttribute('aria-current','page');nav.append(tab);stage.append(stageHeader,workspace,nav);app.append(stage);
  const battle=make('section','battleView','battle-canvas');battle.hidden=true;battle.dataset.screen='battle';battle.dataset.wpLogicalBattleCanvas='';battle.dataset.wpBattleLandscapeWidth='760';battle.dataset.wpBattleLandscapeHeight='390';
  const battleHeader=header('battle'),play=make('div','battleContent','tg-play');play.dataset.wpFrameLogicalActions='battle';
  const hud=make('div','battleStats');
  for(const [id,key] of [['stageStat','stage'],['readingStat','reading'],['starStat','stars']]){
    const group=make('div'),label=make('span'),value=make('b',id);
    label.textContent=key==='stage'?t('stages'):key==='reading'?t('reading',{current:'',total:5}).replace('/5','').trim():t(key);
    group.append(label,value);hud.append(group);
  }
  const clueBox=make('div',null,'tg-clue'),modeLabel=make('strong','modeLabel'),clue=make('p','clue'),tolerance=make('small','tolerance');clueBox.append(modeLabel,clue,tolerance);
  const field=make('div','tideField','tg-field');field.setAttribute('aria-labelledby','clue');
  const bubbles=make('div',null,'tg-bubbles');bubbles.setAttribute('aria-hidden','true');for(let i=0;i<6;i++){const b=make('i');b.style.setProperty('--i',i);bubbles.append(b);}field.append(bubbles);
  const glasses=make('div',null,'tg-glasses');
  function glass(id){
    const group=make('div',id+'Group','tg-glass-group'),label=make('div',id+'Caption','tg-glass-caption'),art=make('div',id+'Art','tg-glass-art');
    art.setAttribute('aria-hidden','true');
    const cavity=make('div',null,'tg-cavity'),liquid=make('div',id+'Water','tg-liquid'),surface=make('i',null,'tg-surface'),mark=make('div',id+'Mark','tg-marker');
    liquid.append(surface);cavity.append(liquid,mark);art.append(cavity);group.append(art,label);glasses.append(group);return {group,label,art,liquid,mark};
  }
  const activeGlass=glass('active'),referenceGlass=glass('reference');referenceGlass.group.hidden=true;field.append(glasses);
  const controls=make('div','controls','tg-controls'),meter=make('div',null,'tg-meter'),meterCaption=make('div',null,'tg-meter-caption'),dialLabel=make('label','dialLabel'),dialValue=make('output','dialValue');
  dialLabel.htmlFor='waterRange';dialLabel.textContent=t('waterline');dialValue.htmlFor='waterRange';meterCaption.append(dialLabel,dialValue);
  const adjust=make('div',null,'tg-adjust'),minus=button('minus','minus'),plus=button('plus','plus'),range=make('input','waterRange');
  minus.setAttribute('aria-label',t('minus'));minus.textContent='−';plus.setAttribute('aria-label',t('plus'));plus.textContent='+';
  range.type='range';range.min='0';range.max='100';range.step='1';range.dir='ltr';range.setAttribute('aria-labelledby','dialLabel');adjust.append(minus,range,plus);meter.append(meterCaption,adjust);
  const feedback=make('div','feedback','tg-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');feedback.setAttribute('aria-atomic','true');
  const seal=button('sealBtn','seal',true),secondary=make('div',null,'tg-secondary'),reset=button('resetBtn','reset'),hint=button('hintBtn','hint');secondary.append(reset,hint);controls.append(meter,feedback,seal,secondary);
  play.append(hud,clueBox,field,controls);battle.append(battleHeader,play);
  const overlay=make('section','tideModal','tg-modal');overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','modalTitle');overlay.setAttribute('aria-describedby','modalText');
  const card=make('div',null,'tg-modal-card'),modalTitle=make('h2','modalTitle'),starArt=make('div','modalStars','tg-result-stars'),modalText=make('p','modalText'),saveMessage=make('p','saveMessage','tg-save-warning'),modalActions=make('div',null,'tg-modal-actions');
  starArt.setAttribute('aria-hidden','true');
  for(const [id,key] of [['continueBtn','continue'],['nextBtn','next'],['replayBtn','replay'],['leaveBtn','leave']])modalActions.append(button(id,key,id==='nextBtn'));
  card.append(modalTitle,starArt,modalText,saveMessage,modalActions);overlay.append(card);battle.append(overlay);app.append(battle);
  const roots={main,stage,battle};
  function updateProgress(){ $('mainProgress').textContent=t('progress',{count:R.completed(progress),total:R.TOTAL}); }
  function settingsOpen(){return [...app.querySelectorAll('.wp-frame-popover')].some(n=>!n.hidden);}
  function blocked(){return scene!=='battle'||!run||busy||Boolean(modal)||document.hidden||settingsOpen();}
  function pause(){
    if(document.hidden||settingsOpen())motion.pause('covered');else motion.resume('covered');
    app.classList.toggle('tg-running',!document.hidden&&!settingsOpen()&&!modal);
  }
  function releaseModal(){modal=null;overlay.hidden=true;play.inert=false;frame.activate(scene);pause();}
  function show(name,focus=true){
    ++epoch;motion.cancel();busy=false;modal=null;overlay.hidden=true;play.inert=false;scene=name;document.body.dataset.screen=name;
    for(const [key,node] of Object.entries(roots)){node.hidden=key!==name;node.inert=key!==name;}
    $('gameGuide').hidden=name!=='main';frame.activate(name);updateProgress();pause();
    if(name==='main'){motion.fade($('poster'));if(focus)$('startBtn').focus({preventScroll:true});}
    if(name==='stage'){
      stageController.refresh();stageController.center(R.unlocked(progress));
      if(focus)$('stageBack').focus({preventScroll:true});for(const node of rail.querySelectorAll('.tg-stage-item'))motion.fade(node);
    }
  }
  function bindStage(card,index){
    const level=R.stages[index],best=progress.best[index],locked=index>R.unlocked(progress);
    card.type='button';card.className='stage-card'+(locked?' locked':'');card.setAttribute('aria-disabled',String(locked));
    card.dataset.tgArc=String(level.arc);card.dataset.tgState=locked?'locked':best?'done':'ready';card.dataset.tgCheckpoint=String(level.checkpoint);
    if(index===R.unlocked(progress))card.dataset.wpStageRecommended='true';else delete card.dataset.wpStageRecommended;
    const group=make('div',null,'tg-stage-item');group.dataset.wpItemContent='';
    const emblem=make('span',null,'tg-stage-emblem');emblem.setAttribute('aria-hidden','true');emblem.textContent=['≈','◈','±','∑','½','✦'][level.arc-1];
    const title=make('strong'),mode=make('span'),state=make('small'),stars=make('span',null,'tg-stage-stars');
    title.textContent=t('stage',{value:index+1});mode.textContent=copy.modes[level.arc-1];state.textContent=locked?t('locked'):best?t('done'):'5 × '+t('reading',{current:1,total:1}).replace('1/1','').trim();
    stars.textContent='★'.repeat(best?.stars||0)+'☆'.repeat(3-(best?.stars||0));stars.setAttribute('aria-label',t('stars')+': '+(best?.stars||0)+'/3');
    group.append(emblem,title,mode,stars,state);card.replaceChildren(group);
  }
  function setWater(value,instant=false){
    const from=visualWater,to=R.clamp(value);
    motion.tween('water',instant?0:180,p=>{visualWater=from+(to-from)*p;activeGlass.liquid.style.height=visualWater+'%';});
  }
  function renderValue(instant=false){
    const round=R.roundOf(run);range.value=String(run.value);dialValue.textContent=run.phase==='observe'?'—':String(run.value)+(round.mode==='offset'?'':'%');
    range.setAttribute('aria-valuetext',dialValue.textContent);setWater(run.phase==='observe'?round.target:R.water(run),instant);
    activeGlass.label.textContent=run.phase==='observe'?t('target',{value:round.target}):round.mode==='offset'?t('waterline')+': '+R.water(run)+'%':t('waterline');
  }
  function renderRound(instant=false){
    if(!run)return;
    if(run.phase==='result'){openModal('result');return;}
    const round=R.roundOf(run),observe=run.phase==='observe';
    $('stageStat').textContent=`${run.index+1}/${R.TOTAL}`;$('readingStat').textContent=`${run.reading+1}/${R.READINGS}`;$('starStat').textContent=String(R.totalStars(progress));
    modeLabel.textContent=copy.modes[['read','memory','offset','balance','fraction','mixed'].indexOf(round.mode)];
    const clueIndex=round.mode==='memory'?(observe?1:2):{read:0,offset:3,balance:4,fraction:5}[round.mode];
    const isolate=value=>locale==='ar'?'\u2066'+value+'\u2069':String(value);
    clue.textContent=format(copy.clues[clueIndex],{bias:isolate((round.bias>=0?'+ ':'− ')+Math.abs(round.bias)),value:isolate(round.mode==='balance'?100-round.target:round.target),n:isolate(round.numerator),d:isolate(round.denominator)});
    tolerance.textContent=t('tolerance',{value:round.tolerance});
    const showTarget=observe||run.hintShown||round.mode==='read'||round.mode==='offset';
    activeGlass.mark.hidden=!showTarget;
    // Remove hidden target positions too: memory and fraction answers are not exposed through accessible labels or styles.
    if(showTarget)activeGlass.mark.style.bottom=round.target+'%';else activeGlass.mark.style.removeProperty('bottom');
    referenceGlass.group.hidden=round.mode!=='balance';referenceGlass.mark.hidden=true;
    if(round.mode==='balance'){referenceGlass.liquid.style.height=(100-round.target)+'%';referenceGlass.label.textContent=t('reference')+': '+(100-round.target)+'%';}
    field.dataset.mode=round.mode;field.dataset.feedback='';
    seal.textContent=t(observe?'remember':'seal');dialLabel.textContent=t(round.mode==='offset'?'dial':'waterline');
    for(const node of [range,minus,plus,reset])node.disabled=observe||busy;
    hint.disabled=observe||busy||run.hints>=2||run.hintShown;hint.textContent=t('hint',{count:2-run.hints});seal.disabled=busy;
    feedback.textContent=run.hintShown?t('target',{value:round.target}):'';
    renderValue(instant);
  }
  function startStage(index){
    const next=R.newRun(index,progress);if(!next)return false;run=next;show('battle',false);renderRound(true);seal.focus({preventScroll:true});motion.fade(field);audio('game.start');return true;
  }
  function submit(){
    if(blocked())return;
    if(run.phase==='observe'){R.remember(run);renderRound(true);range.focus({preventScroll:true});audio('ui.click');return;}
    const checked=R.check(run);if(!checked)return;
    if(!checked.correct){feedback.textContent=t('wrong');field.dataset.feedback='wrong';motion.pulse(activeGlass.art,true);audio('feedback.error');return;}
    // Commit the model transaction now; scene cancellation may discard its visual flourish, never its result.
    const target=R.roundOf(run).target;R.advance(run);
    if(run.phase==='result'&&R.settle(progress,run)){saveOK=store.set(R.SAVE_KEY,JSON.stringify(progress));updateProgress();}
    busy=true;feedback.textContent=t('correct');field.dataset.feedback='correct';activeGlass.mark.hidden=false;activeGlass.mark.style.bottom=target+'%';
    for(const node of [range,minus,plus,seal,reset,hint])node.disabled=true;
    const token=epoch;audio('feedback.success');
    motion.pulse(activeGlass.art).then(finished=>{if(!finished||token!==epoch||scene!=='battle'||modal)return;busy=false;renderRound();});
  }
  function openModal(kind){
    ++epoch;motion.cancel();busy=false;focusBefore=document.activeElement;modal=kind;overlay.hidden=false;play.inert=true;frame.activate('battle',{covered:true});
    modalTitle.textContent=t(kind==='leave'?'leaveTitle':'results');modalText.textContent=kind==='leave'?t('leaveBody'):t('attempts',{count:run.attempts,stars:R.starsFor(run)});
    starArt.hidden=kind!=='result';starArt.textContent=kind==='result'?'★'.repeat(R.starsFor(run))+'☆'.repeat(3-R.starsFor(run)):'';
    saveMessage.hidden=saveOK;saveMessage.textContent=t('saveError');
    $('continueBtn').hidden=kind!=='leave';$('nextBtn').hidden=kind!=='result';$('replayBtn').hidden=kind!=='result';$('nextBtn').disabled=run.index===R.TOTAL-1;
    pause();motion.fade(card);(kind==='leave'?$('continueBtn'):run.index===R.TOTAL-1?$('replayBtn'):$('nextBtn')).focus({preventScroll:true});
  }
  function closeLeave(){releaseModal();renderRound(true);if(focusBefore?.isConnected&&!focusBefore.disabled)focusBefore.focus({preventScroll:true});else seal.focus();}
  try{
    frame=window.WeightPlayScreenFrame.mount({root:app,scenes:{main:{root:main,header:mainHeader,content:mainContent},stage:{root:stage,header:stageHeader,content:workspace},battle:{root:battle,header:battleHeader,content:play,headerInfo:hud}},localeSelect:sourceSelect});
    sourceSelect.id='tideglassLocaleSource';
    stageController=window.WeightPlayStageV6.install(rail,{total:R.TOTAL,poolSize:9,bind:bindStage,initialIndex:()=>R.unlocked(progress),activate:index=>{if(scene==='stage'&&!settingsOpen())startStage(index);}});
    if(!stageController)throw Error('Stage controller unavailable');
    listen($('startBtn'),'click',()=>show('stage'));listen($('stageBack'),'click',()=>show('main'));
    listen($('battleBack'),'click',()=>{if(!modal){if(run.phase==='result')show('stage');else openModal('leave');}});
    listen(sourceSelect,'change',()=>{const next=C[sourceSelect.value];if(!next)return;store.set('weightPlayLocale',sourceSelect.value);store.set('weightplay-tideglass-locale',sourceSelect.value);location.assign('/'+next.segment+'/games/animal-tideglass/'+location.search+location.hash);});
    listen(range,'input',()=>{if(blocked()){range.value=String(run?.value||0);return;}if(R.setValue(run,range.value)){feedback.textContent='';field.dataset.feedback='';renderValue();}});
    for(const [node,delta] of [[minus,-1],[plus,1]])listen(node,'click',()=>{if(!blocked()&&R.setValue(run,run.value+delta)){feedback.textContent='';field.dataset.feedback='';renderValue();}});
    listen(reset,'click',()=>{if(!blocked()&&R.setValue(run,R.roundOf(run).initial)){renderValue();feedback.textContent='';field.dataset.feedback='';audio('ui.click');}});
    listen(hint,'click',()=>{if(!blocked()&&R.hint(run)){renderRound();audio('ui.click');}});
    listen(seal,'click',submit);listen($('continueBtn'),'click',closeLeave);listen($('leaveBtn'),'click',()=>show('stage'));
    listen($('nextBtn'),'click',()=>{if(modal==='result'&&run.index<R.TOTAL-1)startStage(run.index+1);});listen($('replayBtn'),'click',()=>{if(modal==='result')startStage(run.index);});
    listen(document,'keydown',event=>{
      if(event.defaultPrevented||event.repeat||scene!=='battle')return;
      if(modal){
        if(event.key==='Escape'){event.preventDefault();modal==='leave'?closeLeave():show('stage');return;}
        if(event.key==='Tab'){
          const nodes=[...overlay.querySelectorAll('button:not([hidden]):not(:disabled)')],first=nodes[0],last=nodes.at(-1);
          if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
          else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
          else if(!overlay.contains(document.activeElement)){event.preventDefault();first.focus();}
        }
        return;
      }
      if(event.key==='Escape'&&!settingsOpen()){event.preventDefault();if(run.phase==='result')show('stage');else openModal('leave');}
    });
    const resize=new ResizeObserver(()=>{if(scene==='stage')stageController.center();});resize.observe(rail);
    listen(window,'weightplay:interaction-state',pause);listen(document,'visibilitychange',pause);
    listen(window,'pageshow',()=>{motion.resume('bfcache');pause();});
    listen(window,'pagehide',event=>{if(event.persisted){motion.pause('bfcache');return;}++epoch;resize.disconnect();motion.destroy();stageController.destroy();frame.destroy();life.abort();});
    $('startBtn').disabled=false;$('loadError').hidden=true;show('main',false);
    // Read-only diagnostics. Native tests must still use the real controls.
    window.TIDEGLASS_TEST=Object.freeze({getState:()=>({scene,modal,busy,run:run?{...run}:null,completed:R.completed(progress),stars:R.totalStars(progress),water:run?R.water(run):0,visualWater,saveOK}),motion:()=>motion.snapshot()});
  }catch(error){console.error('Tideglass startup failed',error);motion.destroy();stageController?.destroy();frame?.destroy();life.abort();$('loadError').hidden=false;$('loadError').textContent=t('loadError');}
})();
