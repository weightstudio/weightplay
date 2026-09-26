/* Tide Tally v10 owner presentation repair, 2026-09-26.
 * One shared Interface 7 frame; the game owns only content and puzzle state.
 * This file is also importable by the focused Node regression tests.
 */
(function () {
  'use strict';
  const raw = [
    [1,'flow',2,[3],[1]], [1,'flow',1,[4],[2]], [1,'flow',3,[2],[1,1]], [1,'flow',2,[5],[3]], [1,'flow',4,[3],[2]],
    [2,'waves',1,[2,3],[1]], [2,'waves',2,[1,4],[2,1]], [2,'waves',3,[3,2],[2,2]], [2,'waves',0,[5,1],[2]], [2,'waves',2,[4,3],[2,1]],
    [3,'missing',2,[],[1],5], [3,'missing',3,[],[2,1],6], [3,'missing',1,[],[1,2],5], [3,'missing',4,[],[3],8], [3,'missing',2,[],[2,2],9],
    [4,'compare',7,[],[],3], [4,'compare',5,[],[],8], [4,'compare',9,[],[],4], [4,'compare',6,[],[],11], [4,'compare',12,[],[],5],
    [5,'two-step',2,[3,2],[1,1]], [5,'two-step',1,[4,2],[2,1]], [5,'two-step',3,[2,5],[1,2]], [5,'two-step',2,[5,3],[2,1]], [5,'two-step',4,[3,4],[2,2]],
    [6,'interference',3,[4],[1],1], [6,'interference',2,[5,2],[1,2],1], [6,'interference',1,[3,4],[2,1],2], [6,'interference',4,[6],[2],3], [6,'interference',5,[4,3],[2,2],1]
  ];
  const sum = a => a.reduce((s, n) => s + n, 0);
  function targetOf(n) {
    if (n.mode === 'compare') return Math.abs(n.left - n.right);
    if (n.mode === 'missing') return n.final - n.start + sum(n.departures);
    return n.start + sum(n.arrivals) - sum(n.departures) - (n.interference || 0);
  }
  const notes = raw.map(([arc, mode, start, arrivals, departures, extra], i) => {
    const n = { id:i+1, arc, mode, start, arrivals, departures, checkpoint:(i+1)%5 === 0 };
    if (mode === 'missing') n.final = extra;
    if (mode === 'compare') { n.left = start; n.right = extra; }
    if (mode === 'interference') n.interference = extra;
    n.target = targetOf(n);
    return Object.freeze(n);
  });
  function shuffle(values, rng = Math.random) {
    const out = [...values];
    for (let i = out.length-1; i > 0; --i) {
      const j = Math.min(i, Math.max(0, Math.floor(rng() * (i+1))));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  // Correct-answer rank and position both vary; never reward always choosing
  // the median. Values stay fixed for the entire attempt, including rewatch.
  function choicesFor(note, rng = Math.random) {
    const target = targetOf(note);
    const upper = Math.max(target + 4, note.start || 0, note.left || 0, note.right || 0);
    const candidates = Array.from({length:upper + 1}, (_, i) => i).filter(n => n !== target);
    return shuffle([target, ...shuffle(candidates, rng).slice(0, 2)], rng);
  }
  // Replay changes a quantity, not just the answer's position. Keep the
  // authored mechanic and non-negative, bounded counts of this same note.
  function variation(note, rng = Math.random) {
    const n = {...note, arrivals:[...note.arrivals], departures:[...note.departures]};
    const roll = max => Math.min(max - 1, Math.max(0, Math.floor(rng() * max)));
    const delta = 1 + roll(4);
    if (n.mode === 'missing') {
      n.start = Math.max(0, n.start + roll(3) - 1);
      n.final += delta;
    } else if (n.mode === 'compare') {
      if (roll(2)) { n.left += delta; n.right = Math.max(0, n.right + roll(3) - 1); }
      else { n.right += delta; n.left = Math.max(0, n.left + roll(3) - 1); }
      if (Math.abs(n.left - n.right) === note.target) n.left += 1;
    } else {
      n.start = Math.max(0, n.start + roll(4) - 1);
      const index = roll(n.arrivals.length);
      n.arrivals[index] += delta;
    }
    n.target = targetOf(n);
    if (n.target === note.target) {
      if (n.mode === 'missing') n.final += 1;
      else if (n.mode === 'compare') { if (n.left >= n.right) n.left++; else n.right++; }
      else n.start += 1;
      n.target = targetOf(n);
    }
    return n;
  }
  function stepsOf(note) {
    if (note.mode === 'compare') return [{kind:'compare', left:note.left, right:note.right}];
    const steps = [{kind:'start', amount:note.start, count:note.start}];
    if (note.mode === 'missing') {
      // Neither the unknown delivery nor intermediate totals reveal its size,
      // including to assistive technology. Only the known end pile is shown.
      steps.push({kind:'mystery', amount:null, count:null});
      note.departures.forEach(amount => steps.push({kind:'depart', amount, count:null}));
      steps.push({kind:'final', amount:note.final, count:note.final});
      return steps;
    }
    let count = note.start;
    const add = (kind, amount) => { count += kind === 'arrive' ? amount : -amount; steps.push({kind, amount, count}); };
    if (note.mode === 'two-step') {
      note.arrivals.forEach((amount, i) => { add('arrive', amount); if (note.departures[i] !== undefined) add('depart', note.departures[i]); });
    } else {
      note.arrivals.forEach(amount => add('arrive', amount));
      note.departures.forEach(amount => add('depart', amount));
    }
    if (note.interference) add('crab', note.interference);
    return steps;
  }
  const SAVE_KEY = 'weightplay-animal-tide-tally-progress-v1';
  function readProgress(text) {
    let data;
    try { data = JSON.parse(text || 'null'); } catch { data = null; }
    const source = data && data.schema === 1 && Array.isArray(data.best) ? data.best : [];
    const best = Array.from({length:notes.length}, (_, i) => {
      const v = source[i]; return Number.isInteger(v) && v >= 1 && v <= 3 ? v : 0;
    });
    // A corrupted non-contiguous save must not unlock a future campaign arc.
    let gap = false;
    best.forEach((v, i) => { if (!v) gap = true; if (gap) best[i] = 0; });
    return {schema:1, best};
  }
  const unlocked = progress => Math.min(notes.length-1, progress.best.findIndex(n => !n) < 0 ? notes.length-1 : progress.best.findIndex(n => !n));
  function newRun(note, rng = Math.random) {
    return {note, steps:stepsOf(note), step:0, phase:'watch', checks:0, rejected:[], answers:choicesFor(note, rng)};
  }
  function advance(run) {
    if (run.phase !== 'watch') return false;
    if (run.step < run.steps.length-1) run.step += 1; else run.phase = 'answer';
    return true;
  }
  function answer(run, value) {
    if (run.phase !== 'answer' || !run.answers.includes(value) || run.rejected.includes(value)) return null;
    run.checks += 1;
    if (value !== run.note.target) { run.rejected.push(value); return false; }
    run.phase = 'result'; return true;
  }
  function settle(progress, run) {
    if (run.phase !== 'result' || run.settled || run.note.id-1 > unlocked(progress)) return false;
    run.settled = true;
    const index = run.note.id-1;
    progress.best[index] = Math.max(progress.best[index], 4-run.checks);
    return true;
  }
  const model = {notes, targetOf, shuffle, choicesFor, variation, stepsOf, readProgress, unlocked, newRun, advance, answer, settle, SAVE_KEY};
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const $ = id => document.getElementById(id);
  const app = $('app');
  if (!app || app.dataset.tideMounted) return;
  // Set synchronously before the bootstrap's DOMContentLoaded auto-discovery.
  app.dataset.wpFrameRoot = ''; app.dataset.tideMounted = 'true';
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key,value); return true; } catch { return false; } }
  };
  const routes = {en:'en','zh-tw':'zh-Hant','zh-cn':'zh-Hans',ja:'ja',ko:'ko',es:'es','pt-br':'pt-BR',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
  let locale = routes[location.pathname.split('/').filter(Boolean)[0]] || document.documentElement.lang || 'en';
  const catalog = window.ANIMAL_TIDE_TALLY_LOCALES || {};
  if (!catalog[locale]) locale = 'en';
  const labels = catalog;
  const text = (key, vars={}) => Object.entries(vars).reduce((s,[k,v])=>s.replaceAll(`{${k}}`,String(v)), labels[locale]?.[key] || catalog[locale]?.[key] || key);
  const progress = readProgress(storage.get(SAVE_KEY));
  let frame, stageController, motion, scene = 'main', run = null, modal = null, saved = true;
  let runSerial = 0, visualToken = 0, busy = false;
  const lifecycle = new AbortController();
  const listen = (node,type,handler) => node.addEventListener(type,handler,{signal:lifecycle.signal});
  const sfx = id => { try { const result = window.WeightPlayAudio?.play?.(id); result?.catch?.(()=>{}); } catch { /* Sound is optional, never gameplay. */ } };
  const sceneRoots = {};
  const own = (tag, id, className) => { const n=document.createElement(tag); if(id)n.id=id;if(className)n.className=className;return n; };
  function button(id, key, fn, primary=false) {
    const n=own('button',id);n.type='button';n.dataset.wpFrameAction=primary?'primary':'secondary';n.textContent=text(key);listen(n,'click',fn);return n;
  }
  function sheet(name) {
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some(n=>n.href.split('?')[0].endsWith('/'+name))) return;
    const link=own('link');link.rel='stylesheet';link.href='/src/'+name+'?v=20260926-tide-v10';document.head.append(link);
  }
  function script(name, ready, base = '/src/') {
    if (ready?.()) return Promise.resolve();
    return new Promise((resolve,reject)=>{
      let node=[...document.scripts].find(n=>n.src.split('?')[0].endsWith('/'+name));
      const fresh=!node;
      if(fresh){node=own('script');node.src=base+name+'?v=20260926-tide-v10';}
      const timeout=setTimeout(()=>finish(Error('Dependency timeout: '+name)),15000);
      function finish(error){clearTimeout(timeout);node.removeEventListener('load',loaded);node.removeEventListener('error',failed);error?reject(error):resolve();}
      function loaded(){finish(ready&&!ready()?Error('Missing API: '+name):null);}
      function failed(){finish(Error('Dependency failed: '+name));}
      node.addEventListener('load',loaded,{once:true});node.addEventListener('error',failed,{once:true});
      if(fresh)document.body.append(node);
    });
  }
  function normalize() {
    const main=$('mainScreen').querySelector('.main-canvas'), mainHeader=main.querySelector('header');
    const mainTitle=mainHeader.querySelector('[data-wp-game-title]');mainTitle.dataset.wpFrameTitle='';
    // Do not replace the official localized name with the old dictionary alias.
    mainTitle.removeAttribute('data-i18n');
    const poster=main.querySelector('.main-poster'), summary=main.querySelector('.main-summary'), copy=own('div');
    poster.dataset.wpFramePoster='';copy.dataset.wpFrameCopy='';summary.dataset.wpFrameSummary='';summary.removeAttribute('data-i18n');summary.textContent=text('summary');
    $('mainProgress').dataset.wpFrameProgress='';
    const start=$('startBtn');start.dataset.wpFrameAction='primary';start.textContent=text('start');start.removeAttribute('data-i18n');
    copy.append(summary,$('mainProgress'),start);
    const mainContent=own('div','mainContent');mainContent.append(poster,copy);
    main.querySelector('.hero-card').replaceWith(mainContent);
    const select=$('localeSelect');select.value=locale;
    const retained=own('div');retained.hidden=true;retained.append(select);app.append(retained);$('settingsPanel').remove();
    // One permanent Guide sibling: never moved during later scene changes.
    const guide=$('gameGuide');app.after(guide);
    const stage=$('stageScreen').querySelector('.stage-canvas'), stageHeader=stage.querySelector('header');
    stage.dataset.wpStageLandscapeWidth='760';stage.dataset.wpStageLandscapeHeight='334';
    const updateStageArt=()=>{
      stage.dataset.wpStageArt=poster.getAttribute('src');
      stage.style.setProperty('--wp-stage-art',`url("${poster.src}")`);
    };
    updateStageArt();listen(poster,'load',updateStageArt);
    const stageTitle=stageHeader.querySelector('h2');stageTitle.dataset.wpFrameTitle='';stageTitle.hidden=true;
    const workspace=own('div','stageWorkspace','tide-stage-workspace');
    const rail=$('stageList');rail.className='stage-rail';rail.replaceChildren();rail.dataset.wpStageRail='true';rail.dataset.wpStageVirtualDrag='true';rail.setAttribute('aria-label',text('stages'));
    workspace.append(rail);stage.querySelector('.panel-intro')?.remove();$('stageChoices')?.remove();
    const nav=stage.querySelector('.stage-tabs');nav.replaceChildren();nav.dataset.wpFrameStageNav='';nav.setAttribute('aria-label',text('stages'));
    const tab=button('stagesTab','stages',()=>{});tab.dataset.wpFrameAction='tab';tab.dataset.wpFrameStageSlot='stages';tab.setAttribute('role','tab');tab.setAttribute('aria-selected','true');tab.setAttribute('aria-controls','stageWorkspace');nav.append(tab);
    stage.append(workspace,nav);
    const battle=$('battleScreen').querySelector('.battle-canvas'), battleHeader=battle.querySelector('header');
    // Same logical content tracks at every aspect ratio; shared scaler fits the envelope.
    battle.dataset.wpBattleLandscapeHeight='448';
    battleHeader.querySelector('h2').dataset.wpFrameTitle='';$('battleSoundBtn').remove();
    const content=own('div','tidePlay','tide-play');
    const info=own('div','tideHud');
    for(const [id,label] of [['tideNoteHud',text('round')],['tideWaveHud',text('mode_waves')],['tideChecksHud',text('checks',{value:''}).split(/[:：]/)[0].trim()]]){
      const stat=own('div'), caption=own('span'), value=own('b',id);caption.textContent=label;stat.append(caption,value);info.append(stat);
    }
    content.append(info);
    const prompt=own('p','prompt','tide-prompt');
    const visual=own('div','tideVisual','tide-visual');
    const event=own('p','tideEvent','tide-event');event.setAttribute('role','status');event.setAttribute('aria-live','polite');
    const water=own('div',null,'tide-water');water.setAttribute('aria-hidden','true');
    const pools=own('div','tidePools','tide-pools');visual.append(water,event,pools);
    const status=own('p','status','tide-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const answers=own('div','answerGrid','tide-answers');answers.setAttribute('role','group');answers.setAttribute('aria-labelledby','prompt');
    const actions=own('div',null,'tide-actions');
    actions.append(button('waveBtn','watch',()=>{if(!inputLocked()&&run&&advance(run)){renderBattle();}}),button('rewatchBtn','rewatch',()=>{
      if(inputLocked()||!run||run.phase==='result')return;
      run.step=0;run.phase='watch';renderBattle();$('waveBtn').focus();
    }));
    content.append(prompt,visual,answers,status,actions);
    battle.querySelector('.battle-body').replaceWith(content);
    $('resultScreen').remove();
    // Modal substate lives in the existing Battle canvas, not a fourth scene.
    const overlay=own('section','tideModal','tide-modal');overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','tideModalTitle');
    const card=own('div',null,'tide-modal-card');card.append(own('h2','tideModalTitle'),own('div','tideStars','tide-stars'),own('p','tideModalText'),own('p','tideSolution','tide-solution'),own('p','tideSave'),own('div','tideModalActions','tide-modal-actions'));overlay.append(card);battle.append(overlay);
    const scenes={main:{root:main,header:mainHeader,content:mainContent},stage:{root:stage,header:stageHeader,content:workspace},battle:{root:battle,header:battleHeader,content,headerInfo:info}};
    Object.assign(sceneRoots, {main:$('mainScreen'),stage:$('stageScreen'),battle:$('battleScreen')});
    $('stageBackBtn').setAttribute('aria-label',text('back'));$('battleBackBtn').setAttribute('aria-label',text('back'));
    return {scenes,localeSelect:select};
  }
  function settingsOpen() {
    return [...app.querySelectorAll('[data-wp-preferences] .wp-frame-popover')].some(n=>!n.hidden);
  }
  function syncSettingsContract() {
    for(const utility of app.querySelectorAll('[data-wp-preferences]')) {
      utility.dataset.wpSettingsControl='';
      const panel=utility.querySelector('.wp-frame-popover');
      const languageRow=panel?.querySelector('label');
      if(languageRow) {
        languageRow.classList.add('wp-shell-settings-row','wp-shell-language-row');
        const select=languageRow.querySelector('select');
        if(select)select.dataset.wpLanguageSwitcher='';
      }
      const soundRow=panel?.querySelector('.wp-shell-combined-sound-row');
      if(soundRow) {
        soundRow.classList.add('wp-shell-settings-row');
        const label=soundRow.querySelector(':scope > span');
        const sound=soundRow.querySelector('.wp-frame-sound[role="switch"]');
        if(label&&sound) {
          sound.classList.add('wp-shell-combined-sound-toggle');
          sound.setAttribute('aria-label',label.textContent.trim());
        }
      }
    }
  }
  function inputLocked() { return scene!=='battle'||Boolean(modal)||busy||document.hidden||settingsOpen(); }
  function syncMotionPause() {
    const paused = document.hidden || settingsOpen();
    if(paused)motion.pause('covered');else motion.resume('covered');
    app.classList.toggle('tide-motion-paused',paused||Boolean(modal));
  }
  function updateProgress() { $('mainProgress').textContent=text('progress',{count:progress.best.filter(Boolean).length,total:notes.length}); }
  function closeModal(focus=true) {
    if(!modal)return;const old=modal;modal=null;$('tideModal').hidden=true;
    $('tidePlay').inert=false;frame.activate('battle');syncSettingsContract();motion.resume('leave');syncMotionPause();
    if(focus&&old.focus?.isConnected)old.focus.focus({preventScroll:true});
  }
  function show(name) {
    closeModal(false);motion.cancel();visualToken++;busy=false;scene=name;document.body.dataset.screen=name;
    for(const [key,node] of Object.entries(sceneRoots)){node.hidden=key!==name;node.inert=key!==name;}
    $('gameGuide').hidden=name!=='main';frame.activate(name);syncSettingsContract();updateProgress();
    if(name==='stage') {stageController.refresh();stageController.center(unlocked(progress));$('stageBackBtn').focus({preventScroll:true});
      // Fade content only: shared drag targets, positions and recycled cards never tween.
      for(const item of $('stageList').querySelectorAll('.tide-stage-item'))motion.animate(item,[{opacity:.35},{opacity:1}],{duration:280});}
    if(name==='main'){$('startBtn').focus({preventScroll:true});for(const node of [app.querySelector('[data-wp-frame-poster]'),app.querySelector('[data-wp-frame-summary]'),$('startBtn')])motion.animate(node,[{opacity:.2},{opacity:1}],{duration:420});}
    syncMotionPause();
  }
  function stageBind(card,index) {
    const note=notes[index], locked=index>unlocked(progress), stars=progress.best[index];
    // Rewrite every recycled-card datum, including false states.
    card.dataset.tideNote=String(index+1);card.dataset.tideArc=String(note.arc);
    card.dataset.tideState=locked?'locked':stars?'cleared':'ready';
    card.dataset.tideCheckpoint=String(note.checkpoint);
    card.type='button';card.className='stage-card'+(locked?' locked':'');card.disabled=false;card.setAttribute('aria-disabled',String(locked));
    card.replaceChildren();
    const title=own('strong'), state=own('span'), objective=own('small'), facts=own('small');
    title.textContent=`${text('round')} ${index+1}`;state.textContent=text(locked?'locked':stars?'cleared':'ready');
    objective.textContent=text('mode_'+note.mode);
    facts.textContent=(note.checkpoint?text('checkpoint')+' · ':'')+text('stars',{value:stars});
    const group=own('div',null,'tide-stage-item');group.dataset.wpItemContent='';
    const emblem=own('span',null,'tide-stage-emblem');emblem.setAttribute('aria-hidden','true');emblem.append(own('span',null,'tide-shell'));
    state.className='tide-stage-state';objective.className='tide-stage-objective';facts.className='tide-stage-facts';
    group.append(emblem,title,state,objective,facts);card.append(group);
    if(index===unlocked(progress))card.dataset.wpStageRecommended='true';else delete card.dataset.wpStageRecommended;
  }
  function startNote(index, freshNumbers=false) {
    if(!Number.isInteger(index)||index<0||index>unlocked(progress)||index>=notes.length)return false;
    runSerial++;run=newRun(freshNumbers?variation(notes[index]):notes[index]);show('battle');renderBattle();$('waveBtn').focus({preventScroll:true});sfx('game.start');return true;
  }
  function pool(count, label, mystery=false) {
    const root=own('div',null,'tide-pool');const caption=own('strong');caption.textContent=label;root.append(caption);
    const pieces=own('div',null,'tide-shells');pieces.setAttribute('aria-label',mystery?text('mystery'):label+' '+count);pieces.setAttribute('role',mystery?'img':'group');
    if(mystery){const q=own('span',null,'tide-unknown');q.textContent='?';q.setAttribute('aria-hidden','true');pieces.append(q);}
    else if(!count){const zero=own('span',null,'tide-unknown');zero.textContent='0';zero.setAttribute('aria-hidden','true');pieces.append(zero);}
    else for(let i=0;i<count;i++){
      const target=own('button',null,'tide-shell-target');target.type='button';
      target.setAttribute('aria-label',text('markShell',{value:i+1}));
      target.setAttribute('aria-pressed','false');
      const shell=own('span',null,'tide-shell');shell.setAttribute('aria-hidden','true');target.append(shell);
      target.addEventListener('click',()=>{
        if(inputLocked())return;
        target.setAttribute('aria-pressed',String(target.getAttribute('aria-pressed')!=='true'));
        motion.pulse(shell);
      });
      pieces.append(target);
    }
    root.append(pieces);return root;
  }
  function question() { return text(run.note.mode==='missing'?'missingQuestion':run.note.mode==='compare'?'compareQuestion':'prompt'); }
  function hint() { return text(run.note.mode==='missing'?'missingHint':run.note.mode==='compare'?'compareHint':'flowHint'); }
  function renderBattle() {
    if(scene!=='battle'||!run)return;
    const step=run.steps[run.step], watching=run.phase==='watch';
    $('tideNoteHud').textContent=`${run.note.id} / ${notes.length}`;$('tideWaveHud').textContent=`${run.step+1} / ${run.steps.length}`;$('tideChecksHud').textContent=String(run.checks);
    $('prompt').textContent=question();
    const pools=$('tidePools');
    const key=runSerial+':'+run.step+':'+watching;
    if(pools.dataset.visualKey!==key){
    pools.dataset.visualKey=key;motion.cancel();visualToken++;pools.replaceChildren();
    if(step.kind==='compare'){
      $('tideEvent').textContent=text('mode_compare');pools.append(pool(step.left,text('leftCove')),pool(step.right,text('rightCove')));
    } else {
      const key={start:'initial',arrive:'arrive',depart:'depart',crab:'crab',mystery:'mystery',final:'final'}[step.kind];
      const signed=step.amount===null?'?':((step.kind==='arrive'?'+':['depart','crab'].includes(step.kind)?'−':'')+step.amount);
      $('tideEvent').textContent=text(key)+'  '+signed;
      // On observation steps show the change as a real group of shells. The
      // question phase keeps only known clues, not the computed answer pile.
      const amount = watching ? step.amount : run.note.mode==='missing'?run.note.final:run.note.start;
      pools.append(pool(amount,watching?text(key):text(run.note.mode==='missing'?'final':'initial'),amount===null));
    }
    busy=!motion.reduced;
    const token=visualToken;
    const outgoing=['depart','crab'].includes(step.kind);
    $('tideVisual').dataset.wave=outgoing?'out':'in';$('tideVisual').dataset.clue=step.kind;
    motion.animate($('tideEvent'),[{opacity:.25},{opacity:1}],{duration:260});
    motion.clue(pools.querySelectorAll('.tide-shell,.tide-unknown'),watching?step.kind:'start').then(()=>{
      if(token!==visualToken||scene!=='battle')return;
      busy=false;renderBattle();
    });
    }
    const grid=$('answerGrid');
    // Buttons are retained while handling answers. Their values never move
    // after a wrong answer, and their targets do not jump during feedback.
    if(grid.dataset.run!==String(run.note.id)+':'+run.answers.join(',')){
      grid.replaceChildren();grid.dataset.run=String(run.note.id)+':'+run.answers.join(',');
      run.answers.forEach(value=>{const b=button('', 'respond',()=>choose(value));b.className='tide-answer';const label=own('span');label.textContent=String(value);b.replaceChildren(label);b.dataset.value=String(value);b.setAttribute('aria-label',text('answerLabel',{value}));grid.append(b);});
    }
    [...grid.children].forEach(b=>{const value=Number(b.dataset.value);b.disabled=watching||busy||run.phase==='result'||run.rejected.includes(value);b.classList.toggle('is-wrong',run.rejected.includes(value));});
    $('waveBtn').disabled=!watching||busy;$('waveBtn').textContent=text(run.step===run.steps.length-1?'respond':'watch');
    $('rewatchBtn').disabled=run.phase==='result'||busy;
    $('status').textContent=watching?text('watchHint'):run.rejected.length?hint():text('respond');
    if(!watching&&run.phase==='answer'&&document.activeElement===$('waveBtn'))grid.querySelector('button:not(:disabled)')?.focus();
  }
  function solution(note) {
    if(note.mode==='compare')return `${Math.max(note.left,note.right)} − ${Math.min(note.left,note.right)} = ${note.target}`;
    if(note.mode==='missing')return `${note.start} + ${note.target}${note.departures.map(n=>' − '+n).join('')} = ${note.final}`;
    let formula=String(note.start);
    if(note.mode==='two-step')note.arrivals.forEach((n,i)=>{formula+=' + '+n;if(note.departures[i]!==undefined)formula+=' − '+note.departures[i];});
    else {formula+=note.arrivals.map(n=>' + '+n).join('');formula+=note.departures.map(n=>' − '+n).join('');}
    if(note.interference)formula+=' − '+note.interference;
    return formula+' = '+note.target;
  }
  function openModal(kind) {
    closeModal(false);modal={kind,focus:kind==='leave'?$('battleBackBtn'):document.activeElement};$('tideModal').hidden=false;
    $('tidePlay').inert=true;frame.activate('battle',{covered:true});
    if(kind==='leave')motion.pause('leave');else motion.cancel();
    syncMotionPause();
    const result=kind==='result', actions=$('tideModalActions');actions.replaceChildren();
    if(result)motion.animate($('tideModal').firstElementChild,[{opacity:.25},{opacity:1}],{duration:260});
    $('tideModalTitle').textContent=text(result?(progress.best.every(Boolean)?'resultTitle':'resultLevel'):'leaveTitle');
    $('tideModalText').textContent=result?text('stars',{value:4-run.checks})+' · '+text('checks',{value:run.checks}):`${text('round')} ${run.note.id} · ${text('leaveText')}`;
    $('tideSolution').textContent=result?solution(run.note):'';$('tideSolution').dir='ltr';
    $('tideSave').textContent=result?text(saved?'saved':'sessionOnly'):'';
    if(result){
      actions.append(button('resultStageBtn','stages',()=>show('stage')));
      const hasNext=run.note.id<notes.length;
      const next=button('resultNextBtn','next',()=>{if(hasNext)startNote(run.note.id);},true);next.disabled=!hasNext;actions.append(next);
      actions.append(button('resultReplayBtn','retry',()=>startNote(run.note.id-1,true)));
    }else{
      actions.append(button('keepPlayingBtn','stay',()=>closeModal(),true),button('leaveNoteBtn','stages',()=>{run=null;show('stage');}));
    }
    const starRoot=$('tideStars');starRoot.replaceChildren();starRoot.hidden=!result;
    if(result){
      starRoot.setAttribute('aria-label',text('stars',{value:4-run.checks}));
      for(let i=0;i<3;i++){const star=own('span');star.textContent=i<4-run.checks?'★':'☆';star.setAttribute('aria-hidden','true');starRoot.append(star);}
      motion.enter(starRoot.children);motion.animate($('tideModalTitle'),[{opacity:.2},{opacity:1}]);
    }
    actions.querySelector('button').focus({preventScroll:true});
  }
  function choose(value) {
    if(inputLocked()||!run)return;
    const correct=answer(run,value);if(correct===null)return;
    renderBattle();
    if(correct){settle(progress,run);saved=storage.set(SAVE_KEY,JSON.stringify(progress));updateProgress();sfx('feedback.success');openModal('result');}
    else {motion.pulse($('answerGrid').querySelector('[data-value="'+value+'"] span'),true);sfx('feedback.error');$('answerGrid').querySelector('button:not(:disabled)')?.focus({preventScroll:true});}
  }
  async function boot() {
    try {
      document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';
      for(const name of ['game-screen-frame.css','stage-selector-standard.css','battle-canvas-standard.css'])sheet(name);
      await Promise.all([script('game-screen-frame.js',()=>window.WeightPlayScreenFrame?.mount),script('stage-virtualization-standard.js',()=>window.WeightPlayStageV6?.install),script('motion.js',()=>window.AnimalTideMotion,'/games/animal-tide-tally/')]);
      motion=new window.AnimalTideMotion();
      const slots=normalize();frame=window.WeightPlayScreenFrame.mount({root:app,...slots});
      // Keep the cloned visible selector as the canonical Settings owner;
      // the original source select only relays its change event to routing.
      slots.localeSelect.id='tideLocaleSource';
      syncSettingsContract();
      for(const button of app.querySelectorAll('[data-wp-preferences] [data-wp-settings]'))
        listen(button,'click',syncSettingsContract);
      listen(window,'wonder:locale-change',()=>queueMicrotask(syncSettingsContract));
      listen(window,'weightplay:audio-volume-change',()=>queueMicrotask(syncSettingsContract));
      stageController=window.WeightPlayStageV6.install($('stageList'),{total:notes.length,poolSize:9,bind:stageBind,initialIndex:()=>unlocked(progress),activate:index=>startNote(index)});
      if(!stageController)throw Error('Stage controller unavailable');
      listen($('startBtn'),'click',()=>show('stage'));listen($('stageBackBtn'),'click',()=>show('main'));
      listen($('battleBackBtn'),'click',()=>{if(!modal&&run?.phase!=='result')openModal('leave');});
      listen(slots.localeSelect,'change',e=>{const next=e.target.value;const route=Object.keys(routes).find(k=>routes[k]===next);if(!route)return;storage.set('weightPlayLocale',next);location.assign('/'+route+'/games/animal-tide-tally/'+location.search+location.hash);});
      listen(document,'keydown',e=>{
        if(e.defaultPrevented||e.repeat||scene!=='battle')return;
        if(modal){
          if(e.key==='Escape'){e.preventDefault();if(modal.kind==='leave')closeModal();else show('stage');return;}
          if(e.key==='Tab'){
            const buttons=[...$('tideModal').querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);
            if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
            else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
            else if(!$('tideModal').contains(document.activeElement)){e.preventDefault();first?.focus();}
          }
          return;
        }
        if(e.key==='Escape'&&!settingsOpen()){e.preventDefault();openModal('leave');}
        else if(/^[123]$/.test(e.key)&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&run?.phase==='answer'&&!e.target.closest('select,input,textarea,[contenteditable]')&&!e.target.closest('[data-wp-preferences]')){e.preventDefault();choose(run.answers[Number(e.key)-1]);}
      });
      await Promise.all([script('stage-selector-standard.js'),script('battle-canvas-standard.js')]);
      $('loading').hidden=true;app.hidden=false;show('main');
      window.dispatchEvent(new CustomEvent('wonder:locale-change'));
      // Resize changes only the shared rail's centering, never game contents.
      const resize=new ResizeObserver(()=>{if(scene==='stage')stageController.center();});resize.observe($('stageList'));
      listen(window,'weightplay:interaction-state',syncMotionPause);
      listen(document,'visibilitychange',syncMotionPause);
      listen(window,'pageshow',()=>{motion.resume('bfcache');syncMotionPause();});
      listen(window,'pagehide',e=>{if(e.persisted){motion.pause('bfcache');return;}resize.disconnect();motion.destroy();stageController.destroy();frame.destroy();lifecycle.abort();});
      window.__ANIMAL_TIDE_TALLY_TEST__={...model,labels,solution,startNote,motionSnapshot:()=>motion.snapshot(),getState:()=>({noteIndex:run?run.note.id-1:0,solved:progress.best.flatMap((n,i)=>n?[i]:[]),checks:run?.checks||0,screen:scene,phase:run?.phase,step:run?.step,feedback:run?.phase==='result'?'correct':run?.rejected.length?'wrong':'',modal:modal?.kind||null,busy})};
    }catch(error){console.error('Tide Tally startup failed',error);$('loading').hidden=false;$('loading').textContent=text('loadError');app.hidden=true;}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
}());
