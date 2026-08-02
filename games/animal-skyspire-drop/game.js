(() => {
  "use strict";
  document.body.dataset.runtimeLocalize="off";
  const LOCALES=window.SKYDROP_LOCALES;
  const localeOrder=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const localeLabels={en:"English","zh-Hant":"繁體中文","zh-Hans":"简体中文",ja:"日本語",ko:"한국어",es:"Español","pt-BR":"Português",fr:"Français",de:"Deutsch",it:"Italiano",ru:"Русский",hi:"हिन्दी",ar:"العربية"};
  const routeLocales={en:"en","zh-tw":"zh-Hant","zh-cn":"zh-Hans",ja:"ja",ko:"ko",es:"es","pt-br":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const localeRoutes=Object.fromEntries(Object.entries(routeLocales).map(([route,locale])=>[locale,route]));
  const storageKey="weightplay:animal-skyspire-drop:v1",sessionStore=new Map();
  const $=id=>document.getElementById(id);
  const els={loading:$("loading"),mainGroup:$("mainGroup"),stageScreen:$("stageScreen"),battleScreen:$("battleScreen"),battleLive:$("battleLive"),localeSelect:$("localeSelect"),mainProgress:$("mainProgress"),start:$("start"),stageBack:$("stageBack"),stageRail:$("stageRail"),stageSummary:$("stageSummary"),racesTab:$("racesTab"),forgeTab:$("forgeTab"),towerPanel:$("towerPanel"),forgePanel:$("forgePanel"),stageHint:$("stageHint"),shardCount:$("shardCount"),upgrades:$("upgrades"),auraButton:$("auraButton"),forgeFeedback:$("forgeFeedback"),battleBack:$("battleBack"),battleHelp:$("battleHelp"),towerLabel:$("towerLabel"),depthValue:$("depthValue"),comboValue:$("comboValue"),timeValue:$("timeValue"),shieldValue:$("shieldValue"),objective:$("objective"),arenaWrap:$("arenaWrap"),arena:$("arena"),powerBadge:$("powerBadge"),powerValue:$("powerValue"),feedback:$("feedback"),helpModal:$("helpModal"),helpClose:$("helpClose"),leaveModal:$("leaveModal"),leaveContinue:$("leaveContinue"),leaveStage:$("leaveStage"),resultModal:$("resultModal"),resultKicker:$("resultKicker"),resultTitle:$("resultTitle"),resultText:$("resultText"),resultTime:$("resultTime"),resultCombo:$("resultCombo"),resultStars:$("resultStars"),retry:$("retry"),resultMap:$("resultMap"),next:$("next")};
  els.resultMap.parentElement.append(els.resultMap,els.next,els.retry);
  els.arena.tabIndex=0;
  els.arena.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight A D");
  let stageReserve=els.stageScreen.querySelector(":scope > .wp-stage-physical-reserve");
  if(!stageReserve){
    stageReserve=document.createElement("div");
    stageReserve.className="ad-reserve wp-stage-physical-reserve";
    stageReserve.setAttribute("aria-hidden","true");
    els.stageScreen.append(stageReserve);
  }
  const defaultSave={unlocked:1,stars:{},best:{},shards:0,upgrades:{grip:0,aegis:0,spark:0},tutorial:false,aura:false};
  let lang=detectLocale(),save=loadSave(),stageIndex=Math.max(0,Math.min(29,save.unlocked-1)),run=null,raf=0,lastFrame=0,screen="main",sceneGeneration=0,activeTab="towers",resizeObserver=null,lifecycleSuspended=document.hidden,windowFocused=document.hasFocus(),modalOpener=null,resultActionClaimed=false,forgeDecisionReadyAt={};
  const STAGE_CARD_POOL_SIZE=9;
  let stageCardPool=[],stageWindowStart=0,stageBrowseLogical=stageIndex,stageSettleFrame=0;
  const images={};
  const imagePaths={background:"../../assets/animal-skyspire-drop/spire-bg-v2.webp",hero:"../../assets/animal-skyspire-drop/fia-orb.webp",safe:"../../assets/animal-skyspire-drop/safe-texture.webp",hazard:"../../assets/animal-skyspire-drop/hazard-texture.webp",fragile:"../../assets/animal-skyspire-drop/fragile-texture.webp",goal:"../../assets/animal-skyspire-drop/goal-texture.webp"};
  const ctx=els.arena.getContext("2d");
  const TAU=Math.PI*2,PLAYER_ANGLE=-Math.PI/2;

  function detectLocale(){const segment=location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();if(routeLocales[segment])return routeLocales[segment];try{const stored=localStorage.getItem("weightplayLocale");if(localeOrder.includes(stored))return stored}catch{}return "en"}
  function storageRead(key){try{return localStorage.getItem(key)}catch{return sessionStore.get(key)||null}}
  function storageWrite(key,value){try{localStorage.setItem(key,value)}catch{sessionStore.set(key,value)}}
  function normalizeSave(raw={}){const upgrades=raw.upgrades||{};return{unlocked:boundInt(raw.unlocked,1,30,1),stars:raw.stars&&typeof raw.stars==="object"?raw.stars:{},best:raw.best&&typeof raw.best==="object"?raw.best:{},shards:boundInt(raw.shards,0,99999,0),upgrades:{grip:boundInt(upgrades.grip,0,3,0),aegis:boundInt(upgrades.aegis,0,3,0),spark:boundInt(upgrades.spark,0,2,0)},tutorial:Boolean(raw.tutorial),aura:Boolean(raw.aura)}}
  function loadSave(){try{return normalizeSave(JSON.parse(storageRead(storageKey)||"{}"))}catch{return normalizeSave()}}
  function persist(){storageWrite(storageKey,JSON.stringify(save))}
  function boundInt(value,min,max,fallback){const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.trunc(n))):fallback}
  function t(key,vars={}){let value=LOCALES[lang]?.[key]??LOCALES.en[key]??key;const translate=window.WeightPlayGameRuntimeLocalizer?.translate;if(lang!=="en"&&!LOCALES[lang]&&translate)value=Array.isArray(value)?value.map(item=>translate(String(item))):translate(String(value));if(Array.isArray(value))return value;return String(value).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??`{${name}}`)}
  function commonText(source){const translate=window.WeightPlayGameRuntimeLocalizer?.translate;return lang==="en"||!translate?source:translate(source)}
  function ensureCompletePublicGuide(){
    const guide=document.querySelector(".game-page-info");
    if(!guide)return;
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
        <article class="game-info-section"><h3 data-t="strategyTitle"></h3><p data-t="strategyText"></p></article>
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
    const route=localeRoutes[lang]||"en";
    const allGames=guide.querySelector("[data-wp-guide-all-games]");
    const relatedGame=guide.querySelector("[data-wp-guide-related-game]");
    guide.querySelector("[data-wp-guide-faq-title]").textContent=commonText("Frequently Asked Questions");
    guide.querySelector("[data-wp-guide-related-title]").textContent=commonText("Related Games");
    allGames.href=`/${route}/`;
    allGames.textContent=commonText("All Games");
    relatedGame.href=`/${route}/games/animal-block-grove/`;
    relatedGame.textContent=commonText("Animal Block Grove");
    guide.querySelector(".guide-related-links").setAttribute("aria-label",commonText("Related Games"));
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
    if(guide)guide.setAttribute("aria-label",lang==="ar"?`دليل لعبة ${t("title")}`:t("guideLabel"));
    document.querySelectorAll("[data-t]").forEach(node=>{node.textContent=t(node.dataset.t)});
    document.querySelectorAll("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.tAria)));
    document.querySelectorAll("[data-t-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.tAlt)));
    refreshPublicGuide();renderMainProgress();renderStages();renderForge();if(run)renderHud()
  }
  function initLocale(){els.localeSelect.innerHTML=localeOrder.map(code=>`<option value="${code}">${localeLabels[code]}</option>`).join("");els.localeSelect.value=lang;els.localeSelect.addEventListener("change",()=>{const next=els.localeSelect.value;try{localStorage.setItem("weightplayLocale",next)}catch{}if(/^https?:$/.test(location.protocol)){location.assign(`/${localeRoutes[next]}/games/animal-skyspire-drop/${location.search}${location.hash}`);return}lang=next;window.WonderI18n?.setLocale?.(lang);applyLocale()})}
  function track(event,details={}){window.WonderAnalytics?.track?.(event,{game_id:"animal-skyspire-drop",stage:stageIndex+1,locale:lang,...details})}

  function seeded(seed){let x=(seed|0)||1;return()=>{x=(x*1664525+1013904223)|0;return((x>>>0)/4294967296)}}
  function normAngle(angle){angle%=TAU;return angle<0?angle+TAU:angle}
  function angleDistance(a,b){return Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)))}
  function buildStage(index){const chapter=Math.floor(index/5),within=index%5,ringCount=8+chapter*2+within,wind=within===1?-.075-chapter*.008:within===2?.085+chapter*.008:within===4?(chapter%2?-.12:.12):0,pulse=within>=2,twin=within>=3;const rand=seeded(9127+index*733);const rings=[];for(let i=0;i<ringCount;i++){const gapWidth=Math.max(.54,1.18-chapter*.075-within*.025);const gap=rand()*TAU;let hazard=normAngle(gap+Math.PI*(.72+rand()*.56));const hazardWidth=Math.min(1.5,.58+chapter*.1+within*.035),hazard2=twin&&i%3===within%3?normAngle(hazard+Math.PI*(.7+rand()*.35)):null;const tempo=within===3?(i%2?.76:1.28):within===4?(i%3===0?1.38:.9):1;rings.push({gap,gapWidth,hazard,hazardWidth,hazard2,hazard2Width:hazard2===null?0:Math.max(.34,hazardWidth*.58),pulse:pulse&&i%2===within%2,tempo,offset:(rand()-.5)*.25,drift:chapter>=2&&i%3!==0?(rand()>.5?1:-1)*(.09+chapter*.018+within*.008):0,fragile:chapter>=1&&i%3===1,reverse:chapter>=3&&i%4===2,crystal:chapter>=4&&i%5===2,cracked:false,broken:false})}return{index,chapter,within,ringCount,rings,wind,pulse,twin,tempo:within>=3,target:Math.round(ringCount*(1.45-chapter*.035)+5),name:t("chapters")[chapter],rule:t("rules")[chapter]}}
  const stages=Array.from({length:30},(_,i)=>buildStage(i));
  function refreshStageLocale(){for(let i=0;i<stages.length;i++){stages[i].name=t("chapters")[stages[i].chapter];stages[i].rule=t("rules")[stages[i].chapter]}}

  function setScreen(next){screen=next;const generation=++sceneGeneration;document.body.dataset.screen=next;els.mainGroup.hidden=next!=="main";els.stageScreen.hidden=next!=="stage";els.battleScreen.hidden=next!=="battle";if(next!=="stage"){clearTimeout(stageScrollTimer);stageScrollTimer=0}if(next!=="battle")cancelAnimationFrame(raf);if(next==="stage"){renderStages();renderForge();requestAnimationFrame(()=>centerCurrentStage(generation))}if(next==="battle")startLoop();}
  function renderMainProgress(){const done=Object.keys(save.stars).filter(key=>Number(save.stars[key])>0).length;els.mainProgress.textContent=`${done} / 30`}
  function stageWindowLimit(){return Math.max(0,stages.length-STAGE_CARD_POOL_SIZE)}
  function desiredStageWindow(index){return Math.max(0,Math.min(stageWindowLimit(),Math.round(index)-Math.floor(STAGE_CARD_POOL_SIZE/2)))}
  function bindStageCard(card,index){const stage=stages[index],locked=index+1>save.unlocked,stars=Number(save.stars[index]||0),current=index===Math.round(stageBrowseLogical);card.className=`stage-card${locked?" locked":""}${current?" centered":""}`;card.dataset.stage=String(index);card.tabIndex=current?0:-1;card.setAttribute("aria-disabled",String(locked));card.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End");card.setAttribute("aria-posinset",String(index+1));card.setAttribute("aria-setsize",String(stages.length));if(current)card.setAttribute("aria-current","true");else card.removeAttribute("aria-current");card.innerHTML=`<small>${t("chapter",{n:stage.chapter+1})} · ${stage.name}</small><strong>${t("stage",{n:index+1})}</strong><span>${t("ringCount",{n:stage.ringCount})} · ${stars?"★".repeat(stars):locked?t("locked"):t("cleared")}</span><small>${stage.rule}</small>`}
  function createStageCard(){const card=document.createElement("button");card.type="button";card.addEventListener("focus",()=>selectStageOwner(card));card.addEventListener("click",()=>{const index=Number(card.dataset.stage);if(index+1<=save.unlocked)startBattle(index)});return card}
  function syncStageCards(){stageCardPool.forEach(card=>bindStageCard(card,Number(card.dataset.stage)))}
  function moveStageWindow(targetStart){const target=Math.max(0,Math.min(stageWindowLimit(),targetStart));let recycled=0;while(stageWindowStart<target){const card=els.stageRail.firstElementChild;stageWindowStart++;els.stageRail.append(card);bindStageCard(card,stageWindowStart+stageCardPool.length-1);recycled++}while(stageWindowStart>target){const card=els.stageRail.lastElementChild;stageWindowStart--;els.stageRail.prepend(card);bindStageCard(card,stageWindowStart);recycled++}stageCardPool=[...els.stageRail.children];els.stageRail.dataset.wpStageWindowStart=String(stageWindowStart);els.stageRail.dataset.wpStageWindowEnd=String(stageWindowStart+stageCardPool.length-1);if(recycled)els.stageRail.dataset.wpStageRecycleCount=String(Number(els.stageRail.dataset.wpStageRecycleCount||0)+recycled)}
  function ensureStageWindow(index){moveStageWindow(desiredStageWindow(index));syncStageCards()}
  function stageRailGeometry(){const cards=[...els.stageRail.children],first=cards[0]?.getBoundingClientRect(),second=cards[1]?.getBoundingClientRect(),pitch=first&&second?Math.abs((second.left+second.width/2)-(first.left+first.width/2)):280;return{pitch:pitch||280}}
  function positionStageRail(logical){const value=Math.max(0,Math.min(stages.length-1,logical)),anchor=Math.round(value);moveStageWindow(desiredStageWindow(anchor));const card=els.stageRail.querySelector(`[data-stage="${anchor}"]`);if(!card)return value;card.scrollIntoView({behavior:"auto",block:"nearest",inline:"center"});els.stageRail.scrollLeft+=(value-anchor)*stageRailGeometry().pitch;els.stageRail.dataset.wpStageDragLogical=value.toFixed(4);return value}
  function renderStages(){if(!els.stageRail)return;refreshStageLocale();stageBrowseLogical=Math.max(0,Math.min(stages.length-1,stageIndex));stageWindowStart=desiredStageWindow(stageBrowseLogical);els.stageRail.innerHTML="";stageCardPool=Array.from({length:Math.min(STAGE_CARD_POOL_SIZE,stages.length)},(_,offset)=>{const card=createStageCard();bindStageCard(card,stageWindowStart+offset);els.stageRail.append(card);return card});els.stageRail.dataset.wpStageVirtualized="bounded-recycle";els.stageRail.dataset.wpStagePoolSize=String(stageCardPool.length);els.stageRail.dataset.wpStageTotal=String(stages.length);els.stageRail.dataset.wpStageRecycleCount="0";moveStageWindow(stageWindowStart);els.stageSummary.textContent=`${Math.min(save.unlocked,30)} / 30 · ★ ${Object.values(save.stars).reduce((sum,n)=>sum+Number(n||0),0)}`;selectStageOwner(els.stageRail.querySelector(`[data-stage="${stageIndex}"]`)||els.stageRail.firstElementChild)}
  function centerCurrentStage(generation=sceneGeneration){if(screen!=="stage"||generation!==sceneGeneration)return;ensureStageWindow(stageIndex);const card=els.stageRail.querySelector(`[data-stage="${stageIndex}"]`);card?.scrollIntoView({inline:"center",block:"nearest",behavior:"instant"});requestAnimationFrame(()=>markCentered(generation))}
  function selectStageOwner(best){if(!best)return;stageIndex=Number(best.dataset.stage);stageBrowseLogical=stageIndex;stageCardPool.forEach(card=>{const current=card===best;card.classList.toggle("centered",current);card.tabIndex=current?0:-1;if(current)card.setAttribute("aria-current","true");else card.removeAttribute("aria-current")})}
  function focusStageIndex(index){index=Math.max(0,Math.min(stages.length-1,index));const generation=sceneGeneration;clearTimeout(stageScrollTimer);stageBrowseLogical=index;ensureStageWindow(index);const card=els.stageRail.querySelector(`[data-stage="${index}"]`);if(!card)return;card.scrollIntoView({inline:"center",block:"nearest",behavior:"instant"});selectStageOwner(card);card.focus({preventScroll:true});requestAnimationFrame(()=>{if(screen==="stage"&&generation===sceneGeneration&&card.isConnected)selectStageOwner(card)})}
  function markCentered(generation=sceneGeneration){if(screen!=="stage"||generation!==sceneGeneration||els.stageRail.dataset.wpDragDown==="1"||els.stageRail.dataset.wpStageSettling==="true")return;const cards=[...els.stageRail.querySelectorAll(".stage-card")];if(!cards.length)return;const railRect=els.stageRail.getBoundingClientRect(),cx=(railRect.left+railRect.right)/2;let best=cards[0],distance=Infinity;for(const card of cards){const rect=card.getBoundingClientRect(),d=Math.abs((rect.left+rect.right)/2-cx);if(d<distance){best=card;distance=d}}selectStageOwner(best)}
  let stageScrollTimer=0;els.stageRail.addEventListener("scroll",()=>{clearTimeout(stageScrollTimer);const generation=sceneGeneration;stageScrollTimer=setTimeout(()=>markCentered(generation),80)},{passive:true});
  els.stageRail.addEventListener("keydown",event=>{const card=event.target.closest?.(".stage-card");if(!card)return;const current=Number(card.dataset.stage),rtl=document.documentElement.dir==="rtl";let next=null;if(event.key==="Home")next=0;else if(event.key==="End")next=stages.length-1;else if(event.key==="ArrowRight")next=current+(rtl?-1:1);else if(event.key==="ArrowLeft")next=current+(rtl?1:-1);if(next===null)return;event.preventDefault();focusStageIndex(next)});
  function installVirtualStageDrag(){const rail=els.stageRail;if(rail.dataset.wpStageVirtualDrag==="true")return;rail.dataset.wpStageVirtualDrag="true";rail.dataset.wpStageCenterObserver="manual";let pointerId=null,startX=0,lastX=0,logical=stageIndex,moved=false;const restore=()=>{rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type");rail.classList.remove("wp-stage-dragging");delete rail.dataset.wpStageSettling};rail.addEventListener("pointerdown",event=>{if(event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;cancelAnimationFrame(stageSettleFrame);stageSettleFrame=0;pointerId=event.pointerId;startX=lastX=event.clientX;logical=stageBrowseLogical;moved=false;rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");rail.dataset.wpDragDown="1";event.stopImmediatePropagation()},true);document.addEventListener("pointermove",event=>{if(event.pointerId!==pointerId)return;const delta=event.clientX-lastX;lastX=event.clientX;if(!moved&&Math.abs(event.clientX-startX)>4){moved=true;rail.classList.add("wp-stage-dragging")}if(moved){if(event.cancelable)event.preventDefault();logical=positionStageRail(logical-delta/stageRailGeometry().pitch);stageBrowseLogical=logical;syncStageCards()}event.stopImmediatePropagation()},true);const finish=event=>{if(pointerId===null||(event.pointerId!==undefined&&event.pointerId!==pointerId))return;pointerId=null;rail.dataset.wpDragDown="0";if(!moved){restore();return}if(event.cancelable)event.preventDefault();const from=logical,target=Math.max(0,Math.min(stages.length-1,Math.round(from))),started=performance.now();rail.dataset.wpStageSettling="true";const settle=now=>{const progress=Math.min(1,(now-started)/330),eased=progress*progress*(3-2*progress);stageBrowseLogical=positionStageRail(from+(target-from)*eased);if(progress<1)stageSettleFrame=requestAnimationFrame(settle);else{stageSettleFrame=0;focusStageIndex(target);restore()}};stageSettleFrame=requestAnimationFrame(settle);moved=false;event.stopImmediatePropagation()};document.addEventListener("pointerup",finish,true);document.addEventListener("pointercancel",finish,true);rail.addEventListener("click",event=>{if(rail.dataset.wpStageSettling!=="true")return;event.preventDefault();event.stopImmediatePropagation()},true)}
  installVirtualStageDrag();
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
    for(const item of stageTabs){
      const active=item===selected;
      item.panel.hidden=!active;
      item.button.classList.toggle("active",active);
      item.button.setAttribute("aria-selected",String(active));
      item.button.tabIndex=active?0:-1;
    }
    if(activeTab==="towers"){const generation=sceneGeneration;requestAnimationFrame(()=>centerCurrentStage(generation))}
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
  function focusScreenOwner(owner){const token=++screenFocusSettlement,attempt=()=>{if(token!==screenFocusSettlement)return;const active=document.activeElement,stageOwner=owner==="stage"&&active?.matches?.(".stage-card"),style=active&&active!==document.body&&active!==document.documentElement?getComputedStyle(active):null,owned=active&&active!==document.body&&active!==document.documentElement&&active.isConnected&&!active.closest("[hidden]")&&active.getClientRects().length&&style?.visibility!=="hidden";if(owned&&!stageOwner)return;let target=null;if(owner==="main"&&screen==="main")target=els.start;if(owner==="stage"&&screen==="stage")target=els.stageRail.querySelector(".stage-card.centered[aria-current='true']");if(target&&target.getClientRects().length&&active!==target)target.focus({preventScroll:true})};requestAnimationFrame(attempt);for(const delay of [80,240,480,800])setTimeout(attempt,delay)}
  function focusArena(){const attempt=()=>{if(screen!=="battle"||!run||run.paused||run.ended||els.battleLive.inert)return;const active=document.activeElement,style=active&&active!==document.body&&active!==document.documentElement?getComputedStyle(active):null,unowned=!active||active===document.body||active===document.documentElement||active===els.arena||!active.isConnected||!active.getClientRects().length||style?.visibility==="hidden";if(unowned)els.arena.focus({preventScroll:true})};requestAnimationFrame(attempt);for(const delay of [80,240,480,800,1200,1600])setTimeout(attempt,delay)}
  function openBattleModal(modal,focusTarget,opener=null){const generation=sceneGeneration;modalOpener=opener?.isConnected?opener:null;modal.hidden=false;setBattleIsolation(true);requestAnimationFrame(()=>{if(screen==="battle"&&generation===sceneGeneration&&!modal.hidden)focusTarget?.focus({preventScroll:true})})}
  function closeBattleModal(modal,{resume=false,restore=true}={}){modal.hidden=true;setBattleIsolation(false);const opener=modalOpener;modalOpener=null;if(resume&&run&&!run.ended){run.paused=false;lastFrame=performance.now()}if(restore){if(opener?.isConnected)opener.focus({preventScroll:true});else focusArena()}}
  function trapBattleModal(event,onEscape){const modal=event.currentTarget;if(event.key==="Escape"&&onEscape){event.preventDefault();onEscape();return}if(event.key!=="Tab")return;const actions=[...modal.querySelectorAll("button:not([hidden]):not(:disabled)")];if(!actions.length)return;const first=actions[0],last=actions.at(-1);if(actions.length===1||(event.shiftKey&&document.activeElement===first)||(!event.shiftKey&&document.activeElement===last)){event.preventDefault();(event.shiftKey?last:first).focus()}}
  function closeHelp(){save.tutorial=true;persist();closeBattleModal(els.helpModal,{resume:true})}
  function continueLeave(){closeBattleModal(els.leaveModal,{resume:true})}
  function startBattle(index,{skipTutorial=false}={}){stageIndex=Math.max(0,Math.min(29,index));const stage=buildStage(stageIndex);run={stage,current:0,rotation:0,rotationTarget:0,bounce:0.18,transition:0,departing:null,elapsed:0,accum:0,lastHudAt:0,combo:0,bestCombo:0,power:false,shield:save.upgrades.aegis>=2?2:save.upgrades.aegis>=1?1:0,paused:false,ended:false,result:null,lastFeedback:"",dragging:false,dragPointerId:null,lastX:0,keys:new Set(),landings:0,shieldsUsed:0};els.resultModal.hidden=true;els.leaveModal.hidden=true;els.helpModal.hidden=true;setBattleIsolation(false);els.feedback.textContent="";setScreen("battle");syncArenaSize();renderHud();track("game_start");if(!save.tutorial&&!skipTutorial){run.paused=true;openBattleModal(els.helpModal,els.helpClose)}else{save.tutorial=true;persist();focusArena()}}
  function startLoop(){cancelAnimationFrame(raf);raf=0;if(lifecycleSuspended||document.hidden||!windowFocused)return;lastFrame=performance.now();raf=requestAnimationFrame(frame)}
  function frame(now){if(screen!=="battle"||!run||lifecycleSuspended||document.hidden||!windowFocused){raf=0;return}const elapsed=Math.min(.08,(now-lastFrame)/1000||0);lastFrame=now;if(!run.paused&&!run.ended){run.accum=Math.min(.1,run.accum+elapsed);while(run.accum>=1/120&&!run.ended){update(1/120);run.accum-=1/120}}if(now-run.lastHudAt>=100){run.lastHudAt=now;renderHud()}draw();raf=requestAnimationFrame(frame)}
  function suspendLifecycle(){lifecycleSuspended=true;cancelAnimationFrame(raf);raf=0;if(run){run.dragging=false;run.dragPointerId=null;run.keys.clear()}}
  function resumeLifecycle(){if(document.hidden||!windowFocused)return;lifecycleSuspended=false;if(screen==="battle"&&run)startLoop()}
  function signedAngle(from,to){let delta=normAngle(to)-normAngle(from);if(delta>Math.PI)delta-=TAU;if(delta<-Math.PI)delta+=TAU;return delta}
  function update(dt){run.elapsed+=dt;const grip=1+save.upgrades.grip*.18,direction=currentReverse()?-1:1;if(run.keys.has("left"))run.rotationTarget-=dt*2.35*grip*direction;if(run.keys.has("right"))run.rotationTarget+=dt*2.35*grip*direction;run.rotationTarget=normAngle(run.rotationTarget+dt*run.stage.wind);const follow=1-Math.exp(-dt*15);run.rotation=normAngle(run.rotation+signedAngle(run.rotation,run.rotationTarget)*follow);if(run.departing){run.departing.alpha=Math.max(0,run.departing.alpha-dt*5.2);if(run.departing.alpha===0)run.departing=null}if(run.transition>0)run.transition=Math.max(0,run.transition-dt*1.35);else{run.bounce+=dt*(1.12+run.stage.chapter*.035+run.stage.within*.012)*(currentRing()?.tempo||1);if(run.bounce>=1)land()}}
  function currentRing(){return run?.stage.rings[run.current]}
  function currentReverse(){return Boolean(currentRing()?.reverse)}
  function ringAngle(ring){return normAngle(ring.offset+ring.drift*run.elapsed)}
  function hazardWidthAt(ring,secondary=false){const base=secondary?ring.hazard2Width:ring.hazardWidth;if(!ring.pulse)return base;return base*(.72+.34*(.5+.5*Math.sin(run.elapsed*3.4+ring.offset*11)))}
  function sectorAtPlayer(ring){if(!ring||ring.broken)return"gap";const local=normAngle(PLAYER_ANGLE-run.rotation-ringAngle(ring));if(angleDistance(local,ring.gap)<ring.gapWidth/2)return"gap";if(angleDistance(local,ring.hazard)<hazardWidthAt(ring)/2||ring.hazard2!==null&&angleDistance(local,ring.hazard2)<hazardWidthAt(ring,true)/2)return"hazard";return ring.fragile?"fragile":"safe"}
  function threshold(){return Math.max(2,3-save.upgrades.spark)}
  function passRing(kind){const cleared=run.current;run.current++;run.combo++;run.bestCombo=Math.max(run.bestCombo,run.combo);if(run.combo>=threshold())run.power=true;run.departing={index:cleared,alpha:1};run.transition=1;run.bounce=0;run.lastFeedback=t(kind==="gap"?"gapPass":"cometSmash",{n:run.combo});els.feedback.textContent=run.lastFeedback;if(run.current>=run.stage.ringCount)finish(true)}
  function land(){run.landings++;run.bounce=0;const ring=currentRing(),sector=sectorAtPlayer(ring);if(sector==="gap"){passRing("gap");return}if(sector==="hazard"){if(run.power){run.power=false;run.combo=0;ring.broken=true;passRing("smash");return}if(run.shield>0){run.shield--;run.shieldsUsed++;run.combo=0;run.lastFeedback=t("shieldSave");els.feedback.textContent=run.lastFeedback;return}run.lastFeedback=t("hazardHit");els.feedback.textContent=run.lastFeedback;finish(false);return}if(sector==="fragile"){if(ring.cracked){ring.broken=true;run.lastFeedback=t("fragileBreak");els.feedback.textContent=run.lastFeedback;passRing("smash")}else{ring.cracked=true;run.combo=0;run.lastFeedback=t("fragileCrack");els.feedback.textContent=run.lastFeedback}return}run.combo=0;if(ring.crystal&&run.shield<2){run.shield++;ring.crystal=false;run.lastFeedback=t("crystal")}else run.lastFeedback=currentReverse()?t("reversed"):t("safeBounce");els.feedback.textContent=run.lastFeedback}
  function finish(win){if(run.ended)return;run.ended=true;run.paused=true;const time=Number(run.elapsed.toFixed(1));let stars=0,newBest=false;if(win){stars=time<=run.stage.target?3:time<=run.stage.target*1.35?2:1;const old=Number(save.best[stageIndex]||Infinity);newBest=time<old;save.best[stageIndex]=Math.min(old,time);save.stars[stageIndex]=Math.max(Number(save.stars[stageIndex]||0),stars);save.unlocked=Math.max(save.unlocked,Math.min(30,stageIndex+2));const reward=4+stars*2+run.stage.chapter;save.shards+=reward;persist();renderMainProgress();track("game_complete",{time,stars,best_combo:run.bestCombo})}else track("game_fail",{depth:run.current,time});run.result={win,time,stars,newBest};showResult()}
  function syncResultActions(won){resultActionClaimed=false;const generation=sceneGeneration,resultOwner=run,canAdvance=won&&stageIndex<29,primary=canAdvance?els.next:els.resultMap;for(const action of [els.resultMap,els.next,els.retry]){action.hidden=false;action.disabled=action===els.next&&!canAdvance;action.classList.toggle("primary",action===primary)}requestAnimationFrame(()=>{if(screen==="battle"&&generation===sceneGeneration&&run===resultOwner&&!els.resultModal.hidden)primary.focus({preventScroll:true})})}
  function claimResultAction(){if(els.resultModal.hidden||resultActionClaimed)return false;resultActionClaimed=true;for(const action of [els.retry,els.resultMap,els.next])action.disabled=true;return true}
  function showResult(){const r=run.result;els.resultKicker.textContent=t(r.win?"winKicker":"failKicker");els.resultTitle.textContent=t(r.win?"winTitle":"failTitle");els.resultText.textContent=r.win?t("winText",{n:stageIndex+1,time:r.time}):t("failText");els.resultTime.textContent=`${r.time}s`;els.resultCombo.textContent=String(run.bestCombo);els.resultStars.textContent=r.win?"★".repeat(r.stars):"—";openBattleModal(els.resultModal);syncResultActions(r.win)}
  function renderHud(){if(!run)return;els.towerLabel.textContent=`${t("stage",{n:stageIndex+1})} · ${run.stage.name}`;els.depthValue.textContent=`${Math.min(run.current+1,run.stage.ringCount)} / ${run.stage.ringCount}`;els.comboValue.textContent=String(run.combo);els.timeValue.textContent=run.elapsed.toFixed(1);els.shieldValue.textContent=String(run.shield);els.powerValue.textContent=run.power?t("maxed"):`${Math.min(run.combo,threshold())} / ${threshold()}`;els.powerBadge.classList.toggle("ready",run.power)}

  function syncArenaSize(){const rect=els.arena.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1),w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));if(els.arena.width!==w||els.arena.height!==h){els.arena.width=w;els.arena.height=h;els.arena.dataset.dpr=String(dpr)}}
  function coverImage(img,x,y,w,h){if(!img?.complete)return;const ratio=Math.max(w/img.naturalWidth,h/img.naturalHeight),sw=w/ratio,sh=h/ratio,sx=(img.naturalWidth-sw)/2,sy=(img.naturalHeight-sh)/2;ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h)}
  function draw(){
    if(!run)return;const dpr=Number(els.arena.dataset.dpr||1),W=els.arena.width/dpr,H=els.arena.height/dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);coverImage(images.background,0,0,W,H);ctx.fillStyle="#03132955";ctx.fillRect(0,0,W,H);
    const cx=W/2,currentY=H*.61,radius=Math.min(W*.42,H*.40,270),spacing=Math.max(82,Math.min(132,H*.17)),first=run.current,last=Math.min(run.stage.ringCount,run.current+5),dropProgress=1-run.transition,dropShare=.28,cameraProgress=Math.max(0,Math.min(1,(dropProgress-dropShare)/(1-dropShare))),cameraEase=cameraProgress*cameraProgress*(3-2*cameraProgress),cameraOffset=(1-cameraEase)*spacing;
    for(let i=last-1;i>=first;i--){const depth=i-run.current,y=currentY+depth*spacing+cameraOffset,scale=Math.max(.68,1-depth*.045);if(i<last-1){const nextY=y+spacing,shaftW=radius*.16*scale;ctx.save();ctx.fillStyle="rgba(112,211,235,.13)";ctx.strokeStyle="rgba(174,239,255,.22)";ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(cx-shaftW/2,y+18,shaftW,nextY-y-42,shaftW*.32);ctx.fill();ctx.stroke();ctx.restore()}drawRing(run.stage.rings[i],cx,y,radius*scale,i===run.current,depth)}
    if(run.departing){const departedY=currentY-cameraEase*spacing;drawRing(run.stage.rings[run.departing.index],cx,departedY,radius,true,-1,run.departing.alpha)}if(run.current>=run.stage.ringCount)drawGoal(cx,currentY,radius);const bounceHeight=run.transition>0?0:Math.sin(Math.min(1,run.bounce)*Math.PI)*Math.min(88,H*.15),dropDistance=Math.min(54,H*.082),fallDrop=run.transition>0?(dropProgress<dropShare?(1-(1-dropProgress/dropShare)**3)*dropDistance:(1-cameraEase)*dropDistance):0;const heroSize=Math.min(112,Math.max(68,W*.19)),heroY=currentY-radius*.16-heroSize*.72-bounceHeight+fallDrop;
    if(save.aura){ctx.save();ctx.globalAlpha=.7;ctx.fillStyle="#c786ff";for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(cx+(i%2?1:-1)*i*3,heroY+heroSize*.55+i*8,Math.max(2,7-i),0,TAU);ctx.fill()}ctx.restore()}if(run.power){ctx.save();ctx.shadowBlur=32;ctx.shadowColor="#ffe56d";ctx.fillStyle="#fff2a855";ctx.beginPath();ctx.arc(cx,heroY+heroSize/2,heroSize*.58,0,TAU);ctx.fill();ctx.restore()}ctx.drawImage(images.hero,cx-heroSize/2,heroY,heroSize,heroSize);if(run.ended&&!run.result?.win){ctx.fillStyle="#d56eff33";ctx.fillRect(0,0,W,H)}
  }
  function drawRing(ring,cx,y,radius,isCurrent,depth=0,opacity=1){
    const yScale=.29,inner=radius*.45,displayRotation=run.rotation,alpha=(isCurrent?1:Math.max(.46,.84-Math.abs(depth)*.09))*opacity;
    const gapCenter=normAngle(ring.gap+displayRotation+ringAngle(ring)),gapStart=gapCenter-ring.gapWidth/2,gapEnd=gapCenter+ring.gapWidth/2;
    const hazardCenter=normAngle(ring.hazard+displayRotation+ringAngle(ring)),hazardWidth=hazardWidthAt(ring),hazardStart=hazardCenter-hazardWidth/2,hazardEnd=hazardCenter+hazardWidth/2;
    ctx.save();ctx.translate(cx,y+15);ctx.scale(1,yScale);ctx.globalAlpha=alpha*.78;ctx.shadowColor="#000";ctx.shadowBlur=20;drawDonutSegment(gapEnd,gapStart+TAU,inner,radius,"#010713");ctx.restore();
    ctx.save();ctx.translate(cx,y);ctx.scale(1,yScale);ctx.globalAlpha=alpha;const surface=ctx.createLinearGradient(0,-radius,0,radius);if(ring.fragile){surface.addColorStop(0,"#bdfcff");surface.addColorStop(.44,"#2295b0");surface.addColorStop(1,"#092c55")}else{surface.addColorStop(0,"#fff0a0");surface.addColorStop(.40,"#188da7");surface.addColorStop(1,"#07304f")}ctx.shadowColor=isCurrent?"#59efff":"#071627";ctx.shadowBlur=isCurrent?22:8;drawDonutSegment(gapEnd,gapStart+TAU,inner,radius,surface);
    const innerGlow=ctx.createLinearGradient(0,-radius,0,radius);innerGlow.addColorStop(0,"rgba(255,255,255,.32)");innerGlow.addColorStop(.5,"rgba(83,237,255,.08)");innerGlow.addColorStop(1,"rgba(0,10,30,.30)");drawDonutSegment(gapEnd,gapStart+TAU,inner+radius*.055,radius-radius*.055,innerGlow);
    const hazardGradient=ctx.createLinearGradient(0,-radius,0,radius);hazardGradient.addColorStop(0,"#ff8bf3");hazardGradient.addColorStop(.45,"#7d32d5");hazardGradient.addColorStop(1,"#32136c");ctx.shadowColor="#d54bff";ctx.shadowBlur=isCurrent?25:12;drawDonutSegment(hazardStart,hazardEnd,inner+2,radius-2,hazardGradient,"#ff9ff4",isCurrent?5:3);if(ring.hazard2!==null){const center=normAngle(ring.hazard2+displayRotation+ringAngle(ring)),width=hazardWidthAt(ring,true);drawDonutSegment(center-width/2,center+width/2,inner+2,radius-2,hazardGradient,"#ff9ff4",isCurrent?5:3)}
    ctx.shadowBlur=0;ctx.lineWidth=isCurrent?6:3;ctx.strokeStyle=isCurrent?"rgba(255,241,140,.98)":"rgba(157,235,249,.48)";strokeDonutEdges(gapEnd,gapStart+TAU,inner,radius);
    ctx.strokeStyle="rgba(167,247,255,.32)";ctx.lineWidth=2;for(const offset of [.16,.31]){ctx.beginPath();ctx.arc(0,0,inner+(radius-inner)*offset,gapEnd,gapStart+TAU);ctx.stroke()}
    for(const edge of [gapStart,gapEnd]){ctx.strokeStyle="#fff4a0";ctx.lineWidth=isCurrent?7:4;ctx.beginPath();ctx.moveTo(Math.cos(edge)*inner,Math.sin(edge)*inner);ctx.lineTo(Math.cos(edge)*radius,Math.sin(edge)*radius);ctx.stroke()}
    ctx.restore();
    if(ring.crystal){ctx.save();ctx.globalAlpha=opacity;ctx.translate(cx,y-radius*.06);ctx.fillStyle="#fff4a8";ctx.shadowBlur=18;ctx.shadowColor="#61edff";ctx.beginPath();ctx.moveTo(0,-16);ctx.lineTo(11,0);ctx.lineTo(0,16);ctx.lineTo(-11,0);ctx.closePath();ctx.fill();ctx.restore()}
  }
  function visualSector(ring,screenAngle,displayRotation=run.rotation){if(ring.broken)return"gap";const local=normAngle(screenAngle-displayRotation-ringAngle(ring));if(angleDistance(local,ring.gap)<ring.gapWidth/2)return"gap";if(angleDistance(local,ring.hazard)<hazardWidthAt(ring)/2||ring.hazard2!==null&&angleDistance(local,ring.hazard2)<hazardWidthAt(ring,true)/2)return"hazard";return ring.fragile?"fragile":"safe"}
  function drawDonutSegment(a0,a1,inner,outer,fill,stroke="",lineWidth=0){ctx.beginPath();ctx.arc(0,0,outer,a0,a1);ctx.arc(0,0,inner,a1,a0,true);ctx.closePath();ctx.fillStyle=fill||"#38b9c2";ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth||2;ctx.stroke()}}
  function strokeDonutEdges(a0,a1,inner,outer){ctx.beginPath();ctx.arc(0,0,outer,a0,a1);ctx.arc(0,0,inner,a1,a0,true);ctx.closePath();ctx.stroke()}
  function drawGoal(cx,y,radius){ctx.save();ctx.translate(cx,y);ctx.scale(1,.31);ctx.beginPath();ctx.arc(0,0,radius,0,TAU);ctx.arc(0,0,radius*.32,TAU,0,true);ctx.closePath();ctx.fillStyle=ctx.createPattern(images.goal,"repeat");ctx.fill();ctx.strokeStyle="#fff4a2";ctx.lineWidth=6;ctx.stroke();ctx.restore()}

  function rotateBy(delta){if(!run||run.paused||run.ended)return;const grip=1+save.upgrades.grip*.18;run.rotationTarget=normAngle(run.rotationTarget+delta*grip*(currentReverse()?-1:1))}
  els.arena.addEventListener("pointerdown",event=>{if(!run||run.paused||run.ended||!event.isPrimary||event.button!==0||run.dragPointerId!==null)return;els.arena.focus({preventScroll:true});run.dragging=true;run.dragPointerId=event.pointerId;run.lastX=event.clientX;els.arena.setPointerCapture(event.pointerId);event.preventDefault()});
  els.arena.addEventListener("pointermove",event=>{if(!run?.dragging||run.dragPointerId!==event.pointerId)return;const dx=event.clientX-run.lastX;run.lastX=event.clientX;rotateBy(dx*.012);event.preventDefault()});
  const stopDrag=event=>{if(!run||run.dragPointerId!==event.pointerId)return;run.dragging=false;run.dragPointerId=null};els.arena.addEventListener("pointerup",stopDrag);els.arena.addEventListener("pointercancel",stopDrag);els.arena.addEventListener("lostpointercapture",stopDrag);
  window.addEventListener("keydown",event=>{if(screen!=="battle"||!run||run.paused||document.activeElement!==els.arena)return;if(["ArrowLeft","a","A"].includes(event.key)){run.keys.add("left");event.preventDefault()}if(["ArrowRight","d","D"].includes(event.key)){run.keys.add("right");event.preventDefault()}});
  window.addEventListener("keyup",event=>{if(!run)return;if(["ArrowLeft","a","A"].includes(event.key))run.keys.delete("left");if(["ArrowRight","d","D"].includes(event.key))run.keys.delete("right")});
  window.addEventListener("blur",()=>{windowFocused=false;suspendLifecycle()});window.addEventListener("focus",()=>{windowFocused=true;resumeLifecycle()});window.addEventListener("pagehide",suspendLifecycle);window.addEventListener("pageshow",resumeLifecycle);document.addEventListener("visibilitychange",()=>{if(document.hidden)suspendLifecycle();else resumeLifecycle()});

  els.start.addEventListener("click",()=>{setScreen("stage");track("game_start_menu")});els.stageBack.addEventListener("click",()=>setScreen("main"));els.racesTab.addEventListener("click",()=>setTab("towers"));els.forgeTab.addEventListener("click",()=>setTab("forge"));els.battleBack.addEventListener("click",()=>{if(!run||run.ended){setScreen("stage");return}run.paused=true;openBattleModal(els.leaveModal,els.leaveContinue,els.battleBack)});els.leaveContinue.addEventListener("click",continueLeave);els.leaveStage.addEventListener("click",()=>{closeBattleModal(els.leaveModal,{restore:false});run=null;stageIndex=Math.max(stageIndex,Math.min(29,save.unlocked-1));setScreen("stage")});els.battleHelp.addEventListener("click",()=>{if(!run)return;run.paused=true;openBattleModal(els.helpModal,els.helpClose,els.battleHelp)});els.helpClose.addEventListener("click",closeHelp);els.helpModal.addEventListener("keydown",event=>trapBattleModal(event,closeHelp));els.leaveModal.addEventListener("keydown",event=>trapBattleModal(event,continueLeave));els.resultModal.addEventListener("keydown",trapBattleModal);els.retry.addEventListener("click",()=>{if(claimResultAction())startBattle(stageIndex,{skipTutorial:true})});els.resultMap.addEventListener("click",()=>{if(!claimResultAction())return;closeBattleModal(els.resultModal,{restore:false});run=null;stageIndex=Math.max(stageIndex,Math.min(29,save.unlocked-1));setScreen("stage")});els.next.addEventListener("click",()=>{if(claimResultAction())startBattle(Math.min(29,stageIndex+1),{skipTutorial:true})});els.auraButton.addEventListener("click",()=>{if(save.aura)return;if(window.WeightPlayWallet?.spendDiamonds?.(10)){save.aura=true;els.forgeFeedback.textContent="";persist();renderForge()}else els.forgeFeedback.textContent=`${t("auraTitle")} · ${t("auraBuy")}`});
  els.start.addEventListener("click",()=>focusScreenOwner("stage"));
  els.stageBack.addEventListener("click",()=>focusScreenOwner("main"));
  els.battleBack.addEventListener("click",()=>{if(!run||run.ended)focusScreenOwner("stage")});
  els.leaveStage.addEventListener("click",()=>focusScreenOwner("stage"));
  els.resultMap.addEventListener("click",()=>focusScreenOwner("stage"));
  window.addEventListener("resize",syncArenaSize,{passive:true});if("ResizeObserver"in window){resizeObserver=new ResizeObserver(syncArenaSize);resizeObserver.observe(els.arenaWrap)}

  function preload(){return Promise.all(Object.entries(imagePaths).map(([key,src])=>new Promise(resolve=>{const image=new Image;image.onload=()=>{images[key]=image;resolve()};image.onerror=()=>{images[key]=image;resolve()};image.src=src})))}
  window.__animalSkyspireDropSmoke={stages,startBattle:(index=0)=>startBattle(index,{skipTutorial:true}),snapshot:()=>run?{stage:run.stage.index,current:run.current,rotation:run.rotation,rotationTarget:run.rotationTarget,bounce:run.bounce,transition:run.transition,departing:run.departing?{...run.departing}:null,combo:run.combo,bestCombo:run.bestCombo,power:run.power,shield:run.shield,elapsed:run.elapsed,paused:run.paused,ended:run.ended,result:run.result,screen,keys:[...run.keys]}:null,rotateToGap:()=>{const ring=currentRing();if(!ring)return false;run.rotation=run.rotationTarget=normAngle(PLAYER_ANGLE-ringAngle(ring)-ring.gap);return true},forceLanding:()=>{if(!run||run.ended)return false;run.bounce=1;land();return true},forceWin:()=>{if(!run)return;run.current=run.stage.ringCount;finish(true)},forceFail:()=>{if(!run)return;finish(false)},step:(seconds=.1)=>{for(let left=seconds;left>0&&!run.ended;left-=.016)update(Math.min(.016,left));draw()},save:()=>JSON.parse(JSON.stringify(save)),setSave:value=>{save=normalizeSave(value);persist();renderMainProgress();renderStages();renderForge()}};
  ensureCompletePublicGuide();initLocale();applyLocale();window.addEventListener("DOMContentLoaded",()=>setTimeout(()=>{ensureCompletePublicGuide();applyLocale()},0),{once:true});preload().then(()=>{els.loading.hidden=true;syncArenaSize();renderMainProgress();renderStages();renderForge()});
})();
