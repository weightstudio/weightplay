/* Tangle Rescue v14: scene/save controller. Rules and board input are separate. */
(() => {
  'use strict';
  const { boards, tokens, minimumMoves, hintPair, exchange, rating, cleanCompleted } = window.TanglePuzzle;
  const dictionaries = window.TANGLE_RESCUE_LOCALES;
  const $ = id => document.getElementById(id);
  const read = (key, fallback) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const json = (key, fallback) => { try { return JSON.parse(read(key, JSON.stringify(fallback))); } catch { return fallback; } };
  const state = { locale: 'en', screen: 'main', board: 0, selectedStage: 0, current: [], selected: -1,
    swaps: 0, history: [], hint: [], hints: 0, errorRows: [], completed: cleanCompleted(json('weightplay-animal-tangle-rescue-completed', [])),
    statusKey: 'ready', statusVars: {}, statusError: false, dialog: false, settled: false };
  let selector = null, frame = null, transition = 0, generation = 0, dialogReturn = null;
  const audio = window.WeightPlayAudio?.createScope();
  const sound = id => audio?.play(id);
  const copy = (key, vars = {}) => {
    let value = dictionaries[state.locale]?.[key] ?? dictionaries.en?.[key] ?? key;
    for (const [key, val] of Object.entries(vars)) value = value.replaceAll(`{${key}}`, String(val));
    return value;
  };
  const animalName = token => copy(tokens[token].copy) + (boards[state.board].target.length > 4 ? ` ${tokens[token].suffix}` : '');
  const highestUnlocked = () => Math.min(boards.length-1, state.completed.reduce((max, row) => Math.max(max,row+1), 0));
  const isUnlocked = row => row === 0 || state.completed.includes(row-1);
  const canInput = () => state.screen === 'battle' && !state.dialog && !state.settled && !document.hidden && !transition;
  const bestFor = row => Math.max(0, Number(read(`weightplay-animal-tangle-rescue-best-${row}`, '0')) || 0);
  const starsFor = row => Math.min(3, Math.max(0, Number(read(`weightplay-animal-tangle-rescue-stars-${row}`, '0')) || 0));
  function status(key, vars = {}, error = false) { state.statusKey=key; state.statusVars=vars; state.statusError=error; }
  function stageRecord(row) {
    const board = boards[row]; if (!board) return null;
    const stars = starsFor(row);
    return { id:row+1, arc:board.arc, checkpoint:board.checkpoint,
      title:copy(`boardTitle${row+1}`), hint:copy(`boardHint${row+1}`),
      kicker:copy('round',{number:row+1,total:boards.length}),
      summary:copy('masteryGuide'), status:state.completed.includes(row) ? `${copy('completed')} ${'★'.repeat(stars)}` : isUnlocked(row) ? copy('readyStage') : '—',
      locked:!isUnlocked(row), cleared:state.completed.includes(row) };
  }
  function refreshText() {
    document.querySelectorAll('[data-copy]').forEach(node => node.textContent=copy(node.dataset.copy));
    document.querySelectorAll('[data-copy-aria-label]').forEach(node => node.setAttribute('aria-label',copy(node.dataset.copyAriaLabel)));
    $('mainProgress').textContent=copy('progress',{count:state.completed.length,total:boards.length});
    if (state.screen==='stage') selector?.refresh(state.selectedStage);
    if (state.screen==='battle') render();
  }
  function locale(value) {
    state.locale=dictionaries[value] ? value : 'en';
    document.documentElement.lang=state.locale; document.documentElement.dir=state.locale==='ar'?'rtl':'ltr';
    $('languageSelect').value=state.locale; refreshText();
  }
  function settleMotion() { boardView.settle(); audio?.stop(); }
  function applyScreen(next) {
    state.screen=next;
    const scene=next==='result'?'battle':next;
    document.body.dataset.screen=scene;
    ['main','stage','battle'].forEach(name => { const node=$(name+'Screen'); node.hidden=name!==scene; node.inert=name!==scene; node.classList.toggle('active',name===scene); });
    $('guideScreen').hidden=scene!=='main';
    $('battlePlayLayer').hidden=next==='result'; $('battlePlayLayer').inert=next==='result';
    $('resultScreen').hidden=next!=='result'; $('resultScreen').inert=next!=='result';
    $('resultScreen').classList.toggle('active',next==='result');
    frame?.activate(scene,{covered:next==='result'});
    if(next==='main') refreshText();
    if(next==='stage') { selector?.refresh(state.selectedStage); $('stageBackBtn').focus({preventScroll:true}); }
    if(next==='battle') { render(); $('boardDiagram').querySelector('[data-endpoint]:not(:disabled)')?.focus({preventScroll:true}); }
    if(next==='result') { $('resultScreen').scrollTop=0; $('resultHeading').focus({preventScroll:true}); }
    window.scrollTo(0,0);
  }
  function setScreen(next) {
    clearTimeout(transition); transition=0; generation+=1; settleMotion();
    $('app').inert=false; $('app').classList.remove('scene-exiting');
    if(state.screen===next || matchMedia('(prefers-reduced-motion: reduce)').matches) { applyScreen(next); return; }
    const ticket=generation;
    $('app').inert=true; $('app').classList.add('scene-exiting');
    transition=setTimeout(() => {
      if(ticket!==generation)return;
      transition=0; $('app').inert=false; $('app').classList.remove('scene-exiting'); applyScreen(next);
    },110);
  }
  function render(motion=[]) {
    const board=boards[state.board], count=state.current.filter((token,row)=>token===board.target[row]).length;
    $('battleHeading').textContent=copy('round',{number:state.board+1,total:boards.length});
    $('roundHint').textContent=stageRecord(state.board).title;
    $('progressBadge').textContent=copy('liveConnected',{count,total:board.target.length});
    $('moveCount').textContent=String(state.swaps);
    $('parCount').textContent=String(minimumMoves(board.start,board.target));
    $('rescueMeter').style.setProperty('--progress',`${count/board.target.length*100}%`);
    $('rescueMeter').setAttribute('aria-label',copy('liveConnected',{count,total:board.target.length}));
    $('battleStatus').textContent=copy(state.statusKey,state.statusVars);
    $('battleStatus').classList.toggle('error',state.statusError);
    $('undoBtn').disabled=state.history.length===0;
    $('hintBtn').disabled=count===board.target.length;
    $('checkBtn').classList.toggle('rescue-ready',count===board.target.length);
    $('checkBtn').textContent=copy(count===board.target.length?'rescueNow':'check');
    boardView.update(board,state,copy,motion);
  }
  function select(row) {
    if(!canInput()||(boards[state.board].lockedRows||[]).includes(row))return;
    if(state.selected===row) { cancelSelection();return; }
    if(state.selected>=0) { swap(state.selected,row);return; }
    state.selected=row; state.hint=[]; state.errorRows=[]; status('selectSecond'); render();
  }
  function cancelSelection() { state.selected=-1; state.hint=[]; status('ready'); if(state.screen==='battle')render(); }
  function swap(first,second) {
    if(!canInput())return;
    const next=exchange(state.current,boards[state.board],first,second); if(!next)return;
    const before=state.current.filter((t,i)=>t===boards[state.board].target[i]).length;
    state.history.push(state.current.slice());
    state.current=next; state.swaps+=1; state.selected=-1; state.hint=[]; state.errorRows=[];
    const after=state.current.filter((t,i)=>t===boards[state.board].target[i]).length;
    status(after===next.length?'allHome':'swapped',{first:animalName(next[first]),second:animalName(next[second])});
    sound(after>before?'puzzle.match':'board.move'); render([first,second]);
  }
  function undo() {
    if(!canInput()||!state.history.length)return;
    state.current=state.history.pop(); state.swaps=state.history.length; state.selected=-1; state.hint=[]; state.errorRows=[];
    status('undoDone'); sound('board.undo'); render(state.current.map((_,row)=>row));
  }
  function hint() {
    if(!canInput())return;
    const pair=hintPair(state.current,boards[state.board]); if(!pair.length)return;
    // Repeated viewing of the same hint does not inflate the hint count.
    if(state.hint.join()!==pair.join())state.hints+=1;
    state.selected=-1; state.hint=pair; state.errorRows=[];
    status('hintPair',{first:pair[0]+1,second:pair[1]+1}); sound('feedback.hint'); render();
  }
  function reset() {
    if(!canInput())return;
    state.current=boards[state.board].start.slice(); state.history=[]; state.swaps=0; state.hints=0;
    state.selected=-1; state.hint=[]; state.errorRows=[]; status('resetDone'); render(state.current.map((_,row)=>row));
  }
  function startBoard(row) {
    if(!Number.isInteger(row)||row<0||row>=boards.length||!isUnlocked(row))return;
    state.board=row; state.selectedStage=row; state.current=boards[row].start.slice();
    state.swaps=0; state.history=[]; state.hints=0; state.hint=[]; state.selected=-1; state.errorRows=[]; state.settled=false;
    status('ready'); applyTheme(); setScreen('battle'); sound('game.start');
  }
  function check() {
    if(!canInput())return;
    const board=boards[state.board];
    state.errorRows=state.current.map((token,row)=>token===board.target[row]?-1:row).filter(row=>row>=0);
    if(state.errorRows.length) { status('incorrectRows',{rows:state.errorRows.map(row=>row+1).join(', ')},true); sound('feedback.error'); render();return; }
    state.settled=true;
    if(!state.completed.includes(state.board))state.completed.push(state.board);
    const saved=write('weightplay-animal-tangle-rescue-completed',JSON.stringify(state.completed));
    const best=bestFor(state.board), nextBest=best?Math.min(best,state.swaps):state.swaps;
    write(`weightplay-animal-tangle-rescue-best-${state.board}`,String(nextBest));
    const stars=rating(state.swaps,minimumMoves(board.start,board.target),state.hints);
    write(`weightplay-animal-tangle-rescue-stars-${state.board}`,String(Math.max(stars,starsFor(state.board))));
    $('resultHeading').textContent=copy(state.completed.length===boards.length?'campaignComplete':'resultTitle');
    $('resultText').textContent=copy(!saved?'saveUnavailable':stars===3?'perfectRescue':'rescueComplete');
    $('resultStats').textContent=copy('stats',{moves:copy('placements',{count:state.swaps}),best:copy('placements',{count:nextBest})});
    $('resultStars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);
    $('resultStars').setAttribute('aria-label',copy('starsEarned',{count:stars}));
    $('rescuedAnimals').innerHTML=board.target.map(token=>`<span class="rescued-token">${boardView.sprite(token)}</span>`).join('');
    $('nextStageBtn').disabled=state.board===boards.length-1;
    setScreen('result'); sound('puzzle.clear');
  }
  function openLeave(event) {
    if(state.screen==='result') { state.selectedStage=highestUnlocked();setScreen('stage');return; }
    if(!canInput())return;
    state.dialog=true; dialogReturn=event?.currentTarget || $('battleBackBtn'); settleMotion();
    $('battlePlayLayer').inert=true;
    $('battleScreen').querySelector('header').inert=true;
    $('leaveText').textContent=copy('leaveBoardText',{number:state.board+1,moves:state.swaps});
    $('leaveDialog').hidden=false; $('cancelLeaveBtn').focus({preventScroll:true});
  }
  function closeLeave(leave=false) {
    $('leaveDialog').hidden=true; state.dialog=false; $('battlePlayLayer').inert=false;
    $('battleScreen').querySelector('header').inert=false;
    if(leave) { state.selectedStage=state.board;setScreen('stage'); }
    else dialogReturn?.focus({preventScroll:true});
  }
  function trap(event,node) {
    if(event.key!=='Tab')return;
    const focusable=[...node.querySelectorAll('button:not(:disabled),[tabindex="0"]')].filter(el=>el.getClientRects().length);
    if(!focusable.length)return;
    const index=focusable.indexOf(document.activeElement);
    if(index<0 || (!event.shiftKey&&index===focusable.length-1) || (event.shiftKey&&index===0)) {
      event.preventDefault();focusable[event.shiftKey?focusable.length-1:0].focus();
    }
  }
  const THEME_KEY='weightplay-tangle-firefly-v1', THEME_ACTIVE='weightplay-tangle-theme';
  const ownedTheme=()=>read(THEME_KEY,'')==='owned';
  function applyTheme() { $('battlePlayLayer').dataset.theme=ownedTheme()&&read(THEME_ACTIVE,'')==='firefly'?'firefly':'forest'; }
  function themePanel() {
    [...$('stageScreen').children].forEach(node=>{if(node!==$('themeDialog'))node.inert=true;});
    $('themeDialog').hidden=false;
    $('themeBalance').textContent=String(window.WeightPlayWallet?.read().diamonds||0);
    $('themeBuyBtn').textContent=copy(ownedTheme()?'useFirefly':'buyTheme');
    $('themeStatus').textContent=copy(ownedTheme()?'themeOwned':'themeDescription');
    $('themeCloseBtn').focus({preventScroll:true});
  }
  function buyTheme() {
    if(!ownedTheme()) {
      if((window.WeightPlayWallet?.read().diamonds||0)<40) { $('themeStatus').textContent=copy('notEnough');sound('feedback.error');return; }
      // Check persistence before charging; failed wallet writes cannot grant the theme.
      if(!write(THEME_KEY,'pending')) { $('themeStatus').textContent=copy('saveUnavailable');return; }
      try {
        if(!window.WeightPlayWallet.spendDiamonds(40)) { localStorage.removeItem(THEME_KEY);return; }
        if(!write(THEME_KEY,'owned')) { window.WeightPlayWallet.addDiamonds(40);localStorage.removeItem(THEME_KEY);$('themeStatus').textContent=copy('saveUnavailable');return; }
      } catch { $('themeStatus').textContent=copy('saveUnavailable');return; }
      sound('shop.purchase');
    }
    write(THEME_ACTIVE,'firefly');applyTheme();themePanel();$('themeStatus').textContent=copy('themeActive');
  }
  const boardView=window.TangleBoardView($('boardDiagram'),{select,swap,cancel:cancelSelection,canInput,
    focus(row){state.selected=row;state.hint=[];status('dragToSwap');render();}});
  $('startBtn').onclick=()=>setScreen('stage');$('guideStartBtn').onclick=()=>setScreen('stage');
  $('stageBackBtn').onclick=()=>setScreen('main');$('battleBackBtn').onclick=openLeave;
  $('checkBtn').onclick=check;$('resetBtn').onclick=reset;$('undoBtn').onclick=undo;$('hintBtn').onclick=hint;
  $('cancelLeaveBtn').onclick=()=>closeLeave();$('confirmLeaveBtn').onclick=()=>closeLeave(true);
  $('stageTab').onclick=()=>selector?.select(state.selectedStage,{focus:true});
  $('resultStagesBtn').onclick=()=>{state.selectedStage=highestUnlocked();setScreen('stage');};
  $('retryBtn').onclick=()=>startBoard(state.board);
  $('nextStageBtn').onclick=()=>{if(state.board<boards.length-1)startBoard(state.board+1);};
  $('themeBtn').onclick=themePanel;$('themeCloseBtn').onclick=()=>{
    $('themeDialog').hidden=true; [...$('stageScreen').children].forEach(node=>node.inert=false); $('themeBtn').focus();
  };
  $('languageSelect').addEventListener('change',event=>window.WonderI18n?.setLocale(event.target.value));
  $('themeBuyBtn').onclick=buyTheme;
  $('themeDefaultBtn').onclick=()=>{write(THEME_ACTIVE,'forest');applyTheme();$('themeStatus').textContent=copy('themeActive');};
  document.addEventListener('keydown',event=>{
    if(!$('themeDialog').hidden){if(event.key==='Escape')$('themeCloseBtn').click();else trap(event,$('themeDialog'));return;}
    if(state.dialog){if(event.key==='Escape'){event.preventDefault();closeLeave();}else trap(event,$('leaveDialog'));return;}
    if(state.screen==='result')trap(event,$('resultScreen'));
    if(canInput()&&(event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();undo();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)settleMotion();else if(state.screen==='battle')boardView.trace();});
  window.addEventListener('pagehide',()=>{
    clearTimeout(transition);transition=0;generation+=1;$('app').inert=false;$('app').classList.remove('scene-exiting');settleMotion();
  });
  window.addEventListener('pageshow',()=>{if(state.screen==='battle')boardView.trace();});
  window.addEventListener('wonder:locale-change',event=>locale(event.detail?.locale||document.documentElement.lang));
  window.AnimalTangleRescueI9=Object.freeze({
    get activeScene(){return state.screen==='result'?'battle':state.screen;},get isResult(){return state.screen==='result';},
    get selectedStage(){return state.selectedStage;},get stageCount(){return boards.length;},get screen(){return state.screen;},
    stageRecord,startBoard,
    selectStage(row){state.selectedStage=Math.max(0,Math.min(boards.length-1,row));},
    setStageSelector(value){selector=value;selector.refresh(state.selectedStage);},
    setFrame(value){frame=value;frame.activate(this.activeScene,{covered:this.isResult});},
  });
  state.selectedStage=highestUnlocked();
  locale(window.WonderI18n?.actualLocale?.()||document.documentElement.lang||'en');
  $('app').hidden=false;applyTheme();applyScreen('main');
  window.WeightPlayAudio?.preload(['game.start','board.move','board.undo','puzzle.match','puzzle.clear','feedback.hint','feedback.error','shop.purchase']);
})();
