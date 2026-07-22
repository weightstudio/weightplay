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
