(()=>{
  "use strict";

  const result=document.getElementById("resultModal");
  if(!result)return;

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
  };

  new MutationObserver(settleTerminalFailure).observe(result,{attributes:true,attributeFilter:["hidden"]});
})();
