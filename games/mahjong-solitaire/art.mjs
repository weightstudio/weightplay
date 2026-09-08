// Presentation only. Rules and shared shell remain the sole state owners.
export function installMahjongArt(root=document){
 const controller=new AbortController(),animations=new Set(),nodes=new Set();let disposed=false,pending=null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clear=()=>{clearTimeout(pending);pending=null;for(const a of animations)a.cancel();animations.clear();for(const node of nodes)node.remove();nodes.clear();};
 const animate=(node,frames,options)=>{
  if(typeof node.animate!=='function'){node.remove();nodes.delete(node);return;}
  const a=node.animate(frames,options);animations.add(a);
  a.finished.catch(()=>{}).finally(()=>{animations.delete(a);nodes.delete(node);node.remove();});
 };
 const click=event=>{
  const tile=event.target.closest?.('.mj-layered .tile');
  if(!tile){clear();return;}
  const board=tile.closest('.mj-layered'),selected=board.querySelector('.tile.selected');
  if(!selected||selected===tile||tile.dataset.open!=='true'||selected.dataset.symbol!==tile.dataset.symbol)return;
  const wrap=board.closest('.board-wrap');if(!wrap)return;
  clear();
  const boundary=wrap.getBoundingClientRect(),scale=boundary.width/wrap.offsetWidth;
  const before=[selected,tile].map(el=>({id:el.dataset.value,html:el.innerHTML,rect:el.getBoundingClientRect()}));
  // A capture-listener microtask may run BEFORE delegated bubble handlers.
  // Defer one owned task; only actual rules-authorized removals animate.
  pending=setTimeout(()=>{
   pending=null;
   if(disposed||reduced.matches||document.hidden||!wrap.isConnected||!wrap.getClientRects().length||before.some(t=>wrap.querySelector(`.tile[data-value="${t.id}"]`)))return;
   for(const [i,t] of before.entries()){
    const ghost=document.createElement('div');ghost.className='mj-match-ghost';ghost.innerHTML=t.html;ghost.setAttribute('aria-hidden','true');ghost.inert=true;
    Object.assign(ghost.style,{left:`${(t.rect.left-boundary.left)/scale-wrap.clientLeft}px`,top:`${(t.rect.top-boundary.top)/scale-wrap.clientTop}px`,width:`${t.rect.width/scale}px`,height:`${t.rect.height/scale}px`});
    ghost.querySelector('.mj-lock')?.remove();wrap.append(ghost);nodes.add(ghost);
    animate(ghost,[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:1,offset:.3,transform:`translate(${i?-3:3}px,-8px) scale(1.04)`},{opacity:0,transform:`translate(${i?-6:6}px,-20px) scale(.82)`}],{duration:340,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'});
   }
  },0);
 };
 root.addEventListener('click',click,{capture:true,signal:controller.signal});
 const dispose=()=>{disposed=true;clear();controller.abort();};
 window.addEventListener('pagehide',dispose,{once:true,signal:controller.signal});
 window.addEventListener('resize',clear,{signal:controller.signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();},{signal:controller.signal});
 return {dispose,clear,stats:()=>({animations:animations.size,nodes:nodes.size,pending:pending!==null})};
}
