(async function () {
  "use strict";

  const locales = window.GROVE_CHAIN_LOCALES;
  const localeKeys = locales.__localeKeys;
  const GAME_VERSION = "v6";
  let advanceTimer = null;
  let viewportResetFrame = 0;
  const cancelAdvance = () => { clearTimeout(advanceTimer); advanceTimer = null; };
  window.addEventListener('pagehide', cancelAdvance);
  window.addEventListener('pagehide',()=>cancelAnimationFrame(viewportResetFrame));
  const {createChain,play,undo,outcome}=await import('./chain-engine.mjs?v=20260909-grove-campaign-v6');
  const {recoveryCopy}=await import('./chain-copy.mjs?v=20260909-grove-campaign-v6');
  const {campaign}=await import('./campaign.mjs?v=20260909-grove-campaign-v6');
  const {campaignCopy}=await import('./campaign-copy.mjs?v=20260909-grove-campaign-v6');
  const {campaignGuide}=await import('./campaign-guide.mjs?v=20260909-grove-campaign-v6');
  for(const [locale,guide] of Object.entries(campaignGuide))Object.assign(locales[locale],guide);
  const {PROGRESS_KEY,normalizeProgress,completeStage}=await import('./progress.mjs?v=20260909-grove-campaign-v6');
  const {createStageView}=await import('./stage-view.mjs?v=20260909-grove-campaign-v6');
  const {createHabitatArt}=await import('./habitat-art.mjs?v=20260909-grove-campaign-v6');
  const rounds=campaign.map(p=>({...p,tiles:p.tiles.map(tile=>Object.assign([tile.from,tile.to],tile))}));
  let stageView,progress,flipMode=false,fitBattle=()=>{},completionReceipt=null;
  const cc=()=>campaignCopy[state.locale]||campaignCopy.en;
  let chainState=null,rackOrder=[];
  const state = { locale: "en", sound: true, roundIndex: 0, currentEnd: "", picks: 0, placed: [], rack: [], solved: 0 };
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
  function playTone(kind) {
    if (!state.sound || !(window.AudioContext || window.webkitAudioContext)) return;
    try { const AudioCtor = window.AudioContext || window.webkitAudioContext; const audio = new AudioCtor(); const oscillator = audio.createOscillator(); const gain = audio.createGain(); oscillator.frequency.value = kind === "success" ? 620 : 210; gain.gain.setValueAtTime(0.0001, audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.03, audio.currentTime + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.13); oscillator.connect(gain).connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + 0.14); oscillator.addEventListener("ended", () => audio.close(), { once: true }); } catch (_) {}
  }
  function applyLocale() {
    document.documentElement.lang = state.locale;
    document.body.dataset.gameVersion = GAME_VERSION;
    document.documentElement.dir = copy().direction || "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelectorAll("[data-copy-aria-label]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.copyAriaLabel)); });
    $("settingsBtn").setAttribute("aria-label", t("settings"));
    $("settingsPanel").setAttribute("aria-label", t("settings"));
    $("battleSoundBtn").setAttribute("aria-label", state.sound ? t("soundOn") : t("soundOff"));
    $("battleSoundBtn").setAttribute("aria-pressed", String(state.sound));
    $("battleSoundBtn").textContent = state.sound ? "♪" : "×";
    $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("soundBtn").setAttribute("aria-pressed", String(state.sound));
    document.querySelectorAll('[data-copy="facts"]').forEach(node=>node.textContent=cc().summary);
    $('flipChain').textContent=cc().flip;
    $('battleBackBtn').textContent='←';$('battleBackBtn').setAttribute('aria-label',cc().backStages);
    $('leaveBtn').textContent=cc().backStages;$('homeBtn').textContent=cc().backStages;$('nextStage').textContent=cc().next;
    if(stageView&&!stageView.root.hidden)stageView.refresh();
    if (!$('battleView').hidden) renderRound();
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
    const stage=id==='stageView';
    if(stageView)stageView.root.hidden=!stage;
    $("mainView").hidden = !main;
    const guide = document.querySelector(".guide-card, [data-wp-game-guide], .game-page-info-static");
    if (guide) guide.hidden = !main;
    $("battleView").hidden = main || stage;
    document.querySelector('#battleView .logical-shell').hidden=result;
    $("resultView").hidden = !result;
    document.body.dataset.screen = main ? "main" : stage?'stage':result ? "result" : "battle";
    $("settingsPanel").hidden = true;
    $("settingsBtn").setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    if(!main)viewportResetFrame=requestAnimationFrame(()=>{
      viewportResetFrame=0;
      document.documentElement.scrollTop=0;document.body.scrollTop=0;
      window.scrollTo({left:0,top:0,behavior:'instant'});
    });
    if(!main&&!stage)fitBattle();
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
    $("roundLabel").textContent = t("round", { current: state.roundIndex + 1, total: rounds.length });
    $("endLabel").textContent = t("end", { habitat: habitat(state.currentEnd) });
    $("placedCount").textContent = String(state.placed.length);
    const words=recoveryCopy[state.locale]||recoveryCopy.en;
    const c=cc();
    const rules=[`${c.goal}: ${habitat(round.goal)}`,`${c.required}: ${chainState.tiles.filter(tile=>tile.required&&!chainState.path.includes(tile.id)).length}`];
    if(round.visits?.length)rules.push(`${c.visits}: ${round.visits.map(h=>`${chainState.visited.includes(h)?'✓ ':''}${habitat(h)}`).join(' · ')}`);
    if(round.bridges!==undefined)rules.push(`${c.bridges}: ${chainState.bridgesLeft}`);
    if(round.flips!==undefined)rules.push(`${c.flips}: ${chainState.flipsLeft}`);
    if(round.deliveries?.length)rules.push(`${c.deliveries}: ${round.deliveries.map((h,i)=>`${i<chainState.deliveryIndex?'✓ ':''}${habitat(h)}`).join(' → ')}`);
    $("instruction").textContent=rules.join(' • ');
    $('flipChain').disabled=!round.tiles.some(tile=>tile.reversible);$('flipChain').setAttribute('aria-pressed',String(flipMode));
    $('placedCount').parentElement.lastChild.textContent=`/${round.tiles.length}`;
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
    if(!result.accepted){button.classList.add('is-wrong');$('battleStatus').textContent=t('wrong');setFeedbackState('wrong');playTone('wrong');return;}
    chainState=result.state;
    button.disabled = true; button.classList.add("is-correct"); state.placed.push(reversed?[tile[1],tile[0]]:tile); state.rack[index] = null; state.currentEnd = chainState.end; state.solved += 1; $("battleStatus").textContent = t("right"); $("battleStatus").classList.remove("is-wrong"); $("appStatus").textContent = t("right"); playTone("success"); renderRound(); setFeedbackState("matched");
    if(outcome(chainState)==='dead-end'){$('battleStatus').textContent=(recoveryCopy[state.locale]||recoveryCopy.en)[1];setFeedbackState('wrong');}
    if (outcome(chainState)==='complete') { recordCompletion();cancelAdvance(); advanceTimer = window.setTimeout(() => { advanceTimer=null; if ($('battleView').hidden) return; finish(); }, 420); }
  }
  function startRound() { cancelAdvance();flipMode=false; const round = rounds[state.roundIndex];chainState=createChain(campaign[state.roundIndex]); state.currentEnd = round.start; state.placed = []; state.rack = shuffle(round.tiles);rackOrder=[...state.rack]; $("battleStatus").textContent = ""; $("battleStatus").classList.remove("is-wrong"); setFeedbackState("idle"); renderRound(); }
  function undoChoice(){
    if(!chainState?.path.length)return;cancelAdvance();chainState=undo(chainState);
    state.placed.pop();state.solved=Math.max(0,state.solved-1);state.currentEnd=chainState.end;
    state.rack=rackOrder.map(tile=>chainState.path.includes(tile.id)?null:tile);
    $('battleStatus').textContent='';setFeedbackState('idle');renderRound();
  }
  function start(index=0) {if(!Number.isInteger(index)||index<0||index>=progress.unlocked)return;completionReceipt=null;state.roundIndex=index; state.picks = 0; state.solved = 0; track("session_started",{stage:index+1}); showView("battleView"); startRound(); }
  function openStages(){showView('stageView');stageView.refresh({resetSelection:true});}
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
  function toggleSettings() { const panel = $("settingsPanel"); const open = panel.hidden; panel.hidden = !open; $("settingsBtn").setAttribute("aria-expanded", String(open)); }
  function toggleSound() { state.sound = !state.sound; applyLocale(); track("sound_changed", { enabled: state.sound }); }
  state.locale = queryLocale();
  const initialize = () => {
    const actions=document.createElement('div');actions.className='grove-battle-actions';$('leaveBtn').before(actions);
    const undoButton=document.createElement('button');undoButton.id='undoChain';undoButton.type='button';undoButton.className='secondary-btn';undoButton.addEventListener('click',undoChoice);
    const flip=document.createElement('button');flip.id='flipChain';flip.type='button';flip.className='secondary-btn';flip.addEventListener('click',()=>{flipMode=!flipMode;renderRound();});
    actions.append(undoButton,flip,$('leaveBtn'));
    const routePanel=document.createElement('div');routePanel.className='grove-route-panel';
    document.querySelector('.chain-card').before(routePanel);routePanel.append(document.querySelector('.chain-card'),$('instruction'),$('battleStatus'));
    const next=document.createElement('button');next.id='nextStage';next.type='button';next.className='primary-btn';next.addEventListener('click',()=>start(state.roundIndex+1));$('replayBtn').before(next);
    const canvas=document.querySelector('#battleView .battle-canvas'),frame=document.createElement('div');frame.className='grove-battle-frame';
    frame.append(document.querySelector('#battleView .logical-shell'),$('resultView'));canvas.append(frame);
    fitBattle=()=>{
      if($('battleView').hidden)return;
      const width=Math.min(920,document.documentElement.clientWidth),height=Math.max(1,(window.visualViewport?.height||innerHeight)-56);
      const wide=width>=680&&width>height*1.3;
      // Recompose route and rack tracks on viewport changes; domino, label
      // and action dimensions stay identical in both layouts.
      frame.dataset.layout=wide?'wide':'tall';
      const scale=Math.min(width/(wide?740:390),height/(wide?354:620));
      canvas.style.height=height+'px';frame.style.width=width/scale+'px';frame.style.height=height/scale+'px';frame.style.transform=`scale(${scale})`;
    };
    const resizeLifecycle=new AbortController();window.addEventListener('resize',fitBattle,{signal:resizeLifecycle.signal});window.visualViewport?.addEventListener('resize',fitBattle,{signal:resizeLifecycle.signal});window.addEventListener('pagehide',()=>resizeLifecycle.abort(),{once:true});
    stageView=createStageView({campaign,copy:cc,locale:()=>state.locale,progress:()=>progress,activate:start,home:goHome,sound:()=>state.sound,soundLabel:()=>t(state.sound?'soundOn':'soundOff'),toggleSound});
    populateLocales();applyLocale();$('startBtn').addEventListener('click',openStages);$('replayBtn').addEventListener('click',()=>start(state.roundIndex));$('homeBtn').addEventListener('click',openStages);$('battleBackBtn').addEventListener('click',openStages);$('leaveBtn').addEventListener('click',openStages);$('settingsBtn').addEventListener('click',toggleSettings);$('soundBtn').addEventListener('click',toggleSound);$('battleSoundBtn').addEventListener('click',toggleSound);
    // Decode the two-ended domino art before the first entry. Text labels
    // remain a usable fallback if an asset request fails; no retry loop.
    $('startBtn').disabled=true;$('startBtn').setAttribute('aria-busy','true');
    const atlas=new Image();atlas.src='/games/animal-grove-dominoes/assets/animal-grove-dominoes-habitat-atlas.png';
    atlas.decode().catch(()=>{}).finally(()=>{$('startBtn').disabled=false;$('startBtn').removeAttribute('aria-busy');});
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});else initialize();
  window.GROVE_CHAIN_TEST = { rounds, start, choose, state };
})();
