// Isolated Stage 45 proposal. The host must apply the returned motion through
// real swept collision and commit the returned shield together with the pulse.
export function makeRamCharge(id,boss,target){
  if(typeof id!=='string'||!id||![boss?.x,boss?.y,target?.x,target?.y].every(Number.isFinite))throw new TypeError('INVALID_RAM_CHARGE');
  const dx=target.x-boss.x,dy=target.y-boss.y,length=Math.hypot(dx,dy);if(length<1)throw new RangeError('RAM_AIM_TOO_SHORT');
  const x2=Math.max(24,Math.min(1000,boss.x+dx/length*350)),y2=Math.max(24,Math.min(1736,boss.y+dy/length*350));
  const size=Number.isFinite(boss.size)&&boss.size>0?boss.size:148;
  return {id,phase:'warning',remaining:1.8,width:2*(size*.4+24),x1:boss.x,y1:boss.y,x2,y2,progress:0};
}
export function stepRamCharge(cue,dt){
  if(!cue||!Number.isFinite(dt)||dt<0||dt>.25||![cue.x1,cue.y1,cue.x2,cue.y2,cue.remaining,cue.progress].every(Number.isFinite))throw new RangeError('INVALID_RAM_STEP');
  if(cue.phase==='warning'){const remaining=Math.max(0,cue.remaining-dt);return {cue:{...cue,remaining,phase:remaining<=1e-9?'active':'warning'},x:cue.x1,y:cue.y1}}
  if(cue.phase==='active'){if(cue.progress<0||cue.progress>1)throw new RangeError('INVALID_RAM_PROGRESS');const next=cue.progress+dt/.7,progress=next>=1-1e-9?1:next;return {cue:{...cue,progress,phase:progress===1?'done':'active'},x:cue.x1+(cue.x2-cue.x1)*progress,y:cue.y1+(cue.y2-cue.y1)*progress}}
  throw new RangeError('RAM_CHARGE_NOT_ACTIVE');
}
export function applyRamPulse(boss,before,after,events){
  if(!boss||boss.image!=='bossCircuitRam'||!boss.isBoss||!Number.isFinite(boss.hp)||boss.hp<=0||!boss.shielded||!Array.isArray(events)||!events.includes('beacon-pulsed'))throw new Error('RAM_PULSE_UNAVAILABLE');
  if(before?.stage!==45||after?.stage!==45||after.completed!==before.completed+1||after.pulses!==before.pulses+1||after.lastPulse!==(before.completed===0?'A':before.completed===1?'C':null))throw new Error('RAM_PULSE_MISMATCH');
  return {...boss,shielded:after.completed===2?false:true};
}
export function ramObjective(round,bossDefeated){return round?.stage===45&&round.completed===2&&bossDefeated===true}
