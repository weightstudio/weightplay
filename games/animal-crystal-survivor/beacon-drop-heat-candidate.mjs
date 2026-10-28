// Unconnected Stage 47 draft: a defeated carrier leaves a warned hot patch
// around its fragment. Does not itself move, damage, save or reward anything.
export function makeDropHeat(drop){
  if(!Number.isFinite(drop?.x)||!Number.isFinite(drop?.y)||drop.x<0||drop.x>1024||drop.y<0||drop.y>1760)throw new RangeError('invalid in-arena fragment');
  return {kind:'lane',x:drop.x,y:drop.y,width:200,height:180,warn:1.8,life:6.2,damage:8,tick:0,color:'#ec7734',beaconDropHeat:true};
}
export function insideDropHeat(point,heat){
  if(!Number.isFinite(point?.x)||!Number.isFinite(point?.y))throw new TypeError('finite point required');
  return Math.abs(point.x-heat.x)<=heat.width/2&&Math.abs(point.y-heat.y)<=heat.height/2;
}
