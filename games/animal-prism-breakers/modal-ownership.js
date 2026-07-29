(()=>{
  "use strict";

  const battleLive=document.querySelector("#battleScreen .battle-live");
  const specs=[
    {node:document.querySelector("#helpModal"),title:"helpModalTitle",restore:true,escape:"#helpClose"},
    {node:document.querySelector("#leaveModal"),title:"leaveModalTitle",restore:true,escape:"#leaveContinue"},
    {node:document.querySelector("#pauseModal"),title:"pauseTitle",restore:true,escape:"#pauseResume"},
    {node:document.querySelector("#resultModal"),title:"resultModalTitle",restore:false,escape:""}
  ];
  let active=null;
  let returnFocus=null;
  let pendingOpener=null;
  let resultDecisionCommitted=false;
  let resultWasOpen=false;
  const heldDecisionKeys=new Set();

  const visible=spec=>spec.node&&!spec.node.hidden;
  const actions=modal=>[...modal.querySelectorAll('button:not(:disabled),a[href],select:not(:disabled),[tabindex]:not([tabindex="-1"])')]
    .filter(node=>node.getClientRects().length);

  function setBattleCovered(covered){
    if(!battleLive)return;
    battleLive.inert=covered;
    if(covered)battleLive.setAttribute("aria-hidden","true");
    else battleLive.removeAttribute("aria-hidden");
  }

  function sync(){
    const resultOpen=visible(specs[3]);
    if(resultOpen&&!resultWasOpen)resultDecisionCommitted=false;
    resultWasOpen=resultOpen;
    const next=specs.find(visible)||null;
    if(next===active)return;
    const previous=active;
    active=next;
    if(next){
      if(!previous){
        returnFocus=pendingOpener?.isConnected?pendingOpener:document.activeElement;
        pendingOpener=null;
      }
      setBattleCovered(true);
      requestAnimationFrame(()=>{
        if(active!==next||next.node.contains(document.activeElement))return;
        actions(next.node)[0]?.focus({preventScroll:true});
      });
      return;
    }
    setBattleCovered(false);
    const target=returnFocus;
    returnFocus=null;
    pendingOpener=null;
    if(previous?.restore&&target?.isConnected&&target.getClientRects().length){
      requestAnimationFrame(()=>target.focus({preventScroll:true}));
    }
  }

  for(const spec of specs){
    if(!spec.node)continue;
    const heading=spec.node.querySelector("h2");
    if(heading){
      if(!heading.id)heading.id=spec.title;
      spec.node.setAttribute("aria-labelledby",heading.id);
    }
    spec.node.setAttribute("role","dialog");
    spec.node.setAttribute("aria-modal","true");
    new MutationObserver(sync).observe(spec.node,{attributes:true,attributeFilter:["hidden"]});
  }

  document.addEventListener("click",event=>{
    const opener=event.target.closest?.("#battleHelp,#battleBack,#breakerPause");
    if(opener)pendingOpener=opener;
    const resultAction=event.target.closest?.("#resultModal button");
    if(!resultAction)return;
    if(resultDecisionCommitted||specs[3].node?.hidden){
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    resultDecisionCommitted=true;
  },true);

  const decisionKey=event=>event.key==="Enter"||event.key===" "?event.key:"";
  const decisionTarget=target=>target instanceof Element&&Boolean(target.closest("#battleHelp,#battleBack,#breakerPause,#helpModal button,#leaveModal button,#pauseModal button,#resultModal button"));

  document.addEventListener("keydown",event=>{
    const key=decisionKey(event);
    if(!key)return;
    const owned=Boolean(active)||decisionTarget(event.target);
    if(!owned)return;
    if(heldDecisionKeys.has(key)){
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    heldDecisionKeys.add(key);
  },true);

  document.addEventListener("keyup",event=>{
    const key=decisionKey(event);
    if(key)heldDecisionKeys.delete(key);
  },true);
  window.addEventListener("blur",()=>heldDecisionKeys.clear());
  document.addEventListener("visibilitychange",()=>{if(document.hidden)heldDecisionKeys.clear();});

  document.addEventListener("keydown",event=>{
    if(!active)return;
    if(event.key==="Escape"){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(active.escape)active.node.querySelector(active.escape)?.click();
      return;
    }
    if(event.key!=="Tab")return;
    const available=actions(active.node);
    if(!available.length){event.preventDefault();active.node.focus({preventScroll:true});return;}
    const first=available[0],last=available.at(-1);
    if(event.shiftKey&&(document.activeElement===first||!active.node.contains(document.activeElement))){
      event.preventDefault();
      last.focus({preventScroll:true});
    }else if(!event.shiftKey&&(document.activeElement===last||!active.node.contains(document.activeElement))){
      event.preventDefault();
      first.focus({preventScroll:true});
    }
  },true);

  for(const eventName of ["pointerdown","pointerup","click"]){
    battleLive?.addEventListener(eventName,event=>{
      if(!active)return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },true);
  }

  sync();
})();

(()=>{
  const $=selector=>document.querySelector(selector);
  let settlementToken=0;
  function settleNavigationFocus(screen,targetSelector,recoverableSelector=targetSelector){
    const token=++settlementToken;
    let observer=null,stopTimer=0;
    const settle=()=>{
      if(token!==settlementToken||document.body.dataset.screen!==screen){
        observer?.disconnect();clearTimeout(stopTimer);return;
      }
      const target=$(targetSelector);
      if(!target)return;
      const active=document.activeElement;
      const visibleOwner=active&&active!==document.body&&active.getClientRects().length>0;
      if(visibleOwner&&active!==target&&!active.matches(recoverableSelector))return;
      target.focus({preventScroll:true});
    };
    settle();requestAnimationFrame(settle);
    observer=new MutationObserver(settle);
    observer.observe(document.body,{attributes:true,childList:true,subtree:true});
    [80,400,1000].forEach(delay=>setTimeout(settle,delay));
    stopTimer=setTimeout(()=>observer.disconnect(),1600);
  }
  $("#start")?.addEventListener("click",()=>settleNavigationFocus("stage",'.stage-card.centered[aria-current="true"]',".stage-card"));
  $("#stageBack")?.addEventListener("click",()=>settleNavigationFocus("main","#start"));
  ["#leaveStage","#resultStage"].forEach(selector=>$(selector)?.addEventListener("click",()=>settleNavigationFocus("stage",'.stage-card.centered[aria-current="true"]',".stage-card")));
})();

(()=>{
  const arena=document.querySelector("#arena");
  if(!arena)return;
  arena.tabIndex=0;
  arena.setAttribute("aria-keyshortcuts","ArrowLeft ArrowRight A D Space");
  const installKeyDiscovery=()=>{
    if(document.querySelector(".key-discovery"))return true;
    const target=document.querySelector(".game-info-systems");
    if(!target)return false;
    const keys=document.createElement("p");
    keys.className="key-discovery";
    keys.setAttribute("aria-hidden","true");
    keys.innerHTML="<kbd>&larr;</kbd><kbd>&rarr;</kbd><span>/</span><kbd>A</kbd><kbd>D</kbd>";
    target.append(keys);
    return true;
  };
  let discoveryAttempts=0;
  const discoveryTimer=setInterval(()=>{
    discoveryAttempts+=1;
    if(installKeyDiscovery()||discoveryAttempts>=32)clearInterval(discoveryTimer);
  },250);
  installKeyDiscovery();
  const movementKeys=new Set(["ArrowLeft","ArrowRight","a","d"]);
  const ownsKeyboard=event=>event.target===arena;

  document.addEventListener("keydown",event=>{
    if(document.body.dataset.screen!=="battle"||!movementKeys.has(event.key))return;
    if(!ownsKeyboard(event))event.stopImmediatePropagation();
  },true);

  arena.addEventListener("pointerdown",()=>arena.focus({preventScroll:true}));
  document.addEventListener("click",event=>{
    if(event.target.closest?.("#launchBall"))arena.focus({preventScroll:true});
  },true);
})();
