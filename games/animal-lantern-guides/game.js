(() => {
  "use strict";

  const COPY = window.ANIMAL_LANTERN_GUIDES_COPY;
  const SUPPORTED_LOCALES = window.ANIMAL_LANTERN_GUIDES_LOCALES;
  const LOCALE_LABELS = window.ANIMAL_LANTERN_GUIDES_LABELS;
  const ROUTE_LOCALE_MAP = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const SYMBOLS = ["moon", "leaf", "star"];
  const GLYPHS = { moon: "☾", leaf: "❧", star: "✦" };
  const CHAPTERS = [
    { key: "chapter1", ruleKey: "ruleSame", shifts: [0, 0, 0, 0, 0] },
    { key: "chapter2", ruleKey: "ruleNext", shifts: [1, 1, 1, 1, 1] },
    { key: "chapter3", ruleKey: "rulePrevious", shifts: [-1, -1, -1, -1, -1] },
    { key: "chapter4", ruleKey: "ruleEcho", shifts: [2, 2, 2, 2, 2] },
    { key: "chapter5", ruleKey: "ruleWeather", shifts: [1, -1, 1, -1, 1] },
    { key: "chapter6", ruleKey: "ruleMastery", shifts: [-1, 1, 2, 0, 1] }
  ];
  const STAGE_NAMES = ["Mossy Bridge", "Fern Hollow", "Owl Lookout", "Firefly Bend", "Badger Gate"];
  const STAGES = window.LANTERN_TRAILS;
  const $ = id => document.getElementById(id);
  const screens = { main: $("mainScreen"), stage: $("stageScreen"), battle: $("battleScreen"), result: $("resultScreen") };

  function preferredLocale() {
    const segment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const candidates = [window.__WEIGHTPLAY_ROUTE_LOCALE__, ROUTE_LOCALE_MAP[segment]];
    try { candidates.push(localStorage.getItem("weightPlayLocale"), localStorage.getItem("weightplayLocale"), localStorage.getItem("wp-locale")); } catch { /* restricted storage is supported */ }
    candidates.push(document.documentElement.lang);
    return candidates.find(code => SUPPORTED_LOCALES.includes(code)) || "en";
  }

  function readNumber(key, fallback) {
    try {
      const value = Number(localStorage.getItem(key));
      return Number.isFinite(value) && value > 0 ? value : fallback;
    } catch { return fallback; }
  }
  function saveNumber(key, value) { try { localStorage.setItem(key, String(value)); } catch { /* session still works */ } }

  let locale = preferredLocale();
  let soundEnabled = true;
  let stageIndex = 0;
  let unlocked = Math.min(30, readNumber("animalLanternGuidesUnlocked", 1));
  let best = Math.min(30, readNumber("animalLanternGuidesBest", 0));
  let light = 3;
  let phase = "scout";
  let feedbackKey = "";
  let clueVisible = false;
  let resultSuccess = null;
  let bridgeStep=0, pendingTimer=null, lastWrong="";

  function text(key, vars = {}) {
    const pack = { ...COPY[locale], ...window.LANTERN_UPGRADE_COPY[locale] };
    let value = pack[key] ?? COPY.en[key] ?? key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  }
  function symbolName(id) { return (COPY[locale] || COPY.en).symbols[id] || COPY.en.symbols[id]; }
  function setText(id, value) { const node = $(id); if (node) node.textContent = value; }
  function focusNoScroll(node) { node?.focus({ preventScroll: true }); }

  function show(name) {
    if(name!=="battle"){clearTimeout(pendingTimer);pendingTimer=null;}
    window.dispatchEvent(new CustomEvent("wp:block-scene",{detail:{active:name==="battle",colours:["#e4be65","#64cfb0","#a78bfd"],lit:bridgeStep}}));
    Object.entries(screens).forEach(([key, node]) => { node.hidden = key !== name; });
    $("settingsPanel").hidden = true;
    $("mainGuide").hidden = name !== "main";
    [$("settingsBtn"), $("stageSettingsBtn"), $("battleSettingsBtn")].forEach(button => button?.setAttribute("aria-expanded", "false"));
    document.body.dataset.screen = name;
    window.scrollTo(0, 0);
  }

  function toggleSettings() {
    const panel = $("settingsPanel");
    const opening = panel.hidden;
    panel.hidden = !opening;
    [$("settingsBtn"), $("stageSettingsBtn"), $("battleSettingsBtn")].forEach(button => button?.setAttribute("aria-expanded", String(opening)));
  }

  function stageTitle(stage) {
    return `${text(CHAPTERS[stage.chapter].key)} · ${stage.number}`;
  }

  function applyCopy() {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = `${text("title")} | WeightPlay`;
    document.querySelector('[data-wp-return="main"]')?.setAttribute("aria-label", text("back"));
    [$("settingsBtn"), $("stageSettingsBtn"), $("battleSettingsBtn")].forEach(button => button?.setAttribute("aria-label", text("settings")));
    setText("battleBackLabel", text("back")); setText("stageBackLabel", text("back"));
    setText("eyebrow", text("eyebrow")); setText("title", text("title")); setText("languageLabel", text("language")); setText("settingsLabel", text("settings")); setText("soundBtn", text(soundEnabled ? "soundOn" : "soundOff"));
    setText("guideBadge", text("guideBadge")); setText("mainHeading", text("mainHeading")); setText("mainBody", text("mainBody")); setText("progressTitle", text("progressTitle")); setText("progressBody", text("progressBody")); setText("startBtn", text("start")); setText("soloNote", text("soloNote"));
    setText("promiseOneTitle", text("scout")); setText("promiseOneBody", text("scoutPromise")); setText("promiseTwoTitle", text("guide")); setText("promiseTwoBody", text("guidePromise")); setText("promiseThreeTitle", text("together")); setText("promiseThreeBody", text("togetherPromise"));
    setText("howTo", text("howTo")); setText("howToBody", text("guideText")); setText("stageBadge", text("stageBadge")); setText("stageTitle", text("stageTitle")); setText("stageHelp", text("stageHelp"));
    setText("stageOverviewTab", text("stageTitle")); setText("sceneBadge", text("sceneBadge")); setText("scoutRole", text("scoutRole")); setText("scoutHeading", text("scoutHeading")); setText("scoutTask", text("scoutTask")); setText("guideRole", text("guideRole")); setText("guideHeading", text("guideHeading")); setText("guideTask", text("guideTask")); setText("passBtn", text("passClue")); setText("leaveBtn", text("leave")); setText("footer", text("footer")); setText("resultBadge", text("resultBadge")); setText("replayBtn", text("replay")); setText("homeBtn", text("stageMap")); setText("nextBtn", text("nextStage"));
    $("localeSelect").value = locale;
    $("localeSelect").setAttribute("aria-label", text("language"));
    $("scoutChoices").setAttribute("aria-label", text("scoutChoicesLabel"));
    $("guideChoices").setAttribute("aria-labelledby", "guideHeading");
    $("guideChoices").setAttribute("aria-describedby", "guideTask guideRule");
    setText("bestLine", text("bestMenu", { n: best, total: STAGES.length }));
    if (!screens.stage.hidden) renderStage();
    if (!screens.battle.hidden) renderBattle();
    if (!screens.result.hidden) renderResult();
  }

  function glyph(id) {
    const shapes={moon:'M6 1H2V2H1V6H2V7H6V6H4V5H3V3H4V2H6Z',leaf:'M6 1H3V2H2V3H1V6H2V7H3V6H5V5H6V4H7V1Z',star:'M3 0H5V2H6V3H8V5H6V6H5V8H3V6H2V5H0V3H2V2H3Z'};
    return `<svg viewBox="0 0 8 8" class="rune-icon rune-${id}" aria-hidden="true"><path d="${shapes[id]}"/></svg>`;
  }
  function puzzle() {
    const stage=STAGES[stageIndex];
    const kind=stage.rule==='weather'?['same','next','previous'][bridgeStep%3]:stage.rule==='mixed'?['missing','blocked','next','previous'][bridgeStep%4]:stage.rule==='finale'?['same','next','missing','blocked','previous'][bridgeStep%5]:stage.rule;
    const signal=stage.signals[bridgeStep], second=(signal+1+(stage.number%2))%3, blocked=(stage.number+bridgeStep)%3;
    const mapping=[0,1,2].map(i=>{let v=(i+(kind==='previous'?2:kind==='same'?0:1))%3;if(kind==='blocked'&&v===blocked)v=(v+1)%3;return v;});
    return {kind,signal,second,blocked,mapping,answer:kind==='missing'?3-signal-second:mapping[signal]};
  }
  function makeSymbolButton(id) {
    const button=document.createElement('button');button.type='button';button.className='symbol-button';button.dataset.symbol=id;button.dataset.role='guide';button.innerHTML=`${glyph(id)}<span>${symbolName(id)}</span>`;button.setAttribute('aria-label',symbolName(id));button.onclick=()=>guideChoice(id);return button;
  }
  function scene(){window.dispatchEvent(new CustomEvent('wp:block-scene',{detail:{active:document.body.dataset.screen==='battle',colours:['#e4be65','#64cfb0','#a78bfd'],lit:bridgeStep}}));}
  function cue(good=false){try{if(soundEnabled)window.WonderSound?.play(good?'success':'click');}catch{}}

  function renderStage() {
    setText("stageProgress", text("stageProgress", { unlocked, total: STAGES.length }));
    const map = $("chapterMap"); map.replaceChildren();
    CHAPTERS.forEach((chapter, chapterIndex) => {
      const card = document.createElement("article"); card.className = "chapter-card";
      const heading = document.createElement("h3"); heading.textContent = text(chapter.key);
      const rule = document.createElement("p"); rule.textContent = chapterIndex < 5 ? text(STAGES[chapterIndex*5].rule) : ["same","next","previous","missing","blocked"].map(key=>text(key)).join(" ");
      // This five-button chapter grid is intentionally not the shared horizontal
      // Stage rail.  Its old generic class was picked up by the shared rail CSS,
      // pushing Trail 1 off the phone viewport.
      const grid = document.createElement("div"); grid.className = "lantern-stage-grid";
      STAGES.filter(stage => stage.chapter === chapterIndex).forEach(stage => {
        const button = document.createElement("button");
        button.type = "button"; button.className = "stage-button"; button.disabled = stage.number > unlocked; button.dataset.stage = String(stage.number); button.dataset.wpStageCard = ""; button.setAttribute("aria-disabled", String(button.disabled));
        button.innerHTML = `<strong>${stage.checkpoint ? "✦ " : ""}${stage.number}</strong><span>${stage.checkpoint ? text("checkpoint") : text("trail")}</span>`;
        button.setAttribute("aria-label", `${stageTitle(stage)}${button.disabled ? ` — ${text("locked")}` : ""}`);
        button.addEventListener("click", () => startStage(stage.number - 1)); grid.appendChild(button);
      });
      card.append(heading, rule, grid); map.appendChild(card);
    });
  }

  function showStage() { show("stage"); renderStage(); focusNoScroll($("chapterMap").querySelector(`button[data-stage="${Math.min(unlocked, 30)}"]`) || $("stageBackBtn")); }

  function renderBattle() {
    const stage=STAGES[stageIndex],p=puzzle(),isGuide=phase==='guide'||phase==='settling';
    const step=isGuide?'guide':clueVisible?'pass':'scout';
    setText('roundLabel',text('round',{n:stage.number,total:30}));setText('meterLabel',text('meter',{n:light}));setText('sceneTitle','');
    setText('bridgeProgress',text('step',{n:bridgeStep+(phase==='settling'?1:0),total:stage.signals.length}));
    $('blockWorld').dataset.feedback=phase==='settling'?'success':'';
    $('bridgeTrack').innerHTML=stage.signals.map((_,i)=>`<span class="bridge-tile ${i<bridgeStep+(phase==='settling'?1:0)?'is-lit':''}" aria-hidden="true">${i+1}</span>`).join('');
    setText('sceneHint',text(p.kind));setText('handoffPrompt',lastWrong?lastWrong:isGuide?text('handoff'):clueVisible?text('phasePass'):text('phaseScout'));
    setText('stepScout',`1 · ${text('scout')}`);setText('stepPass',`2 · ${text('together')}`);setText('stepGuide',`3 · ${text('guide')}`);
    [['stepScout','scout'],['stepPass','pass'],['stepGuide','guide']].forEach(([id,key])=>{$(id).classList.toggle('is-current',step===key);$(id).classList.toggle('is-done',key==='scout'&&step!=='scout'||key==='pass'&&step==='guide');});
    document.querySelector('.scout-card').classList.toggle('is-active',!isGuide);document.querySelector('.guide-card-panel').classList.toggle('is-active',isGuide);
    document.querySelector('.scout-card').inert=isGuide;document.querySelector('.guide-card-panel').inert=!isGuide;
    setText('guideRule',text(p.kind)+(p.kind==='blocked'?` × ${symbolName(SYMBOLS[p.blocked])}`:''));
    $('ruleMap').innerHTML=p.kind==='missing'?[[0,1,2],[1,2,0],[2,0,1]].map(([a,b,c])=>`<span>${glyph(SYMBOLS[a])}+${glyph(SYMBOLS[b])}<b>→</b>${glyph(SYMBOLS[c])}</span>`).join(''):p.mapping.map((to,from)=>`<span>${glyph(SYMBOLS[from])}<b>→</b>${glyph(SYMBOLS[to])}</span>`).join('');
    $('ruleMap').setAttribute('aria-label',p.kind==='missing'?[[0,1,2],[1,2,0],[2,0,1]].map(([a,b,c])=>`${symbolName(SYMBOLS[a])} + ${symbolName(SYMBOLS[b])} → ${symbolName(SYMBOLS[c])}`).join('; '):p.mapping.map((to,from)=>`${symbolName(SYMBOLS[from])} → ${symbolName(SYMBOLS[to])}`).join('; '));
    const reveal=document.createElement('button');reveal.type='button';reveal.className='symbol-button reveal-button';reveal.dataset.role='scout';
    const names=clueVisible?[symbolName(SYMBOLS[p.signal]),...(p.kind==='missing'?[symbolName(SYMBOLS[p.second])]:[])].join(' + '):text('reveal');
    reveal.innerHTML=clueVisible?`<span class="revealed-pair">${glyph(SYMBOLS[p.signal])}${p.kind==='missing'?glyph(SYMBOLS[p.second]):''}</span><span>${names}</span>`:`<span class="sealed-lantern">?</span><span>${text('reveal')}</span>`;
    reveal.setAttribute('aria-label',names);reveal.disabled=isGuide||clueVisible;reveal.onclick=revealSignal;$('scoutChoices').replaceChildren(reveal);
    $('guideChoices').replaceChildren(...SYMBOLS.map(makeSymbolButton));$('guideChoices').querySelectorAll('button').forEach(b=>b.disabled=phase!=='guide');
    setText('scoutState',clueVisible?names:text('chooseSymbol'));setText('guideState',phase==='settling'?text('guideSuccess'):text('guideTask'));
    $('passBtn').hidden=false;$('passBtn').disabled=isGuide||!clueVisible;setText('recallBtn',text('review'));$('recallBtn').disabled=phase!=='guide';
    $('feedback').textContent=lastWrong|| (feedbackKey?text(feedbackKey):'');$('feedback').classList.toggle('is-good',feedbackKey==='guideSuccess');
    scene();
  }

  function renderResult() {
    if (resultSuccess === null) return;
    const stage = STAGES[stageIndex]; const mastery = resultSuccess && stage.number === 30;
    setText("resultTitle", text(resultSuccess ? mastery ? "masteryTitle" : "completeTitle" : "failTitle"));
    setText("resultBody", text(resultSuccess ? mastery ? "masteryBody" : "completeBody" : "failBody", { n: stage.number }));
    setText("scoreLine", text("score", { n: stage.number })); setText("bestLineResult", text("best", { n: best, total: STAGES.length }));
    $("nextBtn").hidden = !resultSuccess || stage.number >= STAGES.length;
  }

  function startStage(index) {
    if(!Number.isInteger(index)||index<0||index>=30||index+1>unlocked)return;
    clearTimeout(pendingTimer);stageIndex=index;bridgeStep=0;light=3;phase='scout';feedbackKey='';lastWrong='';clueVisible=false;resultSuccess=null;
    show('battle');renderBattle();focusNoScroll($('scoutChoices').querySelector('button'));
  }
  function revealSignal(){if(phase!=='scout'||clueVisible)return;clueVisible=true;lastWrong='';feedbackKey='scoutSuccess';cue();renderBattle();focusNoScroll($('passBtn'));}
  function passToGuide(){if(phase!=='scout'||!clueVisible)return;phase='guide';clueVisible=false;feedbackKey='';renderBattle();focusNoScroll($('guideChoices').querySelector('button'));}
  function guideChoice(id){
    if(phase!=='guide'||!SYMBOLS.includes(id))return;
    const p=puzzle();
    if(SYMBOLS.indexOf(id)!==p.answer){light--;lastWrong=`${text('guideWrong')} ${symbolName(SYMBOLS[p.signal])}${p.kind==='missing'?` + ${symbolName(SYMBOLS[p.second])}`:''} → ${symbolName(SYMBOLS[p.answer])}`;feedbackKey='';if(light<=0){finish(false);return;}phase='scout';clueVisible=false;renderBattle();focusNoScroll($('scoutChoices').querySelector('button'));return;}
    phase='settling';feedbackKey='guideSuccess';lastWrong='';cue(true);renderBattle();
    pendingTimer=setTimeout(()=>{pendingTimer=null;bridgeStep++;if(bridgeStep>=STAGES[stageIndex].signals.length){finish(true);return;}phase='scout';clueVisible=false;feedbackKey='guideSuccess';renderBattle();focusNoScroll($('scoutChoices').querySelector('button'));},320);
  }
  function finish(success) {
    resultSuccess = success;
    if (success) {
      best = Math.max(best, stageIndex + 1); unlocked = Math.max(unlocked, Math.min(STAGES.length, stageIndex + 2));
      saveNumber("animalLanternGuidesBest", best); saveNumber("animalLanternGuidesUnlocked", unlocked);
    }
    show("result"); renderResult(); focusNoScroll(success && stageIndex < STAGES.length - 1 ? $("nextBtn") : $("replayBtn"));
  }

  $("startBtn").addEventListener("click", () => best === 0 && unlocked === 1 ? startStage(0) : showStage());
  $("stageBackBtn").addEventListener("click", () => { show("main"); focusNoScroll($("startBtn")); });
  $("battleBackBtn").addEventListener("click", showStage); $("leaveBtn").addEventListener("click", showStage); $("homeBtn").addEventListener("click", showStage);
  $("replayBtn").addEventListener("click", () => startStage(stageIndex)); $("nextBtn").addEventListener("click", () => startStage(Math.min(stageIndex + 1, STAGES.length - 1))); $("passBtn").addEventListener("click", passToGuide);
  [$("settingsBtn"), $("stageSettingsBtn"), $("battleSettingsBtn")].forEach(button => button?.addEventListener("click", toggleSettings));
  $("soundBtn").addEventListener("click", () => { soundEnabled = !soundEnabled; applyCopy(); });
  $("localeSelect").addEventListener("change", event => {
    event.stopImmediatePropagation();
    locale = SUPPORTED_LOCALES.includes(event.target.value) ? event.target.value : "en";
    try { localStorage.setItem("weightPlayLocale", locale); localStorage.setItem("wp-locale", locale); } catch { /* restricted storage is supported */ }
    // Keep the shared shell and this game's copy on one locale while routing.
    // Rewriting a localized page before navigation can fight its title observer.
    if (window.WonderI18n?.setLocale && window.WonderI18n.actualLocale?.() !== locale) {
      window.WonderI18n.setLocale(locale);
      return;
    }
    applyCopy();
  }, { capture: true });
  $("localeSelect").innerHTML = SUPPORTED_LOCALES.map(code => `<option value="${code}">${LOCALE_LABELS[code]}</option>`).join("");
  $('recallBtn').onclick=()=>{if(phase!=='guide')return;phase='scout';clueVisible=false;feedbackKey='';renderBattle();focusNoScroll($('scoutChoices').querySelector('button'));};
  window.addEventListener('wp:block-pick',e=>guideChoice(SYMBOLS[e.detail.index]));window.addEventListener('wp:block-ready',scene);
  window.addEventListener('pagehide',()=>clearTimeout(pendingTimer));
  window.__LANTERN_TEST__={stages:STAGES,getState:()=>({stageIndex,bridgeStep,phase,clueVisible,light,unlocked,best,puzzle:puzzle()})};
  applyCopy(); show("main");
})();
