// One bounded owner for transient presentation. State, spending and rewards
// never depend on an animation finishing. Exit snapshots cannot receive input.
const SNAPSHOT_STYLE=['display','position','inset','top','right','bottom','left','width','height','min-width','min-height','max-width','max-height','box-sizing','margin','padding','gap','grid-template-columns','grid-template-rows','grid-column','grid-row','grid-auto-flow','align-items','align-content','justify-items','justify-content','flex','flex-direction','flex-wrap','order','overflow','overflow-x','overflow-y','font','line-height','letter-spacing','white-space','text-align','text-overflow','overflow-wrap','color','background','background-image','background-size','background-position','border','border-radius','box-shadow','opacity','transform','transform-origin','object-fit','object-position','z-index','visibility','mask','-webkit-mask'];
export class Motion {
 constructor(){this.running=new Map();this.proxy=null;this.serial=0;}
 get reduced(){return matchMedia('(prefers-reduced-motion: reduce)').matches;}
 stop(node){const old=this.running.get(node);if(old){this.running.delete(node);old.cancel();}}
 play(node,frames,duration=180,finish){if(!node)return;this.stop(node);if(this.running.size>=32){const first=this.running.keys().next().value;if(first===this.proxy)this.dropProxy();else this.stop(first);}const animation=node.animate(frames,{duration:this.reduced?Math.min(duration,120):duration,easing:'ease-out'});this.running.set(node,animation);animation.finished.then(()=>{if(this.running.get(node)===animation){this.running.delete(node);finish?.();}},()=>{if(node.hasAttribute('data-puppy-transient'))node.remove();});return animation;}
 enter(node){this.play(node,[{opacity:.15},{opacity:1}],180);}
 emphasize(node){this.play(node,[{filter:'brightness(1.35)'},{filter:'brightness(1)'}],160);}
 exit(node){
  this.dropProxy();if(!node||!node.getClientRects().length)return;
  const rect=node.getBoundingClientRect();if(!rect.width||!rect.height)return;
  const copy=node.cloneNode(true),sources=[node,...node.querySelectorAll('*')],targets=[copy,...copy.querySelectorAll('*')];
  // Pin the snapshot to the actual rendered styles, independent of its old
  // ancestor selectors. Bounded to one current screen/overlay, never a queue.
  for(let i=0;i<sources.length;i++){
   const source=sources[i],target=targets[i],style=getComputedStyle(source);
   for(const property of SNAPSHOT_STYLE)target.style.setProperty(property,style.getPropertyValue(property));
   target.style.setProperty('animation','none','important');target.style.setProperty('transition','none','important');
   if('value' in source&&!(source instanceof HTMLCanvasElement))target.value=source.value;if('checked' in source)target.checked=source.checked;
   target.removeAttribute('id');target.removeAttribute('href');target.removeAttribute('autofocus');target.setAttribute('aria-hidden','true');
   for(const name of target.getAttributeNames())if(name.startsWith('data-'))target.removeAttribute(name);
   if(source instanceof HTMLCanvasElement){try{const img=new Image();img.src=source.toDataURL();img.alt='';img.style.cssText=target.style.cssText;target.replaceWith(img);}catch{target.style.visibility='hidden';}}
  }
  copy.inert=true;copy.setAttribute('aria-hidden','true');copy.dataset.puppyExitProxy=String(++this.serial);
  Object.assign(copy.style,{position:'fixed',inset:'auto',left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,margin:'0',transform:'none',pointerEvents:'none',zIndex:'90',overflow:'hidden'});
  document.body.append(copy);for(let i=0;i<sources.length;i++){targets[i].scrollTop=sources[i].scrollTop;targets[i].scrollLeft=sources[i].scrollLeft;}this.proxy=copy;this.play(copy,[{opacity:1},{opacity:0}],140,()=>{if(this.proxy===copy)this.proxy=null;copy.remove();});
 }
 dropProxy(){if(this.proxy){this.stop(this.proxy);this.proxy.remove();this.proxy=null;}}
 clear(){for(const animation of this.running.values())animation.cancel();this.running.clear();this.dropProxy();document.querySelectorAll('[data-puppy-transient]').forEach(n=>n.remove());}
 stats(){return {animations:this.running.size,exitProxies:this.proxy?1:0};}
}
