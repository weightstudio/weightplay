/** Pure presentation math. Never changes a simulation timer, hit, charge or target. */
export const VISUALS=Object.freeze({
  floor:'#14282e',board:'#203a40',frame:'#37545a',belt:'#2d4c55',slat:'#67858b',
  projectileSize:.29,trailWidth:.13,flightMin:.16,flightMax:.25,effectLife:.62,maxEffects:48,
});
export function shotFrame(shot,reducedMotion=false){
  const dx=shot.tx-shot.x,dz=shot.tz-shot.z;
  const flight=reducedMotion ? .12 : Math.min(VISUALS.flightMax,VISUALS.flightMin+Math.hypot(dx,dz)*.007);
  const t=Math.max(0,Math.min(1,shot.age/flight));
  return {x:shot.x+dx*t,z:shot.z+dz*t,y:1.05+((shot.ty??.85)-1.05)*t+(reducedMotion?0:Math.sin(t*Math.PI)*.12),
    progress:t,impact:shot.age>=flight,burst:Math.max(0,(shot.age-flight)/(VISUALS.effectLife-flight)),flight};
}
export function launchScale(ageTicks,reducedMotion=false){
  if(reducedMotion)return 1;
  const t=Math.max(0,Math.min(1,ageTicks/16));
  return .72+.28*t+Math.sin(t*Math.PI)*.12;
}
