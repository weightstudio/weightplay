// Stage 43 source-only candidate; the host owns combat, drops and persistence.
// The armoured carrier patrols across the junction between C and A.
const left=192,right=832,y=870,speed=128,span=right-left;
export const junctionRoute=Object.freeze({left,right,y});
export function makeJunctionPath(id){
  if(typeof id!=='string'||!id)throw new TypeError('INVALID_JUNCTION_ID');
  return {id,phase:0};
}
export function stepJunctionPath(path,dt){
  if(!path||typeof path.id!=='string'||!path.id||!Number.isFinite(path.phase)||path.phase<0||path.phase>=2||!Number.isFinite(dt)||dt<0||dt>.25)throw new RangeError('INVALID_JUNCTION_STEP');
  const phase=(path.phase+speed*dt/span)%2,progress=phase<=1?phase:2-phase;
  return {path:{...path,phase},x:left+span*progress,y};
}
