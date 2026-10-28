// Unconnected Stage 46 draft. The host must apply its real hazard and damage
// lifecycle; these functions do not save, move, damage or start a round.
const lane=Object.freeze({x:512,y:1000,width:560,height:140,warn:1.8,life:6.2,damage:8,color:'#ec7734',beaconHeat:true});
export function makeHeatLane(){return {kind:'lane',tick:0,...lane}}
export function insideHeatLane(point,heat=lane){
  if(!Number.isFinite(point?.x)||!Number.isFinite(point?.y))throw new TypeError('finite point required');
  return Math.abs(point.x-heat.x)<=heat.width/2&&Math.abs(point.y-heat.y)<=heat.height/2;
}
export function heatPhase(elapsed,heat=lane){
  if(!Number.isFinite(elapsed)||elapsed<0)throw new RangeError('invalid heat time');
  return elapsed<heat.warn?'warning':elapsed<heat.life?'active':'cooled';
}
