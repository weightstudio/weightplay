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

  document.body.dataset.gameVersion="v18";
  const codes=["en","zh-Hant","zh-Hans","ja","ko","es","pt-BR","fr","de","it","ru","hi","ar"],segments={en:"en","zh-Hant":"zh-tw","zh-Hans":"zh-cn",ja:"ja",ko:"ko",es:"es","pt-BR":"pt-br",fr:"fr",de:"de",it:"it",ru:"ru",hi:"hi",ar:"ar"},levels=window.SUNBEAM_LEVELS.levels;
  const $=s=>document.querySelector(s),screens=[...document.querySelectorAll(".screen")],key="wp-animal-sunbeam-v1",roots=Object.freeze({main:$("#main"),stage:$("#stage"),battle:$("#battle")}),returns=Object.freeze({main:$("[data-wp-return='main']"),stage:$("[data-wp-return='stage']"),battle:$("[data-wp-return='battle']")}),mainFlow=Object.freeze({poster:$("#main .hero img"),summary:$("#main .hero [data-t='summary']"),progress:$("#mainProgress"),start:$("#start")}),lifecycleIdentity=new Map([...Object.entries(roots),...Object.entries(returns).map(([name,node])=>[`${name}Return`,node]),...Object.entries(mainFlow)]),mainGuide=()=>$(".game-page-info");
  Object.assign(roots.battle.dataset,{wpBattleLandscapeWidth:"760",wpBattleLandscapeHeight:"400"});
  const STAGE_POOL_SIZE=9;
  let history=[],hintedCell=null,hintedBloom=null,hintUses=0,gates=[],blooms=[],roundWon=false,resultPending=false,feedbackKey="",previousPaths=[],geometryFrame=0,beamRevision=0,beamAnimationsStarted=0;
  const ownedMotion=new Set(),audioScope=window.WeightPlayAudio?.createScope();
  window.WeightPlayAudio?.preload(["board.rotate","board.move","board.undo","feedback.hint","feedback.success","game.start","game.checkpoint","mechanism.unlock","result.win"]);
  window.sunbeamSnapshot=()=>({stage:selected,moves,angles:mirrors.map(m=>m.rot),hintedCell,hintUses,history:history.length,unlocked,screen:document.body.dataset.screen,paths:level?trace().paths:[]});
  const routeSegment=location.pathname.split("/").filter(Boolean)[0],routeLocale=Object.keys(segments).find(code=>segments[code]===routeSegment);let locale=routeLocale||read("wp-locale")||"en";if(!codes.includes(locale))locale="en";if(routeLocale){write("wp-locale",locale);write("weightPlayLocale",locale)}const storedUnlock=read(key);let unlocked=normalizeUnlock(storedUnlock),selected=Math.min(unlocked,30)-1,level=null,mirrors=[],moves=0,resultActionClaimed=false,rotationLocked=false,sceneGeneration=0,resultRevealTimer=0,stageWindowStart=0,stageCards=[],stageSettleFrame=0,cancelStageRailInteraction=()=>{};if(storedUnlock!==null&&storedUnlock!==String(unlocked))write(key,String(unlocked));
  function read(k){try{return localStorage.getItem(k)}catch{return null}}function write(k,v){try{localStorage.setItem(k,v)}catch{}}
  function normalizeUnlock(value){const parsed=Number(value);return Number.isInteger(parsed)&&parsed>=1&&parsed<=31?parsed:1}
  function t(k,v={}){const value=window.SUNBEAM_LOCALES[locale]?.[k]??window.SUNBEAM_LOCALES.en[k]??k;return String(value).replace(/\{(\w+)\}/g,(_,n)=>v[n]??"")}
  function renderMainProgress(){if(mainFlow.progress)mainFlow.progress.textContent=t("progress",{done:Math.min(unlocked-1,30)})}
  renderMainProgress();
  function show(id){stopOwnedMotion();audioScope?.stop();const generation=++sceneGeneration;feedbackKey="";if(id==="main")renderMainProgress();if(id!=="stage")cancelStageRailInteraction();if(id!=="battle"){clearTimeout(resultRevealTimer);resultRevealTimer=0;if($("#result").open)(__wpNotifyMeasurement(), $("#result").close());if($("#leave").open)(__wpNotifyMeasurement(), $("#leave").close())}screens.forEach(screen=>{const active=screen.id===id;screen.hidden=!active;screen.inert=!active;screen.setAttribute("aria-hidden",String(!active))});const guide=mainGuide();if(guide){guide.hidden=id!=="main";guide.setAttribute("aria-hidden",String(id!=="main"))}$(".wp-stage-physical-reserve")?.toggleAttribute("data-wp-stage-reserve-active",id==="stage");$("#generalReserve").hidden=id!=="battle";document.body.dataset.screen=id;document.documentElement.dataset.screen=id;document.body.dataset.gameView=id;document.documentElement.dataset.gameView=id;for(const name of Object.keys(roots)){document.body.classList.toggle(`wp-shell-${name}-active`,name===id);document.documentElement.classList.toggle(`wp-shell-${name}-active`,name===id)}document.body.classList.toggle("wp-stage-active",id==="stage");document.documentElement.classList.toggle("wp-stage-active",id==="stage");document.body.classList.toggle("wp-stage-select-active",id==="stage");document.documentElement.classList.toggle("wp-stage-select-active",id==="stage");window.scrollTo(0,0);if(id==="stage")renderStages();const content=({main:$("#main .hero"),stage:$("#stageGrid"),battle:$("#battle .garden-panel")})[id];tween(content,[{opacity:.3,transform:"translateY(6px)"},{opacity:1,transform:"translateY(0)"}],{duration:220});window.dispatchEvent(new CustomEvent("weightplay:shell-sync",{detail:{screen:id,generation}}));window.dispatchEvent(new CustomEvent("weightplay:stage-sync",{detail:{screen:id,generation}}));window.dispatchEvent(new CustomEvent("weightplay:battle-sync",{detail:{screen:id,generation}}));window.dispatchEvent(new CustomEvent("weightplay:game-view-change",{detail:{view:id}}));window.dispatchEvent(new CustomEvent("weightplay:battle-state",{detail:{active:id==="battle"}}));window.dispatchEvent(new CustomEvent("weightplay:stage-state",{detail:{active:id==="stage"}}));window.WeightPlayBattleCanvas?.sync?.();requestAnimationFrame(()=>requestAnimationFrame(()=>{if(generation!==sceneGeneration||document.body.dataset.screen!==id)return;for(const [name,node] of lifecycleIdentity)if(!node?.isConnected)throw new Error(`LIFE-RECREATED-ROOT:${name}`);window.dispatchEvent(new CustomEvent("weightplay:scene-settled",{detail:{scene:id,generation}}))}))
    { const __wpNextScreen = ({main:"main",stage:"stage",battle:"battle",})[id] ?? null;
      if (["result"].includes(id) && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "complete"; }
      else if (true && (__wpNextScreen === "main" || __wpNextScreen === "stage") && __wpMeasurement.screen === "battle" && __wpMeasurement.started && !__wpMeasurement.ended) { __wpMeasurement.ended = true; __wpMeasurement.outcome = "abandon"; }
      __wpMeasurement.screen = __wpNextScreen;  __wpNotifyMeasurement(); }
}
  function desiredStageWindow(index){return Math.max(0,Math.min(30-STAGE_POOL_SIZE,index-Math.floor(STAGE_POOL_SIZE/2)))}
  function bindStageCard(card,index){const locked=index+1>unlocked,active=index===selected;card.dataset.index=index;card.dataset.stageIndex=index;card.dataset.chapter=Math.floor(index/5)+1;card.className="stage-card"+(active?" selected centered":"")+(locked?" locked":"");card.style.setProperty("--stage-card-position",`${18+(index%5)*16}% ${28+(index%3)*19}%`);card.tabIndex=active?0:-1;card.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight Home End");card.setAttribute("aria-disabled",String(locked));card.setAttribute("aria-posinset",String(index+1));card.setAttribute("aria-setsize","30");if(active)card.setAttribute("aria-current","true");else card.removeAttribute("aria-current");const chapter=Math.floor(index/5)+1;const subtitle=locked?t("locked"):t("chapter",{n:chapter})+" · "+t("chapterArc"+chapter);card.innerHTML="<strong>"+t("garden",{n:index+1})+"</strong><span>"+subtitle+"</span>"}
  function createStageCard(poolId){const card=document.createElement("button");card.dataset.wpStagePoolId=poolId;card.onclick=()=>{const index=Number(card.dataset.index),locked=card.getAttribute("aria-disabled")==="true";selectStage(index,true,true);if(!locked)startLevel(index)};return card}
  function buildStagePool(){const rail=$("#stageGrid");rail.replaceChildren();stageWindowStart=desiredStageWindow(selected);stageCards=Array.from({length:STAGE_POOL_SIZE},(_,offset)=>{const card=createStageCard(String(offset));bindStageCard(card,stageWindowStart+offset);rail.append(card);return card});Object.assign(rail.dataset,{wpStageVirtualized:"bounded-recycle",wpStagePoolSize:String(STAGE_POOL_SIZE),wpStageTotal:"30",wpStageRecycleCount:"0"})}
  function moveStageWindow(targetStart){const rail=$("#stageGrid"),target=Math.max(0,Math.min(30-STAGE_POOL_SIZE,targetStart));let recycled=0;while(stageWindowStart<target){const card=rail.firstElementChild;stageWindowStart++;rail.append(card);bindStageCard(card,stageWindowStart+STAGE_POOL_SIZE-1);recycled++}while(stageWindowStart>target){const card=rail.lastElementChild;stageWindowStart--;rail.prepend(card);bindStageCard(card,stageWindowStart);recycled++}stageCards=[...rail.children];Object.assign(rail.dataset,{wpStageWindowStart:String(stageWindowStart),wpStageWindowEnd:String(stageWindowStart+STAGE_POOL_SIZE-1)});if(recycled)rail.dataset.wpStageRecycleCount=String(Number(rail.dataset.wpStageRecycleCount||0)+recycled);return recycled}
  function syncStageCards(){stageCards.forEach(card=>bindStageCard(card,Number(card.dataset.index)))}
  function stageRailGeometry(){const rail=$("#stageGrid"),cards=[...rail.children],railRect=rail.getBoundingClientRect(),first=cards[0]?.getBoundingClientRect(),second=cards[1]?.getBoundingClientRect(),delta=first&&second?second.left+second.width/2-first.left-first.width/2:0;return{center:railRect.left+railRect.width/2,pitch:Math.abs(delta)||(first?.width||264)+16,orientation:Math.sign(delta)||1}}
  function positionStageRail(logicalPosition){const rail=$("#stageGrid"),logical=Math.max(0,Math.min(29,logicalPosition)),anchor=Math.round(logical);if(moveStageWindow(desiredStageWindow(anchor)))syncStageCards();const card=rail.querySelector(`[data-index="${anchor}"]`);if(!card)return logical;card.scrollIntoView({behavior:"auto",inline:"center",block:"nearest"});const geometry=stageRailGeometry(),fraction=logical-anchor;if(Math.abs(fraction)>.0001)rail.scrollLeft+=fraction*geometry.orientation*geometry.pitch;rail.dataset.wpStageDragLogical=logical.toFixed(4);return logical}
  function currentStageLogical(){const geometry=stageRailGeometry(),card=stageCards.reduce((best,item)=>{const rect=item.getBoundingClientRect(),distance=Math.abs(rect.left+rect.width/2-geometry.center);return!best||distance<best.distance?{item,distance}:best},null)?.item;if(!card)return selected;const rect=card.getBoundingClientRect();return Math.max(0,Math.min(29,Number(card.dataset.index)+(geometry.center-rect.left-rect.width/2)/(geometry.pitch*geometry.orientation)))}
  function selectStage(index,center=false,focus=false){selected=Math.max(0,Math.min(29,index));moveStageWindow(desiredStageWindow(selected));syncStageCards();if(center)positionStageRail(selected);if(focus)requestAnimationFrame(()=>$("#stageGrid").querySelector(`[data-index="${selected}"]`)?.focus({preventScroll:true}))}
  function installStageRail(){const rail=$("#stageGrid");if(rail.dataset.wpStageVirtualDrag==="true")return;rail.dataset.wpStageVirtualDrag="true";rail.dataset.wpStageCenterObserver="manual";let pointerId=null,startX=0,lastX=0,logical=selected,moved=false,suppressClick=false;const restore=()=>{rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type");delete rail.dataset.wpStageSettling;delete rail.dataset.wpDragDown;rail.classList.remove("wp-stage-dragging")};cancelStageRailInteraction=()=>{pointerId=null;cancelAnimationFrame(stageSettleFrame);stageSettleFrame=0;restore()};window.addEventListener("pointerdown",event=>{if(!event.target?.closest?.("#stageGrid")||event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;cancelAnimationFrame(stageSettleFrame);stageSettleFrame=0;pointerId=event.pointerId;startX=lastX=event.clientX;logical=currentStageLogical();moved=false;rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");rail.dataset.wpDragDown="1";event.stopImmediatePropagation()},true);window.addEventListener("pointermove",event=>{if(event.pointerId!==pointerId)return;const delta=event.clientX-lastX;lastX=event.clientX;if(!moved&&Math.abs(event.clientX-startX)>4){moved=true;rail.classList.add("wp-stage-dragging")}if(moved){const rect=rail.getBoundingClientRect(),scale=rect.width?rail.clientWidth/rect.width:1;if(event.cancelable)event.preventDefault();logical=positionStageRail(logical-delta*scale/stageRailGeometry().pitch)}event.stopImmediatePropagation()},true);const finish=event=>{if(pointerId===null||(event.pointerId!==undefined&&event.pointerId!==pointerId))return;pointerId=null;if(moved){if(event.cancelable)event.preventDefault();const from=logical,index=Math.max(0,Math.min(29,Math.round(from))),started=performance.now();selected=index;syncStageCards();positionStageRail(from);rail.dataset.wpStageSettling="true";const settle=now=>{const progress=Math.max(0,Math.min(1,(now-started)/340)),eased=progress*progress*(3-2*progress);positionStageRail(from+(index-from)*eased);if(progress<1&&document.body.dataset.screen==="stage")stageSettleFrame=requestAnimationFrame(settle);else{stageSettleFrame=0;if(document.body.dataset.screen==="stage"){positionStageRail(index);syncStageCards()}restore()}};stageSettleFrame=requestAnimationFrame(settle);suppressClick=true;setTimeout(()=>{suppressClick=false},0)}else restore();moved=false;event.stopImmediatePropagation()};window.addEventListener("pointerup",finish,true);window.addEventListener("pointercancel",finish,true);rail.addEventListener("click",event=>{if(!suppressClick)return;suppressClick=false;event.preventDefault();event.stopImmediatePropagation()},true);rail.addEventListener("keydown",event=>{const card=event.target.closest(".stage-card");if(!card||!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const current=Number(card.dataset.index),rtl=document.documentElement.dir==="rtl",next=Math.max(0,Math.min(29,event.key==="Home"?0:event.key==="End"?29:current+(event.key==="ArrowRight"?(rtl?-1:1):(rtl?1:-1))));selectStage(next,true,true)})}
  function renderStages(){$("#progress").textContent=t("progress",{done:Math.min(unlocked-1,30)});if(stageCards.length!==STAGE_POOL_SIZE||!stageCards.every(card=>card.isConnected))buildStagePool();moveStageWindow(desiredStageWindow(selected));syncStageCards();installStageRail();requestAnimationFrame(()=>positionStageRail(selected))}
  function startLevel(index){
    stopOwnedMotion();clearTimeout(resultRevealTimer);resultRevealTimer=0;
    selected=index;level=levels[index];mirrors=level.mirrors.map(mirror=>({...mirror,visualAngle:mirror.rot*90}));
    gates=level.gates.map(gate=>({...gate}));blooms=level.blooms.map(bloom=>({...bloom,awake:false}));
    moves=0;history=[];hintedCell=null;hintedBloom=null;hintUses=0;rotationLocked=false;roundWon=false;resultPending=false;previousPaths=[];
    $("#chapter").textContent=t("chapter",{n:Math.floor(index/5)+1});$("#stageName").textContent=t("garden",{n:index+1});
    $("#board .beam-layer")?.remove();show("battle");renderBoard({kind:"start"});
    playSound("game.start");
    __wpMeasurement.roundKey={};__wpMeasurement.restart=false;__wpMeasurement.started=true;__wpMeasurement.ended=false;__wpMeasurement.outcome="complete";__wpMeasurement.screen="battle";__wpNotifyMeasurement();
  }
  function reflect(direction,rotation){return window.SUNBEAM_OPTICS.reflect(direction,rotation)}
  function trace(){
    const result=window.SUNBEAM_OPTICS.trace(level,mirrors,gates);
    return{...result,routeHit:result.hit,hit:result.hit&&blooms.every(bloom=>bloom.awake)};
  }
  function reducedMotion(){return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches===true}
  function tween(target,keyframes,options={}){
    if(!target||typeof target.animate!=="function")return null;
    const generation=sceneGeneration;
    if(reducedMotion())keyframes=[{opacity:.7},{opacity:1}];
    const animation=target.animate(keyframes,{duration:reducedMotion()?100:(options.duration??180),delay:reducedMotion()?0:(options.delay??0),easing:options.easing??"cubic-bezier(.2,.8,.25,1)",fill:"none"});
    ownedMotion.add(animation);
    animation.onfinish=()=>{ownedMotion.delete(animation);if(generation===sceneGeneration)options.finish?.()};
    animation.oncancel=()=>ownedMotion.delete(animation);
    return animation;
  }
  function stopOwnedMotion(){
    for(const animation of ownedMotion)animation.cancel();ownedMotion.clear();
    cancelAnimationFrame(geometryFrame);geometryFrame=0;
    $("#board")?.querySelectorAll("[data-retiring],.light-spark,.cell-flash").forEach(node=>node.remove());
  }
  function playSound(id){audioScope?.play(id)}
  function retireProxy(node){
    node.getAnimations?.({subtree:true}).forEach(animation=>animation.cancel());node.remove();
  }
  function sparkAt(cell,count=4,strong=false){
    const board=$("#board"),target=board.querySelector(`[data-cell="${cell}"]`);if(!target)return;
    const old=[...board.querySelectorAll(".light-spark")];old.slice(0,Math.max(0,old.length+count-18)).forEach(retireProxy);
    for(let i=0;i<count;i++){
      const spark=document.createElement("i"),angle=(i/count)*Math.PI*2-Math.PI/2,distance=strong?43:23;
      spark.className="light-spark";spark.setAttribute("aria-hidden","true");spark.style.left=(target.offsetLeft+target.offsetWidth/2)+"px";spark.style.top=(target.offsetTop+target.offsetHeight/2)+"px";
      board.append(spark);
      const animation=tween(spark,[{opacity:1,transform:"translate(-50%,-50%) scale(1)"},{opacity:0,transform:`translate(calc(-50% + ${Math.cos(angle)*distance}px),calc(-50% + ${Math.sin(angle)*distance}px)) rotate(90deg) scale(.35)`}],{duration:strong?540:300,finish:()=>spark.remove()});
      if(!animation)spark.remove();
    }
  }
  function acknowledge(cell){
    const target=$("#board").querySelector(`[data-cell="${cell}"]`);if(!target)return;
    target.querySelectorAll(".cell-flash").forEach(retireProxy);
    const flash=document.createElement("i");flash.className="cell-flash";flash.setAttribute("aria-hidden","true");target.append(flash);
    const animation=tween(flash,[{opacity:.8,transform:"scale(.72)"},{opacity:0,transform:"scale(1.05)"}],{duration:220,finish:()=>flash.remove()});if(!animation)flash.remove();
  }
  function drawBeam(result,animate=true){
    const board=$("#board"),ns="http://www.w3.org/2000/svg";
    let svg=board.querySelector(".beam-layer");
    if(!svg){svg=document.createElementNS(ns,"svg");svg.classList.add("beam-layer");svg.setAttribute("aria-hidden","true");board.append(svg)}
    svg.setAttribute("viewBox",`0 0 ${Math.max(1,board.clientWidth)} ${Math.max(1,board.clientHeight)}`);
    const centre=index=>{const cell=board.querySelector(`[data-cell="${index}"]`);return[cell.offsetLeft+cell.offsetWidth/2,cell.offsetTop+cell.offsetHeight/2]};
    let changed=false;
    result.paths.forEach((path,sourceIndex)=>{
      let group=svg.querySelector(`[data-source="${sourceIndex}"]`);
      if(!group){group=document.createElementNS(ns,"g");group.dataset.source=String(sourceIndex);group.style.setProperty("--beam-color",sourceIndex?"#91f4d8":"#ffe565");svg.append(group)}
      const delta=window.SUNBEAM_OPTICS.delta(previousPaths[sourceIndex],path),wanted=new Set(window.SUNBEAM_OPTICS.edges(path).map(edge=>edge.key));
      if(delta.added.length||delta.removed.length)changed=true;
      group.querySelectorAll(".beam-segment:not([data-retiring])").forEach(segment=>{
        if(wanted.has(segment.dataset.edge))return;
        segment.dataset.retiring="true";
        const exit=animate&&!reducedMotion()?tween(segment,[{opacity:1},{opacity:0}],{duration:120,finish:()=>segment.remove()}):null;
        if(!exit)segment.remove();
      });
      let freshIndex=0;
      for(const edge of window.SUNBEAM_OPTICS.edges(path)){
        let segment=group.querySelector(`.beam-segment[data-edge="${edge.key}"]:not([data-retiring])`);
        const fresh=!segment;
        if(fresh){segment=document.createElementNS(ns,"g");segment.classList.add("beam-segment");segment.dataset.edge=edge.key;group.append(segment);
          for(const className of ["beam-glow","beam-core"]){const line=document.createElementNS(ns,"polyline");line.setAttribute("class",className);segment.append(line)}
        }
        const a=centre(edge.from),b=centre(edge.to),length=Math.hypot(b[0]-a[0],b[1]-a[1]);
        for(const line of segment.children){
          line.setAttribute("points",a.join(",")+" "+b.join(","));
          line.style.strokeDasharray=String(length);line.style.strokeDashoffset="0";
          if(fresh&&animate&&length>0){
            const keyframes=reducedMotion()?[{opacity:.35},{opacity:1}]:[{strokeDashoffset:length,opacity:.45},{strokeDashoffset:0,opacity:1}];
            if(tween(line,keyframes,{duration:140,delay:Math.min(180,freshIndex*24),easing:"linear"}))beamAnimationsStarted++;
          }
        }
        if(fresh)freshIndex++;
      }
      let tip=group.querySelector(".beam-tip");if(!tip){tip=document.createElementNS(ns,"rect");tip.classList.add("beam-tip");group.append(tip)}
      const p=centre(path.end);tip.setAttribute("x",p[0]-5);tip.setAttribute("y",p[1]-5);tip.setAttribute("width","10");tip.setAttribute("height","10");tip.dataset.stop=path.stop;
      const previous=previousPaths[sourceIndex];
      if(animate&&previous&&(previous.end!==path.end||previous.stop!==path.stop))tween(tip,[{opacity:.2},{opacity:1},{opacity:.7}],{duration:240});
    });
    svg.querySelectorAll("g[data-source]").forEach(group=>{if(Number(group.dataset.source)>=result.paths.length)group.remove()});
    const retiring=[...svg.querySelectorAll("[data-retiring]")];retiring.slice(0,Math.max(0,retiring.length-72)).forEach(retireProxy);
    if(changed)beamRevision++;
    previousPaths=result.paths.map(path=>({...path,beam:[...path.beam]}));
  }
  function canPlay(){return document.body.dataset.screen==="battle"&&!roundWon&&!$("#result").open&&!$("#leave").open&&!$("#tutorialPanel").open}
  function remember(){history.push({angles:mirrors.map(item=>item.rot),gateStates:gates.map(item=>item.open),bloomStates:blooms.map(item=>item.awake),moves});if(history.length>256)history.shift()}
  function rotateMirror(control,cell,target,focusCell=null){
    if(!canPlay())return;
    const isGate=control.kind==="gate",next=target===undefined?(isGate?!control.open:(control.rot+1)%2):target;
    if(isGate?control.open===Boolean(next):control.rot===next)return;
    remember();hintedCell=null;hintedBloom=null;
    if(isGate)control.open=Boolean(next);else{control.rot=next;control.visualAngle+=90}
    moves++;
    const before=previousPaths.map(path=>({...path,beam:[...path.beam]})),lit=trace().beam,newBlooms=blooms.filter(bloom=>!bloom.awake&&lit.includes(bloom.cell));
    newBlooms.forEach(bloom=>bloom.awake=true);
    const result=trace(),same=before.every((path,index)=>path.beam.join(",")===result.paths[index]?.beam.join(","));
    const connected=result.paths.some((path,index)=>path.hit&&!before[index]?.hit);
    const cause=result.paths.find(path=>!path.hit)?.stop;
    feedbackKey=newBlooms.length?"bloomAwakened":connected?"rayConnected":same?"sameRoute":isGate&&control.open?"gateOpened":cause==="gate"?"gateBlocked":cause==="loop"?"beamLoop":cause==="edge"?"beamMiss":"mirrorTurned";
    renderBoard({kind:"action",result});acknowledge(control.cell);sparkAt(control.cell,3);
    for(const bloom of newBlooms){sparkAt(bloom.cell,7);const art=$("#board").querySelector(`[data-cell="${bloom.cell}"] .bloom-art`);tween(art,[{transform:"translateY(2px) scale(.7)",filter:"brightness(1.8)"},{transform:"translateY(-3px) scale(1.2)",filter:"brightness(1.2)"},{transform:"translateY(0) scale(1)",filter:"brightness(1)"}],{duration:360})}
    playSound(isGate?(control.open?"mechanism.unlock":"board.move"):"board.rotate");
    if(!result.hit){if(newBlooms.length)playSound("game.checkpoint");else if(connected)playSound("feedback.success")}
    checkComplete();
    if(focusCell!==null&&!roundWon)$("#board").querySelector(`[data-cell="${focusCell}"]`)?.focus({preventScroll:true});
  }
  function renderStatus(result){
    const status=$("#status");
    let goal=status.querySelector(".objective-line"),feedback=status.querySelector(".feedback-line");
    if(!goal){goal=document.createElement("span");goal.className="objective-line";feedback=document.createElement("span");feedback.className="feedback-line";status.replaceChildren(goal,feedback)}
    const connected=result.paths.filter(path=>path.hit).length,awake=blooms.filter(bloom=>bloom.awake).length;
    goal.textContent=t(blooms.length?"bloomObjective":"routeObjective",{done:awake,total:blooms.length,rays:connected,sources:result.paths.length})+" · "+t("turnCounter",{moves});
    let text=result.hit?t("complete"):hintedCell!==null?t(hintedBloom!==null?"bloomHint":gates.some(gate=>gate.cell===hintedCell)?"gateHint":"hintLocation",{row:Math.floor((hintedBloom??hintedCell)/6)+1,col:(hintedBloom??hintedCell)%6+1}):result.routeHit&&!blooms.every(bloom=>bloom.awake)?t("bloomNeeded"):t(feedbackKey|| (blooms.length?"bloomNext":"followBeam"));
    if(feedback.textContent!==text){feedback.textContent=text;feedback.title=text;tween(feedback,[{opacity:.4},{opacity:1}],{duration:140})}
    $("#beamState").textContent=result.hit?t("complete"):t("lightCounter",{rays:connected,sources:result.paths.length});
  }
  function renderBoard(options={}){
    if(!level)return;
    const result=options.result||trace(),map=new Map(mirrors.map(mirror=>[mirror.cell,mirror])),gateMap=new Map(gates.map(gate=>[gate.cell,gate])),bloomMap=new Map(blooms.map(bloom=>[bloom.cell,bloom])),sources=new Map(level.sources.map(source=>[source.cell,source])),board=$("#board");
    board.classList.toggle("solved",result.hit);board.setAttribute("aria-rowcount","6");board.setAttribute("aria-colcount","6");
    board.style.setProperty("--garden-charge",String(blooms.length?blooms.filter(bloom=>bloom.awake).length/blooms.length:result.paths.filter(path=>path.hit).length/result.paths.length));
    for(let i=0;i<36;i++){
      const mirror=map.get(i),gate=gateMap.get(i),bloom=bloomMap.get(i),row=Math.floor(i/6)+1,col=i%6+1,interactive=Boolean(mirror||gate);
      let cell=board.querySelector(`[data-cell="${i}"]`);
      if(!cell||cell.tagName!==(interactive?"BUTTON":"DIV")){const replacement=document.createElement(interactive?"button":"div");if(cell)cell.replaceWith(replacement);else board.append(replacement);cell=replacement}
      cell.dataset.cell=String(i);cell.setAttribute("role","gridcell");cell.setAttribute("aria-rowindex",String(row));cell.setAttribute("aria-colindex",String(col));
      cell.className="cell"+(sources.has(i)?" source":"")+(i===level.goal?" goal":"")+(mirror?" mirror":"")+(gate?" gate":"")+(bloom?" bloom":"")+(result.beam.includes(i)?" beam":"")+(result.hit&&i===level.goal?" hit":"")+((i===hintedCell||i===hintedBloom)?" hint-target":"");
      cell.dataset.lit=String(result.beam.includes(i));
      cell.toggleAttribute("aria-describedby",false);if(i===hintedCell||i===hintedBloom)cell.setAttribute("aria-describedby","status");
      if(interactive){cell.type="button";cell.disabled=roundWon;cell.setAttribute("aria-disabled",String(roundWon));cell.onclick=event=>rotateMirror(gate||mirror,cell,undefined,event.detail===0?i:null)}
      if(mirror){cell.dataset.rot=String(mirror.rot);cell.dataset.axis=mirror.rot===0?"/":"\\";cell.style.setProperty("--mirror-angle",mirror.visualAngle+"deg");cell.setAttribute("aria-label",t("mirrorLabel",{row,col,axis:mirror.rot===0?"/":"\\"}))}
      else if(gate){cell.dataset.kind="sun-gate";cell.dataset.open=String(gate.open);cell.setAttribute("aria-pressed",String(gate.open));cell.setAttribute("aria-label",t(gate.open?"gateLabelOpen":"gateLabelClosed",{row,col}))}
      else cell.setAttribute("aria-label",t(bloom?(bloom.awake?"bloomLabelAwake":"bloomLabelSleeping"):sources.has(i)?"kicker":i===level.goal?"complete":"cellLabel",{row,col}));
      if(sources.has(i))cell.dataset.direction=["↑","→","↓","←"][sources.get(i).startDir];
      let art=cell.querySelector(".bloom-art");
      if(bloom){if(!art){art=document.createElement("i");art.className="bloom-art";art.setAttribute("aria-hidden","true");cell.append(art)}cell.dataset.awake=String(bloom.awake)}
      else{art?.remove();delete cell.dataset.awake}
    }
    drawBeam(result,options.kind!=="locale"&&options.kind!=="resize");renderStatus(result);
    $("#undo").disabled=history.length===0||roundWon;$("#hint").disabled=roundWon;$("#reset").disabled=roundWon;
  }
  function revealResult(){
    clearTimeout(resultRevealTimer);const generation=sceneGeneration;
    resultRevealTimer=setTimeout(()=>{
      resultRevealTimer=0;if(generation!==sceneGeneration||document.body.dataset.screen!=="battle"||!roundWon)return;
      if($("#leave").open||document.hidden){resultPending=true;return}
      resultPending=false;if(!$("#result").open){__wpNotifyMeasurement();$("#result").showModal()}
    },620);
  }
  function checkComplete(){
    if(roundWon||!trace().hit)return;roundWon=true;
    if(selected+2>unlocked){unlocked=Math.min(31,selected+2);write(key,String(unlocked))}
    const bestKey="wp-sunbeam-bloom-v18-"+selected,prior=Number(read(bestKey));if(!prior||moves<prior)write(bestKey,String(moves));
    resultActionClaimed=false;["#resultStages","#retry","#next"].forEach(selector=>$(selector).disabled=false);$("#next").disabled=selected===29;
    $("#resultBody").textContent=t("resultBody",{n:selected+1,moves})+" "+t("mastery",{best:read(bestKey),hints:hintUses})+" "+t("challengeBudget",{moves,par:level.par});
    renderBoard({kind:"complete"});sparkAt(level.goal,12,true);acknowledge(level.goal);playSound("result.win");revealResult();
    __wpMeasurement.ended=true;__wpMeasurement.outcome="win";__wpMeasurement.screen=null;__wpNotifyMeasurement();
  }
  function claimResultAction(action){if(resultActionClaimed||!$("#result").open)return;resultActionClaimed=true;["#resultStages","#retry","#next"].forEach(selector=>$(selector).disabled=true);__wpNotifyMeasurement();$("#result").close();action()}
  function hint(){
    if(!canPlay())return;
    const path=trace().beam,gate=gates.find(item=>!item.open&&path.includes(item.cell))||gates.find(item=>!item.open);
    const choice=gate?{mirror:gate}:window.SUNBEAM_OPTICS.hintMirror(level,mirrors,blooms);if(!choice)return;
    hintedCell=choice.mirror.cell;hintedBloom=choice.bloomCell??null;hintUses++;
    renderBoard({kind:"hint"});acknowledge(hintedCell);if(hintedBloom!==null)acknowledge(hintedBloom);playSound("feedback.hint");
  }
  function undo(){
    if(!canPlay()||!history.length)return;clearTimeout(resultRevealTimer);resultRevealTimer=0;
    const previous=history.pop();mirrors.forEach((mirror,index)=>{mirror.rot=previous.angles[index];mirror.visualAngle=mirror.rot*90});gates.forEach((gate,index)=>gate.open=previous.gateStates[index]);blooms.forEach((bloom,index)=>bloom.awake=previous.bloomStates[index]);
    moves=previous.moves;hintedCell=null;hintedBloom=null;feedbackKey="undoDone";renderBoard({kind:"undo"});playSound("board.undo");
  }
  function installFeedback(){
    for(const id of ["leave","tutorialPanel"]){const dialog=$("#"+id);dialog.addEventListener("close",()=>{if(document.body.dataset.screen==="battle"&&resultPending)revealResult()})}
    $("#battle [data-back]").addEventListener("click",()=>{stopOwnedMotion();audioScope?.stop();if(resultRevealTimer){clearTimeout(resultRevealTimer);resultRevealTimer=0;resultPending=roundWon}});
    if(typeof ResizeObserver==="function")new ResizeObserver(()=>{
      if(document.body.dataset.screen!=="battle"||geometryFrame)return;const generation=sceneGeneration;
      geometryFrame=requestAnimationFrame(()=>{geometryFrame=0;if(generation===sceneGeneration&&document.body.dataset.screen==="battle"&&level)drawBeam(trace(),false)});
    }).observe($("#board"));
    document.addEventListener("visibilitychange",()=>{if(document.hidden){stopOwnedMotion();audioScope?.stop();if(resultRevealTimer){clearTimeout(resultRevealTimer);resultRevealTimer=0;resultPending=roundWon}}else if(resultPending&&document.body.dataset.screen==="battle"&&!$("#leave").open)revealResult()});
    window.addEventListener("pagehide",()=>{stopOwnedMotion();clearTimeout(resultRevealTimer);audioScope?.dispose()},{once:true});
    for(const button of document.querySelectorAll(".tools button")){button.addEventListener("click",()=>{if(!button.disabled)tween(button,[{filter:"brightness(.88)"},{filter:"brightness(1)"}],{duration:160})})}
  }
  function applyLocale(){document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.title=t("title")+" | WeightPlay";document.querySelectorAll("[data-t]").forEach(node=>node.textContent=t(node.dataset.t));document.querySelectorAll("[data-t-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.tAria)));document.querySelectorAll("[data-t-alt]").forEach(node=>node.setAttribute("alt",t(node.dataset.tAlt)));$("#locale").value=locale;if(!$("#stage").hidden)renderStages();if(!$("#battle").hidden)renderBoard({kind:"locale"})}
  codes.forEach(code=>{const option=document.createElement("option");option.value=code;option.textContent=window.SUNBEAM_LOCALES[code].label;$("#locale").append(option)});$("#locale").onchange=e=>{locale=e.target.value;write("wp-locale",locale);write("weightPlayLocale",locale);if(/^https?:$/.test(location.protocol)){const target=`/${segments[locale]}/games/animal-sunbeam-garden/`;if(location.pathname!==target){location.assign(target);return}}try{window.WonderI18n?.setLocale?.(locale)}catch{}applyLocale()};
  document.body.dataset.wpSceneWriter="sunbeam-game-v7";$("#start").onclick=()=>show("stage");$("#tutorialOpen").onclick=()=>(__wpNotifyMeasurement(), $("#tutorialPanel").showModal());$("#tutorialClose").onclick=()=>(__wpNotifyMeasurement(), $("#tutorialPanel").close());$("#stageGrid").addEventListener("wonder:stage-snap",event=>{if($("#stageGrid").dataset.wpStageCenterObserver==="manual")return;const index=Number(event.detail?.index);if(Number.isInteger(index)&&index>=0)selectStage(index)});$("#stage [data-back]").onclick=()=>show("main");$("#battle [data-back]").onclick=()=>(__wpNotifyMeasurement(), $("#leave").showModal());$("#leaveContinue").onclick=()=>(__wpNotifyMeasurement(), $("#leave").close());$("#leaveStage").onclick=()=>show("stage");$("#hint").onclick=hint;$("#undo").onclick=undo;$("#reset").onclick=()=>{if(canPlay()){__wpReplayStart(()=>startLevel(selected));feedbackKey="resetDone";renderStatus(trace())}};$("#resultStages").onclick=()=>claimResultAction(()=>{selected=Math.min(unlocked,30)-1;show("stage")});$("#retry").onclick=()=>claimResultAction(()=>__wpReplayStart(() => startLevel(selected)));$("#next").onclick=()=>claimResultAction(()=>startLevel(selected+1));installFeedback();applyLocale();show("main");
  window.sunbeamSnapshot=()=>({selected,moves,angles:mirrors.map(mirror=>mirror.rot),gates:gates.map(gate=>({cell:gate.cell,open:gate.open})),blooms:blooms.map(bloom=>({cell:bloom.cell,awake:bloom.awake})),hintedCell,hintedBloom,hintUses,history:history.length,unlocked,screen:document.body.dataset.screen,paths:level?trace().paths:[],beamRevision,beamAnimationsStarted,roundWon});
})();
