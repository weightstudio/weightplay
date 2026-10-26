// Finite, visual-only transfers. The simulator commits every reward first.
export function createTransfers({root,source,asset,pulse,active,epoch,reduced}){
 const actors=new Set();
 function cancel(){for(const actor of actors){actor.animation.cancel();actor.element.remove();}actors.clear();}
 function pause(value){for(const {animation}of actors){if(value)animation.pause();else if(animation.playState==='paused')animation.play();}}
 function transfer(kind,target,id){
  if(!active()||!target?.isConnected)return;
  const bounds=root.getBoundingClientRect(),end=target.getBoundingClientRect(),point=source(id);
  if(!point||!bounds.width||!bounds.height||!end.width||!end.height)return;
  const scale=bounds.width/root.offsetWidth,clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const startX=clamp((point.x-bounds.left)/scale,20,root.offsetWidth-20),startY=clamp((point.y-bounds.top)/scale,24,root.offsetHeight-20);
  const endX=clamp((end.x+end.width/2-bounds.left)/scale,20,root.offsetWidth-20),endY=clamp((end.y+end.height/2-bounds.top)/scale,24,root.offsetHeight-20);
  const element=document.createElement('img');element.className='fia-transfer';element.alt='';element.setAttribute('aria-hidden','true');element.src=asset(kind);
  // An offscreen world origin/destination is represented at its visible edge.
  element.dataset.edgeTarget=String(end.bottom>bounds.bottom||end.top<bounds.top);
  const minimal=reduced();element.style.left=((minimal?endX:startX)-16)+'px';element.style.top=((minimal?endY:startY)-16)+'px';root.append(element);
  if(actors.size>=8){const oldest=actors.values().next().value;oldest.animation.cancel();oldest.element.remove();actors.delete(oldest);}
  const dx=endX-startX,dy=endY-startY,token=epoch();
  const frames=minimal?[{opacity:0},{opacity:1,offset:.3},{opacity:0}]:[
   {transform:'translate(0,0) scale(.7)',opacity:.8},
   {transform:`translate(${dx*.5}px,${dy*.5-36}px) scale(1.15)`,opacity:1,offset:.5},
   {transform:`translate(${dx}px,${dy}px) scale(.5)`,opacity:0}];
  const animation=element.animate(frames,{duration:minimal?220:540,easing:'ease-in-out'}),actor={element,animation};actors.add(actor);
  animation.finished.then(()=>{if(active()&&epoch()===token&&target.isConnected)pulse(target);}).catch(()=>{}).finally(()=>{element.remove();actors.delete(actor);});
 }
 return {transfer,cancel,pause,get count(){return actors.size;}};
}
