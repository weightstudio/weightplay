(function () {
  "use strict";
  const locales = window.ANIMAL_HABITAT_COUNTS_LOCALES || {};
  const STANDARD_COPY = {
    en:{ start:"Start Game", continue:"Continue playing", confirmLeave:"Return to Stages" },
    "zh-Hant":{ start:"開始遊戲", continue:"繼續遊戲", confirmLeave:"返回關卡" },
    "zh-Hans":{ start:"开始游戏", continue:"继续游戏", confirmLeave:"返回关卡" },
    ja:{ start:"ゲーム開始", continue:"プレイを続ける", confirmLeave:"ステージへ戻る" },
    ko:{ start:"게임 시작", continue:"계속 플레이", confirmLeave:"스테이지로 돌아가기" },
    es:{ start:"Iniciar juego", continue:"Seguir jugando", confirmLeave:"Volver a niveles" },
    "pt-BR":{ start:"Iniciar jogo", continue:"Continuar jogando", confirmLeave:"Voltar às fases" },
    fr:{ start:"Démarrer le jeu", continue:"Continuer", confirmLeave:"Retour aux niveaux" },
    de:{ start:"Spiel starten", continue:"Weiterspielen", confirmLeave:"Zurück zu den Stufen" },
    it:{ start:"Inizia gioco", continue:"Continua a giocare", confirmLeave:"Torna ai livelli" },
    ru:{ start:"Начать игру", continue:"Продолжить игру", confirmLeave:"Вернуться к этапам" },
    hi:{ start:"गेम शुरू करें", continue:"खेल जारी रखें", confirmLeave:"स्टेज पर लौटें" },
    ar:{ start:"ابدأ اللعبة", continue:"متابعة اللعب", confirmLeave:"العودة إلى المراحل" },
  };
  Object.entries(STANDARD_COPY).forEach(([locale, values]) => { if (locales[locale]) Object.assign(locales[locale], values); });
  const campaignLocales = window.ANIMAL_HABITAT_COUNTS_CAMPAIGN_LOCALES;
  const experienceLocales = window.HabitatExperienceLocales;
  const campaign = window.ANIMAL_HABITAT_COUNTS_CAMPAIGN;
  const model = window.HabitatModel;
  const stages = campaign.stages;
  const SAVE_KEY = "weightplay-animal-habitat-counts-campaign-v12";
  const POSTER = "/assets/interface7-redrawn/animal-habitat-counts.webp";
  const LENS_IMAGE = "/assets/animal-gearpack-expedition-items/crystal-lens.webp";
  const STONE_IMAGE = "/assets/animal-block-grove-icon-stone.webp";
  const $ = id => document.getElementById(id);
  const stored = (key, fallback = '') => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const readProgress = () => { try { return model.normalize(JSON.parse(stored(SAVE_KEY, '{}')), stages); } catch { return model.normalize({}, stages); } };
  const progress = readProgress();
  const routeLocale = { en:'en', 'zh-tw':'zh-Hant', 'zh-cn':'zh-Hans', ja:'ja', ko:'ko', es:'es', 'pt-br':'pt-BR', fr:'fr', de:'de', it:'it', ru:'ru', hi:'hi', ar:'ar' };
  const requestedLocale = routeLocale[location.pathname.split('/').filter(Boolean)[0]] || stored('weightplay-habitat-counts-locale','en');
  const state = { locale:locales[requestedLocale] ? requestedLocale : 'en', screen:'main', roundIndex:0, selectedStage:progress.unlocked-1, mode:'plant', selectedZone:null, resultVisible:false, checkpointGrant:0 };
  let run = null, outcome = null, screenFrame = null, stageSelector = null;
  let scene = null, sceneLoading = false, sceneAttempts = 0, disposed = false, dialogReturn = null, activeDialog = null;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  const interpolate = (value, vars = {}) => Object.entries(vars).reduce((text,[key,value]) => text.split('{'+key+'}').join(String(value)), String(value));
  const t = (key, vars) => interpolate(locales[state.locale]?.[key] ?? locales.en?.[key] ?? key, vars);
  const c = (key, vars) => { const value = campaignLocales[state.locale]?.[key] ?? campaignLocales.en?.[key] ?? key; return Array.isArray(value) ? value : interpolate(value,vars); };
  const x = (key, vars) => interpolate(experienceLocales[state.locale]?.[key] ?? experienceLocales.en[key] ?? key, vars);
  const currentStage = () => stages[state.roundIndex];
  const play = event => window.WeightPlayAudio?.play(event);
  Object.defineProperties(state, {
    board:{get:()=>run?.board || [],set:value=>{if(run)run.board=value;}}, checks:{get:()=>run?.checks || 0},
    revealed:{get:()=>run?.revealed || new Set()}, completed:{get:()=>progress.completed}, unlocked:{get:()=>progress.unlocked}, lens:{get:()=>progress.lens},
  });
  function animate(node, frames, duration = 220) {
    if (!node?.animate || document.hidden) return;
    const effect = node.animate(motion.matches ? [{opacity:.6},{opacity:1}] : frames, {duration:motion.matches ? 80 : duration,easing:'cubic-bezier(.2,.8,.2,1)'});
    animations.add(effect); effect.finished.catch(()=>{}).finally(()=>animations.delete(effect));
  }
  function settleMotion() { animations.forEach(effect=>effect.cancel()); animations.clear(); $('boardParticles')?.replaceChildren(); }
  function saveProgress() {
    if (run && state.screen === 'battle' && !state.resultVisible) progress.active = model.snapshot(run,currentStage());
    try { localStorage.setItem(SAVE_KEY,JSON.stringify(progress)); if($('saveState'))$('saveState').textContent=x('saved'); if($('storageNotice'))$('storageNotice').hidden=true; return true; }
    catch { if($('saveState'))$('saveState').textContent=x('saveFailed'); if($('storageNotice'))$('storageNotice').hidden=false; return false; }
  }
  function setScreen(screen) {
    if (state.screen === 'battle' && !state.resultVisible) saveProgress();
    closeDialog(false); settleMotion();
    state.screen=screen; document.body.dataset.screen=screen;
    ['main','stage','battle'].forEach(name=>{const node=$(name+'Screen');node.hidden=name!==screen;node.classList.toggle('active',name===screen);});
    $('guideSection').hidden=screen!=='main';
    scene?.setActive(screen==='battle');
    if(screen==='main')renderMain();
    if(screen==='stage')renderStages();
    screenFrame?.activate(screen);
    if(screen==='stage')stageSelector?.refresh(state.selectedStage);
    if(screen==='battle')ensureScene();
    window.scrollTo(0,0);
  }
  function applyLocale() {
    document.documentElement.lang=state.locale;
    document.documentElement.dir=locales[state.locale]?.direction || (state.locale==='ar'?'rtl':'ltr');
    document.querySelectorAll('[data-copy]').forEach(node=>node.textContent=t(node.dataset.copy));
    document.querySelectorAll('[data-copy-aria-label]').forEach(node=>node.setAttribute('aria-label',t(node.dataset.copyAriaLabel)));
    document.querySelectorAll('[data-campaign-copy]').forEach(node=>node.textContent=c(node.dataset.campaignCopy));
    document.querySelectorAll('[data-experience]').forEach(node=>node.textContent=x(node.dataset.experience));
    document.querySelectorAll('[data-experience-aria]').forEach(node=>node.setAttribute('aria-label',x(node.dataset.experienceAria)));
    const leaveCopy=$('leaveDialog').querySelector('[data-copy="leaveBody"]');
    leaveCopy.textContent=x('saved');
    renderMain();
    if(run)renderBattle();
    if(state.resultVisible)renderResult();
  }
  function renderMain() {
    $('mainProgress').textContent=progress.completed.length?c('progress',{count:progress.completed.length,total:30}):c('progressEmpty',{total:30});
    $('startBtn').textContent=progress.completed.length || progress.active ? t('continue') : t('start');
  }
  function renderStages() {
    if($('stageSummary'))$('stageSummary').textContent=c('progress',{count:progress.completed.length,total:30});
    stageSelector?.refresh(state.selectedStage);
  }
  function stageRecord(index) {
    const stage=stages[index]; if(!stage)return null;
    const arc=c('arcs')[index/5|0];
    const locked=stage.number>progress.unlocked,cleared=progress.completed.includes(stage.id);
    const details=[c('rules')[0]];
    if(stage.zones.length)details.push(c('zonesTitle')+': '+stage.zones.length);
    if(stage.stones.length)details.push(c('rules')[1]);
    if(stage.trail.length)details.push(c('rules')[2]);
    if(stage.branch.length)details.push(c('rules')[3]);
    return {id:stage.id,kicker:arc,title:String(stage.number),subtitle:c('stageHint',{arc,size:stage.size}),status:c('status')[cleared?1:locked?2:0],summary:c('stageHint',{arc,size:stage.size}),details,poster:POSTER,locked,cleared};
  }
  const selectStage=index=>state.selectedStage=Math.max(0,Math.min(29,Number(index)||0));
  window.AnimalHabitatCountsI9=Object.freeze({
    get screen(){return state.screen;},get selectedStage(){return state.selectedStage;},get stageCount(){return stages.length;},
    stageTabLabel:()=>t('stages'),stageRecord,selectStage,startStage,experienceCopy:x,openThemes,
    setFrame:frame=>screenFrame=frame,setStageSelector:selector=>stageSelector=selector,
  });
  function startGame() { state.selectedStage=progress.active?stages.findIndex(stage=>stage.id===progress.active.stageId):progress.unlocked-1;setScreen('stage');stageSelector?.select(state.selectedStage,{focus:true,notify:false}); }
  function startStage(index, options={}) {
    if(index<0 || index>=stages.length || index+1>progress.unlocked)return;
    closeDialog(false);settleMotion();
    state.roundIndex=index;state.selectedStage=index;state.mode='plant';state.selectedZone=null;state.resultVisible=false;
    const saved=!options.fresh && progress.active?.stageId===stages[index].id ? progress.active : null;
    run=model.createRun(stages[index],saved);outcome=null;
    $('battlePanel').hidden=false;$('battlePanel').inert=false;$('resultPanel').hidden=true;
    play('game.start');setScreen('battle');renderBattle();
    notice(saved?x('restored'):x('ready'));
    saveProgress();$('habitatGrid').querySelector('.cell:not(:disabled)')?.focus({preventScroll:true});
    animate($('boardAxis'),[{opacity:.2},{opacity:1}],320);
  }
  function routeIndex(stage,index) {
    if(stage.trail[0]===index)return 0;
    if(stage.trail.at(-1)===index)return 2;
    if(stage.trail.includes(index))return 1;
    return stage.branch.includes(index)?3:-1;
  }
  function buildBoard(stage) {
    const grid=$('habitatGrid');
    if(grid.dataset.stageId===stage.id)return;
    grid.dataset.stageId=stage.id;
    ['habitatGrid','rowClues','columnClues'].forEach(id=>$(id).style.setProperty('--board-size',stage.size));
    const clues=(counts,type)=>counts.map((target,index)=>{
      const node=document.createElement('span');node.className='clue';node.dataset.clueType=type;node.dataset.clueIndex=index;
      const value=document.createElement('b'), goal=document.createElement('small');goal.textContent='/'+target;node.append(value,goal);return node;
    });
    $('rowClues').replaceChildren(...clues(stage.rows,'row'));
    $('columnClues').replaceChildren(...clues(stage.columns,'column'));
    grid.replaceChildren(...Array.from({length:stage.size**2},(_,index)=>{
      const button=document.createElement('button');button.type='button';button.className='cell';button.dataset.cell=index;
      button.disabled=stage.stones.includes(index);button.classList.toggle('is-stone',button.disabled);
      const symbol=document.createElement('span');symbol.className='cell-symbol';symbol.setAttribute('aria-hidden','true');button.append(symbol);
      if(button.disabled){const img=document.createElement('img');img.src=STONE_IMAGE;img.alt='';button.append(img);symbol.hidden=true;}
      const zones=stage.zones.filter(zone=>zone.cells[0]===index);
      if(zones.length){const marker=document.createElement('span');marker.className='zone-marker';marker.textContent=zones.map(z=>z.id+1).join('·');marker.setAttribute('aria-hidden','true');button.append(marker);}
      const route=routeIndex(stage,index);
      if(route>=0){button.dataset.route=route;const marker=document.createElement('span');marker.className='route-marker';marker.textContent=['S','●','E','◇'][route];marker.setAttribute('aria-hidden','true');button.append(marker);}
      return button;
    }));
    $('zoneClues').replaceChildren(...stage.zones.map(zone=>{
      const button=document.createElement('button');button.type='button';button.className='zone-clue';button.dataset.zone=zone.id;
      const key=document.createElement('span');key.className='zone-key';key.textContent=zone.id+1;
      const value=document.createElement('b');button.append(key,value);return button;
    }));
    if(stage.zones.some(zone=>zone.hidden)){
      const button=document.createElement('button');button.type='button';button.className='lens-use';button.id='revealBtn';
      const image=document.createElement('img');image.src=LENS_IMAGE;image.alt='';const value=document.createElement('b');value.textContent='−1';button.append(image,value);
      button.addEventListener('click',revealZone);$('zoneClues').append(button);
    }
    const rules=[c('rules')[0]];if(stage.stones.length)rules.push(c('rules')[1]);if(stage.trail.length)rules.push(c('rules')[2]);if(stage.branch.length)rules.push(c('rules')[3]);
    $('ruleList').replaceChildren(...rules.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  }
  function renderBattle() {
    if(!run)return;
    const stage=currentStage();buildBoard(stage);
    $('battlePanel').dataset.boardSize=stage.size;$('battlePanel').dataset.theme=progress.theme;
    $('arcIndex').textContent=String((state.roundIndex/5|0)+1).padStart(2,'0')+' / 06';
    $('roundHint').textContent=c('arcs')[state.roundIndex/5|0];
    $('progressBadge').textContent=c('progressBadge',{number:stage.number,total:30});
    $('battleHeading').textContent='';
    $('habitatGrid').setAttribute('aria-label',c('stageHint',{arc:c('arcs')[state.roundIndex/5|0],size:stage.size}));
    updateBoard();
  }
  function updateBoard() {
    const stage=currentStage(),result=campaign.evaluateBoard(stage,run.board);
    $('habitatGrid').querySelectorAll('.cell').forEach((button,index)=>{
      const planted=!!run.board[index],marked=!!run.marks[index],route=routeIndex(stage,index);
      button.setAttribute('aria-pressed',String(planted));button.classList.toggle('is-marked',marked);
      const value=button.disabled?c('cell')[3]:marked?x('marked'):c('cell')[planted?1:2];
      button.setAttribute('aria-label',interpolate(c('cell')[0],{row:(index/stage.size|0)+1,column:index%stage.size+1,state:value})+(route>=0?', '+c('route')[route]:''));
      button.querySelector('.cell-symbol').textContent=marked?'×':planted?'✓':'·';
      const selected=state.selectedZone===null?null:stage.zones[state.selectedZone];
      button.classList.toggle('is-zone',!!selected?.cells.includes(index));button.classList.toggle('is-muted',!!selected && !selected.cells.includes(index));
      button.classList.remove('is-route-error');
    });
    let matched=0,total=stage.size*2;
    [['rowClues',result.rows,stage.rows],['columnClues',result.columns,stage.columns]].forEach(([id,actual,targets])=>{
      $(id).querySelectorAll('.clue').forEach((node,index)=>{
        const equal=actual[index]===targets[index];if(equal)matched++;
        node.querySelector('b').textContent=actual[index];node.classList.toggle('is-complete',equal);node.classList.toggle('is-over',actual[index]>targets[index]);node.classList.remove('is-mismatch');
        node.setAttribute('aria-label',x(id==='rowClues'?'rowFix':'columnFix',{line:index+1,actual:actual[index],target:targets[index]}));
      });
    });
    stage.zones.forEach(zone=>{
      const hidden=zone.hidden&&!run.revealed.has(zone.id),count=zone.cells.reduce((sum,index)=>sum+run.board[index],0);
      const node=$('zoneClues').querySelector('[data-zone="'+zone.id+'"]');
      node.querySelector('b').textContent=count+'/'+(hidden?'?':zone.count);node.setAttribute('aria-pressed',String(state.selectedZone===zone.id));
      node.setAttribute('aria-label',hidden?c('zoneHidden',{number:zone.id+1}):c('zoneCount',{number:zone.id+1,count:zone.count}));
      node.classList.toggle('is-complete',!hidden&&count===zone.count);node.classList.remove('is-mismatch');
      if(!hidden){total++;if(count===zone.count)matched++;}
    });
    if(stage.trail.length){total++;if(result.connected)matched++;}
    $('clueProgress').textContent=x('live',{count:matched,total});$('proofFill').style.width=(matched/total*100)+'%';
    $('filledCount').textContent=t('filled',{count:run.board.reduce((a,b)=>a+b,0)});
    $('undoBtn').disabled=!run.history.length;$('clearBtn').disabled=!run.board.some(Boolean)&&!run.marks.some(Boolean);
    $('plantBtn').setAttribute('aria-pressed',String(state.mode==='plant'));$('markBtn').setAttribute('aria-pressed',String(state.mode==='mark'));
    $('noZones').hidden=!!stage.zones.length;$('zoneHeading').hidden=!stage.zones.length;
    const hiddenZones=stage.zones.filter(zone=>zone.hidden&&!run.revealed.has(zone.id));
    const scanZone=hiddenZones.find(zone=>zone.id===state.selectedZone)||hiddenZones[0];
    $('lensCount').textContent='';
    if(stage.number>=5){const img=document.createElement('img');img.src=LENS_IMAGE;img.alt=c('itemName');const value=document.createElement('span');value.textContent=String(progress.lens);$('lensCount').append(img,value);}
    const reveal=$('revealBtn');if(reveal){reveal.disabled=!scanZone||progress.lens<1;reveal.setAttribute('aria-label',scanZone?c('revealZone',{number:scanZone.id+1})+' · '+c('lensAvailable',{count:progress.lens}):c('itemName'));reveal.title=scanZone?c('revealZone',{number:scanZone.id+1}):c('correct');}
    scene?.update(stage,run.board,progress.theme);
  }
  function notice(text,wrong=false){const node=$('battleStatus');node.textContent=text;node.classList.toggle('is-wrong',wrong);}
  function editable(){return state.screen==='battle'&&!state.resultVisible&&!activeDialog;}
  function editCell(index,mode=state.mode){if(!editable()||!model.toggle(run,currentStage(),index,mode))return;play('board.move');updateBoard();saveProgress();notice(x('ready'));burst(index,false);}
  function undo(){if(!editable()||!model.undo(run))return;play('board.undo');updateBoard();saveProgress();notice(x('ready'));}
  function resetBoard(){if(!editable()||!model.clear(run))return;play('board.undo');updateBoard();saveProgress();notice(x('ready'));}
  function revealZone(){
    if(!editable()||progress.lens<1)return;
    const hidden=currentStage().zones.filter(zone=>zone.hidden&&!run.revealed.has(zone.id));
    const zone=hidden.find(zone=>zone.id===state.selectedZone)||hidden[0];if(!zone)return;
    progress.lens--;run.revealed.add(zone.id);state.selectedZone=zone.id;saveProgress();updateBoard();play('feedback.hint');notice(c('revealed',{number:zone.id+1,count:zone.count}));
    animate($('zoneClues').querySelector('[data-zone="'+zone.id+'"]'),[{opacity:.3},{opacity:1}],320);
  }
  function checkBoard(){
    if(!editable())return;
    const stage=currentStage();run.checks++;const result=campaign.evaluateBoard(stage,run.board);updateBoard();
    if(!result.correct){
      const row=result.rowMismatch.indexOf(true),column=result.columnMismatch.indexOf(true),zone=result.zoneMismatch.indexOf(true);
      let message=x('routeFix');
      if(row>=0){message=x('rowFix',{line:row+1,actual:result.rows[row],target:stage.rows[row]});$('rowClues').children[row].classList.add('is-mismatch');}
      else if(column>=0){message=x('columnFix',{line:column+1,actual:result.columns[column],target:stage.columns[column]});$('columnClues').children[column].classList.add('is-mismatch');}
      else if(zone>=0){state.selectedZone=zone;updateBoard();message=x('zoneFix');$('zoneClues').querySelector('[data-zone="'+zone+'"]').classList.add('is-mismatch');}
      else {$('habitatGrid').querySelectorAll('[data-route]').forEach(node=>node.classList.add('is-route-error'));}
      notice(message,true);animate($('battleStatus'),[{opacity:.4},{opacity:1}],220);play('feedback.error');saveProgress();return;
    }
    state.resultVisible=true;outcome=model.settle(progress,stage,run);state.checkpointGrant=outcome.lens;saveProgress();
    state.selectedStage=progress.unlocked-1;renderMain();renderStages();renderResult();
    play(stage.number===30?'result.win':stage.checkpoint?'game.checkpoint':'feedback.success');
    burst(Math.floor(run.board.length/2),true);openDialog('resultPanel',$('resultNextBtn').disabled?$('resultReplayBtn'):$('resultNextBtn'));
  }
  function renderResult(){
    const stage=currentStage();
    $('resultTitle').textContent=x(stage.number===30?'allDone':outcome?.first?'first':'revisit');
    $('resultBody').textContent=stage.number===30?c('finaleBody'):c('resultBody');
    $('resultStats').textContent=c('resultStats',{number:stage.number,checks:run.checks,count:progress.completed.length});
    const reward=$('checkpointReward');reward.replaceChildren();reward.hidden=!outcome?.lens;
    if(outcome?.lens){const image=document.createElement('img');image.src=LENS_IMAGE;image.alt=c('itemName');reward.append(image,document.createTextNode(c('checkpointReward',{count:outcome.lens,total:progress.lens})));}
    $('themeReward').hidden=!outcome?.earnedTheme;$('themeReward').textContent=x('twilight')+' · '+x('purchased');
    $('atlasProgress').replaceChildren(...Array.from({length:6},(_,arc)=>{const span=document.createElement('span');span.classList.toggle('is-complete',stages.slice(arc*5,arc*5+5).every(s=>progress.completed.includes(s.id)));return span;}));
    $('resultNextBtn').disabled=stage.number===30;
  }
  function burst(index,celebrate){
    if(motion.matches||document.hidden)return;
    const parent=$('boardParticles'),cell=$('habitatGrid').children[index];if(!cell)return;
    const box=cell.getBoundingClientRect(),rect=parent.getBoundingClientRect();
    const scale=parent.clientWidth/rect.width;
    const count=celebrate?18:5;
    parent.replaceChildren();
    for(let i=0;i<count;i++){
      const dot=document.createElement('i');dot.style.left=((box.x+box.width/2-rect.x)*scale)+'px';dot.style.top=((box.y+box.height/2-rect.y)*scale)+'px';parent.append(dot);
      const angle=i/count*Math.PI*2,range=celebrate?75:26;
      const effect=dot.animate([{transform:'translate(0,0)',opacity:1},{transform:'translate('+Math.cos(angle)*range+'px,'+(Math.sin(angle)*range-20)+'px)',opacity:0}],{duration:celebrate?650:350,easing:'ease-out'});
      animations.add(effect);effect.finished.catch(()=>{}).finally(()=>{animations.delete(effect);dot.remove();});
    }
  }
  function openDialog(id,focus){
    closeDialog(false);dialogReturn=document.activeElement;activeDialog=$(id);activeDialog.hidden=false;
    $(state.screen+'Screen').querySelectorAll(':scope > header,:scope > nav').forEach(node=>node.inert=true);
    if(state.screen==='battle'){$('battlePanel').inert=true;scene?.setActive(false);}
    if(state.screen==='stage'){$('stageWorkspace').inert=true;$('themesBtn').inert=true;}
    focus?.focus({preventScroll:true});
  }
  function closeDialog(restore=true){
    if(!activeDialog)return;activeDialog.hidden=true;activeDialog=null;
    ['stageScreen','battleScreen'].forEach(id=>$(id).querySelectorAll(':scope > header,:scope > nav').forEach(node=>node.inert=false));
    $('battlePanel').inert=state.resultVisible;$('stageWorkspace').inert=false;if($('themesBtn'))$('themesBtn').inert=false;
    if(restore&&dialogReturn?.isConnected)dialogReturn.focus({preventScroll:true});
    scene?.setActive(state.screen==='battle');
  }
  function openLeave(){if(state.resultVisible)return returnToStages();saveProgress();openDialog('leaveDialog',$('continueBtn'));}
  function returnToStages(){closeDialog(false);$('resultPanel').hidden=true;setScreen('stage');state.resultVisible=false;stageSelector?.select(state.selectedStage,{focus:true,notify:false});}
  function openThemes(){$('themeStatus').textContent='';renderThemes();openDialog('themeDialog',$('themeCloseBtn'));}
  function renderThemes(){
    let diamonds=0;try{diamonds=window.WeightPlayWallet?.read().diamonds||0;}catch{}
    $('themeBalance').textContent=x('balance',{count:diamonds});
    $('themeChoices').replaceChildren(...['daylight','twilight','aurora'].map(theme=>{
      const owned=progress.themes.includes(theme),active=progress.theme===theme;
      const row=document.createElement('div');row.className='theme-option';
      const swatch=document.createElement('div');swatch.className='theme-swatch';swatch.dataset.theme=theme;swatch.setAttribute('aria-hidden','true');
      const copy=document.createElement('div'),title=document.createElement('strong'),description=document.createElement('small');title.textContent=x(theme);description.textContent=theme==='twilight'&&!owned?x('earn'):x('permanent');copy.append(title,description);
      const button=document.createElement('button');button.type='button';button.className='tool-button';button.dataset.theme=theme;button.textContent=x(active?'equipped':owned?'equip':'buy');button.disabled=active||theme==='twilight'&&!owned;
      if(theme==='twilight'&&!owned)button.textContent=progress.completed.length+'/5';
      if(theme==='aurora'&&!owned){const icon=document.createElement('img');icon.src='/assets/weightplay-diamond.svg';icon.width=18;icon.height=18;icon.alt='';button.prepend(icon);}
      button.addEventListener('click',()=>equipTheme(theme));row.append(swatch,copy,button);return row;
    }));
  }
  function equipTheme(theme){
    if (window.WeightPlayWallet?.withTransaction && !window.WeightPlayWallet.inTransaction()) return window.WeightPlayWallet.withTransaction("animal-habitat-counts:game.js:equipTheme", () => equipTheme(...arguments));

    if(!['daylight','twilight','aurora'].includes(theme))return;
    if(theme==='twilight'&&!progress.themes.includes(theme))return;
    let charged=false;
    if(!progress.themes.includes(theme)){
      try{charged=!!window.WeightPlayWallet?.spendDiamonds(12);}catch{}
      if(!charged){$('themeStatus').textContent=x('insufficient');play('feedback.error');return;}
    }
    const prior=progress.theme;const priorThemes=[...progress.themes];
    progress.theme=theme;if(!progress.themes.includes(theme))progress.themes.push(theme);
    if(!saveProgress()){
      progress.theme=prior;progress.themes=priorThemes;
      if(charged)try{window.WeightPlayWallet.addDiamonds(12);}catch{}
      $('themeStatus').textContent=x('saveFailed');return;
    }
    play(charged?'shop.purchase':'ui.click');renderThemes();$('themeStatus').textContent=charged?x('purchased'):x('equipped');
    $('themeCloseBtn').focus({preventScroll:true});
  }
  async function ensureScene(){
    if(scene){scene.setActive(state.screen==='battle');if(run)scene.update(currentStage(),run.board,progress.theme);return;}
    if(sceneLoading||disposed)return;
    sceneLoading=true;
    try{
      const {createHabitatScene}=await import('./habitat-scene.mjs?v=20261022-habitat-v16&attempt='+sceneAttempts++);
      if(disposed)return;
      scene=createHabitatScene($('terrainCanvas'),$('habitatGrid'),visualFailure);
      $('terrainCanvas').parentElement.classList.add('is-3d');$('visualNotice').hidden=true;
      scene.setActive(state.screen==='battle');if(run)scene.update(currentStage(),run.board,progress.theme);
    }catch{visualFailure();}finally{sceneLoading=false;}
  }
  function visualFailure(){ $('terrainCanvas').parentElement.classList.remove('is-3d');$('visualNotice').hidden=false; }
  function moveGridFocus(event){
    const cell=event.target.closest('.cell');if(!cell||!editable())return;
    if(event.key.toLowerCase()==='x'){event.preventDefault();editCell(Number(cell.dataset.cell),'mark');return;}
    const map={ArrowUp:-currentStage().size,ArrowDown:currentStage().size,ArrowLeft:-1,ArrowRight:1};if(!(event.key in map))return;
    event.preventDefault();const size=currentStage().size,index=Number(cell.dataset.cell),delta=map[event.key];let next=index;
    while(true){const candidate=next+delta;if(candidate<0||candidate>=size*size)return;if(Math.abs(delta)===1&&(candidate/size|0)!==(index/size|0))return;next=candidate;const node=$('habitatGrid').children[next];if(!node.disabled){node.focus({preventScroll:true});return;}}
  }
  function trapFocus(event){
    if(!activeDialog)return;
    if(event.key==='Escape'){event.preventDefault();if(state.resultVisible)returnToStages();else closeDialog();return;}
    if(event.key!=='Tab')return;
    const controls=[...activeDialog.querySelectorAll('button:not(:disabled),[href],select')].filter(node=>node.getClientRects().length);
    const index=controls.indexOf(document.activeElement);if(event.shiftKey&&index<=0){event.preventDefault();controls.at(-1)?.focus();}else if(!event.shiftKey&&(index===controls.length-1||index<0)){event.preventDefault();controls[0]?.focus();}
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const language=$('languageSelect');Object.keys(locales).forEach(key=>{const option=document.createElement('option');option.value=key;option.textContent=locales.en.languageNames[key]||key;language.append(option);});language.value=state.locale;
    language.addEventListener('change',()=>{state.locale=language.value;applyLocale();});
    applyLocale();
    $('habitatGrid').addEventListener('click',event=>{const cell=event.target.closest('.cell');if(cell)editCell(Number(cell.dataset.cell));});
    $('habitatGrid').addEventListener('contextmenu',event=>{const cell=event.target.closest('.cell');if(cell){event.preventDefault();editCell(Number(cell.dataset.cell),'mark');}});
    $('habitatGrid').addEventListener('keydown',moveGridFocus);
    $('habitatGrid').addEventListener('focusin',event=>{const cell=event.target.closest('.cell');if(!cell)return;const index=Number(cell.dataset.cell),size=currentStage().size;document.querySelectorAll('.clue').forEach(node=>node.classList.toggle('is-focus',Number(node.dataset.clueIndex)===(node.dataset.clueType==='row'?(index/size|0):index%size)));});
    $('habitatGrid').addEventListener('focusout',()=>document.querySelectorAll('.clue.is-focus').forEach(node=>node.classList.remove('is-focus')));
    $('zoneClues').addEventListener('click',event=>{const node=event.target.closest('[data-zone]');if(!node||!editable())return;const id=Number(node.dataset.zone);state.selectedZone=state.selectedZone===id?null:id;updateBoard();});
    $('startBtn').addEventListener('click',startGame);$('stageBackBtn').addEventListener('click',()=>setScreen('main'));$('battleBackBtn').addEventListener('click',openLeave);
    $('plantBtn').addEventListener('click',()=>{state.mode='plant';updateBoard();});$('markBtn').addEventListener('click',()=>{state.mode='mark';updateBoard();});
    $('undoBtn').addEventListener('click',undo);$('clearBtn').addEventListener('click',resetBoard);$('checkBtn').addEventListener('click',checkBoard);
    $('helpBtn').addEventListener('click',()=>openDialog('helpDialog',$('helpCloseBtn')));$('helpCloseBtn').addEventListener('click',()=>closeDialog());
    $('continueBtn').addEventListener('click',()=>closeDialog());$('confirmLeaveBtn').addEventListener('click',returnToStages);
    $('resultMapBtn').addEventListener('click',returnToStages);$('resultReplayBtn').addEventListener('click',()=>startStage(state.roundIndex,{fresh:true}));$('resultNextBtn').addEventListener('click',()=>{if(state.roundIndex<29)startStage(state.roundIndex+1);});
    $('themeCloseBtn').addEventListener('click',()=>closeDialog());$('retryVisualBtn').addEventListener('click',()=>{scene?.dispose();scene=null;ensureScene();});
    document.addEventListener('keydown',event=>{trapFocus(event);if(!activeDialog&&editable()&&event.key.toLowerCase()==='z'&&!event.metaKey&&!event.altKey){event.preventDefault();undo();}});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){settleMotion();if(run&&!state.resultVisible)saveProgress();}});
    window.addEventListener('pagehide',event=>{saveProgress();settleMotion();if(!event.persisted){disposed=true;scene?.dispose();scene=null;}});
    window.addEventListener('pageshow',event=>{if(event.persisted)scene?.setActive(state.screen==='battle');});
    screenFrame=window.mountHabitatCountsFrame();renderStages();setScreen('main');
  });
  window.ANIMAL_HABITAT_COUNTS_TEST={stages,startGame,startStage,checkBoard,state,saveProgress,readProgress};
})();
