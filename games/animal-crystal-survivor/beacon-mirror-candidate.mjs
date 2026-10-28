// Isolated Stage 38 hazard design; not connected to gameplay or rewards.
// Each centre blocks the middle approach while leaving the mirrored flank open.
const circles=Object.freeze({A:Object.freeze({x:392,y:1020,r:145}),B:Object.freeze({x:632,y:1020,r:145})});
export function mirrorStart(first='A'){
  if(!circles[first])throw new RangeError('Unknown mirror side');
  return {side:first,warn:2,life:4,cycle:1};
}
export function mirrorStep(previous,dt){
  if(!Number.isFinite(dt)||dt<0||dt>.25||!circles[previous.side])throw new RangeError('Invalid mirror step');
  const next={...previous,warn:Math.max(0,previous.warn-dt),life:previous.life-dt};
  if(next.life<=0)return {state:{side:previous.side==='A'?'B':'A',warn:2,life:4,cycle:previous.cycle+1},events:['mirror-switched']};
  return {state:next,events:[]};
}
export function mirrorAt(state,x,y){
  if(!circles[state.side]||![x,y].every(Number.isFinite))throw new RangeError('Invalid mirror position');
  const zone=circles[state.side];return state.warn<=0&&state.life>0&&Math.hypot(x-zone.x,y-zone.y)<=zone.r;
}
export const mirrorZones=circles;
