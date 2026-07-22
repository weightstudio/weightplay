(()=>{
  "use strict";

  const rail=document.getElementById("stageRail");
  const status=document.getElementById("stageHint");
  if(!rail||!status)return;

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

  rail.addEventListener("click",event=>{
    const card=event.target.closest(".stage-card.locked.centered");
    if(!card)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    status.textContent=[...card.querySelectorAll("small,strong,span")]
      .map(node=>node.textContent.trim())
      .filter(Boolean)
      .join(" · ");
  },{capture:true});
})();
