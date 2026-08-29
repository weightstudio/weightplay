(()=>{
  "use strict";
  const header=document.querySelector("#battle .scene-header"),help=document.querySelector("#battleHelp"),hint=document.querySelector("#hint");
  if(!header||!help)return;
  const syncHeaderGrid=()=>{const compact=window.matchMedia("(max-width:680px)").matches;header.style.gridTemplateColumns=compact?"70px minmax(0,1fr) minmax(0,100px) 48px":"112px minmax(0,1fr) minmax(0,112px) 48px";help.style.justifySelf="end"};
  const label=document.querySelector("#tutorialTitle")?.textContent?.trim()||"How to play";
  help.setAttribute("aria-label",label);help.title=label;help.addEventListener("click",()=>document.querySelector("#tutorialPanel")?.showModal());
  if(hint)hint.dataset.wpPrimaryAction="hint";
  syncHeaderGrid();window.addEventListener("resize",syncHeaderGrid,{passive:true});
})();
