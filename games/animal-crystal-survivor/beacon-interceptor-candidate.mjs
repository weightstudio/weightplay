// Unconnected Stage 51 draft. The host owns spawning, damage, removal and
// swept collision; a cue commits once to the carrier's sampled position.
const finitePoint=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
export function makeInterceptorCue(id,carrier){
  if(typeof id!=='string'||!id||!finitePoint(carrier)||carrier.x<42||carrier.x>982||carrier.y<42||carrier.y>1718)throw new TypeError('INVALID_INTERCEPT_CARRIER');
  const x1=carrier.x<=512?Math.min(982,carrier.x+280):Math.max(42,carrier.x-280);
  return {id,phase:'warning',remaining:2.2,progress:0,width:58,x1,y1:carrier.y,x2:carrier.x,y2:carrier.y};
}
export function stepInterceptorCue(cue,dt){
  if(!cue||![cue.x1,cue.y1,cue.x2,cue.y2,cue.remaining,cue.progress].every(Number.isFinite)||
    !Number.isFinite(dt)||dt<0||dt>.25||cue.remaining<0||cue.progress<0||cue.progress>1)throw new RangeError('INVALID_INTERCEPT_STEP');
  if(cue.phase==='warning'){const remaining=Math.max(0,cue.remaining-dt);return {cue:{...cue,remaining,phase:remaining<=1e-9?'active':'warning'},x:cue.x1,y:cue.y1}}
  if(cue.phase==='active'){const raw=cue.progress+dt/.65,progress=raw>=1-1e-9?1:raw;return {cue:{...cue,progress,phase:progress===1?'done':'active'},x:cue.x1+(cue.x2-cue.x1)*progress,y:cue.y1+(cue.y2-cue.y1)*progress}}
  throw new RangeError('INTERCEPT_NOT_ACTIVE');
}
export function shouldSpawnInterceptor(round,hasLiveCue){
  return round?.stage===51&&round.completed===0&&Number.isFinite(round.charge)&&round.charge>0&&hasLiveCue===false;
}
