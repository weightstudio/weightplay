// Isolated Stage 40 two-facet boss concept. No runtime or persistence binding.
export function makeFerryman(hp=360){
  if(!Number.isFinite(hp)||hp<=0)throw new RangeError('INVALID_FERRYMAN_HP');
  return {hp,maxHp:hp,phase:0,shielded:true,defeated:false};
}
export function pulseFerryman(previous,station){
  const required=previous.phase===0?'A':previous.phase===1?'B':null;
  if(!previous.shielded||!required||station!==required)return {state:previous,events:[]};
  return {state:{...previous,shielded:false},events:[`facet-opened:${station}`]};
}
export function hitFerryman(previous,damage){
  if(!Number.isFinite(damage)||damage<0)throw new RangeError('INVALID_FERRYMAN_DAMAGE');
  if(previous.defeated||previous.shielded)return {state:previous,events:[]};
  if(previous.phase===0){
    const hp=Math.max(previous.maxHp/2,previous.hp-damage);
    if(hp<=previous.maxHp/2)return {state:{...previous,hp,phase:1,shielded:true},events:['second-facet-closed']};
    return {state:{...previous,hp},events:[]};
  }
  const hp=Math.max(0,previous.hp-damage);
  return {state:{...previous,hp,phase:hp===0?2:1,defeated:hp===0},events:hp===0?['ferryman-defeated']:[]};
}
