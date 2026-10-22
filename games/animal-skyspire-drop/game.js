(async () => {
  "use strict";
  const requiredStyles=['/games/animal-skyspire-drop/style.css','/games/animal-skyspire-drop/style-interface9.css','/src/game-ui-theme.css','/src/game-screen-frame.css','/src/game-play-ui.css','/src/interface9-shared-screens.css','/src/battle-canvas-standard.css'];
  const loadedStyles=[...document.styleSheets].filter(sheet=>{try{return sheet.href&&sheet.cssRules.length>0}catch{return false}}).map(sheet=>new URL(sheet.href).pathname);
  if(!window.WeightPlayScreenFrame?.mount||!window.WeightPlayPlayUI?.mountStage||!window.WeightPlayStageRailI9?.attachLogical||!window.WeightPlayBattleCanvas?.sync||!requiredStyles.every(suffix=>loadedStyles.some(path=>path.endsWith(suffix))))throw new Error('SKYSPIRE_SHARED_ENTRY_DEPENDENCY_UNAVAILABLE');
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(run?.paused || run?.suspended || lifecycleSuspended), node: document.body,
    activityMode: "input", idleSeconds: 300
  });
  function __wpNotifyMeasurement() { try { window.WonderAnalytics?.game?.observeState(__wpReadMeasurement); } catch { /* Optional telemetry. */ } }
  // Explicit authored replay actions count only when a new round was actually created.
  function __wpReplayStart(action) {
    const previous = __wpMeasurement.roundKey, value = action();
    if (__wpMeasurement.roundKey !== previous) { __wpMeasurement.restart = true; __wpNotifyMeasurement(); }
    return value;
  }
  window.addEventListener("weightplay:analytics-ready", __wpNotifyMeasurement);
  __wpNotifyMeasurement();

  const {Skyspire3D}=await import("./skyspire-3d.js?v=20261022-skyspire-i9-entry1");
  const {createSkyspireDropStageConfig}=await import("./stage-config.mjs?v=20261022-skyspire-i9-entry1");
  let view3d=null;
  document.body.dataset.runtimeLocalize="off";
  const LOCALES=window.SKYDROP_LOCALES;
  const localeOrder=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const localeLabels={en:"English","zh-Hant":"繁體中文","zh-Hans":"简体中文",ja:"日本語",ko:"한국어",es:"Español","pt-BR":"Português",fr:"Français",de:"Deutsch",it:"Italiano",ru:"Русский",hi:"हिन्दी",ar:"العربية"};
  const routeLocales={en:"en","zh-tw":"zh-Hant","zh-cn":"zh-Hans",ja:"ja",ko:"ko",es:"es","pt-br":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const localeRoutes=Object.fromEntries(Object.entries(routeLocales).map(([route,locale])=>[locale,route]));
  const localeOverrides={hi:{
    loading:"स्काईस्पायर खुल रहा है…",title:"स्काईस्पायर ड्रॉप",language:"भाषा",posterAlt:"क्रिस्टल शिखर से उतरती फ़िया",eyebrow:"क्रिस्टल अवरोहण आर्केड",
    pitch:"टावर घुमाएँ, हर खुले रास्ते को मिलाएँ और शापित छल्लों से पहले फ़िया का धूमकेतु प्रहार भरें।",start:"खेल शुरू करें",
    guideFaqTitle:"अक्सर पूछे जाने वाले प्रश्न",guideRelatedTitle:"संबंधित गेम",guideAllGames:"सभी गेम",guideRelatedGame:"Animal Block Grove",
    chooseStage:"स्काईस्पायर चुनें",towers:"स्काईस्पायर",forge:"धूमकेतु भट्ठी",stageHint:"रेल खींचें और खुला टावर चुनें।",
    stage:"टावर {n}",ringCount:"{n} छल्ले",locked:"बंद",cleared:"पूरा",stageReady:"तैयार",chapter:"अध्याय {n}",
    chapters:["पहली रोशनी","काँच का प्रभामंडल","बहता हुआ शिखर","दर्पण धारा","छाया द्वार","मुकुट-पतन"],
    rules:["खुले रास्तों को पहचानें और सुरक्षित उछाल सीखें।","नाज़ुक वलय पहले चटकते हैं, फिर टूट जाते हैं।","निशाना साधते समय अलग-अलग वलय खिसकते रहते हैं।","चिह्नित वलय घूमने की दिशा उलट देते हैं।","कवच और घने शापित क्षेत्र योजना माँगते हैं।","हर टावर का नियम पूरी गति के साथ लौटता है।"],
    forgeTitle:"धूमकेतु भट्ठी",forgeIntro:"सहेजे गए आकाशी टुकड़ों से नियंत्रण और बचाव के स्थायी सुधार खरीदें।",auraTitle:"विजेता पथ",auraText:"बैंगनी-सुनहरी सजावटी लकीर; इससे टावरों का संतुलन नहीं बदलता।",
    shards:"{n} आकाशी टुकड़े",upgradeGrip:"सर्पिल पकड़",upgradeGripDesc:"उसी खिंचाव से टावर को और घुमाएँ।",upgradeAegis:"क्रिस्टल कवच",upgradeAegisDesc:"कठिन टावर की शुरुआत में एक कवच पाएँ।",
    upgradeSpark:"धूमकेतु चिंगारी",upgradeSparkDesc:"कम खुले रास्तों में धूमकेतु प्रहार भरें।",upgradeButton:"सुधारें · {n}",maxed:"अधिकतम",auraBuy:"खोलें · 10 💎",auraOwned:"सुसज्जित",
    combo:"क्रम",time:"समय",shield:"कवच",objective:"टावर घुमाएँ और बचाव द्वार तक पहुँचें।",arenaLabel:"घूमता हुआ क्रिस्टल टावर",controlCue:"घुमाने के लिए बाएँ या दाएँ खींचें",cometBreak:"धूमकेतु प्रहार",
    helpTitle:"खुले रास्ते से फ़िया का मार्गदर्शन करें",help1:"पूरे टावर को घुमाने के लिए क्षैतिज दिशा में खींचें।",help2:"फ़िरोज़ी सुरक्षित है। बैंगनी क्षेत्र दौड़ खत्म करता है, जब तक कवच या धूमकेतु प्रहार तैयार न हो।",help3:"लगातार तीन खुले रास्ते एक स्वचालित धूमकेतु प्रहार भरते हैं।",
    continue:"जारी रखें",leaveTitle:"इस अवरोहण को जारी रखें?",leaveText:"जारी रखें चुनने पर आप इसी उछाल से आगे बढ़ेंगे। मानचित्र पर लौटने से यह दौड़ समाप्त होगी।",returnMap:"मानचित्र पर लौटें",
    resultTime:"समय",bestCombo:"सर्वश्रेष्ठ क्रम",stars:"सितारे",retry:"फिर प्रयास करें",next:"अगला टावर",best:"सर्वश्रेष्ठ: {time} सेकंड",newBest:"नया सर्वश्रेष्ठ अवरोहण!",starSummary:"{n} / 3 सितारे",
    safeBounce:"सुरक्षित उछाल — अगली उतराई से पहले घुमाएँ।",gapPass:"साफ़ अवरोहण! क्रम {n}।",hazardHit:"शापित क्षेत्र ने फ़िया को रोक दिया।",shieldSave:"क्रिस्टल कवच ने उतराई बचा ली।",cometSmash:"धूमकेतु प्रहार ने खतरा तोड़ दिया!",
    fragileCrack:"काँच का वलय चटक गया।",fragileBreak:"काँच का वलय टूटकर खुल गया!",reversed:"दर्पण धारा: नियंत्रण उलटे हैं।",crystal:"आकाशी क्रिस्टल ने कवच भर दिया।",
    winKicker:"बचाव द्वार तक पहुँच गए",winTitle:"स्काईस्पायर पूरा हुआ!",winText:"फ़िया ने {time} सेकंड में टावर {n} बहाल किया।",failKicker:"अवरोहण रुक गया",failTitle:"सर्पिल फिर आज़माएँ",failText:"बैंगनी क्षेत्र पढ़ें, पहले घुमाएँ और अगली उतराई को सुरक्षित रखें।",
    rotateCue:"घुमाव दर्ज हुआ — चमकते खुले रास्ते को मिलाएँ।",nextRule:"अगला टावर {n}: {name} · नया नियम: {rule}",
    landingScan:"अगला उतराव",scanGap:"खुला रास्ता",scanSafe:"सुरक्षित पत्थर",scanDanger:"शापित क्षेत्र",scanFragile:"नाज़ुक काँच",
    scanGapAction:"आगे बढ़ें",scanSafeAction:"उछलें · रीसेट",scanDangerAction:"बचें",scanFragileAction:"चटकाएँ, फिर पार करें",
  }};
  const storageKey="weightplay:animal-skyspire-drop:v1",sessionStore=new Map();
  const $=id=>document.getElementById(id);
  const landingScan=document.createElement("div");landingScan.id="landingScan";landingScan.className="landing-scan";landingScan.setAttribute("aria-live","off");landingScan.innerHTML='<span id="landingScanLabel"></span><strong id="landingScanValue"></strong><em id="landingScanRule"></em>';$('arenaWrap').append(landingScan);
  const els={loading:$("loadingPanel"),gameFrame:$("gameFrame"),mainScreen:$("mainScreen"),stageScreen:$("stageScreen"),battleScreen:$("battleScreen"),battleLive:$("battleLive"),localeSelect:$("localeSelect"),mainProgress:$("mainProgress"),start:$("start"),stageBack:$("stageBack"),stageRail:$("stageRail"),stageSummary:$("stageSummary"),racesTab:$("racesTab"),forgeTab:$("forgeTab"),towerPanel:$("towerPanel"),forgePanel:$("forgePanel"),stageHint:$("stageHint"),shardCount:$("shardCount"),upgrades:$("upgrades"),auraButton:$("auraButton"),forgeFeedback:$("forgeFeedback"),battleBack:$("battleBack"),battleHelp:$("battleHelp"),stageContent:$("stageContent"),battleContent:$("battleContent"),battleInfo:$("battleInfo"),towerLabel:$("towerLabel"),depthValue:$("depthValue"),comboValue:$("comboValue"),timeValue:$("timeValue"),shieldValue:$("shieldValue"),objective:$("objective"),arenaWrap:$("arenaWrap"),arena:$("arena"),landingScan,landingScanLabel:$("landingScanLabel"),landingScanValue:$("landingScanValue"),landingScanRule:$("landingScanRule"),powerBadge:$("powerBadge"),powerValue:$("powerValue"),feedback:$("feedback"),helpModal:$("helpModal"),helpClose:$("helpClose"),leaveModal:$("leaveModal"),leaveContinue:$("leaveContinue"),leaveStage:$("leaveStage"),resultModal:$("resultModal"),resultKicker:$("resultKicker"),resultTitle:$("resultTitle"),resultText:$("resultText"),nextRule:$("nextRule"),resultTime:$("resultTime"),resultCombo:$("resultCombo"),resultStars:$("resultStars"),retry:$("retry"),resultMap:$("resultMap"),next:$("next")};
  els.resultMap.parentElement.append(els.resultMap,els.next,els.retry);
  els.arena.tabIndex=0;
  els.arena.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight A D");
  const defaultSave={unlocked:1,stars:{},best:{},shards:0,upgrades:{grip:0,aegis:0,spark:0},tutorial:false,aura:false};
  let lang=detectLocale(),save=loadSave(),stageIndex=Math.max(0,Math.min(29,save.unlocked-1)),run=null,raf=0,lastFrame=0,screen="main",sceneGeneration=0,activeTab="towers",resizeObserver=null,lifecycleSuspended=document.hidden,windowFocused=document.hasFocus(),modalOpener=null,resultActionClaimed=false,forgeDecisionReadyAt={},stageController=null,screenFrame=null;
  const GAME_VERSION="v23";
  const GAME_ID='animal-skyspire-drop';
  let runBlockRewardCredited=false;
  function renderResultReward(){
    const icon=window.ShowResultGet?.(GAME_ID,run?.result?.win===true&&runBlockRewardCredited);
    if(icon)queueMicrotask(()=>{if(icon.isConnected&&!els.resultModal.hidden)window.WeightPlayCastle?.dismissRewardNotice?.(GAME_ID)});
  }
  window.addEventListener('weightplay:castle-reward',event=>{
    if(event.detail?.gameId!==GAME_ID||event.detail?.completionId!==`stage-${stageIndex+1}`||screen!=='battle'||!run)return;
    runBlockRewardCredited=true;if(run.result)renderResultReward();
  });
  let sharedSettingsPause=null;
  function syncSharedSettingsPause(){
    const panel=document.getElementById('wp-frame-battle-settings');
    const open=screen==='battle'&&panel&&!panel.hidden;
    if(open&&run&&!run.ended&&!sharedSettingsPause){
      sharedSettingsPause={run,wasPaused:run.paused};run.paused=true;
      run.dragging=false;run.dragPointerId=null;run.keys.clear();cancelAnimationFrame(raf);raf=0;
      renderHud();draw();__wpNotifyMeasurement();
    }else if(!open&&sharedSettingsPause){
      const prior=sharedSettingsPause;sharedSettingsPause=null;
      if(screen==='battle'&&run===prior.run&&!run.ended&&!prior.wasPaused&&els.helpModal.hidden&&els.leaveModal.hidden&&els.resultModal.hidden){run.paused=false;lastFrame=performance.now();startLoop();}
      __wpNotifyMeasurement();
    }
  }
  const interfaceValidationRun=Boolean(window.__WP_INTERFACE_VALIDATION__);

  const TAU=Math.PI*2,PLAYER_ANGLE=-Math.PI/2;

  function detectLocale(){const segment=location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();if(routeLocales[segment])return routeLocales[segment];try{const stored=localStorage.getItem("weightplayLocale");if(localeOrder.includes(stored))return stored}catch{}return "en"}
  function storageRead(key){try{return localStorage.getItem(key)}catch{return sessionStore.get(key)||null}}
  function storageWrite(key,value){try{localStorage.setItem(key,value)}catch{sessionStore.set(key,value)}}
  function normalizeSave(raw={}){const upgrades=raw.upgrades||{};return{unlocked:boundInt(raw.unlocked,1,30,1),stars:raw.stars&&typeof raw.stars==="object"?raw.stars:{},best:raw.best&&typeof raw.best==="object"?raw.best:{},shards:boundInt(raw.shards,0,99999,0),upgrades:{grip:boundInt(upgrades.grip,0,3,0),aegis:boundInt(upgrades.aegis,0,3,0),spark:boundInt(upgrades.spark,0,2,0)},tutorial:Boolean(raw.tutorial),aura:Boolean(raw.aura)}}
  function loadSave(){try{return normalizeSave(JSON.parse(storageRead(storageKey)||"{}"))}catch{return normalizeSave()}}
  function persist(){storageWrite(storageKey,JSON.stringify(save))}
  function boundInt(value,min,max,fallback){const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.trunc(n))):fallback}
  function t(key,vars={}){const localValue=localeOverrides[lang]?.[key]??LOCALES[lang]?.[key];let value=localValue??LOCALES.en[key]??key;const translate=window.WeightPlayGameRuntimeLocalizer?.translate;if(lang!=="en"&&!localValue&&!LOCALES[lang]&&translate)value=Array.isArray(value)?value.map(item=>translate(String(item))):translate(String(value));if(Array.isArray(value))return value;return String(value).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??`{${name}}`)}
  function commonText(source){const translate=window.WeightPlayGameRuntimeLocalizer?.translate;return lang==="en"||!translate?source:translate(source)}
  function ensureCompletePublicGuide(){
    const guide=document.querySelector(".game-page-info");
    if(!guide||guide.hasAttribute("data-wp-preserve-static-guide"))return;
    guide.classList.add("public-guide");
    guide.dataset.wpGuideComplete="true";
    guide.innerHTML=`
      <small data-t="guideKicker"></small>
      <h2 data-t="guideTitle"></h2>
      <p data-t="guideIntro"></p>
      <div class="game-info-sections">
        <article class="game-info-section"><h3 data-t="howTitle"></h3><ol><li data-t="how1"></li><li data-t="how2"></li><li data-t="how3"></li></ol></article>
        <article class="game-info-section"><h3 data-t="growthTitle"></h3><p data-t="growthText"></p><ul data-wp-guide-rules></ul></article>
        <article class="game-info-section"><h3 data-t="cometBreak"></h3><p data-t="help3"></p><p data-t="cometSmash"></p></article>
        <article class="game-info-section"><h3 data-t="shield"></h3><p data-t="help2"></p><p data-t="shieldSave"></p><p data-t="failText"></p></article>
        <article class="game-info-section"><h3 data-t="strategyTitle"></h3><p data-t="strategyText"></p><p data-wp-guide-expansion></p></article>
        <article class="game-info-section"><h3 data-t="forgeTitle"></h3><p data-t="forgeIntro"></p><ul><li><strong data-t="upgradeGrip"></strong> — <span data-t="upgradeGripDesc"></span></li><li><strong data-t="upgradeAegis"></strong> — <span data-t="upgradeAegisDesc"></span></li><li><strong data-t="upgradeSpark"></strong> — <span data-t="upgradeSparkDesc"></span></li></ul></article>
        <article class="game-info-section"><h3 data-t="saveTitle"></h3><p data-t="saveText"></p></article>
        <article class="game-info-section"><h3 data-wp-guide-faq-title></h3><dl><div><dt data-t="helpTitle"></dt><dd data-t="help1"></dd></div><div><dt data-t="leaveTitle"></dt><dd data-t="leaveText"></dd></div></dl></article>
        <article class="game-info-section"><h3 data-wp-guide-related-title></h3><nav class="guide-related-links" aria-label="Related WeightPlay content"><a data-wp-guide-all-games></a><a data-wp-guide-related-game></a></nav></article>
      </div>`;
  }
  function refreshPublicGuide(){
    const guide=document.querySelector("[data-wp-guide-complete]");
    if(!guide)return;
    const rules=t("rules");
    guide.querySelector("[data-wp-guide-rules]").innerHTML=rules.slice(1,5).map(rule=>`<li>${rule}</li>`).join("");
    guide.querySelector("[data-wp-guide-expansion]").textContent=[t("guideIntro"),t("how1"),t("how2"),t("how3"),t("growthText"),...rules,t("help1"),t("help2"),t("help3"),t("strategyText"),t("forgeIntro"),t("upgradeGripDesc"),t("upgradeAegisDesc"),t("upgradeSparkDesc"),t("saveText"),t("leaveText"),t("failText"),t("objective"),t("controlCue")].join(" ");
    const route=localeRoutes[lang]||"en";
    const allGames=guide.querySelector("[data-wp-guide-all-games]");
    const relatedGame=guide.querySelector("[data-wp-guide-related-game]");
    guide.querySelector("[data-wp-guide-faq-title]").textContent=t("guideFaqTitle");
    guide.querySelector("[data-wp-guide-related-title]").textContent=t("guideRelatedTitle");
    allGames.href=`/${route}/`;
    allGames.textContent=t("guideAllGames");
    relatedGame.href=`/${route}/games/animal-block-grove/`;
    relatedGame.textContent=t("guideRelatedGame");
    guide.querySelector(".guide-related-links").setAttribute("aria-label",t("guideRelatedTitle"));
  }
  function applyLocale(){
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==="ar"?"rtl":"ltr";
    if(lang!=="en")document.querySelector("title")?.setAttribute("data-runtime-localize","off");
    document.title=`${t("title")} | WeightPlay`;
    for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]']){
      const meta=document.querySelector(selector);
      if(meta){if(lang!=="en")meta.setAttribute("data-runtime-localize","off");meta.content=document.title}
    }
    const guide=document.querySelector(".game-page-info");
    if(guide){const guideTitle=guide.querySelector("[data-wp-game-title]")?.textContent.trim()||t("title");guide.setAttribute("aria-label",lang==="ar"?`دليل لعبة ${guideTitle}`:t("guideLabel"))}
    document.querySelectorAll("[data-t]").forEach(node=>{node.textContent=t(node.dataset.t)});
    document.querySelectorAll("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.tAria)));
    document.querySelectorAll("[data-t-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.tAlt)));
    refreshPublicGuide();renderMainProgress();renderStages();renderForge();if(run)renderHud();screenFrame?.refresh()
  }
  function initLocale(){els.localeSelect.innerHTML=localeOrder.map(code=>`<option value="${code}">${localeLabels[code]}</option>`).join("");els.localeSelect.value=lang;els.localeSelect.addEventListener("change",()=>{const next=els.localeSelect.value;try{localStorage.setItem("weightplayLocale",next)}catch{}if(/^https?:$/.test(location.protocol)){location.assign(`/${localeRoutes[next]}/games/animal-skyspire-drop/`);return}lang=next;window.WonderI18n?.setLocale?.(lang);applyLocale()})}
  function viewportBucket(){const width=Math.min(window.innerWidth||0,window.innerHeight||0);if(width<=480)return"phone";if(width<=720)return"tablet";return"desktop"}
  function track(event,details={}){try{window.WonderAnalytics?.track?.(event,{game_id:"animal-skyspire-drop",game_version:GAME_VERSION,stage:stageIndex+1,locale:lang,viewport_bucket:viewportBucket(),viewport:`${window.innerWidth}x${window.innerHeight}`,...details})}catch{}}

  function seeded(seed){let x=(seed|0)||1;return()=>{x=(x*1664525+1013904223)|0;return((x>>>0)/4294967296)}}
  function normAngle(angle){angle%=TAU;return angle<0?angle+TAU:angle}
  function angleDistance(a,b){return Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)))}
  function buildStage(index){const chapter=Math.floor(index/5),within=index%5,ringCount=8+chapter*2+within,wind=within===1?-.075-chapter*.008:within===2?.085+chapter*.008:within===4?(chapter%2?-.12:.12):0,pulse=within>=2,twin=within>=3;const rand=seeded(9127+index*733);const rings=[];for(let i=0;i<ringCount;i++){const gapWidth=Math.max(.54,1.18-chapter*.075-within*.025);const gap=i===0?rand()*TAU:normAngle(rings[i-1].gap+(rand()>.5?1:-1)*(.3+rand()*(.48+chapter*.16)));let hazard=normAngle(gap+Math.PI*(.72+rand()*.56));const hazardWidth=Math.min(1.5,.58+chapter*.1+within*.035),hazard2=twin&&i%3===within%3?normAngle(hazard+Math.PI*(.7+rand()*.35)):null;const tempo=within===3?(i%2?.76:1.28):within===4?(i%3===0?1.38:.9):1;rings.push({gap,gapWidth,hazard,hazardWidth,hazard2,hazard2Width:hazard2===null?0:Math.max(.34,hazardWidth*.58),pulse:pulse&&i%2===within%2,tempo,offset:(rand()-.5)*.25,drift:chapter>=2&&i%3!==0?(rand()>.5?1:-1)*(.09+chapter*.018+within*.008):0,fragile:chapter>=1&&i%3===1,reverse:chapter>=3&&i%4===2,crystal:chapter>=4&&i%5===2,cracked:false,broken:false})}return{index,chapter,within,ringCount,rings,wind,pulse,twin,tempo:within>=3,target:Math.round(ringCount*(1.45-chapter*.035)+5),name:t("chapters")[chapter],rule:t("rules")[chapter]}}
  const buildStageBase=buildStage;
  buildStage=function(index){const stage=buildStageBase(index);if(index===0){stage.learningRamp=true;stage.rings.forEach((ring,i)=>{if(i<3){ring.gapWidth=Math.min(1.64,ring.gapWidth+.28);ring.hazardWidth=Math.max(.38,ring.hazardWidth-.12)}})}return stage};
  const stages=Array.from({length:30},(_,i)=>buildStage(i));
  function refreshStageLocale(){for(let i=0;i<stages.length;i++){stages[i].name=t("chapters")[stages[i].chapter];stages[i].rule=t("rules")[stages[i].chapter]}}

  function setScreen(next){
    const previous=screen;
    if(next==="main"&&previous!=="main")track("return_session",{from_screen:previous});
    if(next!=="stage")stageController?.cancel();
    screen=next;
    const generation=++sceneGeneration;
    document.body.dataset.screen=next;
    els.mainScreen.hidden=next!=="main";
    els.stageScreen.hidden=next!=="stage";
    els.battleScreen.hidden=next!=="battle";
    const guide=document.querySelector(".game-page-info");
    if(guide)guide.hidden=next!=="main";
    els.stageScreen.toggleAttribute("data-wp-logical-stage-canvas",next==="stage");
    els.battleScreen.toggleAttribute("data-wp-logical-battle-canvas",next==="battle");
    if(next!=="battle"){cancelAnimationFrame(raf);release3D()}
    screenFrame?.activate(next);
    if(next==="stage"){renderStages();renderForge()}
    if(next==="battle")startLoop();
    { const __wpNextScreen=({main:"main",stage:"stage",battle:"battle"})[next]??null;
      if(["result"].includes(next)&&__wpMeasurement.started&&!__wpMeasurement.ended){__wpMeasurement.ended=true;__wpMeasurement.outcome="complete"}
      else if(true&&(__wpNextScreen==="main"||__wpNextScreen==="stage")&&__wpMeasurement.screen==="battle"&&__wpMeasurement.started&&!__wpMeasurement.ended){__wpMeasurement.ended=true;__wpMeasurement.outcome="abandon"}
      __wpMeasurement.screen=__wpNextScreen;__wpNotifyMeasurement();
    }
  }
  function renderMainProgress(){const done=Object.keys(save.stars).filter(key=>Number(save.stars[key])>0).length;els.mainProgress.textContent=`${done} / 30`}
  const stageConfig=createSkyspireDropStageConfig({stages,getSave:()=>save,text:(key,params)=>t(key,params)});
  function renderStages(){
    refreshStageLocale();
    stageIndex=Math.max(0,Math.min(stages.length-1,stageIndex));
    els.stageSummary.textContent=`${Math.min(save.unlocked,30)} / 30 · ★ ${Object.values(save.stars).reduce((sum,n)=>sum+Number(n||0),0)}`;
    if(!stageController){
      stageController=window.WeightPlayPlayUI.mountStage({page:els.towerPanel,rail:els.stageRail,config:stageConfig,selected:stageIndex,onSelect:index=>{stageIndex=index},onStart:index=>{track("stage_select",{stage:index+1,input_type:"card",unlocked:save.unlocked});startBattle(index)},isActive:()=>screen==="stage"&&activeTab==="towers"});
    }else stageController.refresh(stageIndex);
  }
  const stageTabs=[
    {id:"towers",button:els.racesTab,panel:els.towerPanel},
    {id:"forge",button:els.forgeTab,panel:els.forgePanel}
  ];
  const stageTablist=els.racesTab.closest(".stage-tabs");
  stageTablist.setAttribute("role","tablist");
  stageTablist.dataset.tAria="chooseStage";
  stageTablist.setAttribute("aria-label",t("chooseStage"));
  stageTabs.forEach(item=>{
    item.button.setAttribute("role","tab");
    item.button.setAttribute("aria-controls",item.panel.id);
    item.panel.setAttribute("role","tabpanel");
    item.panel.setAttribute("aria-labelledby",item.button.id);
  });
  function setTab(tab){
    const selected=stageTabs.find(item=>item.id===tab)||stageTabs[0];
    activeTab=selected.id;
    for(const item of stageTabs){const active=item===selected;item.panel.hidden=!active;item.button.classList.toggle("active",active);item.button.setAttribute("aria-selected",String(active));item.button.setAttribute("aria-pressed",String(active));item.button.tabIndex=active?0:-1}
    if(activeTab==="towers")stageController?.refresh(stageIndex);else stageController?.cancel();
  }
  function moveStageTab(event){
    const current=stageTabs.findIndex(item=>item.button===event.currentTarget);
    let next=current;
    if(["ArrowRight","ArrowDown"].includes(event.key))next=(current+1)%stageTabs.length;
    else if(["ArrowLeft","ArrowUp"].includes(event.key))next=(current-1+stageTabs.length)%stageTabs.length;
    else if(event.key==="Home")next=0;
    else if(event.key==="End")next=stageTabs.length-1;
    else return;
    event.preventDefault();
    setTab(stageTabs[next].id);
    stageTabs[next].button.focus({preventScroll:true});
  }
  stageTabs.forEach(item=>item.button.addEventListener("keydown",moveStageTab));
  setTab(activeTab);
  function renderForge(focusUpgrade=""){els.shardCount.textContent=t("shards",{n:save.shards});const defs=[{id:"grip",title:"upgradeGrip",desc:"upgradeGripDesc",cost:[12,24,42]},{id:"aegis",title:"upgradeAegis",desc:"upgradeAegisDesc",cost:[18,34,54]},{id:"spark",title:"upgradeSpark",desc:"upgradeSparkDesc",cost:[28,52]}];els.upgrades.innerHTML="";for(const def of defs){const level=save.upgrades[def.id],max=def.cost.length,cost=def.cost[level];const button=document.createElement("button");button.type="button";button.dataset.upgrade=def.id;button.className=`upgrade${level>=max?" maxed":""}`;button.innerHTML=`<strong>${t(def.title)} · ${level}/${max}</strong><small>${t(def.desc)}</small><b>${level>=max?t("maxed"):t("upgradeButton",{n:cost})}</b>`;button.disabled=level>=max;button.addEventListener("click",()=>{if(save.upgrades[def.id]!==level||performance.now()<(forgeDecisionReadyAt[def.id]||0))return;if(save.shards<cost){els.forgeFeedback.textContent=`${t("shards",{n:save.shards})} / ${t("upgradeButton",{n:cost})}`;return}const restoreFocus=document.activeElement===button;forgeDecisionReadyAt[def.id]=performance.now()+400;save.shards-=cost;save.upgrades[def.id]++;els.forgeFeedback.textContent="";persist();renderForge(restoreFocus?def.id:"");track("skyspire_upgrade",{upgrade:def.id,level:save.upgrades[def.id]})});els.upgrades.append(button)}els.auraButton.textContent=save.aura?t("auraOwned"):t("auraBuy");els.auraButton.disabled=save.aura;if(focusUpgrade){const generation=sceneGeneration,preferred=els.upgrades.querySelector(`[data-upgrade="${focusUpgrade}"]:not(:disabled)`),fallback=els.upgrades.querySelector(".upgrade:not(:disabled)")||(!els.auraButton.disabled?els.auraButton:els.forgeTab);requestAnimationFrame(()=>{if(screen==="stage"&&activeTab==="forge"&&generation===sceneGeneration)(preferred||fallback)?.focus({preventScroll:true})})}}

  function setBattleIsolation(active){els.battleLive.inert=active;if(active)els.battleLive.setAttribute("aria-hidden","true");else els.battleLive.removeAttribute("aria-hidden")}
  let screenFocusSettlement=0;
  function focusScreenOwner(owner){const token=++screenFocusSettlement,attempt=()=>{if(token!==screenFocusSettlement)return;const active=document.activeElement,stageOwner=owner==="stage"&&active?.matches?.(".stage-card"),style=active&&active!==document.body&&active!==document.documentElement?getComputedStyle(active):null,owned=active&&active!==document.body&&active!==document.documentElement&&active.isConnected&&!active.closest("[hidden]")&&active.getClientRects().length&&style?.visibility!=="hidden";if(owned&&!stageOwner)return;let target=null;if(owner==="main"&&screen==="main")target=els.start;if(owner==="stage"&&screen==="stage")target=els.stageRail.querySelector(".stage-card[aria-current='true']");if(target&&target.getClientRects().length&&active!==target)target.focus({preventScroll:true})};requestAnimationFrame(attempt);for(const delay of [80,240,480,800])setTimeout(attempt,delay)}
  function focusArena(){const attempt=()=>{if(screen!=="battle"||!run||run.paused||run.ended||els.battleLive.inert)return;const active=document.activeElement,style=active&&active!==document.body&&active!==document.documentElement?getComputedStyle(active):null,unowned=!active||active===document.body||active===document.documentElement||active===els.arena||!active.isConnected||!active.getClientRects().length||style?.visibility==="hidden";if(unowned)els.arena.focus({preventScroll:true})};requestAnimationFrame(attempt);for(const delay of [80,240,480,800,1200,1600])setTimeout(attempt,delay)}
  function openBattleModal(modal,focusTarget,opener=null){const generation=sceneGeneration;modalOpener=opener?.isConnected?opener:null;(__wpNotifyMeasurement(), modal.hidden=false);setBattleIsolation(true);screenFrame?.activate("battle");requestAnimationFrame(()=>{if(screen==="battle"&&generation===sceneGeneration&&!modal.hidden)focusTarget?.focus({preventScroll:true})})}
  function closeBattleModal(modal,{resume=false,restore=true}={}){(__wpNotifyMeasurement(), modal.hidden=true);setBattleIsolation(false);screenFrame?.activate("battle");const opener=modalOpener;modalOpener=null;if(resume&&run&&!run.ended){(__wpNotifyMeasurement(), run.paused=false);lastFrame=performance.now();startLoop()}if(restore){if(opener?.isConnected)opener.focus({preventScroll:true});else focusArena()}}
  function trapBattleModal(event,onEscape){const modal=event.currentTarget;if(event.key==="Escape"&&onEscape){event.preventDefault();onEscape();return}if(event.key!=="Tab")return;const actions=[...modal.querySelectorAll("button:not([hidden]):not(:disabled)")];if(!actions.length)return;const first=actions[0],last=actions.at(-1);if(actions.length===1||(event.shiftKey&&document.activeElement===first)||(!event.shiftKey&&document.activeElement===last)){event.preventDefault();(event.shiftKey?last:first).focus()}}
  function closeHelp(){save.tutorial=true;persist();closeBattleModal(els.helpModal,{resume:true})}
  function continueLeave(){closeBattleModal(els.leaveModal,{resume:true})}
  function startBattle(index,{skipTutorial=false}={}){runBlockRewardCredited=false;unlockSound();stageIndex=Math.max(0,Math.min(29,index));const stage=buildStage(stageIndex);run={stage,current:0,rotation:0,rotationTarget:0,height:2.3,velocity:0,bounce:0.18,transition:0,departing:null,elapsed:0,accum:0,lastHudAt:0,combo:0,bestCombo:0,power:false,shield:save.upgrades.aegis>=2?2:save.upgrades.aegis>=1?1:0,paused:false,ended:false,result:null,lastFeedback:"",firstRotationShown:false,firstRotationFeedbackUntil:0,pendingFeedback:"",dragging:false,dragPointerId:null,lastX:0,keys:new Set(),landings:0,shieldsUsed:0};const first=stage.rings[0];run.rotation=run.rotationTarget=normAngle(PLAYER_ANGLE-first.offset-first.gap-first.gapWidth/2-.3);
    for(let i=0;i<32&&sectorAtPlayer(first)==="hazard";i++)run.rotation=run.rotationTarget=normAngle(run.rotation+.2);
    (__wpNotifyMeasurement(), els.resultModal.hidden=true);(__wpNotifyMeasurement(), els.leaveModal.hidden=true);(__wpNotifyMeasurement(), els.helpModal.hidden=true);setBattleIsolation(false);els.feedback.textContent="";try{ensure3D();view3d.setStage(stage)}catch(error){release3D();console.error(error);setScreen("stage");showGraphicsError();return}setScreen("battle");syncArenaSize();renderHud();track("game_start");if(!save.tutorial&&!skipTutorial&&!interfaceValidationRun){(__wpNotifyMeasurement(), run.paused=true);openBattleModal(els.helpModal,els.helpClose)}else{save.tutorial=true;persist();focusArena()}
    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function startLoop(){cancelAnimationFrame(raf);raf=0;if(lifecycleSuspended||document.hidden||!windowFocused)return;lastFrame=performance.now();raf=requestAnimationFrame(frame)}
  function frame(now){if(screen!=="battle"||!run||lifecycleSuspended||document.hidden||!windowFocused){raf=0;return}const elapsed=Math.min(.08,(now-lastFrame)/1000||0);lastFrame=now;if(!run.paused&&!run.ended){run.accum=Math.min(.1,run.accum+elapsed);while(run.accum>=1/120&&!run.ended){update(1/120);run.accum-=1/120}}if(now-run.lastHudAt>=100){run.lastHudAt=now;renderHud()}draw();raf=run.paused||run.ended?0:requestAnimationFrame(frame)}
  function suspendLifecycle(){(__wpNotifyMeasurement(), lifecycleSuspended=true);cancelAnimationFrame(raf);raf=0;if(run){run.dragging=false;run.dragPointerId=null;run.keys.clear()}}
  function resumeLifecycle(){if(document.hidden||!windowFocused)return;(__wpNotifyMeasurement(), lifecycleSuspended=false);if(screen==="battle"&&run)startLoop()}
  function signedAngle(from,to){let delta=normAngle(to)-normAngle(from);if(delta>Math.PI)delta-=TAU;if(delta<-Math.PI)delta+=TAU;return delta}
  function update(dt){
    run.elapsed+=dt;
    const grip=1+save.upgrades.grip*.18,direction=currentReverse()?-1:1;
    if(run.keys.has("left"))run.rotationTarget-=dt*2.35*grip*direction;
    if(run.keys.has("right"))run.rotationTarget+=dt*2.35*grip*direction;
    run.rotationTarget=normAngle(run.rotationTarget+dt*run.stage.wind);
    const follow=1-Math.exp(-dt*(run.dragging?32:22));
    run.rotation=normAngle(run.rotation+signedAngle(run.rotation,run.rotationTarget)*follow);
    const previous=run.height;
    run.velocity=Math.max(-12,run.velocity-17*dt);
    run.height+=run.velocity*dt;
    run.transition=0;
    run.bounce=Math.max(0,Math.min(1,(8.1-run.velocity)/16.2));
    if(run.current>=run.stage.ringCount&&run.height<=-run.stage.ringCount*3+.48){run.height=-run.stage.ringCount*3+.48;finish(true);return}
    // Swept downward crossings: a fast fall cannot tunnel through a platform.
    while(!run.ended&&run.current<run.stage.ringCount&&run.velocity<0){
      const floor=-run.current*3+.48;
      if(previous<floor-.001||run.height>floor)break;
      const before=run.current;
      land();
      if(run.current===before){
        run.height=floor;
        if(!run.ended)run.velocity=8.1*(currentRing()?.tempo||1);
        break;
      }
    }
  }
  function currentRing(){return run?.stage.rings[run.current]}
  function currentReverse(){return Boolean(currentRing()?.reverse)}
  function ringAngle(ring){return normAngle(ring.offset+ring.drift*run.elapsed)}
  function hazardWidthAt(ring,secondary=false){const base=secondary?ring.hazard2Width:ring.hazardWidth;if(!ring.pulse)return base;return base*(.72+.34*(.5+.5*Math.sin(run.elapsed*3.4+ring.offset*11)))}
  function sectorAtPlayer(ring){if(!ring||ring.broken)return"gap";const local=normAngle(PLAYER_ANGLE-run.rotation-ringAngle(ring));if(angleDistance(local,ring.gap)<ring.gapWidth/2)return"gap";if(angleDistance(local,ring.hazard)<hazardWidthAt(ring)/2||ring.hazard2!==null&&angleDistance(local,ring.hazard2)<hazardWidthAt(ring,true)/2)return"hazard";return ring.fragile?"fragile":"safe"}
  function threshold(){return Math.max(2,3-save.upgrades.spark)}
  function recordLanding(sector,outcome,details={}){soundCue(outcome);const payload={ring:run.current+1,sector,outcome,...details};track("landing",payload);if(sector==="gap")track("gap_result",payload);if(sector==="hazard")track("hazard_result",payload)}
  function passRing(kind){const cleared=run.current;run.current++;run.combo++;run.bestCombo=Math.max(run.bestCombo,run.combo);if(run.combo>=threshold())run.power=true;run.departing={index:cleared,alpha:1};run.transition=0;if(kind==="smash")track("comet_smash",{ring:cleared+1,combo:run.combo});run.lastFeedback=t(kind==="gap"?"gapPass":"cometSmash",{n:run.combo});setFeedback(run.lastFeedback);}
  function land(){run.landings++;run.bounce=0;const ring=currentRing(),sector=sectorAtPlayer(ring);if(sector==="gap"){recordLanding("gap","pass");passRing("gap");return}if(sector==="hazard"){if(run.power){recordLanding("hazard","comet_smash");run.power=false;run.combo=0;ring.broken=true;passRing("smash");return}if(run.shield>0){recordLanding("hazard","shield_save");track("shield_used",{ring:run.current+1});run.shield--;run.shieldsUsed++;run.combo=0;run.lastFeedback=t("shieldSave");setFeedback(run.lastFeedback);return}recordLanding("hazard","fail");run.lastFeedback=t("hazardHit");setFeedback(run.lastFeedback);finish(false);return}if(sector==="fragile"){if(ring.cracked){recordLanding("fragile","break");ring.broken=true;run.lastFeedback=t("fragileBreak");setFeedback(run.lastFeedback);passRing("smash")}else{recordLanding("fragile","crack");ring.cracked=true;run.combo=0;run.lastFeedback=t("fragileCrack");setFeedback(run.lastFeedback)}return}const outcome=currentReverse()?"reverse":"bounce";recordLanding("safe",outcome);run.combo=0;if(ring.crystal&&run.shield<2){run.shield++;ring.crystal=false;run.lastFeedback=t("crystal")}else run.lastFeedback=currentReverse()?t("reversed"):t("safeBounce");setFeedback(run.lastFeedback)}
  function finish(win){if(run.ended)return;run.ended=true;(__wpNotifyMeasurement(), run.paused=true);const time=Number(run.elapsed.toFixed(1));let stars=0,newBest=false;track("stage_result",{outcome:win?"win":"fail",depth:run.current,time,best_combo:run.bestCombo});if(win){stars=time<=run.stage.target?3:time<=run.stage.target*1.35?2:1;const old=Number(save.best[stageIndex]||Infinity);newBest=time<old;save.best[stageIndex]=Math.min(old,time);save.stars[stageIndex]=Math.max(Number(save.stars[stageIndex]||0),stars);save.unlocked=Math.max(save.unlocked,Math.min(30,stageIndex+2));const reward=4+stars*2+run.stage.chapter;save.shards+=reward;persist();renderMainProgress();track("game_complete",{time,stars,best_combo:run.bestCombo})}else track("game_fail",{depth:run.current,time});run.result={win,time,stars,newBest};showResult()
    __wpMeasurement.ended = true; __wpMeasurement.outcome = (win ? "win" : "lose"); if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}
  function syncResultActions(won){resultActionClaimed=false;const generation=sceneGeneration,resultOwner=run,canAdvance=won&&stageIndex<29,primary=canAdvance?els.next:els.resultMap;for(const action of [els.resultMap,els.next,els.retry]){action.hidden=false;action.disabled=action===els.next&&!canAdvance;action.classList.toggle("primary",action===primary)}requestAnimationFrame(()=>{if(screen==="battle"&&generation===sceneGeneration&&run===resultOwner&&!els.resultModal.hidden)primary.focus({preventScroll:true})})}
  function claimResultAction(){if(els.resultModal.hidden||resultActionClaimed)return false;resultActionClaimed=true;for(const action of [els.retry,els.resultMap,els.next])action.disabled=true;return true}
  function showResult(){const r=run.result,nextStage=stages[stageIndex+1];els.resultKicker.textContent=t(r.win?"winKicker":"failKicker");els.resultTitle.textContent=t(r.win?"winTitle":"failTitle");els.resultText.textContent=r.win?t("winText",{n:stageIndex+1,time:r.time}):t("failText");els.nextRule.hidden=!r.win||!nextStage;els.nextRule.textContent=r.win&&nextStage?t("nextRule",{n:stageIndex+2,name:nextStage.name,rule:nextStage.rule}):"";els.resultTime.textContent=`${r.time}s`;els.resultCombo.textContent=String(run.bestCombo);els.resultStars.textContent=r.win?"★".repeat(r.stars):"—";openBattleModal(els.resultModal);syncResultActions(r.win);renderResultReward()}
  function renderLandingScan(){const sector=sectorAtPlayer(currentRing()),key={gap:"scanGap",safe:"scanSafe",hazard:"scanDanger",fragile:"scanFragile"}[sector]||"scanSafe",actionKey={gap:"scanGapAction",safe:"scanSafeAction",hazard:"scanDangerAction",fragile:"scanFragileAction"}[sector]||"scanSafeAction",verdict=`${t(key)} · ${t(actionKey)}`;els.landingScanLabel.textContent=t("landingScan");els.landingScanValue.textContent=t(key);els.landingScanRule.textContent=t(actionKey);els.landingScan.dataset.sector=sector;els.landingScan.setAttribute("aria-label",`${t("landingScan")}: ${verdict}`);els.arena.setAttribute("aria-label",`${t("arenaLabel")}. ${t("landingScan")}: ${verdict}.`)}
  function renderHud(){if(!run)return;els.objective.textContent=t(currentReverse()?"reversed":"objective");els.towerLabel.textContent=`${t("stage",{n:stageIndex+1})} · ${run.stage.name}`;els.depthValue.textContent=`${Math.min(run.current+1,run.stage.ringCount)} / ${run.stage.ringCount}`;els.comboValue.textContent=String(run.combo);els.timeValue.textContent=run.elapsed.toFixed(1);els.shieldValue.textContent=String(run.shield);els.powerValue.textContent=run.power?t("maxed"):`${Math.min(run.combo,threshold())} / ${threshold()}`;els.powerBadge.classList.toggle("ready",run.power);renderLandingScan()}

  function syncArenaSize(){view3d?.resize();if(run&&(run.paused||run.ended))draw()}
  function release3D(){
    window.WeightPlayAudio?.stopAll({ combatOnly: true });
    view3d?.dispose();view3d=null;
    const fresh=els.arena.cloneNode(false);fresh.dataset.renderer="released";
    els.arena.replaceWith(fresh);els.arena=fresh;
  }
  function ensure3D(){if(!view3d){view3d=new Skyspire3D(els.arena);view3d.setStage(run.stage);
    els.arena.addEventListener("webglcontextlost",event=>{if(view3d?.canvas!==event.target)return;event.preventDefault();suspendLifecycle();if(run)(__wpNotifyMeasurement(), run.paused=true);showGraphicsError()},{once:true});
  }}
  function showGraphicsError(){
    document.getElementById("graphicsError")?.remove();
    const messages={en:"3D graphics are unavailable. Try again, or use a browser with WebGL enabled.","zh-Hant":"3D 畫面暫時無法啟動。請重試，或使用已啟用 WebGL 的瀏覽器。","zh-Hans":"3D 画面暂时无法启动。请重试，或使用已启用 WebGL 的浏览器。",ja:"3D を開始できません。再試行するか、WebGL 対応ブラウザを使用してください。",ko:"3D를 시작할 수 없습니다. 다시 시도하거나 WebGL 지원 브라우저를 사용하세요.",es:"No se pudo iniciar el 3D. Reintenta o usa un navegador con WebGL.", "pt-BR":"Não foi possível iniciar o 3D. Tente novamente ou use um navegador com WebGL.",fr:"La 3D est indisponible. Réessayez ou utilisez un navigateur avec WebGL.",de:"3D ist nicht verfügbar. Erneut versuchen oder einen Browser mit WebGL verwenden.",it:"3D non disponibile. Riprova o usa un browser con WebGL.",ru:"3D недоступно. Повторите попытку или используйте браузер с WebGL.",hi:"3D उपलब्ध नहीं है। फिर कोशिश करें या WebGL वाला ब्राउज़र इस्तेमाल करें।",ar:"تعذّر تشغيل الرسومات ثلاثية الأبعاد. أعد المحاولة أو استخدم متصفحاً يدعم WebGL."};
    const box=document.createElement("section");box.id="graphicsError";box.className="graphics-error";box.setAttribute("role","alert");
    const message=document.createElement("p");message.textContent=messages[lang]||messages.en;
    const retry=document.createElement("button");retry.textContent=t("retry");retry.className="primary";retry.onclick=()=>location.reload();
    box.append(message,retry);(screen==="battle"?els.battleScreen:els.stageScreen).append(box);retry.focus();
  }
  function draw(){if(run&&view3d)view3d.render(run,ringAngle,hazardWidthAt,save.aura)}

  let audioContext=null;
  function unlockSound() { return window.WeightPlayAudio?.unlock(); }
  function soundCue(kind) { const cue = {"pass":"movement.land","comet_smash":"impact.stone","break":"impact.glass","fail":"player.hurt","hit":"player.hurt","win":"result.win","finish":"result.win"}[kind]; if (cue) return window.WeightPlayAudio?.play(cue); }
  function setFeedback(message){if(!run)return;if(run.firstRotationFeedbackUntil>performance.now()){run.pendingFeedback=message;return}run.lastFeedback=message;els.feedback.textContent=message}
  function showFirstRotation(inputType){if(!run||run.firstRotationShown)return;run.firstRotationShown=true;run.firstRotationFeedbackUntil=performance.now()+1500;run.pendingFeedback="";run.lastFeedback=t("rotateCue");els.feedback.textContent=run.lastFeedback;track("first_rotate",{input_type:inputType});const owner=run;window.setTimeout(()=>{if(run!==owner||owner.ended)return;owner.firstRotationFeedbackUntil=0;if(owner.pendingFeedback){owner.lastFeedback=owner.pendingFeedback;owner.pendingFeedback="";els.feedback.textContent=owner.lastFeedback}},1500)}
  function rotateBy(delta,inputType="drag"){if(!run||run.paused||run.ended||!Number.isFinite(delta)||Math.abs(delta)<.0001)return;const grip=1+save.upgrades.grip*.18;run.rotationTarget=normAngle(run.rotationTarget+delta*grip*(currentReverse()?-1:1));track("input_action",{action:"rotate",input_type:inputType,direction:delta>0?"right":"left"});showFirstRotation(inputType)}
  els.arenaWrap.addEventListener("pointerdown",event=>{if(event.target!==els.arena||!run||run.paused||run.ended||!event.isPrimary||event.button!==0||run.dragPointerId!==null)return;unlockSound();els.arena.focus({preventScroll:true});run.dragging=true;run.dragPointerId=event.pointerId;run.lastX=event.clientX;els.arena.setPointerCapture(event.pointerId);event.preventDefault()});
  els.arenaWrap.addEventListener("pointermove",event=>{if(!run?.dragging||run.dragPointerId!==event.pointerId)return;const dx=event.clientX-run.lastX;run.lastX=event.clientX;rotateBy(dx*Math.PI*1.45/Math.max(240,els.arena.getBoundingClientRect().width));event.preventDefault()});
  const stopDrag=event=>{if(!run||run.dragPointerId!==event.pointerId)return;run.dragging=false;run.dragPointerId=null};els.arenaWrap.addEventListener("pointerup",stopDrag);els.arenaWrap.addEventListener("pointercancel",stopDrag);els.arenaWrap.addEventListener("lostpointercapture",stopDrag);
  window.addEventListener("keydown",event=>{if(screen!=="battle"||!run||run.paused||document.activeElement!==els.arena)return;if(["ArrowLeft","a","A"].includes(event.key)){track("input_action",{action:"rotate",input_type:"keyboard",direction:"left"});showFirstRotation("keyboard");run.keys.add("left");event.preventDefault()}if(["ArrowRight","d","D"].includes(event.key)){track("input_action",{action:"rotate",input_type:"keyboard",direction:"right"});showFirstRotation("keyboard");run.keys.add("right");event.preventDefault()}});
  window.addEventListener("keyup",event=>{if(!run)return;if(["ArrowLeft","a","A"].includes(event.key))run.keys.delete("left");if(["ArrowRight","d","D"].includes(event.key))run.keys.delete("right")});
  window.addEventListener("blur",()=>{windowFocused=false;suspendLifecycle()});window.addEventListener("focus",()=>{windowFocused=true;resumeLifecycle()});window.addEventListener("pagehide",()=>{suspendLifecycle();release3D()});window.addEventListener("pageshow",()=>{if(screen==="battle"&&run)ensure3D();resumeLifecycle()});document.addEventListener("visibilitychange",()=>{if(document.hidden)suspendLifecycle();else resumeLifecycle()});

  els.leaveStage.addEventListener("click",()=>{if(!els.leaveModal.hidden)track("map_return",{source:"battle_leave",stage:stageIndex+1})},{capture:true});
  els.retry.addEventListener("click",()=>{if(!els.resultModal.hidden&&!resultActionClaimed)track("retry",{source:"result",stage:stageIndex+1,outcome:run?.result?.win?"win":"fail"})},{capture:true});
  els.resultMap.addEventListener("click",()=>{if(!els.resultModal.hidden&&!resultActionClaimed)track("map_return",{source:"result",stage:stageIndex+1,outcome:run?.result?.win?"win":"fail"})},{capture:true});
  els.next.addEventListener("click",()=>{if(!els.resultModal.hidden&&!resultActionClaimed)track("next_stage",{from_stage:stageIndex+1,stage:stageIndex+2,outcome:run?.result?.win?"win":"fail"})},{capture:true});

  els.start.addEventListener("click",()=>{stageIndex=Math.min(stages.length-1,Math.max(0,save.unlocked-1));setScreen("stage");track("game_start_menu")});els.stageBack.addEventListener("click",()=>setScreen("main"));els.racesTab.addEventListener("click",()=>setTab("towers"));els.forgeTab.addEventListener("click",()=>setTab("forge"));els.battleBack.addEventListener("click",()=>{if(!run||run.ended){setScreen("stage");return}(__wpNotifyMeasurement(), run.paused=true);openBattleModal(els.leaveModal,els.leaveContinue,els.battleBack)});els.leaveContinue.addEventListener("click",continueLeave);els.leaveStage.addEventListener("click",()=>{closeBattleModal(els.leaveModal,{restore:false});run=null;setScreen("stage")});els.battleHelp.addEventListener("click",()=>{if(!run)return;(__wpNotifyMeasurement(), run.paused=true);openBattleModal(els.helpModal,els.helpClose,els.battleHelp)});els.helpClose.addEventListener("click",closeHelp);els.helpModal.addEventListener("keydown",event=>trapBattleModal(event,closeHelp));els.leaveModal.addEventListener("keydown",event=>trapBattleModal(event,continueLeave));els.resultModal.addEventListener("keydown",trapBattleModal);els.retry.addEventListener("click",()=>{if(claimResultAction())__wpReplayStart(() => startBattle(stageIndex,{skipTutorial:true}))});els.resultMap.addEventListener("click",()=>{if(!claimResultAction())return;closeBattleModal(els.resultModal,{restore:false});run=null;setScreen("stage")});els.next.addEventListener("click",()=>{if(claimResultAction())startBattle(Math.min(29,stageIndex+1),{skipTutorial:true})});els.auraButton.addEventListener("click",()=>{if(save.aura)return;if(window.WeightPlayWallet?.spendDiamonds?.(10)){save.aura=true;els.forgeFeedback.textContent="";persist();renderForge()}else els.forgeFeedback.textContent=`${t("auraTitle")} · ${t("auraBuy")}`});
  els.start.addEventListener("click",()=>focusScreenOwner("stage"));
  els.stageBack.addEventListener("click",()=>focusScreenOwner("main"));
  els.battleBack.addEventListener("click",()=>{if(!run||run.ended)focusScreenOwner("stage")});
  els.leaveStage.addEventListener("click",()=>focusScreenOwner("stage"));
  els.resultMap.addEventListener("click",()=>focusScreenOwner("stage"));
  window.addEventListener("resize",syncArenaSize,{passive:true});if("ResizeObserver"in window){resizeObserver=new ResizeObserver(syncArenaSize);resizeObserver.observe(els.arenaWrap)}

  async function preload(){
    const loader=window.WeightPlayGameEntryLoader;
    if(!loader?.isActive)throw new Error('SKYSPIRE_SHARED_ENTRY_LOADER_REQUIRED');
    const uiImages=new Map();
    for(const image of els.gameFrame.querySelectorAll('img[src]'))if(!image.closest('.game-page-info')&&(image.hasAttribute('data-wp-frame-poster')||new URL(image.src).pathname.includes('/assets/animal-skyspire-drop/')))uiImages.set(image.src,image);
    const stagePosterURL=new URL(stageConfig.poster,location.origin).href;
    if(!uiImages.has(stagePosterURL)){const image=new Image();image.src=stagePosterURL;uiImages.set(stagePosterURL,image)}
    const total=Skyspire3D.assetCount+uiImages.size;let completed=0;
    loader.begin(total);
    const progress=count=>{completed+=count;loader.assetProgress(completed,total)};
    await Promise.all([
      Skyspire3D.loadAssets().then(()=>progress(Skyspire3D.assetCount)),
      ...[...uiImages.values()].map(image=>image.decode().then(()=>progress(1))),
    ]);
  }
  window.__animalSkyspireDropSmoke={stages,startBattle:(index=0)=>startBattle(index,{skipTutorial:true}),snapshot:()=>run?{stage:run.stage.index,current:run.current,rotation:run.rotation,rotationTarget:run.rotationTarget,height:run.height,velocity:run.velocity,renderer:view3d?.stats()??null,sector:sectorAtPlayer(currentRing()),gapDelta:currentRing()?signedAngle(run.rotation,normAngle(PLAYER_ANGLE-ringAngle(currentRing())-currentRing().gap)):0,bounce:run.bounce,transition:run.transition,departing:run.departing?{...run.departing}:null,combo:run.combo,bestCombo:run.bestCombo,power:run.power,shield:run.shield,elapsed:run.elapsed,paused:run.paused,ended:run.ended,result:run.result,screen,keys:[...run.keys]}:null,rotateToGap:()=>{const ring=currentRing();if(!ring)return false;run.rotation=run.rotationTarget=normAngle(PLAYER_ANGLE-ringAngle(ring)-ring.gap);return true},rotateToHazard:()=>{const ring=currentRing();if(!ring)return false;run.rotation=run.rotationTarget=normAngle(PLAYER_ANGLE-ringAngle(ring)-ring.hazard);return true},setPower:value=>{if(!run)return false;run.power=Boolean(value);return true},setShield:value=>{if(!run)return false;run.shield=Math.max(0,Math.trunc(Number(value)||0));return true},forceLanding:()=>{if(!run||run.ended)return false;run.bounce=1;land();return true},forceWin:()=>{if(!run)return;run.current=run.stage.ringCount;finish(true)},forceFail:()=>{if(!run)return;finish(false)},step:(seconds=.1,render=true)=>{for(let left=Math.min(1,Math.max(0,seconds));left>0&&!run.ended;left-=.016)update(Math.min(.016,left));if(render)draw()},save:()=>JSON.parse(JSON.stringify(save)),setSave:value=>{save=normalizeSave(value);persist();renderMainProgress();renderStages();renderForge()}};
  window.__animalSkyspireDropSmoke.rotateToFragile=()=>{const ring=currentRing();if(!ring?.fragile)return false;for(let index=0;index<360;index++){const local=index*TAU/360;if(angleDistance(local,ring.gap)<=ring.gapWidth/2||angleDistance(local,ring.hazard)<=hazardWidthAt(ring)/2||ring.hazard2!==null&&angleDistance(local,ring.hazard2)<=hazardWidthAt(ring,true)/2)continue;run.rotation=run.rotationTarget=normAngle(PLAYER_ANGLE-ringAngle(ring)-local);return true}return false};
  screenFrame=window.WeightPlayScreenFrame.mount({root:els.gameFrame,localeSelect:els.localeSelect,playUI:true,scenes:{main:{root:els.mainScreen,header:els.mainScreen.querySelector("header"),content:els.mainScreen.querySelector("[data-wp-frame-content=main]")},stage:{root:els.stageScreen,header:els.stageScreen.querySelector("header"),content:els.stageContent},battle:{root:els.battleScreen,header:els.battleScreen.querySelector("header"),content:els.battleContent,headerInfo:els.battleInfo}}});
  const stageInfoGroup=window.WeightPlayScreenFrame.createGroup();stageInfoGroup.add(els.stageSummary);screenFrame.stageTopUI.add(stageInfoGroup);
  const battleInfoGroup=window.WeightPlayScreenFrame.createGroup();
  const battleStatus=els.battleInfo.querySelector('.battle-status');
  battleInfoGroup.add(els.battleInfo.querySelector('.tower-block'));
  [...battleStatus.children].forEach(node=>battleInfoGroup.add(node));
  battleStatus.remove();
  battleInfoGroup.add(els.battleHelp);screenFrame.battleTopUI.add(battleInfoGroup);
  screenFrame.commonDownButton.add(els.racesTab).add(els.forgeTab);
  window.addEventListener('weightplay:interaction-state',syncSharedSettingsPause);
  screenFrame.activate("main");
  ensureCompletePublicGuide();initLocale();applyLocale();window.addEventListener("DOMContentLoaded",()=>setTimeout(()=>{ensureCompletePublicGuide();applyLocale()},0),{once:true});await preload();syncArenaSize();renderMainProgress();renderStages();renderForge();await new Promise(requestAnimationFrame);els.loading.hidden=true;els.start.disabled=false;window.WeightPlayGameEntryLoader.ready();
})().catch(error=>{console.error(error);window.__weightPlayGameEntryPendingFailure='animal-skyspire-drop';window.WeightPlayGameEntryLoader?.fail(undefined,()=>location.reload());});
