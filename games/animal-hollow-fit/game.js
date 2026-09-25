/* Burrow Shape Match v10 / shared Interface 7. No private frame or sound engine. */
(() => {
  'use strict';
  const P = window.HollowPuzzles, L = window.ANIMAL_HOLLOW_FIT_LOCALES;
  const $ = id => document.getElementById(id);
  const KEY = 'weightplay-animal-hollow-fit-expedition-v10';
  const ROUTES = {en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
  const NAMES = ['English','繁體中文','简体中文','日本語','한국어','Español','Português','Français','Deutsch','Italiano','Русский','हिन्दी','العربية'];
  const abort = new AbortController(), motions = new Set(), effects = new Set();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const audio = window.WeightPlayAudio?.createScope?.();
  let epoch = 0, frame, round, lastFocus, progress, storageOK = true, destroyed = false;
  const state = {view:'main', phase:'idle', locale:'en', index:0, selected:null, turns:0, flipped:false, attempts:0, hinted:false, seed:0, beforeLeave:'play'};
  try { progress = P.readProgress(localStorage.getItem(KEY)); } catch { progress = P.readProgress(null); storageOK = false; }
  const t = (key, vars = {}) => String(L[state.locale][key]).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`);
  const listen = (target, event, fn, options = {}) => target.addEventListener(event, fn, {...options, signal:abort.signal});
  const sound = id => audio?.play(id);
  const starTotal = () => progress.stars.reduce((sum, value) => sum + value, 0);
  const pattern = () => state.selected === null ? Array(25).fill(0) : P.transform(round.options[state.selected], state.turns, state.flipped);
  function motion(node, frames, duration = 240) {
    if (!node || destroyed || reduced.matches || typeof node.animate !== 'function') return Promise.resolve();
    const handle = node.animate(frames, {duration, easing:'cubic-bezier(.2,.75,.25,1)', fill:'none'});
    motions.add(handle); if (document.hidden) handle.pause();
    return handle.finished.catch(() => {}).finally(() => { motions.delete(handle); handle.cancel(); });
  }
  function clearMotion() {
    for (const handle of motions) handle.cancel();
    motions.clear(); for (const node of effects) node.remove(); effects.clear();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(progress)); storageOK = true; } catch { storageOK = false; }
    updateProgress();
  }
  function updateProgress() {
    $('main-progress').textContent = t('progressText', {done:progress.stars.filter(Boolean).length,total:P.TOTAL,stars:starTotal()});
    $('star-count').textContent = String(starTotal());
    document.querySelectorAll('[data-storage-warning]').forEach(node => {node.hidden = storageOK; node.textContent = t('storageWarning');});
  }
  function applyLocale() {
    const copy = L[state.locale];
    document.documentElement.lang = state.locale; document.documentElement.dir = copy.direction;
    document.title = `${copy.title} | WeightPlay`;
    document.querySelectorAll('[data-copy]').forEach(node => {node.textContent = copy[node.dataset.copy];});
    document.querySelectorAll('[data-copy-aria]').forEach(node => node.setAttribute('aria-label', copy[node.dataset.copyAria]));
    document.querySelectorAll('[data-copy-alt]').forEach(node => node.alt = copy[node.dataset.copyAlt]);
    $('locale-select').value = state.locale;
    document.querySelector('[data-wp-return="main"]').href = `/${ROUTES[state.locale]}/`;
    document.querySelectorAll('[data-related-game]').forEach(node => {node.href=`/${ROUTES[state.locale]}/games/${node.dataset.relatedGame}/`;});
    updateProgress(); frame?.refresh();
  }
  function chooseLocale() {
    const route = location.pathname.split('/').filter(Boolean)[0];
    const fromRoute = Object.keys(ROUTES).find(k => ROUTES[k] === route);
    const query = new URLSearchParams(location.search).get('lang');
    // A localized route owns both runtime copy and its static SEO metadata.
    let saved; try { saved = localStorage.getItem('weightplay-animal-hollow-fit-locale'); } catch {}
    return fromRoute || (L[query] ? query : L[saved] ? saved : 'en');
  }
  function fit() {
    if (state.view !== 'battle') return;
    const viewport = $('battleViewport'), canvas = $('logicalCanvas');
    const w = viewport.clientWidth, h = viewport.clientHeight;
    if (!w || !h) return;
    // One uniform scale; flexible logical rows consume the full safe envelope.
    const landscape = w / h > 1.25;
    const minW = landscape ? 740 : 390, minH = landscape ? 300 : 560;
    const scale = Math.min(w / minW, h / minH);
    canvas.style.setProperty('--wp-battle-canvas-scale', String(scale));
    canvas.style.setProperty('--hollow-logical-width', `${w / scale}px`);
    canvas.style.setProperty('--hollow-logical-height', `${h / scale}px`);
    canvas.classList.toggle('wide', landscape);
  }
  function gridLabel(p) {
    return Array.from({length:5},(_, row) => t('rowPattern', {row:row+1,cells:p.slice(row*5,row*5+5).flatMap((v,col)=>v?[col+1]:[]).join(', ')||t('empty')})).join(' ');
  }
  function drawGrid(node, p, target = false, mismatches = []) {
    node.setAttribute('aria-label', gridLabel(target ? round.required : p));
    node.replaceChildren(...p.map((value,i) => {
      const cell = document.createElement('span'); cell.className='shape-cell'; cell.setAttribute('aria-hidden','true');
      if (target) {if(round.required[i])cell.classList.add('opening');if(round.fixed[i])cell.classList.add('fixed');}
      else if(value)cell.classList.add('filled');
      if(mismatches.includes(i))cell.classList.add('mismatch'); return cell;
    }));
  }
  function enableControls() {
    const live = state.phase === 'play', selected = state.selected !== null;
    for(const node of $('piece-options').children)node.disabled=!live;
    for(const id of ['check-button','rotate-button','mirror-button','reset-button'])$(id).disabled=!live||!selected;
    $('hint-button').disabled=!live||state.hinted;
  }
  function updateCards() {
    [...$('piece-options').children].forEach((node,i) => {
      node.setAttribute('aria-pressed', String(state.selected === i));
      drawGrid(node.querySelector('.shape-grid'), state.selected === i ? pattern() : round.options[i]);
    });
    $('selection-note').textContent=state.selected===null?'':t('selected',{n:state.selected+1});
    enableControls();
  }
  function select(index) {
    if(state.phase!=='play'||!Number.isInteger(index)||index<0||index>=3)return;
    state.selected=index;state.turns=0;state.flipped=false;
    updateCards();drawGrid($('target-grid'),round.target,true);
    $('battle-status').textContent=t('chooseHint');$('battle-status').dataset.kind='';
    motion($('piece-options').children[index].querySelector('.shape-grid'),[{transform:'scale(.92)'},{transform:'scale(1)'}],180);
  }
  async function changePiece(action) {
    if(state.phase!=='play'||state.selected===null)return;
    if(action==='rotate'&&!round.rotate||action==='mirror'&&!round.mirror)return;
    const token=++epoch;state.phase='turning';
    if(action==='rotate')state.turns=(state.turns+1)%4;
    // Horizontal reflection of the CURRENT image reverses the accumulated rotation.
    if(action==='mirror'){state.turns=(4-state.turns)%4;state.flipped=!state.flipped;}
    if(action==='reset'){state.turns=0;state.flipped=false;}
    updateCards();drawGrid($('target-grid'),round.target,true);
    const node=$('piece-options').children[state.selected].querySelector('.shape-grid');
    await motion(node,[{transform:action==='rotate'?'rotate(-90deg)':action==='mirror'?'scaleX(-1)':'scale(.94)'},{transform:'none'}],220);
    if(epoch!==token||state.view!=='battle')return;state.phase='play';enableControls();
  }
  function hint() {
    if(state.phase!=='play'||state.hinted)return;
    state.hinted=true;sound('feedback.hint'); const p=pattern();const mismatch=round.required.map((v,i)=>v!==p[i]?i:-1).filter(i=>i>=0);
    const index=mismatch[0]??round.required.indexOf(1), row=Math.floor(index/5);
    drawGrid($('target-grid'),round.target,true,mismatch.filter(i=>Math.floor(i/5)===row));
    $('battle-status').textContent=t('hintText',{row:row+1});$('battle-status').dataset.kind='';enableControls();
    motion($('target-grid'),[{opacity:.65},{opacity:1}],220);
  }
  function loadRound(index) {
    ++epoch;clearMotion();state.index=index;state.selected=null;state.turns=0;state.flipped=false;state.attempts=0;state.hinted=false;state.phase='play';
    round=P.make(index,(state.seed+index*2654435761)>>>0);
    $('room-count').textContent=`${index+1} / ${P.TOTAL}`;$('check-count').textContent='0';
    $('chapter-title').textContent=L[state.locale].chapters[round.chapter];
    $('chapter-rule').textContent=L[state.locale].rules[round.chapter];
    $('target-hint').textContent=t(round.patch?'patchHint':'targetHint');
    $('fixed-legend').hidden=!round.patch;$('rotate-button').hidden=!round.rotate;$('mirror-button').hidden=!round.mirror;$('reset-button').hidden=!round.rotate&&!round.mirror;$('reset-button').parentElement.hidden=!round.rotate&&!round.mirror;
    $('chapter-progress').replaceChildren(...Array.from({length:5},(_,i)=>{const n=document.createElement('span');n.className=i<index%5?'done':i===index%5?'current':'';return n;}));
    drawGrid($('target-grid'),round.target,true);
    $('piece-options').replaceChildren(...round.options.map((p,i)=>{
      const node=document.createElement('button');node.type='button';node.className='piece-card';node.dataset.piece=String(i);node.setAttribute('aria-pressed','false');
      const grid=document.createElement('div');grid.className='shape-grid';grid.setAttribute('role','img');drawGrid(grid,p);
      const label=document.createElement('strong');label.textContent=t('pieceName',{n:i+1});node.append(grid,label);return node;
    }));
    $('selection-note').textContent='';$('battle-status').textContent=t('chooseHint');$('battle-status').dataset.kind='';
    $('resultPanel').hidden=true;$('leavePanel').hidden=true;$('battleViewport').inert=false;
    frame.activate('battle');fit();updateProgress();enableControls();
    motion($('target-grid'),[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'none'}],280);
    [...$('piece-options').children].forEach(node=>motion(node.querySelector('.shape-grid'),[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],300));
    $('chapter-title').focus({preventScroll:true});
  }
  function start(index) {
    if(state.view==='battle'&&state.phase!=='result')return;
    const next=Number.isInteger(index)?index:progress.stars.findIndex(v=>v===0);
    const seed=new Uint32Array(1);crypto.getRandomValues(seed);state.seed=seed[0];
    state.view='battle';$('mainScreen').hidden=true;$('gameGuide').hidden=true;$('battleScreen').hidden=false;
    loadRound(next<0?0:next);sound('game.start');
  }
  async function settle() {
    const source=$('piece-options').children[state.selected].querySelector('.shape-grid'),target=$('target-grid');
    if(reduced.matches)return;
    const from=source.getBoundingClientRect(),to=target.getBoundingClientRect(),canvas=$('logicalCanvas');
    const scale=parseFloat(canvas.style.getPropertyValue('--wp-battle-canvas-scale'))||1;
    const ghost=source.cloneNode(true);ghost.removeAttribute('role');ghost.removeAttribute('aria-label');ghost.classList.add('flying-piece');
    ghost.style.width=`${to.width/scale}px`;ghost.style.height=`${to.height/scale}px`;ghost.style.inset='0';
    const holder=$('match-effects');const h=holder.getBoundingClientRect();
    ghost.style.left=`${(to.left-h.left)/scale}px`;ghost.style.top=`${(to.top-h.top)/scale}px`;holder.append(ghost);effects.add(ghost);
    await motion(ghost,[{transform:`translate(${(from.left-to.left)/scale}px,${(from.top-to.top)/scale}px) scale(${from.width/to.width})`,opacity:.8},{transform:'none',opacity:1}],380);
    ghost.remove();effects.delete(ghost);
  }
  function advance() {
    if(state.index%5===4){
      state.phase='result';$('resultPanel').hidden=false;$('battleViewport').inert=true;frame.activate('battle',{covered:true});
      const start=round.chapter*5, stars=progress.stars.slice(start,start+5).reduce((a,b)=>a+b,0);
      $('result-text').textContent=t('resultText',{chapter:round.chapter+1,stars});$('continue-button').hidden=state.index===P.TOTAL-1;
      updateProgress();motion($('resultPanel').querySelector('.overlay-card'),[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],320);
      sound(state.index===P.TOTAL-1?'result.win':'game.checkpoint');$('result-title').focus({preventScroll:true});
    }else loadRound(state.index+1);
  }
  async function check() {
    if(state.phase!=='play'||state.selected===null)return;
    state.attempts++;$('check-count').textContent=String(state.attempts);
    const p=pattern();
    if(!P.solve(round,p)){
      drawGrid($('target-grid'),round.target,true,round.required.flatMap((v,i)=>v!==p[i]?[i]:[]));
      $('battle-status').textContent=t('wrong');$('battle-status').dataset.kind='wrong';sound('feedback.error');
      motion($('piece-options').children[state.selected].querySelector('.shape-grid'),[{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'none'}],240);return;
    }
    state.phase='settling';const token=++epoch;enableControls();
    progress.stars[state.index]=Math.max(progress.stars[state.index],P.stars(state.attempts,state.hinted));save();
    $('battle-status').textContent=t('correct');$('battle-status').dataset.kind='correct';sound('puzzle.match');
    await Promise.all([settle(),motion($('target-grid'),[{filter:'brightness(1)'},{filter:'brightness(1.55)'},{filter:'brightness(1)'}],420)]);
    if(epoch!==token||state.view!=='battle')return;advance();
  }
  function requestLeave() {
    if(state.view!=='battle'||state.phase==='leave'||state.phase==='result')return;
    state.beforeLeave=state.phase==='settling'?'settling':'play';lastFocus=document.activeElement;
    ++epoch;clearMotion();state.phase='leave';$('leavePanel').hidden=false;$('battleViewport').inert=true;frame.activate('battle',{covered:true});
    $('stay-button').focus({preventScroll:true});
  }
  function stay() {
    if(state.phase!=='leave')return;
    $('leavePanel').hidden=true;$('battleViewport').inert=false;frame.activate('battle');
    if(state.beforeLeave==='settling'){advance();return;}
    state.phase='play';enableControls();lastFocus?.focus({preventScroll:true});
  }
  function home() {
    ++epoch;clearMotion();audio?.stop();state.view='main';state.phase='idle';state.selected=null;
    $('resultPanel').hidden=true;$('leavePanel').hidden=true;$('battleViewport').inert=false;
    $('battleScreen').hidden=true;$('mainScreen').hidden=false;$('gameGuide').hidden=false;frame.activate('main');applyLocale();
    $('start-button').focus({preventScroll:true});motion($('mainContent'),[{opacity:.4},{opacity:1}],220);
  }
  function trap(event) {
    if(event.defaultPrevented||state.view!=='battle')return;
    if(event.key==='Escape'){event.preventDefault();if(state.phase==='leave')stay();else if(state.phase==='result')home();else requestLeave();return;}
    const panel=state.phase==='leave'?$('leavePanel'):state.phase==='result'?$('resultPanel'):null;
    if(event.key!=='Tab'||!panel)return;
    const nodes=[...panel.querySelectorAll('button:not(:disabled)')].filter(n=>!n.hidden);
    const i=nodes.indexOf(document.activeElement);
    if(event.shiftKey&&(i<=0)){event.preventDefault();nodes.at(-1)?.focus();}
    else if(!event.shiftKey&&(i===nodes.length-1||i===-1)){event.preventDefault();nodes[0]?.focus();}
  }
  function destroy() {
    if(destroyed)return;destroyed=true;++epoch;clearMotion();abort.abort();observer.disconnect();audio?.dispose();frame.destroy();
  }
  state.locale=chooseLocale();
  $('locale-select').replaceChildren(...Object.keys(ROUTES).map((code,i)=>{const o=document.createElement('option');o.value=code;o.textContent=NAMES[i];return o;}));
  applyLocale();
  frame=window.WeightPlayScreenFrame.mount({root:$('app'),localeSelect:$('locale-select'),scenes:{
    main:{root:$('mainScreen'),header:$('mainHeader'),content:$('mainContent')},
    battle:{root:$('battleScreen'),header:$('battleHeader'),content:$('battleViewport'),headerInfo:$('battleHud')}
  }});
  frame.activate('main');
  listen($('locale-select'),'change',e=>{
    if(state.view!=='main'||!L[e.target.value])return;
    const next=e.target.value;try{localStorage.setItem('weightplay-animal-hollow-fit-locale',next);}catch{}
    // Navigate to real authored localized HTML so metadata and content remain aligned.
    const url=new URL(`/${ROUTES[next]}/games/animal-hollow-fit/`,location.origin);location.assign(url.href);
  });
  listen($('start-button'),'click',()=>start());
  listen($('guide-button'),'click',()=>{$('gameGuide').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});});
  listen($('piece-options'),'click',e=>{const node=e.target.closest('[data-piece]');if(node)select(Number(node.dataset.piece));});
  listen($('rotate-button'),'click',()=>changePiece('rotate'));listen($('mirror-button'),'click',()=>changePiece('mirror'));listen($('reset-button'),'click',()=>changePiece('reset'));
  listen($('check-button'),'click',check);listen($('hint-button'),'click',hint);listen($('battle-home'),'click',requestLeave);listen($('stay-button'),'click',stay);listen($('leave-button'),'click',home);listen($('result-home'),'click',home);
  listen($('continue-button'),'click',()=>{if(state.phase==='result'&&state.index<P.TOTAL-1)start(state.index+1);});
  listen($('replay-button'),'click',()=>{if(state.phase==='result')start(Math.floor(state.index/5)*5);});
  listen(document,'keydown',trap);
  const observer=new ResizeObserver(fit);observer.observe($('battleViewport'));
  listen(window,'resize',()=>{clearMotion();fit();});
  listen(document,'visibilitychange',()=>{for(const a of motions){if(document.hidden)a.pause();else a.play();}});
  listen(reduced,'change',()=>{if(reduced.matches)for(const a of motions)a.finish();});
  listen(window,'pagehide',e=>{if(e.persisted){for(const a of motions)a.pause();audio?.stop();}else destroy();});
  listen(window,'pageshow',e=>{if(e.persisted){fit();for(const a of motions)a.play();}});
  // Read-only diagnostics: tests must solve through actual input handlers.
  window.ANIMAL_HOLLOW_FIT_TEST=Object.freeze({getState:()=>({...state,storageOK,stars:[...progress.stars],activeAnimations:motions.size,effects:effects.size}),getRound:()=>round?JSON.parse(JSON.stringify(round)):null});
  motion($('mainContent'),[{opacity:0},{opacity:1}],300);
})();
