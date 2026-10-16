(function(root){
  "use strict";

  function resolve({routeIndex,aligned,level,impactSpeed,spill}){
    if(!aligned)return "badLanding";
    if(!level)return "tilted";
    if(spill>=98)return "spilled";
    if(impactSpeed>.22)return routeIndex===0?"roughLanding":"hardLanding";
    return "landed";
  }

  const rules=Object.freeze({resolve});
  if(typeof module==="object"&&module.exports)module.exports=rules;
  else root.FlyingTramLandingRules=rules;
})(globalThis);
