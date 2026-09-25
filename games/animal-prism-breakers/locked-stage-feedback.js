(()=>{
  "use strict";

  const rail=document.getElementById("stageRail");
  const status=document.getElementById("stageHint");
  if(!rail||!status)return;

  status.setAttribute("role","status");
  status.setAttribute("aria-live","polite");
  status.setAttribute("aria-atomic","true");

  const enhanceLockedCards=()=>{
    rail.querySelectorAll(".stage-card.locked").forEach(card=>{
      card.setAttribute("aria-disabled","true");
      card.setAttribute("aria-describedby",status.id);
    });
  };

  new MutationObserver(enhanceLockedCards).observe(rail,{childList:true});
  enhanceLockedCards();

  const publishLockedFeedback=card=>{
    const message=[...card.querySelectorAll("small,strong,span")]
      .map(node=>node.textContent.trim())
      .filter(Boolean)
      .join(" · ");
    const hintCopy=status.querySelector("#stageHintCopy");
    if(hintCopy)hintCopy.textContent=message;else status.textContent=message;
  };

  rail.addEventListener("click",event=>{
    const card=event.target.closest(".stage-card.locked.centered");
    if(!card)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    publishLockedFeedback(card);
  },{capture:true});

  document.addEventListener("keydown",event=>{
    if(event.key!=="Enter"&&event.key!==" ")return;
    const card=event.target.closest?.("#stageRail .stage-card.locked.centered");
    if(!card)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    publishLockedFeedback(card);
  },{capture:true});
})();
