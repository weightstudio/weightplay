(()=>{
  "use strict";
  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];
  const localeOrder=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"];
  const localeLang={en:"en","zh-Hant":"zh-Hant","zh-Hans":"zh-Hans",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const localeByRoute={en:"en","zh-tw":"zh-Hant","zh-cn":"zh-Hans",ja:"ja",ko:"ko",es:"es","pt-br":"pt-BR",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"};
  const palette=["#22dfff","#ff4fcf","#ffbf45","#946cff","#68e56c","#ff786d","#4589ff","#ff6298","#f7d85a"];
  const GAME_VERSION="v14";
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
  }
  function openModal(panel,focus){
    panel.hidden=false;setCovered(true,panel);requestAnimationFrame(()=>focus?.focus?.({preventScroll:true}));
  }
  function closeModal(panel,focus){
    panel.hidden=true;setCovered(false,panel);focus?.focus?.({preventScroll:true});
  }
  function syncBattleHelp(screen){
    const button=$(".wp-tutorial-button");
    if(!button)return;
    const header=$("#battle .battle-header");
    if(button.parentElement!==header)header.append(button);
    button.classList.add("prism-battle-help");
    button.hidden=screen!=="battle";
  }
  function show(id){
    if(id!=="stage")cancelStageRailInteraction();
    $("#leavePanel").hidden=true;$("#result").hidden=true;setCovered(false,null);
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
    window.dispatchEvent(new Event("weightplay:shell-sync"));
    window.dispatchEvent(new Event("weightplay:stage-sync"));
    window.dispatchEvent(new Event("weightplay:battle-sync"));
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
    button.innerHTML='<small class="stage-chapter"></small><strong></strong><span class="stage-size"></span><span class="stage-detail"></span>';
    return button;
  }
  function bindStageCard(button,index){
    const item=levels[index],locked=index>=unlocked;
    button.dataset.index=String(index);button.hidden=false;
    button.className=`stage-card${locked?" locked":""}`;
    button.setAttribute("aria-posinset",String(index+1));button.setAttribute("aria-setsize",String(levels.length));
    button.setAttribute("aria-disabled",String(locked));button.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End");
    const chapterName=chapterCopy("chapterNames",item.chapter),pairs=t("pairs",{n:item.count}),gateCount=t("gates",{n:Object.keys(item.gates).length});
    button.setAttribute("aria-label",`${t("garden",{n:index+1})}, ${t("chapter",{n:item.chapter})}: ${chapterName}, ${item.size}×${item.size}, ${pairs}, ${gateCount}, ${locked?t("locked"):t("ready")}`);
    button.querySelector(".stage-chapter").textContent=`${t("chapter",{n:item.chapter})} · ${chapterName}`;
    button.querySelector("strong").textContent=t("garden",{n:index+1});
    button.querySelector(".stage-size").textContent=`${item.size}×${item.size}`;
    button.querySelector(".stage-detail").textContent=`${pairs} · ${gateCount}${locked?` · ${t("locked")}`:""}`;
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
    const progress=t("progress",{done:Math.max(0,unlocked-1)});
    $("#progressBadge").textContent=progress;
    $("#mainProgress").textContent=progress;
    if(!stageCardPool.length)buildStageCardPool();else{moveStageWindow(desiredStageWindow(selected));syncStageCards()}
    installVirtualStageDrag();
    if(document.body.dataset.screen==="stage")requestAnimationFrame(()=>{if(document.body.dataset.screen==="stage")positionStageRail(selected)});
  }
  function startLevel(index){
    selected=index;level=levels[index];paths={};history=[];activeColor=null;pointerId=null;moves=0;resultClaimed=false;
    $("#stageName").textContent=t("garden",{n:index+1});
    $("#chapter").textContent=`${t("chapter",{n:level.chapter})} · ${chapterCopy("chapterNames",level.chapter)}`;
    const mission=chapterCopy("chapterMissions",level.chapter);
    $("#objective").textContent=mission;
    $("#status").textContent=`${mission} ${t("ready")}`;
    show("battle");renderBoard();tone(520,.05);
    window.WonderAnalytics?.track?.("game_start",{game_id:"animal-prism-garden",game_version:GAME_VERSION,stage:index+1});
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
    $("#moves").textContent=t("moves",{n:moves});
    $("#linkStatus").textContent=t("links",{done:linked,total:level.count});
    $("#fillStatus").textContent=t("filled",{done:occupied,total:level.size*level.size});
  }
  function renderBoard(){
    if(!level)return;
    const grid=$("#grid");grid.innerHTML="";grid.style.setProperty("--size",level.size);
    for(let index=0;index<level.size*level.size;index++){
      const cell=document.createElement("div");
      cell.className="cell";cell.dataset.index=String(index);cell.setAttribute("role","gridcell");
      const seed=seedColorAt(index),owner=ownerAt(index),gate=Number.isInteger(level.gates[index])?level.gates[index]:-1;
      if(owner>=0){cell.classList.add("path");cell.style.setProperty("--path",palette[owner])}
      if(seed>=0){cell.classList.add("seed");cell.style.setProperty("--seed",palette[seed]);cell.dataset.seed=String(seed)}
      if(gate>=0){
        cell.classList.add("gate");cell.style.setProperty("--gate",palette[gate]);
        const mark=document.createElement("span");mark.className="gate-mark";cell.append(mark);
      }
      grid.append(cell);
    }
    renderHud();
  }
  function adjacent(a,b){
    const ar=Math.floor(a/level.size),ac=a%level.size,br=Math.floor(b/level.size),bc=b%level.size;
    return Math.abs(ar-br)+Math.abs(ac-bc)===1;
  }
  function begin(index,event){
    const color=seedColorAt(index);
    if(color<0)return;
    event.preventDefault();
    history.push(copyPaths());
    delete paths[color];
    paths[color]=[index];activeColor=color;pointerId=event.pointerId;
    $("#grid").setPointerCapture?.(pointerId);
    renderBoard();tone(360,.035);
  }
  function extend(index){
    if(activeColor===null)return;
    const path=paths[activeColor],last=path.at(-1);
    if(index===last)return;
    if(path.length>1&&index===path.at(-2)){path.pop();renderBoard();return}
    if(!adjacent(last,index)||path.includes(index)){blocked(index);return}
    const seed=seedColorAt(index),owner=ownerAt(index),gate=Number.isInteger(level.gates[index])?level.gates[index]:-1;
    if((seed>=0&&seed!==activeColor)||(owner>=0&&owner!==activeColor)||(gate>=0&&gate!==activeColor)){blocked(index);return}
    path.push(index);renderBoard();tone(250+path.length*7,.018);
  }
  function blocked(index){
    const cell=$(`.cell[data-index="${index}"]`);cell?.classList.add("blocked");
    setTimeout(()=>cell?.classList.remove("blocked"),240);
    $("#status").textContent=t("blocked");
  }
  function end(event){
    if(activeColor===null||event.pointerId!==pointerId)return;
    moves++;activeColor=null;pointerId=null;
    renderBoard();checkComplete();
  }
  function checkComplete(){
    const allLinked=Array.from({length:level.count},(_,color)=>connected(color)).every(Boolean);
    const filled=new Set(Object.values(paths).flat()).size===level.size*level.size;
    if(!allLinked||!filled||resultClaimed)return;
    resultClaimed=true;
    const nextUnlocked=Math.min(30,Math.max(unlocked,selected+2));
    if(nextUnlocked!==unlocked){unlocked=nextUnlocked;write(saveKey,unlocked)}
    $("#resultBody").textContent=t("resultBody",{n:selected+1,moves});
    $("#next").disabled=selected>=29;
    setTimeout(()=>{openModal($("#result"),$("#next").disabled?$("#retry"):$("#next"));successTone()},280);
    window.WonderAnalytics?.track?.("game_complete",{game_id:"animal-prism-garden",game_version:GAME_VERSION,stage:selected+1,moves});
  }
  function hint(){
    if(!level)return;
    const color=Array.from({length:level.count},(_,i)=>i).find(i=>!connected(i));
    if(color===undefined)return;
    history.push(copyPaths());paths[color]=level.solution[color].slice();moves++;
    $("#status").textContent=t("hinted");renderBoard();tone(720,.08);checkComplete();
  }
  function undo(){
    const previous=history.pop();
    if(!previous)return;
    paths=previous;activeColor=null;moves++;
    $("#status").textContent=t("undone");renderBoard();
  }
  function reset(){
    if(Object.keys(paths).length)history.push(copyPaths());
    paths={};activeColor=null;moves++;
    $("#status").textContent=t("fresh");renderBoard();
  }
  function tone(frequency,duration){
    if(window.WonderSound?.isMuted?.())return;
    try{
      audioContext ||= new(window.AudioContext||window.webkitAudioContext)();
      const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();
      oscillator.frequency.value=frequency;oscillator.type="sine";gain.gain.setValueAtTime(.035,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);
      oscillator.connect(gain).connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+duration);
    }catch{}
  }
  function successTone(){[520,680,880].forEach((note,index)=>setTimeout(()=>tone(note,.14),index*100))}

  $("#grid").addEventListener("pointerdown",event=>begin(Number(event.target.closest(".cell")?.dataset.index),event));
  $("#grid").addEventListener("pointermove",event=>{
    if(activeColor===null||event.pointerId!==pointerId)return;
    const cell=document.elementFromPoint(event.clientX,event.clientY)?.closest?.(".cell");
    if(cell&&$("#grid").contains(cell))extend(Number(cell.dataset.index));
  });
  $("#grid").addEventListener("pointerup",end);
  $("#grid").addEventListener("pointercancel",end);
  $("#start").addEventListener("click",()=>show("stage"));
  $("#stage [data-back]").addEventListener("click",()=>show("main"));
  $("#battle [data-back]").addEventListener("click",()=>openModal($("#leavePanel"),$("#leaveContinue")));
  $("#leaveContinue").addEventListener("click",()=>closeModal($("#leavePanel"),$("#battle [data-back]")));
  $("#leaveStages").addEventListener("click",()=>show("stage"));
  $("#undo").addEventListener("click",undo);$("#hint").addEventListener("click",hint);$("#reset").addEventListener("click",reset);
  $("#resultStages").addEventListener("click",()=>show("stage"));
  $("#retry").addEventListener("click",()=>startLevel(selected));
  $("#next").addEventListener("click",()=>startLevel(Math.min(29,selected+1)));
  $("#stageGrid").addEventListener("click",event=>{const card=event.target.closest(".stage-card");if(!card)return;const index=Number(card.dataset.index);selectStage(index);if(index<unlocked)startLevel(index)});
  $("#stageGrid").addEventListener("keydown",event=>{const card=event.target.closest(".stage-card");if(!card||!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();event.stopImmediatePropagation();const current=Number(card.dataset.index),rtl=document.documentElement.dir==="rtl",step=event.key==="ArrowRight"?(rtl?-1:1):(rtl?1:-1),next=event.key==="Home"?0:event.key==="End"?levels.length-1:Math.max(0,Math.min(levels.length-1,current+step));selectStage(next,true)},true);
  $("#stageTab").addEventListener("click",()=>selectStage(selected,true));

  initLocale();renderStages();show("main");
  document.addEventListener("DOMContentLoaded",()=>syncBattleHelp(document.body.dataset.screen),{once:true});
  window.addEventListener("load",()=>{
    $("#loadingPanel")?.classList.add("hidden");
  window.WonderAnalytics?.track?.("game_view",{game_id:"animal-prism-garden",game_version:GAME_VERSION,release_state:"public"});
  },{once:true});
})();
