(()=>{
  "use strict";
  const GAME_ID="animal-number-match",GAME_VERSION=11,INTERFACE_VERSION=6;
  const codes=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const $=selector=>document.querySelector(selector),screens=[...document.querySelectorAll(".screen")],levels=window.NUMBER_MATCH_LEVELS.levels;
  const storageKey="wp-animal-number-match-v1";
  let locale=window.WonderI18n?.actualLocale?.()||window.__WONDER_FORCED_LOCALE||read("weightPlayLocale")||read("wp-locale")||window.WonderI18n?.locale?.()||"en";if(!codes.includes(locale))locale="en";
  const STAGE_CARD_POOL_SIZE=9,clamp=(value,minimum,maximum)=>Math.max(minimum,Math.min(maximum,value));
  let unlocked=Number(read(storageKey))||1,selected=Math.min(unlocked,30)-1,level=null,values=[],picked=null,history=[],moves=0,resultActionClaimed=false,inputLocked=false,tileFocusIndex=0,activeScene="main",sceneGeneration=0,lastInputType="unknown",returnedToMain=false;
  let stageCardPool=[],stageWindowStart=0,stageSettleRaf=0,restoreStageRailBehavior=()=>{};
  function read(key){try{return localStorage.getItem(key)}catch{return null}}
  function write(key,value){try{localStorage.setItem(key,value)}catch{}}
  function t(key,vars={}){const value=window.NUMBER_MATCH_LOCALES[locale]?.[key]??window.NUMBER_MATCH_LOCALES.en[key]??key;return String(value).replace(/\{(\w+)\}/g,(_,name)=>vars[name]??"")}
  function viewportBucket(){const viewport=window.visualViewport,width=Math.round(viewport?.width||window.innerWidth||0),height=Math.round(viewport?.height||window.innerHeight||0);if(width>height&&height<=500)return"short-landscape";if(width>=1000)return"desktop";if(width>=600)return"wide-phone";return"phone"}
  function normalizeInputType(value){return["pointer","touch","keyboard"].includes(value)?value:"unknown"}
  function eventInputType(event){if(event?.pointerType==="touch")return"touch";if(event?.pointerType)return"pointer";if(event?.type?.startsWith("key")||event?.detail===0)return"keyboard";return"pointer"}
  function track(name,data={}){const payload={...data,game:GAME_ID,game_version:GAME_VERSION,interface_version:INTERFACE_VERSION,locale:locale||"en",viewport:viewportBucket(),input_type:normalizeInputType(data.input_type||lastInputType)};if(window.WonderAnalytics&&typeof window.WonderAnalytics.track==="function")window.WonderAnalytics.track(name,payload)}
  function pairOrientation(a,b){const ar=Math.floor(a/level.cols),ac=a%level.cols,br=Math.floor(b/level.cols),bc=b%level.cols;return ar===br?"row":ac===bc?"column":"unknown"}
  function show(id){
    if(id!=="stage"&&activeScene==="stage")cancelStageMotion();
    if(id!==activeScene){activeScene=id;sceneGeneration++}
    if(id!=="battle"&&$("#leaveDialog").open)$("#leaveDialog").close();
    if(id!=="battle")document.querySelectorAll("#battle .match-echo").forEach(node=>node.remove());
    screens.forEach(screen=>{const inactive=screen.id!==id;screen.hidden=inactive;screen.classList.toggle("hidden",inactive)});
    $("#generalReserve").hidden=id!=="battle";
    document.body.dataset.gameView=id;document.body.dataset.screen=id;
    for(const scene of ["main","stage","battle"])document.body.classList.toggle(`wp-shell-${scene}-active`,scene===id);
    document.body.classList.toggle("wp-stage-select-active",id==="stage");document.documentElement.classList.toggle("wp-stage-select-active",id==="stage");
    window.scrollTo(0,0);
    dispatchEvent(new CustomEvent("weightplay:shell-sync",{detail:{screen:id,generation:sceneGeneration}}));
    dispatchEvent(new CustomEvent("weightplay:stage-sync",{detail:{screen:id,generation:sceneGeneration}}));
    if(id==="stage")renderStages()
  }
  function cancelStageMotion(){cancelAnimationFrame(stageSettleRaf);stageSettleRaf=0;restoreStageRailBehavior()}
  function stageWindowLimit(){return Math.max(0,levels.length-STAGE_CARD_POOL_SIZE)}
  function desiredStageWindow(index){return clamp(index-Math.floor(STAGE_CARD_POOL_SIZE/2),0,stageWindowLimit())}
  function createStageCard(poolIndex){
    const button=document.createElement("button");button.type="button";button.className="stage-card";button.dataset.wpStagePoolNode=String(poolIndex+1);button.innerHTML='<strong></strong><span></span><span class="difficulty-pips" aria-hidden="true"></span>';
    button.addEventListener("click",event=>{const index=Number(button.dataset.stageIndex),locked=index+1>unlocked;selectStage(index,true);if(!locked)startLevel(index,eventInputType(event),"stage_card")});
    button.addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const rtl=document.documentElement.dir==="rtl",current=Number(button.dataset.stageIndex),next=event.key==="Home"?0:event.key==="End"?levels.length-1:clamp(current+(event.key==="ArrowRight"?(rtl?-1:1):(rtl?1:-1)),0,levels.length-1);selectStage(next,true,true)});
    return button;
  }
  function bindStageCard(button,index){
    const item=levels[index],locked=index+1>unlocked;button.dataset.index=String(index);button.dataset.stageIndex=String(index);button.setAttribute("aria-posinset",String(index+1));button.setAttribute("aria-setsize",String(levels.length));button.setAttribute("aria-disabled",locked?"true":"false");button.classList.toggle("locked",locked);button.querySelector("strong").textContent=t("grove",{n:index+1});button.querySelector("span").textContent=`${item.rows} × ${item.cols}${locked?" · "+t("locked"):""}`;button.querySelector(".difficulty-pips").dataset.tier=String(item.tier);
  }
  function syncStageCards(){stageCardPool.forEach(button=>{const index=Number(button.dataset.stageIndex),active=index===selected;bindStageCard(button,index);button.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End");button.tabIndex=active?0:-1;button.classList.toggle("selected",active);button.classList.toggle("centered",active);button.classList.toggle("wp-stage-centered",active);button.setAttribute("aria-current",active?"true":"false");if(index===Math.max(0,unlocked-1))button.dataset.wpStageRecommended="true";else delete button.dataset.wpStageRecommended})}
  function buildStageCardPool(){const rail=$("#stageGrid"),count=Math.min(STAGE_CARD_POOL_SIZE,levels.length);rail.innerHTML="";stageWindowStart=desiredStageWindow(selected);stageCardPool=Array.from({length:count},(_,offset)=>{const button=createStageCard(offset);bindStageCard(button,stageWindowStart+offset);rail.append(button);return button});rail.dataset.wpStageVirtualized="bounded-recycle";rail.dataset.wpStagePoolSize=String(count);rail.dataset.wpStageTotal=String(levels.length);rail.dataset.wpStageWindowStart=String(stageWindowStart);rail.dataset.wpStageWindowEnd=String(stageWindowStart+count-1)}
  function moveStageWindow(targetStart){
    const rail=$("#stageGrid"),target=clamp(targetStart,0,stageWindowLimit());let recycledCount=0;
    while(stageWindowStart<target){const recycled=rail.firstElementChild,anchor=recycled?.nextElementSibling,before=anchor?.getBoundingClientRect().left;stageWindowStart++;rail.append(recycled);bindStageCard(recycled,stageWindowStart+stageCardPool.length-1);recycledCount++;const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=after-before}
    while(stageWindowStart>target){const recycled=rail.lastElementChild,anchor=recycled?.previousElementSibling,before=anchor?.getBoundingClientRect().left;stageWindowStart--;rail.prepend(recycled);bindStageCard(recycled,stageWindowStart);recycledCount++;const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=after-before}
    stageCardPool=[...rail.children];rail.dataset.wpStageWindowStart=String(stageWindowStart);rail.dataset.wpStageWindowEnd=String(stageWindowStart+stageCardPool.length-1);if(recycledCount)rail.dataset.wpStageRecycleCount=String(Number(rail.dataset.wpStageRecycleCount||0)+recycledCount);return recycledCount;
  }
  function ensureStageWindow(index){if(!stageCardPool.length)buildStageCardPool();moveStageWindow(desiredStageWindow(index));syncStageCards()}
  function stageRailGeometry(){const rail=$("#stageGrid"),cards=[...rail.children],railRect=rail.getBoundingClientRect(),first=cards[0]?.getBoundingClientRect(),second=cards[1]?.getBoundingClientRect(),delta=first&&second?(second.left+second.width/2)-(first.left+first.width/2):0,fallback=(first?.width||264)+(parseFloat(getComputedStyle(rail).columnGap)||16);return{rail,center:railRect.left+railRect.width/2,pitch:Math.abs(delta)||fallback,orientation:Math.sign(delta)||1}}
  function nearestStageCard(){const rail=$("#stageGrid"),rect=rail.getBoundingClientRect(),center=rect.left+rect.width/2;return stageCardPool.reduce((nearest,card)=>{const box=card.getBoundingClientRect(),distance=Math.abs(box.left+box.width/2-center);return!nearest||distance<nearest.distance?{card,distance}:nearest},null)?.card||null}
  function currentStageLogicalPosition(){const card=nearestStageCard();if(!card)return selected;const index=Number(card.dataset.stageIndex),rect=card.getBoundingClientRect(),geometry=stageRailGeometry();return clamp(index+(geometry.center-(rect.left+rect.width/2))/(geometry.pitch*geometry.orientation),0,levels.length-1)}
  function positionStageRail(logicalPosition){const logical=clamp(logicalPosition,0,levels.length-1),anchorIndex=Math.round(logical),recycled=moveStageWindow(desiredStageWindow(anchorIndex));if(recycled)syncStageCards();const card=$("#stageGrid").querySelector(`[data-stage-index="${anchorIndex}"]`);if(!card)return logical;card.scrollIntoView({behavior:"auto",block:"nearest",inline:"center"});const geometry=stageRailGeometry(),fraction=logical-anchorIndex;if(Math.abs(fraction)>.0001)geometry.rail.scrollLeft+=fraction*geometry.orientation*geometry.pitch;geometry.rail.dataset.wpStageDragLogical=logical.toFixed(4);return logical}
  function selectStage(index,center=false,focus=false){selected=clamp(index,0,levels.length-1);ensureStageWindow(selected);if(center)positionStageRail(selected);syncStageCards();const active=$("#stageGrid").querySelector(`[data-stage-index="${selected}"]`);if(focus)active?.focus({preventScroll:true})}
  function installVirtualStageDrag(){
    const rail=$("#stageGrid");if(rail.dataset.wpStageVirtualDrag==="true")return;rail.dataset.wpStageVirtualDrag="true";rail.dataset.wpStageCenterObserver="manual";const baseSnap=rail.style.getPropertyValue("scroll-snap-type"),baseBehavior=rail.style.getPropertyValue("scroll-behavior");let pointerId=null,startX=0,lastX=0,dragLogical=0,moved=false,suppressClick=false;
    const restore=()=>{if(baseBehavior)rail.style.setProperty("scroll-behavior",baseBehavior);else rail.style.removeProperty("scroll-behavior");if(baseSnap)rail.style.setProperty("scroll-snap-type",baseSnap);else rail.style.removeProperty("scroll-snap-type");delete rail.dataset.wpStageSettling;delete rail.dataset.wpDragDown;rail.classList.remove("wp-stage-dragging")};restoreStageRailBehavior=restore;
    rail.addEventListener("pointerdown",event=>{if(event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;cancelAnimationFrame(stageSettleRaf);stageSettleRaf=0;pointerId=event.pointerId;startX=lastX=event.clientX;dragLogical=currentStageLogicalPosition();moved=false;rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");rail.dataset.wpDragDown="1";event.stopImmediatePropagation()},true);
    document.addEventListener("pointermove",event=>{if(event.pointerId!==pointerId)return;const delta=event.clientX-lastX;lastX=event.clientX;if(!moved&&Math.abs(event.clientX-startX)>4){moved=true;rail.classList.add("wp-stage-dragging")}if(moved){const rect=rail.getBoundingClientRect(),scale=rect.width?rail.clientWidth/rect.width:1,pitch=stageRailGeometry().pitch;if(event.cancelable)event.preventDefault();dragLogical=positionStageRail(dragLogical-delta*scale/pitch)}event.stopImmediatePropagation()},true);
    const finish=event=>{if(pointerId===null||(event.pointerId!==undefined&&event.pointerId!==pointerId))return;pointerId=null;rail.dataset.wpDragDown="0";rail.classList.remove("wp-stage-dragging");if(moved){if(event.cancelable)event.preventDefault();const from=dragLogical,index=clamp(Math.round(from),0,levels.length-1),duration=Number(rail.dataset.wpStageSettleDuration)||340,start=performance.now();selected=index;syncStageCards();positionStageRail(from);rail.dataset.wpStageSettling="true";const settle=now=>{const progress=clamp((now-start)/duration,0,1),eased=progress*progress*(3-2*progress);positionStageRail(from+(index-from)*eased);if(progress<1)stageSettleRaf=requestAnimationFrame(settle);else{stageSettleRaf=0;positionStageRail(index);syncStageCards();restore()}};stageSettleRaf=requestAnimationFrame(settle);suppressClick=true;setTimeout(()=>{suppressClick=false},0)}else restore();moved=false;event.stopImmediatePropagation()};document.addEventListener("pointerup",finish,true);document.addEventListener("pointercancel",finish,true);rail.addEventListener("click",event=>{if(!suppressClick)return;suppressClick=false;event.preventDefault();event.stopImmediatePropagation()},true);
  }
  function renderStages(){$("#progress").textContent=t("progress",{done:Math.min(unlocked-1,30)});if(!stageCardPool.length)buildStageCardPool();ensureStageWindow(selected);installVirtualStageDrag();requestAnimationFrame(()=>selectStage(selected,true))}
  function startLevel(index,startInputType="unknown",entryAction="stage_card"){
    selected=index;lastInputType=normalizeInputType(startInputType);level=levels[index];values=level.cells.slice();picked=null;history=[];moves=0;inputLocked=false;tileFocusIndex=values.findIndex(value=>value!==null);
    $("#board").style.setProperty("--cols",level.cols);$("#chapter").textContent=t("chapter",{n:Math.floor(index/5)+1});$("#stageName").textContent=t("grove",{n:index+1});$("#status").textContent=t("selectFirst");show("battle");renderBoard();
    if(returnedToMain){track("return_session",{source:"main",grove:index+1,entry_action:entryAction});returnedToMain=false}
    track("game_start",{grove:index+1,entry_action:entryAction,unlocked_groves:Math.min(unlocked,30),input_type:lastInputType});
  }
  const matches=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&a+b===10;
  function visiblePair(a,b){
    if(a===b)return false;
    const ar=Math.floor(a/level.cols),ac=a%level.cols,br=Math.floor(b/level.cols),bc=b%level.cols;
    if(ar===br){for(let col=Math.min(ac,bc)+1;col<Math.max(ac,bc);col++)if(values[ar*level.cols+col]!==null)return false;return true}
    if(ac===bc){for(let row=Math.min(ar,br)+1;row<Math.max(ar,br);row++)if(values[row*level.cols+ac]!==null)return false;return true}
    return false;
  }
  function availablePair(){
    for(let a=0;a<values.length;a++)if(values[a]!==null)for(let b=a+1;b<values.length;b++)if(values[b]!==null&&matches(values[a],values[b])&&visiblePair(a,b))return[a,b];
    return null;
  }
  function choose(index,actionInputType="unknown"){
    if(inputLocked||values[index]===null)return;
    lastInputType=normalizeInputType(actionInputType);
    tileFocusIndex=index;
    if(picked===null){picked=index;$("#status").textContent=t("selectFirst");renderBoard();return}
    const first=picked,firstValue=values[first],secondValue=values[index],attempt={grove:selected+1,move:moves+1,first_value:firstValue,second_value:secondValue,orientation:pairOrientation(first,index)};
    if(index===picked){track("pair_attempt",{...attempt,outcome:"same_tile"});picked=null;renderBoard();return}
    if(!matches(values[picked],values[index])){
      track("pair_attempt",{...attempt,outcome:"invalid_sum"});track("invalid_pair",{...attempt,reason:"sum"});
      $("#status").textContent=t("invalid");picked=index;renderBoard();flash(index,"bad");return;
    }
    if(!visiblePair(picked,index)){
      track("pair_attempt",{...attempt,outcome:"blocked"});track("invalid_pair",{...attempt,reason:"blocked"});
      $("#status").textContent=t("blocked");picked=index;renderBoard();flash(index,"bad");return;
    }
    const a=picked,b=index,matched=[{index:a,value:values[a]},{index:b,value:values[b]}];
    track("pair_attempt",{...attempt,outcome:"legal"});
    history.push({a,b,va:values[a],vb:values[b]});values[a]=null;values[b]=null;picked=null;moves++;
    track("pair_clear",{grove:selected+1,move:moves,pairs_left:values.filter(value=>value!==null).length/2,first_clear:moves===1,orientation:pairOrientation(a,b)});
    $("#status").textContent=t("match");renderBoard();showMatchEffect(matched);if(values.every(value=>value===null))complete();
  }
  function renderBoard(){
    const board=$("#board"),restoreFocus=board.contains(document.activeElement),activeIndices=values.map((value,index)=>value===null?-1:index).filter(index=>index>=0);
    if(!activeIndices.includes(tileFocusIndex))tileFocusIndex=activeIndices.reduce((nearest,index)=>Math.abs(index-tileFocusIndex)<Math.abs(nearest-tileFocusIndex)?index:nearest,activeIndices[0]??-1);
    board.innerHTML="";
    values.forEach((value,index)=>{
      const button=document.createElement("button");button.className=`tile${value===null?" empty":""}${picked===index?" selected":""}`;button.dataset.index=index;button.setAttribute("role","gridcell");
      if(value===null){button.disabled=true;button.tabIndex=-1;button.setAttribute("aria-hidden","true")}
      else{button.tabIndex=index===tileFocusIndex?0:-1;button.textContent=value;button.setAttribute("aria-selected",picked===index?"true":"false");button.setAttribute("aria-label",t("tileLabel",{value,row:Math.floor(index/level.cols)+1,col:index%level.cols+1}));button.onclick=event=>choose(index,eventInputType(event))}
      board.append(button);
    });
    if(restoreFocus&&tileFocusIndex>=0)board.querySelector(`[data-index="${tileFocusIndex}"]`)?.focus();
    $("#pairsLeft").textContent=t("pairsLeft",{n:values.filter(value=>value!==null).length/2});$("#undo").disabled=!history.length;
  }
  function moveTileFocus(key,current){
    const activeIndices=values.map((value,index)=>value===null?-1:index).filter(index=>index>=0);
    if(!activeIndices.length)return;
    let next=current;
    if(key==="Home")next=activeIndices[0];
    else if(key==="End")next=activeIndices[activeIndices.length-1];
    else{
      const rtl=document.documentElement.dir==="rtl",horizontal=key==="ArrowLeft"||key==="ArrowRight";
      const step=horizontal?((key==="ArrowRight")!==rtl?1:-1):(key==="ArrowDown"?level.cols:-level.cols);
      for(let candidate=current+step;candidate>=0&&candidate<values.length;candidate+=step){
        if(horizontal&&Math.floor(candidate/level.cols)!==Math.floor(current/level.cols))break;
        if(values[candidate]!==null){next=candidate;break}
      }
    }
    tileFocusIndex=next;
    document.querySelectorAll("#board .tile:not(.empty)").forEach(tile=>tile.tabIndex=Number(tile.dataset.index)===next?0:-1);
    document.querySelector(`#board [data-index="${next}"]`)?.focus();
  }
  function flash(index,className){const generation=sceneGeneration;requestAnimationFrame(()=>{if(activeScene!=="battle"||generation!==sceneGeneration)return;document.querySelector(`#board [data-index="${index}"]`)?.classList.add(className)})}
  function showMatchEffect(matched){
    const board=$("#board");
    matched.forEach(({index,value})=>{
      const socket=board.querySelector(`[data-index="${index}"]`);if(!socket)return;
      const echo=document.createElement("span");
      echo.className="match-echo";echo.textContent=value;echo.setAttribute("aria-hidden","true");
      echo.style.cssText=`left:${socket.offsetLeft}px;top:${socket.offsetTop}px;width:${socket.offsetWidth}px;height:${socket.offsetHeight}px`;
      board.append(echo);echo.addEventListener("animationend",()=>echo.remove(),{once:true});
    });
  }
  function hint(actionInputType="unknown"){
    lastInputType=normalizeInputType(actionInputType);
    const pair=availablePair();
    if(!pair){track("hint",{grove:selected+1,outcome:"reorder"});reorder(actionInputType);return}
    track("hint",{grove:selected+1,outcome:"pair",orientation:pairOrientation(pair[0],pair[1])});pair.forEach(index=>flash(index,"hint"));$("#status").textContent=t("selectFirst")
  }
  function pairValues(list,memo=new Map()){
    if(!list.length)return[];const key=list.slice().sort((a,b)=>a-b).join(",");if(memo.has(key))return null;memo.set(key,true);
    const first=list[0];
    for(let i=1;i<list.length;i++)if(matches(first,list[i])){const rest=list.slice(1,i).concat(list.slice(i+1)),paired=pairValues(rest,memo);if(paired)return[[first,list[i]],...paired]}
    return null;
  }
  function reorder(actionInputType="unknown"){
    lastInputType=normalizeInputType(actionInputType);
    const remaining=values.filter(value=>value!==null),pairs=pairValues(remaining);
    if(!pairs){track("reorder",{grove:selected+1,outcome:"unavailable"});return}
    values=Array(values.length).fill(null);pairs.flat().forEach((value,index)=>values[index]=value);picked=null;moves++;$("#status").textContent=t("shuffled");renderBoard();
    track("reorder",{grove:selected+1,outcome:"reordered",move:moves,pairs_left:values.filter(value=>value!==null).length/2});
  }
  function complete(){
    if(selected+2>unlocked){unlocked=Math.min(31,selected+2);write(storageKey,String(unlocked))}
    resultActionClaimed=false;["#resultStages","#retry","#next"].forEach(selector=>$(selector).disabled=false);$("#next").disabled=selected===29;
    track("result",{grove:selected+1,moves,outcome:"complete"});track("game_complete",{grove:selected+1,moves,outcome:"complete"});
    $("#resultBody").textContent=t("resultBody",{n:selected+1,moves});$("#next").textContent=t("next");const generation=sceneGeneration;setTimeout(()=>{if(activeScene==="battle"&&generation===sceneGeneration)$("#result").showModal()},180);
  }
  function claimResultAction(actionName,actionInputType,action){
    if(resultActionClaimed)return;
    const sourceGrove=selected+1;resultActionClaimed=true;["#resultStages","#retry","#next"].forEach(selector=>$(selector).disabled=true);$("#result").close();track(actionName,{from:"result",grove:sourceGrove,input_type:actionInputType});action();
  }
  function applyLocale(){
    document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.title=`${t("title")} | WeightPlay`;
    document.querySelectorAll("[data-t]").forEach(node=>node.textContent=t(node.dataset.t));document.querySelectorAll("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.tAria)));document.querySelectorAll("[data-t-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.tAlt)));
    $("#locale").value=locale;if(!$("#stage").hidden)renderStages();if(!$("#battle").hidden){$("#chapter").textContent=t("chapter",{n:Math.floor(selected/5)+1});$("#stageName").textContent=t("grove",{n:selected+1});$("#status").textContent=t("selectFirst");renderBoard()}
  }
  codes.forEach(code=>{const option=document.createElement("option");option.value=code;option.textContent=window.NUMBER_MATCH_LOCALES[code].label;$("#locale").append(option)});
  write("weightPlayLocale",locale);write("wp-locale",locale);
  document.addEventListener("change",event=>{if(event.target.id!=="locale")return;locale=event.target.value;write("wp-locale",locale);try{window.WonderI18n?.setLocale?.(locale)}catch{}applyLocale()});
  window.addEventListener("wonder:locale-change",event=>{
    const next=event.detail?.actualLocale||event.detail?.locale;
    if(!codes.includes(next))return;
    locale=next;write("weightPlayLocale",locale);write("wp-locale",locale);applyLocale();
    const generation=sceneGeneration;window.setTimeout(()=>{if(locale===next&&generation===sceneGeneration)applyLocale()},0);
  });
  $("#start").onclick=()=>show("stage");$("#tutorialOpen").onclick=()=>$("#tutorialPanel").showModal();$("#tutorialStart").onclick=()=>{$("#tutorialPanel").close();show("stage")};$("#tutorialPanel").addEventListener("cancel",()=>$("#tutorialPanel").close());$("#stageGrid").addEventListener("wonder:stage-snap",event=>{if(activeScene!=="stage")return;const index=Number(event.detail?.index);if(Number.isInteger(index)&&index>=0)selectStage(index)});$("#stage [data-back]").onclick=event=>{track("main_return",{from:"stage",grove:selected+1,input_type:eventInputType(event)});returnedToMain=true;show("main")};
  $("#battle [data-back]").onclick=()=>{
    if(picked===null&&!history.length&&!moves){show("stage");return}
    inputLocked=true;$("#leaveDialog").showModal();$("#continueBattle").focus();
  };
  const continueBattle=()=>{inputLocked=false;$("#leaveDialog").close();$("#battle [data-back]").focus()};
  $("#continueBattle").onclick=continueBattle;
  $("#leaveBattle").onclick=()=>{inputLocked=false;picked=null;show("stage")};
  $("#leaveDialog").addEventListener("cancel",event=>{event.preventDefault();continueBattle()});
  $("#board").addEventListener("keydown",event=>{
    if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(event.key))return;
    const tile=event.target.closest(".tile:not(.empty)");if(!tile)return;
    event.preventDefault();moveTileFocus(event.key,Number(tile.dataset.index));
  });
  $("#undo").onclick=event=>{lastInputType=eventInputType(event);const last=history.pop();if(!last){track("undo",{grove:selected+1,outcome:"unavailable"});return}values[last.a]=last.va;values[last.b]=last.vb;picked=null;moves=Math.max(0,moves-1);track("undo",{grove:selected+1,outcome:"applied",move:moves});$("#status").textContent=t("undone");renderBoard()};
  $("#hint").onclick=event=>hint(eventInputType(event));$("#shuffle").onclick=event=>reorder(eventInputType(event));$("#restart").onclick=event=>{lastInputType=eventInputType(event);track("restart",{from:"battle",grove:selected+1,input_type:lastInputType});startLevel(selected,lastInputType,"restart")};
  $("#resultStages").onclick=event=>claimResultAction("stages",eventInputType(event),()=>{selected=Math.min(29,unlocked-1);show("stage")});$("#next").onclick=event=>claimResultAction("next_grove",eventInputType(event),()=>startLevel(selected+1,eventInputType(event),"next_grove"));$("#retry").onclick=event=>claimResultAction("replay",eventInputType(event),()=>startLevel(selected,eventInputType(event),"replay"));
  applyLocale();show("main");$("#loadingPanel").classList.add("hidden");window.__NUMBER_MATCH_TEST__={matches,visiblePair,availablePair,currentSolution:()=>level?.solution?.map(pair=>pair.slice())||[]};
})();
