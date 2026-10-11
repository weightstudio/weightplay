(()=>{
  "use strict";
  /* WP-GAME-ANALYTICS-ADAPTER */
  // Only replayable lifecycle signals live here; all metrics/timers/GA4 stay shared.
  const __wpMeasurement = { screen: null, roundKey: null, started: false, ended: false, restart: false, outcome: "complete" };
  const __wpReadMeasurement = () => ({ ...__wpMeasurement,
    screen: ((__wpMeasurement.screen) === "battle" && (__wpMeasurement.ended)) ? null : (__wpMeasurement.screen), ended: Boolean(__wpMeasurement.ended), outcome: __wpMeasurement.outcome,
    paused: Boolean(false), node: document.body,
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

  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];
  const localeOrder=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const localeLang={en:"en","zh-Hant":"zh-Hant","zh-Hans":"zh-Hans",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const localeByRoute={en:"en","zh-tw":"zh-Hant","zh-cn":"zh-Hans",ja:"ja",ko:"ko",es:"es","pt-br":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const palette=["#22dfff","#ff4fcf","#ffbf45","#946cff","#68e56c","#ff786d","#4589ff","#ff6298","#f7d85a"];
  const GAME_VERSION="v18";
  const STAGE_CARD_POOL_SIZE=9;
  const saveKey="wp-animal-prism-garden-v1";
  const {levels}=window.PRISM_GARDEN_LEVELS;
  const screens=$$(".screen");
  const routeSegment=location.pathname.split("/").filter(Boolean)[0]||"";
  let locale=localeByRoute[routeSegment]||read("wp-locale")||document.documentElement.lang||"en";
  let unlocked=Math.max(1,Math.min(30,Number(read(saveKey))||1));
  let selected=unlocked-1;
  let level=null,paths={},history=[],activeColor=null,pointerId=null,moves=0,resultClaimed=false,audioContext=null;
  let stageCardPool=[],stageWindowStart=0,stageSettleRaf=0,cancelStageRailInteraction=()=>{};
  let lastPointerPoint=null,boardCells=[],boardLevel=null,keyboardIndex=0,settleTimer=0,roundGeneration=0;
  const recordsKey="wp-animal-prism-garden-records-v1";
  let records={};
  try{const saved=JSON.parse(read(recordsKey)||"{}");if(saved&&typeof saved==="object"&&!Array.isArray(saved))records=saved}catch{}
  const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)");
  window.WeightPlayAudio?.preload?.(["puzzle.match","board.undo"]);
  function animate(node,keyframes,duration=260){
    if(!node?.animate)return;
    node.getAnimations().forEach(animation=>animation.cancel());
    node.animate(reducedMotion.matches?[{opacity:.7},{opacity:1}]:keyframes,{duration:reducedMotion.matches?90:duration,easing:"cubic-bezier(.2,.8,.2,1)"});
  }
  function stopGesture(){
    const grid=$("#grid");
    if(Number.isInteger(pointerId)&&grid.hasPointerCapture?.(pointerId))grid.releasePointerCapture(pointerId);
    activeColor=null;pointerId=null;lastPointerPoint=null;
  }
  function cancelSettlement(){clearTimeout(settleTimer);settleTimer=0;roundGeneration++}
  function canPlay(){return level&&document.body.dataset.screen==="battle"&&!document.body.classList.contains("modal-open")&&!resultClaimed}
  function status(key,values){$("#status").textContent=t(key,values);animate($("#status"),[{opacity:.4},{opacity:1}],180)}

  function read(key){try{return localStorage.getItem(key)}catch{return null}}
  function write(key,value){try{localStorage.setItem(key,String(value))}catch{}}
  function copyPaths(value=paths){return Object.fromEntries(Object.entries(value).map(([key,path])=>[key,path.slice()]))}
  function t(key,vars={}){
    let value=window.PRISM_GARDEN_LOCALES[locale]?.[key]??window.PRISM_GARDEN_LOCALES.en[key]??key;
    return String(value).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??"");
  }
  function chapterCopy(key,chapter){const catalog=window.PRISM_GARDEN_LOCALES[locale]||window.PRISM_GARDEN_LOCALES.en,values=catalog[key]||window.PRISM_GARDEN_LOCALES.en[key]||[];return values[Math.max(0,Math.min(5,chapter-1))]||""}
  function setCovered(covered,owner){
    $$("#battle > *").forEach(node=>{if(node!==owner)node.inert=covered});
    document.body.classList.toggle("modal-open",covered);
    window.dispatchEvent(new Event("weightplay:prism-covered"));
    // The shared frame reparents the content once; keep the live content inert too.
    $("#battle .battle-content").inert=covered;
  }
  function openModal(panel,focus){
    if(activeColor!==null){moves++;stopGesture();renderBoard();checkComplete();if(resultClaimed&&panel.id==="leavePanel")return}
    stopGesture();renderBoard();
    panel.hidden=false;setCovered(true,panel);requestAnimationFrame(()=>{if(!panel.hidden&&document.body.dataset.screen==="battle")focus?.focus?.({preventScroll:true})});
    animate(panel.querySelector(".modal-card"),[{opacity:0,transform:"translateY(12px)"},{opacity:1,transform:"translateY(0)"}],320);
  }
  function closeModal(panel,focus){
    panel.hidden=true;setCovered(false,panel);focus?.focus?.({preventScroll:true});
  }
  function syncBattleHelp(screen){
    const button=$(".wp-tutorial-button");
    if(!button)return;
    const header=$("#battle .battle-content");
    if(button.parentElement!==header)header.append(button);
    button.classList.add("prism-battle-help");
    button.hidden=screen!=="battle";
  }
  function show(id){
    cancelSettlement();stopGesture();
    $("#battle").getAnimations({subtree:true}).forEach(animation=>animation.cancel());
    if(id!=="stage")cancelStageRailInteraction();
    (__wpNotifyMeasurement(), $("#leavePanel").hidden=true);(__wpNotifyMeasurement(), $("#result").hidden=true);setCovered(false,null);
    screens.forEach(screen=>screen.hidden=screen.id!==id);
    $("#mainGroup").hidden=id!=="main";
    document.body.dataset.screen=id;
    document.body.classList.toggle("wp-shell-main-active",id==="main");
    document.body.classList.toggle("wp-shell-stage-active",id==="stage");
    document.body.classList.toggle("wp-shell-battle-active",id==="battle");
    document.body.classList.toggle("wp-stage-select-active",id==="stage");
    $("#generalReserve").hidden=id==="main";
    syncBattleHelp(id);
    if(id==="stage")renderStages();
    animate($(id==="stage"?"#stage .stage-workspace":id==="battle"?"#grid":"#main .prism-main-content"),[{opacity:0},{opacity:1}],300);
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    window.dispatchEvent(new Event("weightplay:stage-sync"));
    window.dispatchEvent(new Event("weightplay:battle-sync"));

    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[id] ?? null;
      if (["result"].includes(id) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  function setLocale(next){
    locale=localeOrder.includes(next)?next:"en";
    write("wp-locale",locale);
    window.WonderI18n?.setLocale?.(locale);
    document.documentElement.lang=localeLang[locale]||"en";
    document.documentElement.dir=locale==="ar"?"rtl":"ltr";
    $$("[data-t]").forEach(node=>{node.textContent=t(node.dataset.t)});
    $$("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.tAria)));
    $$("[data-t-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.tAlt)));
    document.title=`${t("title")} | WeightPlay`;
    if(level){renderHud();renderBoard()}
    renderStages();
  }
  function initLocale(){
    if(!localeOrder.includes(locale))locale="en";
    const select=$("#locale");
    localeOrder.forEach(code=>{
      const option=document.createElement("option");
      option.value=code;option.textContent=window.PRISM_GARDEN_LOCALES[code].name;
      select.append(option);
    });
    select.value=locale;
    select.addEventListener("change",()=>setLocale(select.value));
    setLocale(locale);
  }
  function stageWindowLimit(){return Math.max(0,levels.length-Math.min(STAGE_CARD_POOL_SIZE,levels.length))}
  function desiredStageWindow(index){return Math.max(0,Math.min(stageWindowLimit(),index-Math.floor(Math.min(STAGE_CARD_POOL_SIZE,levels.length)/2)))}
  function createStageCard(poolIndex){
    const button=document.createElement("button");
    button.type="button";button.className="stage-card";button.dataset.wpStagePoolNode=String(poolIndex+1);
    button.innerHTML='<small class="stage-chapter"></small><strong></strong><span class="stage-size"></span><span class="stage-detail"></span><span class="prism-preview" aria-hidden="true"></span><span class="prism-record"></span>';
    return button;
  }
  function bindStageCard(button,index){
    const item=levels[index],locked=index>=unlocked;
    button.dataset.index=String(index);button.hidden=false;
    button.className=`stage-card${locked?" locked":""}${records[index]?" cleared":""}`;
    button.setAttribute("aria-posinset",String(index+1));button.setAttribute("aria-setsize",String(levels.length));
    button.setAttribute("aria-disabled",String(locked));button.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End");
    const chapterName=chapterCopy("chapterNames",item.chapter),pairs=t("pairs",{n:item.count}),gateCount=t("gates",{n:Object.keys(item.gates).length});
    button.setAttribute("aria-label",`${t("garden",{n:index+1})}, ${t("chapter",{n:item.chapter})}: ${chapterName}, ${item.size}×${item.size}, ${pairs}, ${gateCount}, ${locked?t("locked"):t("ready")}`);
    button.querySelector(".stage-chapter").textContent=`${t("chapter",{n:item.chapter})} · ${chapterName}`;
    button.querySelector("strong").textContent=t("garden",{n:index+1});
    button.querySelector(".stage-size").textContent=`${item.size}×${item.size}`;
    button.querySelector(".stage-detail").textContent=`${pairs} · ${gateCount}${locked?` · ${t("locked")}`:""}`;
    const preview=button.querySelector(".prism-preview");
    if(preview.dataset.level!==String(index)){
      preview.dataset.level=String(index);preview.style.setProperty("--size",item.size);preview.replaceChildren();
      for(let cell=0;cell<item.size*item.size;cell++){
        const dot=document.createElement("i"),color=Array.from({length:item.count},(_,i)=>i).findIndex(i=>item.ends[i].includes(cell));
        if(color>=0)dot.style.background=palette[color];preview.append(dot);
      }
    }
    button.querySelector(".prism-record").textContent=records[index]?t("bestMoves",{n:records[index].moves}):"";
  }
  function syncStageCards(){
    stageCardPool.forEach(button=>{
      const index=Number(button.dataset.index);bindStageCard(button,index);
      const current=index===selected;button.tabIndex=current?0:-1;
      button.classList.toggle("selected",current);button.classList.toggle("is-centered",current);
      if(current){button.setAttribute("aria-current","true");button.dataset.wpStageRecommended="true"}else{button.removeAttribute("aria-current");delete button.dataset.wpStageRecommended}
    });
  }
  function buildStageCardPool(){
    const rail=$("#stageGrid"),count=Math.min(STAGE_CARD_POOL_SIZE,levels.length);rail.replaceChildren();stageWindowStart=desiredStageWindow(selected);
    stageCardPool=Array.from({length:count},(_,offset)=>{const button=createStageCard(offset);bindStageCard(button,stageWindowStart+offset);rail.append(button);return button});
    rail.dataset.wpStageVirtualized="bounded-recycle";rail.dataset.wpStagePoolSize=String(count);rail.dataset.wpStageTotal=String(levels.length);
    rail.dataset.wpStageWindowStart=String(stageWindowStart);rail.dataset.wpStageWindowEnd=String(stageWindowStart+count-1);rail.dataset.wpStageRecycleCount="0";
  }
  function moveStageWindow(targetStart){
    const rail=$("#stageGrid"),target=Math.max(0,Math.min(stageWindowLimit(),targetStart));let recycled=0;
    while(stageWindowStart<target){const card=rail.firstElementChild,anchor=card?.nextElementSibling,before=anchor?.getBoundingClientRect().left;stageWindowStart++;rail.append(card);bindStageCard(card,stageWindowStart+stageCardPool.length-1);recycled++;const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=after-before}
    while(stageWindowStart>target){const card=rail.lastElementChild,anchor=card?.previousElementSibling,before=anchor?.getBoundingClientRect().left;stageWindowStart--;rail.prepend(card);bindStageCard(card,stageWindowStart);recycled++;const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=after-before}
    stageCardPool=[...rail.children];rail.dataset.wpStageWindowStart=String(stageWindowStart);rail.dataset.wpStageWindowEnd=String(stageWindowStart+stageCardPool.length-1);
    if(recycled)rail.dataset.wpStageRecycleCount=String(Number(rail.dataset.wpStageRecycleCount||0)+recycled);return recycled;
  }
  function stageRailGeometry(){
    const rail=$("#stageGrid"),cards=[...rail.children],railRect=rail.getBoundingClientRect(),first=cards[0]?.getBoundingClientRect(),second=cards[1]?.getBoundingClientRect();
    const delta=first&&second?(second.left+second.width/2)-(first.left+first.width/2):0,fallback=(first?.width||264)+(parseFloat(getComputedStyle(rail).columnGap)||22);
    return{center:railRect.left+railRect.width/2,pitch:Math.abs(delta)||fallback,orientation:Math.sign(delta)||1};
  }
  function nearestStageCard(){const geometry=stageRailGeometry();return stageCardPool.reduce((nearest,card)=>{const rect=card.getBoundingClientRect(),distance=Math.abs(rect.left+rect.width/2-geometry.center);return!nearest||distance<nearest.distance?{card,distance}:nearest},null)?.card||null}
  function currentStageLogicalPosition(){const card=nearestStageCard();if(!card)return selected;const index=Number(card.dataset.index),rect=card.getBoundingClientRect(),geometry=stageRailGeometry();return Math.max(0,Math.min(levels.length-1,index+(geometry.center-(rect.left+rect.width/2))/(geometry.pitch*geometry.orientation)))}
  function positionStageRail(logicalPosition){
    const rail=$("#stageGrid"),logical=Math.max(0,Math.min(levels.length-1,logicalPosition)),anchorIndex=Math.round(logical),recycled=moveStageWindow(desiredStageWindow(anchorIndex));if(recycled)syncStageCards();
    const card=rail.querySelector(`[data-index="${anchorIndex}"]`);if(!card)return logical;card.scrollIntoView({behavior:"auto",block:"nearest",inline:"center"});
    const geometry=stageRailGeometry(),fraction=logical-anchorIndex;if(Math.abs(fraction)>.0001)rail.scrollLeft+=fraction*geometry.orientation*geometry.pitch;rail.dataset.wpStageDragLogical=logical.toFixed(4);return logical;
  }
  function selectStage(index,focus=false){selected=Math.max(0,Math.min(levels.length-1,index));if(!stageCardPool.length)buildStageCardPool();moveStageWindow(desiredStageWindow(selected));positionStageRail(selected);syncStageCards();if(focus)$("#stageGrid").querySelector(`[data-index="${selected}"]`)?.focus({preventScroll:true})}
  function installVirtualStageDrag(){
    const rail=$("#stageGrid");if(rail.dataset.wpStageVirtualDrag==="true")return;rail.dataset.wpStageVirtualDrag="true";rail.dataset.wpStageCenterObserver="manual";
    let owner=null,startX=0,lastX=0,dragLogical=0,moved=false,suppressClick=false;
    const restore=()=>{rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type");delete rail.dataset.wpStageSettling;delete rail.dataset.wpDragDown;rail.classList.remove("wp-stage-dragging")};
    cancelStageRailInteraction=()=>{owner=null;cancelAnimationFrame(stageSettleRaf);stageSettleRaf=0;restore()};
    rail.addEventListener("pointerdown",event=>{if(event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;cancelAnimationFrame(stageSettleRaf);stageSettleRaf=0;owner=event.pointerId;startX=lastX=event.clientX;dragLogical=currentStageLogicalPosition();moved=false;rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");rail.dataset.wpDragDown="1";event.stopImmediatePropagation()},true);
    document.addEventListener("pointermove",event=>{if(event.pointerId!==owner)return;const delta=event.clientX-lastX;lastX=event.clientX;if(!moved&&Math.abs(event.clientX-startX)>4){moved=true;rail.classList.add("wp-stage-dragging")}if(moved){const rect=rail.getBoundingClientRect(),scale=rect.width?rail.clientWidth/rect.width:1;if(event.cancelable)event.preventDefault();dragLogical=positionStageRail(dragLogical-delta*scale/stageRailGeometry().pitch)}event.stopImmediatePropagation()},true);
    const finish=event=>{if(owner===null||(event.pointerId!==undefined&&event.pointerId!==owner))return;owner=null;delete rail.dataset.wpDragDown;rail.classList.remove("wp-stage-dragging");if(moved){if(event.cancelable)event.preventDefault();const from=dragLogical,index=Math.max(0,Math.min(levels.length-1,Math.round(from))),started=performance.now();selected=index;syncStageCards();positionStageRail(from);rail.dataset.wpStageSettling="true";const settle=now=>{const progress=Math.max(0,Math.min(1,(now-started)/340)),eased=progress*progress*(3-2*progress);positionStageRail(from+(index-from)*eased);if(progress<1&&document.body.dataset.screen==="stage")stageSettleRaf=requestAnimationFrame(settle);else{stageSettleRaf=0;if(document.body.dataset.screen==="stage"){positionStageRail(index);syncStageCards()}restore()}};stageSettleRaf=requestAnimationFrame(settle);suppressClick=true;setTimeout(()=>{suppressClick=false},0)}else restore();moved=false;event.stopImmediatePropagation()};
    document.addEventListener("pointerup",finish,true);document.addEventListener("pointercancel",finish,true);
    rail.addEventListener("click",event=>{if(!suppressClick)return;suppressClick=false;event.preventDefault();event.stopImmediatePropagation()},true);
  }
  function renderStages(){
    const rail=$("#stageGrid");
    if(!rail)return;
    const progress=t("progress",{done:records[levels.length-1]?levels.length:Math.max(0,unlocked-1)});
    $("#progressBadge").textContent=progress;
    $("#mainProgress").textContent=progress;
    if(!stageCardPool.length)buildStageCardPool();else{moveStageWindow(desiredStageWindow(selected));syncStageCards()}
    installVirtualStageDrag();
    if(document.body.dataset.screen==="stage")requestAnimationFrame(()=>{if(document.body.dataset.screen==="stage")positionStageRail(selected)});
  }
  function startLevel(index){
    cancelSettlement();stopGesture();keyboardIndex=levels[index].ends[0][0];
    selected=index;level=levels[index];paths={};history=[];activeColor=null;pointerId=null;moves=0;resultClaimed=false;
    $("#stageName").textContent=t("garden",{n:index+1});
    $("#chapter").textContent=`${t("chapter",{n:level.chapter})} · ${chapterCopy("chapterNames",level.chapter)}`;
    const mission=chapterCopy("chapterMissions",level.chapter);
    $("#objective").textContent=mission;
    $("#status").textContent=`${mission} ${t("ready")}`;
    show("battle");renderBoard();tone("game.start",.05);
    window.WonderAnalytics?.track?.("game_start",{game_id:"animal-prism-garden",game_version:GAME_VERSION,stage:index+1});

    __wpMeasurement.roundKey = {}; __wpMeasurement.restart = false; __wpMeasurement.started = true; __wpMeasurement.ended = false; __wpMeasurement.outcome = "complete"; __wpMeasurement.screen = "battle"; __wpNotifyMeasurement();
}
  function seedColorAt(index){
    for(let color=0;color<level.count;color++)if(level.ends[color].includes(index))return color;
    return -1;
  }
  function ownerAt(index){
    for(const [color,path] of Object.entries(paths))if(path.includes(index))return Number(color);
    return -1;
  }
  function connected(color){
    const path=paths[color]||[],ends=level.ends[color];
    return path.length>1&&((path[0]===ends[0]&&path.at(-1)===ends[1])||(path[0]===ends[1]&&path.at(-1)===ends[0]));
  }
  function renderHud(){
    if(!level)return;
    const linked=Array.from({length:level.count},(_,color)=>connected(color)).filter(Boolean).length;
    const occupied=new Set(Object.values(paths).flat()).size;
    for(const [id,key,value] of [["moves","hudMoves",String(moves)],["linkStatus","hudPairs",`${linked}/${level.count}`],["fillStatus","hudFilled",`${occupied}/${level.size*level.size}`]]){
      const node=$("#"+id);node.textContent=value;node.setAttribute("aria-label",`${t(key)} ${value}`);
      const label=node.parentElement.querySelector("[data-t]");if(label)label.textContent=t(key);
    }
    $("#grid").style.setProperty("--fill",`${occupied/(level.size*level.size)*100}%`);
    $("#undo").disabled=history.length===0||resultClaimed;
    $("#reset").disabled=Object.keys(paths).length===0||resultClaimed;
    $("#hint").disabled=resultClaimed;
    const pairs=$("#prismPairs");
    if(pairs){
      pairs.replaceChildren(...Array.from({length:level.count},(_,color)=>{
        const mark=document.createElement("span");mark.style.setProperty("--pair",palette[color]);
        mark.className=`prism-pair${connected(color)?" complete":""}${activeColor===color?" drawing":""}`;
        mark.textContent=connected(color)?"✓":String(color+1);
        mark.setAttribute("aria-label",t("pairState",{n:color+1,state:t(connected(color)?"linked":"unlinked")}));return mark;
      }));
    }
  }
  function renderBoard(){
    if(!level)return;
    const grid=$("#grid");grid.style.setProperty("--size",level.size);
    if(boardLevel!==level){
      boardLevel=level;grid.replaceChildren();boardCells=[];
      for(let index=0;index<level.size*level.size;index++){
        const cell=document.createElement("div");cell.dataset.index=String(index);cell.id=`prism-cell-${index}`;cell.setAttribute("role","gridcell");
        cell.innerHTML='<span class="route-arm north"></span><span class="route-arm east"></span><span class="route-arm south"></span><span class="route-arm west"></span><span class="route-core"></span>'+(Number.isInteger(level.gates[index])?'<span class="gate-mark"></span>':'')+'<span class="seed-number"></span>';
        grid.append(cell);boardCells.push(cell);
      }
    }
    grid.setAttribute("aria-activedescendant",`prism-cell-${keyboardIndex}`);
    grid.setAttribute("aria-rowcount",String(level.size));grid.setAttribute("aria-colcount",String(level.size));
    for(let index=0;index<boardCells.length;index++){
      const cell=boardCells[index],wasConnected=cell.classList.contains("connected");
      cell.className="cell";
      const seed=seedColorAt(index),owner=ownerAt(index),gate=Number.isInteger(level.gates[index])?level.gates[index]:-1;
      cell.style.removeProperty("--path");
      if(owner>=0){
        cell.classList.add("path");cell.style.setProperty("--path",palette[owner]);
        const path=paths[owner],at=path.indexOf(index);
        for(const neighbor of [path[at-1],path[at+1]]){
          const delta=neighbor-index;
          if(Number.isInteger(neighbor))cell.classList.add(delta===1?"to-east":delta===-1?"to-west":delta===level.size?"to-south":"to-north");
        }
        if(owner===activeColor){cell.classList.add("active-path");if(index===path.at(-1))cell.classList.add("route-tip")}
        if(connected(owner))cell.classList.add("connected");
      }
      if(seed>=0&&connected(seed))cell.classList.add("connected");
      if(seed>=0){cell.classList.add("seed");cell.style.setProperty("--seed",palette[seed]);cell.dataset.seed=String(seed)}
      if(gate>=0){
        cell.classList.add("gate");cell.style.setProperty("--gate",palette[gate]);
      }
      cell.querySelector(".seed-number").textContent=seed>=0?String(seed+1):gate>=0?String(gate+1):"";
      cell.setAttribute("aria-label",`${Math.floor(index/level.size)+1}, ${index%level.size+1}${seed>=0?` · ${t("pairState",{n:seed+1,state:t(connected(seed)?"linked":"unlinked")})}`:gate>=0?` · ${t("gateNumber",{n:gate+1})}`:""}`);
      cell.setAttribute("aria-selected",String(index===keyboardIndex));
      if(index===keyboardIndex)cell.classList.add("keyboard-cell");
      if(!wasConnected&&cell.classList.contains("connected"))animate(cell,[{filter:"brightness(1.8)"},{filter:"brightness(1)"}],420);
    }
    renderHud();
  }
  function adjacent(a,b){
    const ar=Math.floor(a/level.size),ac=a%level.size,br=Math.floor(b/level.size),bc=b%level.size;
    return Math.abs(ar-br)+Math.abs(ac-bc)===1;
  }
  function begin(index,event){
    if(!canPlay()||activeColor!==null||event.isPrimary===false||event.button>0)return;
    const color=seedColorAt(index);
    if(color<0)return;
    event.preventDefault();
    history.push(copyPaths());
    delete paths[color];
    paths[color]=[index];activeColor=color;pointerId=event.pointerId;
    keyboardIndex=index;
    lastPointerPoint={x:event.clientX,y:event.clientY};
    if(Number.isInteger(pointerId))$("#grid").setPointerCapture?.(pointerId);
    status("drawingPair",{n:color+1});
    renderBoard();tone("board.move",.035);
  }
  function extend(index){
    if(activeColor===null)return;
    const path=paths[activeColor],last=path.at(-1);
    if(index===last)return;
    if(path.length>1&&index===path.at(-2)){path.pop();renderBoard();return}
    // A matching flower terminates a route; overshooting must not undo the pair.
    if(connected(activeColor))return;
    if(!adjacent(last,index)||path.includes(index)){blocked(index);return}
    const seed=seedColorAt(index),owner=ownerAt(index),gate=Number.isInteger(level.gates[index])?level.gates[index]:-1;
    if((seed>=0&&seed!==activeColor)||(owner>=0&&owner!==activeColor)||(gate>=0&&gate!==activeColor)){blocked(index);return}
    path.push(index);keyboardIndex=index;renderBoard();
    if(connected(activeColor)){status("pairLinked",{n:activeColor+1});tone("puzzle.match")}else tone("board.move",.018);
  }
  function blocked(index){
    const cell=$(`.cell[data-index="${index}"]`);
    animate(cell,[{boxShadow:"inset 0 0 0 2px #ff9cab",filter:"brightness(1.5)"},{boxShadow:"inset 0 0 0 0px transparent",filter:"brightness(1)"}],240);
    status("blocked");
  }
  function end(event){
    if(activeColor===null||event.pointerId!==pointerId)return;
    if(event.type==="pointercancel"){
      paths=history.pop()||{};stopGesture();renderBoard();status("undone");return;
    }
    if(pointerId!=="keyboard")tracePointer(event);
    moves++;stopGesture();
    renderBoard();checkComplete();
  }
  function checkComplete(){
    const allLinked=Array.from({length:level.count},(_,color)=>connected(color)).every(Boolean);
    const filled=new Set(Object.values(paths).flat()).size===level.size*level.size;
    if(!allLinked||!filled||resultClaimed)return;
    resultClaimed=true;
    const old=records[selected];
    if(!old||!Number.isFinite(old.moves)||moves<old.moves){records[selected]={moves};write(recordsKey,JSON.stringify(records))}
    const nextUnlocked=Math.min(30,Math.max(unlocked,selected+2));
    if(nextUnlocked!==unlocked){unlocked=nextUnlocked;write(saveKey,unlocked)}
    $("#resultBody").textContent=`${t("resultBody",{n:selected+1,moves})} ${t("bestMoves",{n:records[selected].moves})}`;
    const mosaic=$("#prismResultGarden");
    if(mosaic){mosaic.replaceChildren();mosaic.style.setProperty("--size",level.size);for(let index=0;index<level.size*level.size;index++){const tile=document.createElement("i");tile.style.background=palette[ownerAt(index)];mosaic.append(tile)}}
    renderHud();
    $("#next").disabled=selected>=29;
    const generation=roundGeneration;
    settleTimer=setTimeout(()=>{if(generation!==roundGeneration||document.body.dataset.screen!=="battle")return;settleTimer=0;openModal($("#result"),$("#next").disabled?$("#retry"):$("#next"));successTone()},reducedMotion.matches?90:420);
    window.WonderAnalytics?.track?.("game_complete",{game_id:"animal-prism-garden",game_version:GAME_VERSION,stage:selected+1,moves});

    __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; if (__wpMeasurement.screen === "battle") __wpMeasurement.screen = null; __wpNotifyMeasurement();
}
  function hint(){
    if(!canPlay()||activeColor!==null)return;
    const color=Array.from({length:level.count},(_,i)=>i).find(i=>{
      if(connected(i))return false;
      const candidate=new Set(level.solution[i]||[]);
      return !Object.entries(paths).some(([owner,path])=>Number(owner)!==i&&path.some(cell=>candidate.has(cell)));
    });
    if(color===undefined){$("#status").textContent=t("hintUnavailable");renderBoard();return}
    history.push(copyPaths());paths[color]=level.solution[color].slice();moves++;
    $("#status").textContent=t("hinted");renderBoard();tone("feedback.hint",.08);checkComplete();
  }
  function undo(){
    if(!canPlay())return;stopGesture();
    const previous=history.pop();
    if(!previous)return;
    paths=previous;activeColor=null;moves++;
    status("undone");renderBoard();tone("board.undo");
  }
  function reset(){
    if(!canPlay())return;stopGesture();
    if(Object.keys(paths).length)history.push(copyPaths());
    paths={};activeColor=null;moves++;
    status("fresh");renderBoard();animate($("#grid"),[{opacity:.5},{opacity:1}],220);
  }
  function tone(cue = "ui.click") { return window.WeightPlayAudio?.play(cue); }
  function successTone() { return window.WeightPlayAudio?.play("puzzle.clear"); }

  $("#grid").addEventListener("pointerdown",event=>begin(Number(event.target.closest(".cell")?.dataset.index),event));
  $("#grid").addEventListener("keydown",event=>{
    if(!canPlay())return;
    const delta={ArrowUp:-level.size,ArrowDown:level.size,ArrowLeft:-1,ArrowRight:1}[event.key];
    if(delta!==undefined){
      event.preventDefault();const next=keyboardIndex+delta;
      if(next<0||next>=level.size*level.size||!adjacent(keyboardIndex,next))return;
      keyboardIndex=next;if(pointerId==="keyboard")extend(next);renderBoard();
    }else if(event.key===" "||event.key==="Enter"){
      event.preventDefault();
      if(pointerId==="keyboard")end({pointerId:"keyboard",type:"keyup"});
      else begin(keyboardIndex,{isPrimary:true,button:0,pointerId:"keyboard",preventDefault(){}});
    }else if(event.key==="Escape"&&pointerId==="keyboard"){
      event.preventDefault();paths=history.pop()||{};stopGesture();renderBoard();status("undone");
    }
  });
  function tracePointer(event){
    if(activeColor===null||event.pointerId!==pointerId)return;
    const grid=$("#grid"),rect=grid.getBoundingClientRect();
    const samples=event.getCoalescedEvents?.()||[];
    for(const sample of [...samples,event]){
      const point={x:sample.clientX,y:sample.clientY},from=lastPointerPoint||point;
      const steps=Math.max(1,Math.ceil(Math.hypot(point.x-from.x,point.y-from.y)/(rect.width/level.size/4)));
      for(let step=1;step<=steps;step++){
        const cell=document.elementFromPoint(from.x+(point.x-from.x)*step/steps,from.y+(point.y-from.y)*step/steps)?.closest?.(".cell");
        if(cell&&grid.contains(cell))extend(Number(cell.dataset.index));
      }
      lastPointerPoint=point;
    }
  }
  $("#grid").addEventListener("pointermove",tracePointer);
  $("#grid").addEventListener("pointerup",end);
  $("#grid").addEventListener("pointercancel",end);
  $("#start").addEventListener("click",()=>show("stage"));
  $("#stage [data-back]").addEventListener("click",()=>show("main"));
  $("#battle [data-back]").addEventListener("click",()=>{if(resultClaimed)return;openModal($("#leavePanel"),$("#leaveContinue"))});
  $("#leaveContinue").addEventListener("click",()=>closeModal($("#leavePanel"),$("#battle [data-back]")));
  $("#leaveStages").addEventListener("click",()=>show("stage"));
  $("#undo").addEventListener("click",undo);$("#hint").addEventListener("click",hint);$("#reset").addEventListener("click",reset);
  $("#resultStages").addEventListener("click",()=>{selected=unlocked-1;show("stage")});
  $("#retry").addEventListener("click",()=>__wpReplayStart(() => startLevel(selected)));
  $("#next").addEventListener("click",()=>startLevel(Math.min(29,selected+1)));
  $("#stageGrid").addEventListener("click",event=>{const card=event.target.closest(".stage-card");if(!card)return;const index=Number(card.dataset.index);selectStage(index);if(index<unlocked)startLevel(index)});
  $("#stageGrid").addEventListener("keydown",event=>{const card=event.target.closest(".stage-card");if(!card||!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();event.stopImmediatePropagation();const current=Number(card.dataset.index),rtl=document.documentElement.dir==="rtl",step=event.key==="ArrowRight"?(rtl?-1:1):(rtl?1:-1),next=event.key==="Home"?0:event.key==="End"?levels.length-1:Math.max(0,Math.min(levels.length-1,current+step));selectStage(next,true)},true);
  $("#stageTab").addEventListener("click",()=>selectStage(selected,true));

  // Permanent content nodes are mounted once; the shared frame retains control ownership.
  const pairs=document.createElement("div");pairs.id="prismPairs";pairs.className="prism-pairs";
  $("#objective").after(pairs);
  const mosaic=document.createElement("div");mosaic.id="prismResultGarden";mosaic.className="prism-result-garden";mosaic.setAttribute("aria-hidden","true");
  $("#result .result-mark").replaceWith(mosaic);
  const keyboardHelp=document.createElement("p");keyboardHelp.id="prismKeyboardHelp";keyboardHelp.className="prism-sr-only";keyboardHelp.dataset.t="keyboardHelp";
  $("#grid").after(keyboardHelp);$("#grid").setAttribute("aria-describedby","prismKeyboardHelp");
  document.addEventListener("keydown",event=>{
    const panel=!$("#result").hidden?$("#result"):!$("#leavePanel").hidden?$("#leavePanel"):null;
    if(!panel)return;
    if(event.key==="Escape"&&panel.id==="leavePanel"){event.preventDefault();closeModal(panel,$("#battle [data-back]"));return}
    if(event.key==="Tab"){
      const buttons=[...panel.querySelectorAll("button:not(:disabled)")],first=buttons[0],last=buttons.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  });
  window.addEventListener("pagehide",()=>{cancelSettlement();stopGesture()});

  initLocale();renderStages();show("main");
  document.addEventListener("DOMContentLoaded",()=>syncBattleHelp(document.body.dataset.screen),{once:true});
  window.addEventListener("load",()=>{
    $("#loadingPanel")?.classList.add("hidden");
  window.WonderAnalytics?.track?.("game_view",{game_id:"animal-prism-garden",game_version:GAME_VERSION,release_state:"public"});
  },{once:true});
})();
