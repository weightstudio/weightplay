(()=>{
  "use strict";

  const battleLive=document.querySelector("#battleScreen .battle-live");
  const specs=[
    {node:document.querySelector("#helpModal"),title:"helpModalTitle",restore:true,escape:"#helpClose"},
    {node:document.querySelector("#leaveModal"),title:"leaveModalTitle",restore:true,escape:"#leaveContinue"},
    {node:document.querySelector("#resultModal"),title:"resultModalTitle",restore:false,escape:""}
  ];
  let active=null;
  let returnFocus=null;
  let resultDecisionCommitted=false;
  let resultWasOpen=false;
  const heldDecisionKeys=new Set();
  const stageRail=document.querySelector("#stageRail");

  const visible=spec=>spec.node&&!spec.node.hidden;
  const actions=modal=>[...modal.querySelectorAll('button:not(:disabled),a[href],select:not(:disabled),[tabindex]:not([tabindex="-1"])')]
    .filter(node=>node.getClientRects().length);

  function setBattleCovered(covered){
    if(!battleLive)return;
    battleLive.inert=covered;
    if(covered)battleLive.setAttribute("aria-hidden","true");
    else battleLive.removeAttribute("aria-hidden");
  }

  function stageCards(){
    return stageRail?[...stageRail.querySelectorAll(".stage-card")]:[];
  }

  function syncStageTabOwner(preferred=null){
    const cards=stageCards();
    if(!cards.length)return;
    const owner=preferred&&cards.includes(preferred)
      ?preferred
      :cards.find(card=>card.getAttribute("aria-current")==="true"||card.classList.contains("centered"))||cards[0];
    cards.forEach(card=>{card.tabIndex=card===owner?0:-1;});
  }

  stageRail?.addEventListener("keydown",event=>{
    const card=event.target.closest?.(".stage-card");
    if(!card)return;
    const cards=stageCards();
    const current=cards.indexOf(card);
    if(current<0)return;
    const rtl=getComputedStyle(stageRail).direction==="rtl";
    const delta=event.key==="ArrowLeft"?(rtl?1:-1):event.key==="ArrowRight"?(rtl?-1:1):0;
    let target=null;
    if(delta)target=cards[Math.max(0,Math.min(cards.length-1,current+delta))];
    else if(event.key==="Home")target=cards[0];
    else if(event.key==="End")target=cards.at(-1);
    if(!target)return;
    event.preventDefault();
    target.click();
    syncStageTabOwner(target);
    target.focus({preventScroll:true});
  },true);

  stageRail?.addEventListener("focusin",event=>{
    const card=event.target.closest?.(".stage-card");
    if(!card)return;
    if(card.getAttribute("aria-current")!=="true")card.click();
    syncStageTabOwner(card);
  });

  if(stageRail){
    new MutationObserver(()=>syncStageTabOwner()).observe(stageRail,{childList:true,subtree:true,attributes:true,attributeFilter:["aria-current","class"]});
    syncStageTabOwner();
  }

  function sync(){
    const resultOpen=visible(specs[2]);
    if(resultOpen&&!resultWasOpen)resultDecisionCommitted=false;
    resultWasOpen=resultOpen;
    const next=specs.find(visible)||null;
    if(next===active)return;
    const previous=active;
    active=next;
    if(next){
      if(!previous)returnFocus=document.activeElement;
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

  const decisionKey=event=>event.key==="Enter"||event.key===" "?event.key:"";
  const decisionTarget=target=>target instanceof Element&&Boolean(target.closest("#battleHelp,#battleBack,#helpModal button,#leaveModal button,#resultModal button"));

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

  document.addEventListener("click",event=>{
    const resultAction=event.target.closest?.("#resultModal button");
    if(!resultAction)return;
    if(resultDecisionCommitted||specs[2].node?.hidden){
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    resultDecisionCommitted=true;
  },true);

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
