(()=>{
  "use strict";

  const battleLive=document.querySelector("#battleScreen .battle-live");
  const modalSpecs=[
    {node:document.querySelector("#helpModal"),title:"helpModalTitle",restore:true,escape:"#helpClose"},
    {node:document.querySelector("#leaveModal"),title:"leaveModalTitle",restore:true,escape:"#leaveContinue"},
    {node:document.querySelector("#resultModal"),title:"resultModalTitle",restore:false,escape:""}
  ];
  let activeSpec=null;
  let returnFocus=null;
  let resultDecisionCommitted=false;
  let resultWasOpen=false;
  const heldDecisionKeys=new Set();

  const visible=spec=>spec.node&&!spec.node.hidden;
  const focusable=modal=>[...modal.querySelectorAll('button:not(:disabled),a[href],select:not(:disabled),[tabindex]:not([tabindex="-1"])')]
    .filter(node=>node.getClientRects().length);

  function restoreBackground(){
    if(!battleLive)return;
    battleLive.inert=false;
    battleLive.removeAttribute("aria-hidden");
  }

  function isolateBackground(){
    if(!battleLive)return;
    battleLive.inert=true;
    battleLive.setAttribute("aria-hidden","true");
  }

  function syncOwnership(){
    const resultOpen=visible(modalSpecs[2]);
    if(resultOpen&&!resultWasOpen)resultDecisionCommitted=false;
    resultWasOpen=resultOpen;
    const next=modalSpecs.find(visible)||null;
    if(next===activeSpec)return;
    const previous=activeSpec;
    activeSpec=next;
    if(next){
      if(!previous)returnFocus=document.activeElement;
      isolateBackground();
      requestAnimationFrame(()=>{
        if(activeSpec!==next)return;
        const options=focusable(next.node);
        if(!next.node.contains(document.activeElement))options[0]?.focus({preventScroll:true});
      });
      return;
    }
    restoreBackground();
    const target=returnFocus;
    returnFocus=null;
    if(previous?.restore&&target?.isConnected&&target.getClientRects().length){
      requestAnimationFrame(()=>target.focus({preventScroll:true}));
    }
  }

  for(const spec of modalSpecs){
    if(!spec.node)continue;
    const heading=spec.node.querySelector("h2");
    if(heading){
      if(!heading.id)heading.id=spec.title;
      spec.node.setAttribute("aria-labelledby",heading.id);
    }
    spec.node.setAttribute("role","dialog");
    spec.node.setAttribute("aria-modal","true");
    new MutationObserver(syncOwnership).observe(spec.node,{attributes:true,attributeFilter:["hidden"]});
  }

  const decisionKey=event=>event.key==="Enter"||event.key===" "?event.key:"";
  const decisionTarget=target=>target instanceof Element&&Boolean(target.closest("#battleHelp,#battleBack,#helpModal button,#leaveModal button,#resultModal button"));

  document.addEventListener("keydown",event=>{
    const key=decisionKey(event);
    if(!key)return;
    const owned=Boolean(activeSpec)||decisionTarget(event.target);
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
    const action=event.target.closest?.("#resultModal button");
    if(!action)return;
    if(resultDecisionCommitted||modalSpecs[2].node?.hidden){
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    resultDecisionCommitted=true;
  },true);

  document.addEventListener("keydown",event=>{
    const spec=activeSpec;
    if(!spec)return;
    if(event.key==="Escape"){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(spec.escape)spec.node.querySelector(spec.escape)?.click();
      return;
    }
    if(event.key!=="Tab")return;
    const options=focusable(spec.node);
    if(!options.length){event.preventDefault();spec.node.focus({preventScroll:true});return;}
    const first=options[0],last=options.at(-1);
    if(event.shiftKey&&(document.activeElement===first||!spec.node.contains(document.activeElement))){
      event.preventDefault();
      last.focus({preventScroll:true});
    }else if(!event.shiftKey&&(document.activeElement===last||!spec.node.contains(document.activeElement))){
      event.preventDefault();
      first.focus({preventScroll:true});
    }
  },true);

  for(const eventName of ["pointerdown","pointerup","click"]){
    battleLive?.addEventListener(eventName,event=>{
      if(!activeSpec)return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },true);
  }

  syncOwnership();
})();
