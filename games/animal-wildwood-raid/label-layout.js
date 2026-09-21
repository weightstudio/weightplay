// Move with the projected actor every frame; ease only the collision offset.
const slots=[[0,0],[0,-42],[0,42],[-82,0],[82,0],[0,-84],[0,84],[-82,-42],[82,-42]];
export function placeLabel(state,anchor,size,bounds,placed,time,dt,hero=false){
 const rect=(dx,dy)=>{const x=Math.max(size.w/2+2,Math.min(bounds.w-size.w/2-2,anchor.x+dx)),y=Math.max(size.h+2,Math.min(bounds.h-3,anchor.y+dy));return {x,y,left:x-size.w/2,right:x+size.w/2,top:y-size.h,bottom:y};};
 const clear=(r,pad=3)=>!placed.some(p=>r.left<p.right+pad&&r.right>p.left-pad&&r.top<p.bottom+pad&&r.bottom>p.top-pad);
 state.slot??=0;state.dx??=0;state.dy??=0;
 const current=rect(...slots[state.slot]);
 if(hero)state.slot=0;
 else if(!clear(current)&&time>=(state.holdUntil||0)){
  const next=slots.findIndex(([x,y])=>clear(rect(x,y),7));
  if(next>=0&&next!==state.slot){state.slot=next;state.holdUntil=time+.35;}
  state.homeSince=null;
 }else if(state.slot&&clear(rect(0,0),12)){
  state.homeSince??=time;
  if(time-state.homeSince>.65){state.slot=0;state.homeSince=null;state.holdUntil=time+.35;}
 }else state.homeSince=null;
 const [dx,dy]=slots[state.slot],blend=1-Math.exp(-Math.min(dt,.08)*14);
 if(!state.initialized){state.dx=dx;state.dy=dy;state.initialized=true;}
 else{state.dx+=(dx-state.dx)*blend;state.dy+=(dy-state.dy)*blend;}
 return rect(state.dx,state.dy);
}
