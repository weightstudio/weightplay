(async function () {
  "use strict";

  const locales = window.GROVE_CHAIN_LOCALES;
  const localeKeys = locales.__localeKeys;
  const MAIN_START_COPY = Object.freeze({
    en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲーム開始",
    ko: "게임 시작", es: "Iniciar juego", "pt-BR": "Iniciar jogo", fr: "Commencer",
    de: "Spiel starten", it: "Inizia gioco", ru: "Начать игру", hi: "खेल शुरू करें", ar: "ابدأ اللعبة",
  });
  const GAME_VERSION = "v10";
  let advanceTimer = null;
  let advanceDeadline = 0;
  let pausedAdvanceRemaining = null;
  let viewportResetFrame = 0;
  const clearAdvanceTimer = () => { clearTimeout(advanceTimer); advanceTimer = null; advanceDeadline = 0; };
  const cancelAdvance = () => { clearAdvanceTimer(); pausedAdvanceRemaining = null; };
  const scheduleAdvance = (delay = 420) => {
    clearAdvanceTimer();
    pausedAdvanceRemaining = null;
    const wait = Math.max(0, Number(delay) || 0);
    advanceDeadline = performance.now() + wait;
    advanceTimer = window.setTimeout(() => {
      advanceTimer = null;
      advanceDeadline = 0;
      if ($("battleView").hidden) return;
      finish();
    }, wait);
  };
  const pauseAdvance = () => {
    if (!advanceTimer) return;
    pausedAdvanceRemaining = Math.max(0, advanceDeadline - performance.now());
    clearAdvanceTimer();
  };
  const resumeAdvance = () => {
    if (pausedAdvanceRemaining === null) return;
    const delay = pausedAdvanceRemaining;
    pausedAdvanceRemaining = null;
    scheduleAdvance(delay);
  };
  window.addEventListener('pagehide', cancelAdvance);
  window.addEventListener('pagehide',()=>cancelAnimationFrame(viewportResetFrame));
  const {createChain,play,undo,outcome}=await import('./chain-engine.mjs?v=20260909-grove-campaign-v6');
  const {recoveryCopy}=await import('./chain-copy.mjs?v=20260909-grove-campaign-v6');
  const {campaign}=await import('./campaign.mjs?v=20260909-grove-campaign-v6');
  const {campaignCopy}=await import('./campaign-copy.mjs?v=20260909-grove-campaign-v6');
  const {campaignGuide}=await import('./campaign-guide.mjs?v=20260909-grove-campaign-v6');
  for(const [locale,guide] of Object.entries(campaignGuide))Object.assign(locales[locale],guide);
  const {PROGRESS_KEY,normalizeProgress,completeStage}=await import('./progress.mjs?v=20260909-grove-campaign-v6');
  const {createHabitatArt}=await import('./habitat-art.mjs?v=20260909-grove-campaign-v6');
  const rounds=campaign.map(p=>({...p,tiles:p.tiles.map(tile=>Object.assign([tile.from,tile.to],tile))}));
  let frame,stageController,selectedStageIndex=0,progress,flipMode=false,completionReceipt=null;
  const cc=()=>campaignCopy[state.locale]||campaignCopy.en;
  let chainState=null,rackOrder=[];
  const state = { locale: "en", roundIndex: 0, currentEnd: "", picks: 0, placed: [], rack: [], solved: 0 };
  let lastSoundEnabled=!window.WeightPlayAudio.isMuted();
  window.addEventListener("weightplay:audio-volume-change",()=>{
    const enabled=!window.WeightPlayAudio.isMuted();
    if(enabled===lastSoundEnabled)return;
    lastSoundEnabled=enabled;track("sound_changed",{enabled});
  });
  const $ = (id) => document.getElementById(id);
  const safeStorage = { get(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } }, set(key, value) { try { window.localStorage.setItem(key, value);return true; } catch (_) {return false;} } };
  progress=normalizeProgress(safeStorage.get(PROGRESS_KEY));
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const localeStorageKey = "weightplay-grove-chain-locale";

  function queryLocale() {
    const query = new URLSearchParams(window.location.search).get("lang");
    if (query && locales[query]) return query;
    const segment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    return routeLocaleMap[segment] || safeStorage.get(localeStorageKey) || "en";
  }
  function copy() { return locales[state.locale] || locales.en; }
  function t(key, vars = {}) { const value = copy()[key] || locales.en[key] || key; return String(value).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? "")); }
  function habitat(token) { return copy().tokenNames?.[token] || locales.en.tokenNames[token] || token; }
  function track(name, detail = {}) {
    const event = { name, gameId: "animal-grove-dominoes", version: GAME_VERSION, at: Date.now(), ...detail };
    window.ANIMAL_GROVE_CHAIN_EVENTS = Array.isArray(window.ANIMAL_GROVE_CHAIN_EVENTS) ? window.ANIMAL_GROVE_CHAIN_EVENTS.slice(-39) : [];
    window.ANIMAL_GROVE_CHAIN_EVENTS.push(event);
  }
  function playTone(cue = "ui.click") { return window.WeightPlayAudio?.play(cue); }
  function applyLocale() {
    document.documentElement.lang = state.locale;
    document.body.dataset.gameVersion = GAME_VERSION;
    document.documentElement.dir = copy().direction || "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $('startBtn').removeAttribute('data-copy');
    $('startBtn').textContent = MAIN_START_COPY[state.locale] || MAIN_START_COPY.en;
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.copyAriaLabel)); });
    document.querySelectorAll('[data-copy="facts"]').forEach(node=>node.textContent=cc().summary);
    $('stageList').setAttribute('aria-label',cc().stages);
    $('stageNav').setAttribute('aria-label',cc().stages);
    $('stageTab').textContent=cc().stages;
    $('stageTab').setAttribute('aria-label',cc().stages);
    $('flipChain').textContent=cc().flip;
    $('leaveBtn').textContent=cc().backStages;$('homeBtn').textContent=cc().backStages;$('nextStage').textContent=cc().next;
    stageController?.refresh();
    if (frame?.active === 'battle' && !$('resultView').hidden) return;
    if (frame?.active === 'battle') renderRound();
  }
  function populateLocales() {
    const select = $("localeSelect");
    localeKeys.forEach((key) => { const option = document.createElement("option"); option.value = key; option.textContent = locales.en.languageNames[key]; select.append(option); });
    select.value = state.locale;
    select.addEventListener("change", () => { state.locale = select.value; safeStorage.set(localeStorageKey, state.locale); applyLocale(); track("locale_changed", { locale: state.locale }); });
  }
  function showView(id) {
    cancelAdvance();
    cancelAnimationFrame(viewportResetFrame);
    const main = id === "mainView";
    const result = id === "resultView";
    const stage = id === "stageView";
    $("mainView").hidden = !main;
    $("stageView").hidden = !stage;
    $("battleView").hidden = main || stage;
    const guide = document.querySelector(".guide-card, [data-wp-game-guide], .game-page-info-static");
    if (guide) guide.hidden = !main;
    $("logicalShell").hidden = result;
    $("resultView").hidden = !result;
    document.body.dataset.screen = main ? "main" : stage?'stage':result ? "result" : "battle";
    frame?.activate(main ? 'main' : stage ? 'stage' : 'battle', {covered:result});
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    window.scrollTo(0, 0);
    if(!main)viewportResetFrame=requestAnimationFrame(()=>{
      viewportResetFrame=0;
      document.documentElement.scrollTop=0;document.body.scrollTop=0;
      window.scrollTo({left:0,top:0,behavior:'instant'});
    });
  }
  function shuffle(items) { return [...items].sort((a, b) => (a[0].charCodeAt(0) + a[1].charCodeAt(0)) - (b[0].charCodeAt(0) + b[1].charCodeAt(0))); }
  function tileButton(tile, index) {
    const reversed=flipMode&&tile.reversible;
    const shown=reversed?[tile[1],tile[0]]:tile;
    const button = document.createElement("button");
    button.dataset.tileId=tile.id;
    button.type = "button"; button.className = "habitat-tile"; button.dataset.index = String(index); button.dataset.habitat = tile[0]; button.setAttribute("aria-label", t("chooseTile", { left: habitat(tile[0]), right: habitat(tile[1]) }));
    button.setAttribute('aria-label',`${t('chooseTile',{left:habitat(shown[0]),right:habitat(shown[1])})}; ${tile.required?cc().required:cc().optional}${tile.bridge?`; ${cc().bridges}: ${tile.bridge}`:''}${tile.reversible?`; ${cc().flip}`:''}`);
    for (const token of shown) {
      const half = document.createElement('span'); half.className = 'domino-half';
      const art = createHabitatArt(token);
      const label = document.createElement('span'); label.className = 'tile-side'; label.textContent = habitat(token);
      half.append(art,label);button.append(half);
    }
    const badge=document.createElement('span');badge.className='domino-rule';badge.textContent=`${tile.required?cc().required:cc().optional}${tile.bridge?' • '+cc().bridges+' 1':''}${tile.reversible?' ↕':''}`;button.append(badge);
    button.addEventListener("click", () => choose(index, button));
    return button;
  }
  function renderChain() {
    const trackNode = $("chainTrack"); trackNode.replaceChildren();
    const nodes = [state.roundIndex === 0 ? rounds[state.roundIndex].start : rounds[state.roundIndex].start, ...state.placed.map((tile) => tile[1])];
    nodes.forEach((token, index) => { const node = document.createElement("span"); node.className = `chain-node${index === nodes.length - 1 ? " current" : ""}`; node.textContent = habitat(token); node.setAttribute("aria-label", habitat(token)); trackNode.append(node); if (index < nodes.length - 1) { const arrow = document.createElement("span"); arrow.className = "chain-arrow"; arrow.textContent = "→"; arrow.setAttribute("aria-hidden", "true"); trackNode.append(arrow); } });
  }
  function renderRound() {
    const round = rounds[state.roundIndex];
    const number = new Intl.NumberFormat(state.locale);
    const roundLabel = t("round", { current: state.roundIndex + 1, total: rounds.length });
    const endLabel = t("end", { habitat: habitat(state.currentEnd) });
    $("roundLabel").textContent = `${number.format(state.roundIndex + 1)}/${number.format(rounds.length)}`;
    $("roundLabel").setAttribute("aria-label", roundLabel);
    $("roundLabel").title = roundLabel;
    $("endLabel").textContent = habitat(state.currentEnd);
    $("endLabel").setAttribute("aria-label", endLabel);
    $("endLabel").title = endLabel;
    $("placedCount").textContent = `${state.placed.length}/${round.tiles.length}`;
    const words=recoveryCopy[state.locale]||recoveryCopy.en;
    const c=cc();
    const rules=[`${c.goal}: ${habitat(round.goal)}`,`${c.required}: ${chainState.tiles.filter(tile=>tile.required&&!chainState.path.includes(tile.id)).length}`];
    if(round.visits?.length)rules.push(`${c.visits}: ${round.visits.map(h=>`${chainState.visited.includes(h)?'✓ ':''}${habitat(h)}`).join(' · ')}`);
    if(round.bridges!==undefined)rules.push(`${c.bridges}: ${chainState.bridgesLeft}`);
    if(round.flips!==undefined)rules.push(`${c.flips}: ${chainState.flipsLeft}`);
    if(round.deliveries?.length)rules.push(`${c.deliveries}: ${round.deliveries.map((h,i)=>`${i<chainState.deliveryIndex?'✓ ':''}${habitat(h)}`).join(' → ')}`);
    $("instruction").textContent=rules.join(' • ');
    $('flipChain').disabled=!round.tiles.some(tile=>tile.reversible);$('flipChain').setAttribute('aria-pressed',String(flipMode));
    if($('undoChain')){$('undoChain').textContent=words[0];$('undoChain').disabled=!chainState?.path.length;}
    renderChain();
    const rackNode = $("tileRack"); rackNode.replaceChildren();
    state.rack.forEach((tile, index) => {
      if (tile) rackNode.append(tileButton(tile, index));
      else { const slot=document.createElement('span');slot.className='domino-slot';slot.setAttribute('aria-hidden','true');rackNode.append(slot); }
    });
  }
  function setFeedbackState(value) {
    [$("feedbackArt"), $("resultFeedbackArt")].forEach((node) => { if (node) node.dataset.feedback = value; });
  }
  function choose(index, button) {
    const tile = state.rack[index]; if (!tile) return;
    state.picks += 1; track("tile_selected", { round: state.roundIndex + 1, left: tile[0], right: tile[1], correct: tile[0] === state.currentEnd });
    const reversed=flipMode&&tile.reversible,result=play(chainState,tile.id,{reverse:reversed});
    if(!result.accepted){const message=t('wrong');button.classList.add('is-wrong');$('battleStatus').textContent=message;$('appStatus').textContent=message;setFeedbackState('wrong');playTone("feedback.error");return;}
    chainState=result.state;
    const deadEnd=outcome(chainState)==='dead-end';
    const message=deadEnd?(recoveryCopy[state.locale]||recoveryCopy.en)[1]:t("right");
    button.disabled = true; button.classList.add("is-correct"); state.placed.push(reversed?[tile[1],tile[0]]:tile); state.rack[index] = null; state.currentEnd = chainState.end; state.solved += 1; $("battleStatus").textContent = message; $("battleStatus").classList.remove("is-wrong"); $("appStatus").textContent = message; playTone("board.move"); renderRound(); setFeedbackState(deadEnd?"wrong":"matched");
    if (outcome(chainState)==='complete') { recordCompletion(); scheduleAdvance(420); }
  }
  function startRound() { cancelAdvance();flipMode=false; const round = rounds[state.roundIndex];chainState=createChain(campaign[state.roundIndex]); state.currentEnd = round.start; state.placed = []; state.rack = shuffle(round.tiles);rackOrder=[...state.rack]; $("battleStatus").textContent = ""; $("battleStatus").classList.remove("is-wrong"); setFeedbackState("idle"); renderRound(); }
  function undoChoice(){
    if(!chainState?.path.length)return;cancelAdvance();chainState=undo(chainState);
    state.placed.pop();state.solved=Math.max(0,state.solved-1);state.currentEnd=chainState.end;
    state.rack=rackOrder.map(tile=>chainState.path.includes(tile.id)?null:tile);
    $('battleStatus').textContent='';$('appStatus').textContent=t('end',{habitat:habitat(state.currentEnd)});setFeedbackState('idle');playTone('board.undo');renderRound();
  }
  function start(index=0) {if(!Number.isInteger(index)||index<0||index>=progress.unlocked)return;selectedStageIndex=index;completionReceipt=null;state.roundIndex=index; state.picks = 0; state.solved = 0; track("session_started",{stage:index+1});playTone('game.start'); showView("battleView"); startRound(); }
  function openStages(preferLatestUnlocked=false){if(preferLatestUnlocked===true)selectedStageIndex=Math.max(0,progress.unlocked-1);showView('stageView');stageController?.refresh(selectedStageIndex);}
  function recordCompletion(){
    if(completionReceipt)return completionReceipt;
    if(outcome(chainState)!=='complete')throw new Error('Incomplete route cannot earn progress');
    progress=completeStage(progress,state.roundIndex+1,state.picks);
    const saved=safeStorage.set(PROGRESS_KEY,JSON.stringify(progress));
    completionReceipt={stage:state.roundIndex+1,picks:state.picks,saved};
    track('stage_completed',{stage:completionReceipt.stage,picks:completionReceipt.picks});
    return completionReceipt;
  }
  function finish() {
    const receipt=recordCompletion();
    $('resultTitle').textContent=cc().win;$('resultText').textContent=`${cc().stages} ${state.roundIndex+1} / ${campaign.length}${receipt.saved?'':' · '+cc().saveError}`;
    $('bestValue').textContent=String(progress.best[state.roundIndex+1]);$('nextStage').hidden=state.roundIndex>=campaign.length-1;
    setFeedbackState('complete');showView('resultView');
  }
  function goHome() { track("session_abandoned", { round: state.roundIndex + 1 }); showView("mainView"); applyLocale(); }
  state.locale = queryLocale();
  const initialize = () => {
    const actions=document.createElement('div');actions.className='grove-battle-actions';$('leaveBtn').before(actions);
    const undoButton=document.createElement('button');undoButton.id='undoChain';undoButton.type='button';undoButton.className='secondary-btn';undoButton.addEventListener('click',undoChoice);
    const flip=document.createElement('button');flip.id='flipChain';flip.type='button';flip.className='secondary-btn';flip.addEventListener('click',()=>{flipMode=!flipMode;renderRound();});
    actions.append(undoButton,flip,$('leaveBtn'));
    const routePanel=document.createElement('div');routePanel.className='grove-route-panel';
    document.querySelector('.chain-card').before(routePanel);routePanel.append(document.querySelector('.chain-card'),$('instruction'),$('battleStatus'));
    populateLocales();
    applyLocale();
    frame=window.WeightPlayScreenFrame.mount({
      root:$('app'),localeSelect:$('localeSelect'),playUI:true,
      scenes:{
        main:{root:$('mainView'),header:$('mainView').querySelector('.topbar'),content:$('mainView').querySelector('.main-content')},
        stage:{root:$('stageView'),header:$('stageView').querySelector('.panel-head'),content:$('stageWorkspace')},
        battle:{root:$('battleView'),header:$('battleView').querySelector('.panel-head'),content:$('battleView').querySelector('.battle-content'),headerInfo:$('battleHeaderInfo')},
      },
    });
    frame.activate('main');
    stageController=window.WeightPlayPlayUI.mountStage({
      page:$('stageWorkspace'),rail:$('stageList'),selected:selectedStageIndex,
      config:{
        gameId:'animal-grove-dominoes',count:campaign.length,
        poster:'/games/animal-grove-dominoes/assets/animal-grove-dominoes-cover.webp',
        background:'/assets/lobby-block-atmosphere.svg',
        stage(index){
          const stage=campaign[index];
          if(!stage)throw new RangeError(`GROVE_STAGE_INDEX:${index}`);
          const c=cc(),locked=stage.id>progress.unlocked,best=progress.best[stage.id],cleared=Boolean(best);
          const number=new Intl.NumberFormat(state.locale);
          const required=stage.tiles.filter(tile=>tile.required).length,optional=stage.tiles.length-required;
          const goal=`${c.goal}: ${habitat(stage.goal)}`;
          const summary=`${number.format(required)} ${c.required} · ${goal}`;
          const details=[`${c.required}: ${number.format(required)}`,`${c.optional}: ${number.format(optional)}`,goal];
          if(stage.visits?.length)details.push(`${c.visits}: ${stage.visits.map(habitat).join(' · ')}`);
          if(stage.bridges!==undefined)details.push(`${c.bridges}: ${stage.bridges}`);
          if(stage.flips!==undefined)details.push(`${c.flips}: ${stage.flips}`);
          if(stage.deliveries?.length)details.push(`${c.deliveries}: ${stage.deliveries.map(habitat).join(' → ')}`);
          return {
            id:stage.id,kicker:`${c.stages} ${number.format(stage.id)} / ${number.format(campaign.length)}`,
            title:stage.names[state.locale]||stage.names.en,subtitle:goal,
            status:locked?c.locked:cleared?`${c.cleared} · ${t('best')}: ${best}`:c.play,
            summary,details,locked,cleared,
            poster:'/games/animal-grove-dominoes/assets/animal-grove-dominoes-cover.webp',
          };
        },
      },
      onSelect:index=>{selectedStageIndex=index;},
      onStart:index=>{selectedStageIndex=index;start(index);},
      isActive:()=>$('app').dataset.wpFrameActive==='stage',
    });
    $('stageTab').addEventListener('click',()=>stageController?.select(stageController.selected,{center:true,focus:true}));
    $('startBtn').addEventListener('click',()=>openStages(true));
    $('replayBtn').addEventListener('click',()=>start(state.roundIndex));
    $('nextStage').addEventListener('click',()=>start(state.roundIndex+1));
    $('homeBtn').addEventListener('click',openStages);
    $('battleBackBtn').addEventListener('click',openStages);
    $('stageBackBtn').addEventListener('click',()=>goHome());
    $('leaveBtn').addEventListener('click',openStages);
    applyLocale();
    // Decode the two-ended domino art before the first entry. Text labels
    // remain a usable fallback if an asset request fails; no retry loop.
    $('startBtn').disabled=true;$('startBtn').setAttribute('aria-busy','true');
    const atlas=new Image();atlas.src='/games/animal-grove-dominoes/assets/animal-grove-dominoes-habitat-atlas.png';
    atlas.decode().catch(()=>{}).finally(()=>{$('startBtn').disabled=false;$('startBtn').removeAttribute('aria-busy');});
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});else initialize();
  window.GROVE_CHAIN_TEST = { rounds, start, choose, state };
  window.GROVE_CHAIN_LEAVE_LIFECYCLE = { pause: pauseAdvance, resume: resumeAdvance, discard: cancelAdvance };
})();
