(()=>{
  "use strict";
  const TOTAL=30,POOL=9,clamp=(value,min=1,max=TOTAL)=>Math.max(min,Math.min(max,value));
  let api=null,cards=[],windowStart=1,settleRaf=0,restore=()=>{};
  const desired=stage=>clamp(stage-Math.floor(POOL/2),1,TOTAL-POOL+1);
  function createCard(poolIndex){const button=document.createElement("button");button.type="button";button.className="stage-card";button.dataset.wpStagePoolNode=String(poolIndex+1);button.innerHTML="<span></span><strong></strong><b></b><small></small>";return button}
  function bind(button,stageNumber){
    const stage=api.stages[stageNumber-1],locked=stageNumber>api.save.unlocked,stars=Number(api.save.stars[stageNumber])||0,selected=stageNumber===api.getSelected();
    button.dataset.stage=String(stageNumber);button.dataset.index=String(stageNumber-1);button.dataset.stageIndex=String(stageNumber-1);button.setAttribute("aria-posinset",String(stageNumber));button.setAttribute("aria-setsize",String(TOTAL));button.setAttribute("aria-disabled",String(locked));
    button.classList.toggle("locked",locked);button.classList.toggle("centered",selected);button.classList.toggle("wp-stage-centered",selected);button.tabIndex=selected?0:-1;if(selected)button.setAttribute("aria-current","true");else button.removeAttribute("aria-current");
    button.querySelector("span").textContent=locked?api.t("lockedBadge"):api.chapterName(stage);button.querySelector("strong").textContent=String(stageNumber);button.querySelector("b").textContent=`${stage.boss?"\u{1F451} ":""}${api.t("waveLabel",{wave:0,total:stage.waves})}`;button.querySelector("small").textContent=`${"\u2605".repeat(stars)}${"\u2606".repeat(3-stars)}`;
  }
  const sync=()=>cards.forEach(card=>bind(card,Number(card.dataset.stage)));
  // DOMRect/pointer distances are physical pixels; scrollLeft is in unscaled CSS pixels.
  const renderScale=()=>{const rail=api.rail,width=rail.getBoundingClientRect().width,logicalWidth=rail.offsetWidth||rail.clientWidth;return width>0&&logicalWidth>0?width/logicalWidth:1};
  function moveWindow(next){const rail=api.rail,target=clamp(next,1,TOTAL-POOL+1);let recycled=0;while(windowStart<target){const card=rail.firstElementChild,anchor=card?.nextElementSibling,before=anchor?.getBoundingClientRect().left;windowStart++;rail.append(card);bind(card,windowStart+POOL-1);const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=(after-before)/renderScale();recycled++}while(windowStart>target){const card=rail.lastElementChild,anchor=card?.previousElementSibling,before=anchor?.getBoundingClientRect().left;windowStart--;rail.prepend(card);bind(card,windowStart);const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=(after-before)/renderScale();recycled++}cards=[...rail.children];rail.dataset.wpStageWindowStart=String(windowStart);rail.dataset.wpStageWindowEnd=String(windowStart+POOL-1);if(recycled)rail.dataset.wpStageRecycleCount=String(Number(rail.dataset.wpStageRecycleCount||0)+recycled);return recycled}
  function geometry(){const rail=api.rail,first=cards[0]?.getBoundingClientRect(),second=cards[1]?.getBoundingClientRect(),box=rail.getBoundingClientRect(),delta=first&&second?(second.left+second.width/2)-(first.left+first.width/2):0;return{rail,center:box.left+box.width/2,pitch:Math.abs(delta)||(first?.width||264)+16,orientation:Math.sign(delta)||1}}
  function nearest(){const center=geometry().center;return cards.reduce((best,card)=>{const box=card.getBoundingClientRect(),distance=Math.abs(box.left+box.width/2-center);return!best||distance<best.distance?{card,distance}:best},null)?.card}
  function logical(){const card=nearest();if(!card)return api.getSelected();const stage=Number(card.dataset.stage),box=card.getBoundingClientRect(),g=geometry();return clamp(stage+(g.center-(box.left+box.width/2))/(g.pitch*g.orientation))}
  function position(value){const logicalStage=clamp(value),anchor=Math.round(logicalStage);if(moveWindow(desired(anchor)))sync();const card=api.rail.querySelector(`[data-stage="${anchor}"]`);if(!card)return logicalStage;card.scrollIntoView({behavior:"auto",block:"nearest",inline:"center"});const g=geometry(),fraction=logicalStage-anchor;if(Math.abs(fraction)>.0001)g.rail.scrollLeft+=fraction*g.orientation*g.pitch/renderScale();g.rail.dataset.wpStageDragLogical=logicalStage.toFixed(4);return logicalStage}
  function select(stage,focus=false){stage=clamp(stage);api.setSelected(stage);moveWindow(desired(stage));sync();position(stage);sync();if(focus)api.rail.querySelector(`[data-stage="${stage}"]`)?.focus({preventScroll:true})}
  function install(){
    const rail=api.rail;if(rail.dataset.wpStageVirtualDrag==="true")return;rail.dataset.wpStageVirtualDrag="true";rail.dataset.wpStageCenterObserver="manual";let pointerId=null,startX=0,lastX=0,dragLogical=1,moved=false,suppressClick=false,suppressClickTimer=0;
    const restoreRail=()=>{delete rail.dataset.wpStageSettling;delete rail.dataset.wpDragDown;rail.classList.remove("wp-stage-dragging");rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type")};restore=()=>{pointerId=null;moved=false;suppressClick=false;clearTimeout(suppressClickTimer);suppressClickTimer=0;restoreRail()};
    rail.addEventListener("pointerdown",event=>{if(pointerId!==null||event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;cancelAnimationFrame(settleRaf);settleRaf=0;pointerId=event.pointerId;startX=lastX=event.clientX;dragLogical=logical();moved=false;rail.dataset.wpDragDown="1";rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");event.stopImmediatePropagation()},true);
    document.addEventListener("pointermove",event=>{if(event.pointerId!==pointerId)return;const delta=event.clientX-lastX;lastX=event.clientX;if(!moved&&Math.abs(event.clientX-startX)>4){moved=true;rail.classList.add("wp-stage-dragging")}if(moved){if(event.cancelable)event.preventDefault();const g=geometry();dragLogical=position(dragLogical-delta/(g.pitch*g.orientation))}event.stopImmediatePropagation()},true);
    const finish=event=>{if(pointerId===null||(event.pointerId!==undefined&&event.pointerId!==pointerId))return;pointerId=null;delete rail.dataset.wpDragDown;if(moved){if(event.cancelable)event.preventDefault();const from=dragLogical,target=clamp(Math.round(from)),started=performance.now(),duration=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches?0:(Number(rail.dataset.wpStageSettleDuration)||340);api.setSelected(target);sync();rail.dataset.wpStageSettling="true";const settle=now=>{const progress=clamp((now-started)/duration,0,1),eased=progress*progress*(3-2*progress);position(from+(target-from)*eased);if(progress<1)settleRaf=requestAnimationFrame(settle);else{settleRaf=0;position(target);sync();restoreRail()}};if(duration===0){position(target);sync();restoreRail()}else settleRaf=requestAnimationFrame(settle);suppressClick=true;clearTimeout(suppressClickTimer);suppressClickTimer=setTimeout(()=>{suppressClick=false;suppressClickTimer=0},0)}else restoreRail();moved=false;event.stopImmediatePropagation()};document.addEventListener("pointerup",finish,true);document.addEventListener("pointercancel",finish,true);
    rail.addEventListener("click",event=>{const card=event.target.closest?.(".stage-card"),stage=Number(card?.dataset.stage);if(!stage)return;event.preventDefault();event.stopImmediatePropagation();if(suppressClick){suppressClick=false;return}select(stage,true);if(stage>api.save.unlocked){api.announce();return}api.enter(stage,event)},true);
    rail.addEventListener("keydown",event=>{const current=api.getSelected(),rtl=getComputedStyle(rail).direction==="rtl",step=event.key==="ArrowRight"?(rtl?-1:1):event.key==="ArrowLeft"?(rtl?1:-1):0,target=step?clamp(current+step):event.key==="Home"?1:event.key==="End"?TOTAL:0;if(!target)return;event.preventDefault();event.stopImmediatePropagation();select(target,true)},true);
  }
  function cancel(){cancelAnimationFrame(settleRaf);settleRaf=0;restore()}
  window.addEventListener("blur",cancel);
  window.addEventListener("pagehide",cancel);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)cancel()});
  window.PrismBattalionStageRenderer={render(nextApi){api=nextApi;const rail=api.rail;if(!cards.length||cards.some(card=>card.parentElement!==rail)){rail.replaceChildren();cards=Array.from({length:POOL},(_,index)=>createCard(index));cards.forEach(card=>rail.append(card));windowStart=desired(api.getSelected());cards.forEach((card,index)=>bind(card,windowStart+index));rail.dataset.wpStageVirtualized="bounded-recycle";rail.dataset.wpStagePoolSize=String(POOL);rail.dataset.wpStageTotal=String(TOTAL);rail.dataset.wpStageRecycleCount="0";install()}select(api.getSelected());return true},select,cancel};
})();

/* Game-owned content motion only. The shared Interface 7 frame still owns
   navigation, geometry, focus, preferences and every scene root. Bundling here
   keeps the same optional presentation behavior on all existing locale routes. */
(()=>{
  "use strict";
  const body=document.body;
  if(body?.dataset.gameId!=="animal-prism-battalion"||window.PrismBattalionMotion)return;
  const preference=window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const style=document.createElement("style");
  style.dataset.wpPrismMotion="content-only";
  style.textContent=`
    @keyframes prism-content-reveal{from{opacity:.72}to{opacity:1}}
    @keyframes prism-charge-aura{0%,100%{box-shadow:0 0 12px #ffd55c66}50%{box-shadow:0 0 24px #ffd55caa}}
    body[data-game-id="animal-prism-battalion"] #mainGroup:not([hidden]) :is(.poster,.main-copy),
    body[data-game-id="animal-prism-battalion"] #stage:not([hidden]) :is(.missions-tab,.lab-tab):not([hidden]),
    body[data-game-id="animal-prism-battalion"] #battle:not([hidden]) #battleLive:not([hidden]),
    body[data-game-id="animal-prism-battalion"] .modal-layer:not([hidden])>:is(.dialog-card,.result-card){animation:prism-content-reveal 240ms ease-out}
    body[data-game-id="animal-prism-battalion"] #result:not([hidden]) .result-stats>span{animation:prism-content-reveal 280ms ease-out backwards}
    body[data-game-id="animal-prism-battalion"] #result:not([hidden]) .result-stats>span:nth-child(2){animation-delay:45ms}
    body[data-game-id="animal-prism-battalion"] #result:not([hidden]) .result-stats>span:nth-child(3){animation-delay:90ms}
    body[data-game-id="animal-prism-battalion"] :is(.stage-card,.upgrade,#overdrive){transition:border-color 160ms ease-out,box-shadow 180ms ease-out}
    body[data-game-id="animal-prism-battalion"] #overdrive.ready{animation:prism-charge-aura 1400ms ease-in-out infinite}
    body[data-game-id="animal-prism-battalion"][data-prism-motion-paused] :is(.poster,.main-copy,.missions-tab,.lab-tab,#battleLive,.dialog-card,.result-card,.result-stats>span,#overdrive.ready,.objective-row.first-switch-cue){animation-play-state:paused}
    @media(prefers-reduced-motion:reduce){
      body[data-game-id="animal-prism-battalion"] :is(.poster,.main-copy,.missions-tab,.lab-tab,#battleLive,.dialog-card,.result-card,.result-stats>span,#overdrive.ready,.objective-row.first-switch-cue){animation:none!important}
      body[data-game-id="animal-prism-battalion"] :is(.stage-card,.upgrade,#overdrive){transition:none!important}
    }
  `;
  document.head.append(style);
  const active=new Map(),watched=["coreValue","feedback","labFeedback"].map(id=>document.getElementById(id)).filter(Boolean);
  const previous=new Map(watched.map(node=>[node,node.textContent]));
  let disposed=false;
  const visible=node=>!document.hidden&&!preference?.matches&&!node.closest("[hidden],[inert]");
  function cancelActive(){for(const animation of active.values())animation.cancel();active.clear()}
  function play(node,keyframes){
    if(disposed||!node?.animate||!visible(node))return;
    active.get(node)?.cancel();
    const animation=node.animate(keyframes,{duration:240,easing:"ease-out"});
    active.set(node,animation);
    const release=()=>{if(active.get(node)===animation)active.delete(node)};
    animation.finished.then(release,release);
  }
  // Observe only three small, locale-owned status nodes, never the game tree.
  const observer=new MutationObserver(()=>{
    for(const node of watched){
      const value=node.textContent,before=previous.get(node);
      if(value===before)continue;
      previous.set(node,value);
      if(!value||!visible(node))continue;
      if(node.id==="coreValue"){
        const health=Number(value.split("/")[0]),oldHealth=Number(String(before).split("/")[0]);
        if(Number.isFinite(health)&&Number.isFinite(oldHealth)&&health<oldHealth)
          play(node.parentElement,[{boxShadow:"inset 0 0 0 2px #ff647e"},{boxShadow:"inset 0 0 0 0px transparent"}]);
      }else play(node,[{opacity:.65},{opacity:1}]);
    }
  });
  for(const node of watched)observer.observe(node,{childList:true,characterData:true,subtree:true});
  function syncVisibility(){
    body.toggleAttribute("data-prism-motion-paused",document.hidden||Boolean(preference?.matches));
    if(document.hidden||preference?.matches)cancelActive();
  }
  function dispose(){
    if(disposed)return;
    disposed=true;observer.disconnect();cancelActive();style.remove();
    body.removeAttribute("data-prism-motion-paused");
    document.removeEventListener("visibilitychange",syncVisibility);
    window.removeEventListener("weightplay:shell-sync",cancelActive);
    window.removeEventListener("pagehide",cancelActive);
    preference?.removeEventListener?.("change",syncVisibility);
    delete window.PrismBattalionMotion;
  }
  document.addEventListener("visibilitychange",syncVisibility);
  window.addEventListener("weightplay:shell-sync",cancelActive);
  window.addEventListener("pagehide",cancelActive);
  preference?.addEventListener?.("change",syncVisibility);
  window.PrismBattalionMotion={dispose};
  syncVisibility();
})();
