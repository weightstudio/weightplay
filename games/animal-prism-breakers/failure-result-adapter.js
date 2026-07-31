(()=>{
  "use strict";

  const result=document.getElementById("resultModal");
  if(!result)return;
  const resultStage=document.getElementById("resultStage");
  const next=document.getElementById("next");
  const retry=document.getElementById("retry");
  const actions=result.querySelector(".modal-actions");
  const feedback=document.getElementById("feedback");
  const resultText=document.getElementById("resultText");
  let lastMissSide=null;

  const missCue=()=>lastMissSide&&window.PrismBreakersLocale?.miss?.(lastMissSide);

  window.addEventListener("weightplay:breaker-orb-miss",event=>{
    const detail=event.detail;
    if(detail?.gameId!=="animal-prism-breakers"||detail.stage!==1)return;
    lastMissSide=detail.ballX<detail.paddleX?"left":"right";
    queueMicrotask(()=>{
      const cue=missCue();
      if(cue&&feedback)feedback.textContent=cue;
      if(cue&&detail.livesAfter===0&&resultText)resultText.textContent=cue;
    });
  });

  const settleVersion4Actions=()=>{
    if(result.hidden||!resultStage||!next||!retry||!actions)return;
    actions.append(resultStage,next,retry);
    const state=window.__blockTrilogyTest?.getState?.();
    const canContinue=Boolean(!next.hidden&&state?.engine?.lives>0&&state?.selected<30);
    next.hidden=false;
    next.disabled=!canContinue;
    next.setAttribute("aria-disabled",String(!canContinue));
    resultStage.classList.toggle("primary",!canContinue);
    next.classList.toggle("primary",canContinue);
    retry.classList.remove("primary");
    setTimeout(()=>{
      if(!result.hidden)(canContinue?next:resultStage).focus({preventScroll:true});
    },40);
  };

  const settleTerminalFailure=()=>{
    if(result.hidden)return;
    const state=window.__blockTrilogyTest?.getState?.();
    const engine=state?.engine;
    if(state?.kind!=="breaker"||engine?.lives!==0)return;
    const values={statA:engine.score,statC:engine.lives,resultA:engine.score,resultB:engine.bestCombo,resultC:engine.lives};
    for(const [id,value] of Object.entries(values)){
      const node=document.getElementById(id);
      if(node)node.textContent=String(value);
    }
    const cue=missCue();
    if(state.selected===1&&cue&&resultText)resultText.textContent=cue;
    settleVersion4Actions();
  };

  new MutationObserver(()=>{
    settleTerminalFailure();
    settleVersion4Actions();
  }).observe(result,{attributes:true,attributeFilter:["hidden"]});
})();
