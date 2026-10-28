// Unconnected Stage 52 timing/geometry proposal. Host owns actual hazards,
// movement, collision, visuals, localization, saving and rewards.
export const corridorPlan=Object.freeze({
  stage:52,splitY:880,warning:4.5,active:3,arenaMinY:42,arenaMaxY:1718,
  playerRadius:18,baselineSpeed:238,chargeLifetime:18,stationDwell:1.2,
});
export function makeCorridorCycle(){return {stage:52,side:'north',phase:'warning',remaining:corridorPlan.warning,turn:0};}
export function stepCorridorCycle(previous,dt){
  if(previous?.stage!==52||!['north','south'].includes(previous.side)||!['warning','active'].includes(previous.phase)||
     !Number.isFinite(previous.remaining)||previous.remaining<0||
     previous.remaining>(previous.phase==='warning'?corridorPlan.warning:corridorPlan.active)||
     !Number.isSafeInteger(previous.turn)||previous.turn<0||
     !Number.isFinite(dt)||dt<0||dt>.25)throw new RangeError('INVALID_CORRIDOR_CYCLE');
  const remaining=previous.remaining-dt;
  if(remaining>1e-9)return {state:{...previous,remaining},events:[]};
  // Carry the partial frame forward rather than lengthening every phase.
  const overflow=Math.max(0,-remaining);
  if(previous.phase==='warning')return {state:{...previous,phase:'active',remaining:corridorPlan.active-overflow},events:['corridor-active']};
  return {state:{...previous,side:previous.side==='north'?'south':'north',phase:'warning',remaining:corridorPlan.warning-overflow,turn:previous.turn+1},events:['corridor-warning']};
}
// The warning never damages. Active hazard overlaps the selected half-plane;
// touching its boundary with the player's radius is deliberately unsafe.
export function corridorThreat(cycle,y,radius=corridorPlan.playerRadius){
  if(cycle?.stage!==52||!['north','south'].includes(cycle.side)||!['warning','active'].includes(cycle.phase)||
     !Number.isFinite(y)||!Number.isFinite(radius)||radius<0)throw new TypeError('INVALID_CORRIDOR_POSITION');
  if(cycle.phase!=='active')return false;
  return cycle.side==='north'?y-radius<=corridorPlan.splitY:y+radius>=corridorPlan.splitY;
}
