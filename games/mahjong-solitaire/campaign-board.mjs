import {campaignBlock,nextCampaignOrder} from './campaign-engine.mjs';
import {createFaceElement} from './campaign-faces.mjs';

const W=76,H=92,PAD=16;
export function campaignBoardGeometry(tiles) {
 const points=tiles.map(t=>({id:t.id,x:t.x*W+t.z*2,y:t.y*H-t.z*4}));
 const minX=Math.min(...points.map(p=>p.x)),minY=Math.min(...points.map(p=>p.y));
 return {width:Math.max(...points.map(p=>p.x))-minX+W+PAD*2,
  height:Math.max(...points.map(p=>p.y))-minY+H+PAD*2+8,
  points:points.map(p=>({...p,x:p.x-minX+PAD,y:p.y-minY+PAD}))};
}

// Owned, disposable view; the engine/controller alone changes gameplay state.
// The full original layout defines the rectangle even after pairs disappear.
export function mountCampaignBoard(host,initial,{onTile,faceLabel,blockLabel,orderLabel}) {
 if (![onTile,faceLabel,blockLabel,orderLabel].every(f=>typeof f==='function'))throw new Error('Localized board callbacks required');
 const doc=host.ownerDocument,win=doc.defaultView,abort=new win.AbortController();
 const board=doc.createElement('div');board.className='mjc-board';host.append(board);host.classList.add('mjc-board-host');
 const nodes=new Map(),motions=new Set(),ghosts=new Set(),reduced=win.matchMedia('(prefers-reduced-motion: reduce)');
 let state=null,geometry=null,selected=null,hints=[],disposed=false;
 const clearEffects=()=>{for(const a of motions)a.cancel();motions.clear();for(const n of ghosts)n.remove();ghosts.clear();};
 const animate=(node,frames,options,ghost=false)=>{
  if(reduced.matches||doc.hidden||typeof node.animate!=='function'){if(ghost){node.remove();ghosts.delete(node);}return;}
  const a=node.animate(frames,options);motions.add(a);
  a.finished.catch(()=>{}).finally(()=>{motions.delete(a);if(ghost){ghosts.delete(node);node.remove();}});
 };
 const fit=()=>{
  if(!geometry||disposed)return;
  clearEffects();
  const scale=Math.min(host.clientWidth/geometry.width,host.clientHeight/geometry.height,1.35);
  board.style.width=`${geometry.width}px`;board.style.height=`${geometry.height}px`;
  board.style.transform=`translate(-50%, -50%) scale(${Math.max(0,scale)})`;
  host.dataset.tileWidth=String(72*scale); // diagnostic, not an acceptance claim
 };
 const build=next=>{
  clearEffects();board.replaceChildren();nodes.clear();geometry=campaignBoardGeometry(next.tiles);
  for(const tile of next.tiles){
   const p=geometry.points.find(p=>p.id===tile.id),node=doc.createElement('button');
   node.type='button';node.className='mjc-tile';node.dataset.tileId=tile.id;node.dataset.face=tile.face;
   node.style.left=`${p.x}px`;node.style.top=`${p.y}px`;node.style.zIndex=String(tile.z+1);
   node.append(createFaceElement(tile.face,doc));
   const seal=doc.createElement('span');seal.className='mjc-seal';seal.setAttribute('aria-hidden','true');node.append(seal);
   const order=doc.createElement('span');order.className='mjc-order';order.setAttribute('aria-hidden','true');node.append(order);
   board.append(node);nodes.set(tile.id,node);
  }
  fit();
 };
 const decorate=()=>{
  const next=nextCampaignOrder(state),live=state.tiles.filter(t=>!state.removed.includes(t.id));
  const tab=selected||live.find(t=>!campaignBlock(state,t.id))?.id||live[0]?.id;
  for(const tile of state.tiles){
   const node=nodes.get(tile.id),blocked=campaignBlock(state,tile.id),orderIndex=state.rules.order.indexOf(tile.face);
   node.hidden=blocked==='removed';node.dataset.blocked=blocked;
   node.classList.toggle('is-selected',selected===tile.id);node.classList.toggle('is-hint',hints.includes(tile.id));
   node.setAttribute('aria-pressed',String(selected===tile.id));node.setAttribute('aria-disabled',String(!!blocked));
   node.tabIndex=tile.id===tab?0:-1;
   const orderText=orderIndex>=0?orderLabel(orderIndex+1,tile.face===next):'';
   node.setAttribute('aria-label',[faceLabel(tile.face),blockLabel(blocked),orderText].filter(Boolean).join(' · '));
   const seal=node.querySelector('.mjc-seal');seal.hidden=blocked!=='sealed';seal.dataset.gate=tile.gate||'';
   const badge=node.querySelector('.mjc-order');badge.hidden=orderIndex<0;badge.textContent=orderIndex>=0?String(orderIndex+1):'';
   badge.classList.toggle('is-next',tile.face===next);
  }
 };
 const setState=(next,{selected:selection=null,hint=[]}={})=>{
  if(disposed)throw new Error('Board is disposed');
  const same=state?.tiles===next.tiles,focused=board.contains(doc.activeElement);
  const removed=same?next.removed.filter(id=>!state.removed.includes(id)):[];
  const newlyFree=same?next.tiles.filter(t=>campaignBlock(state,t.id)&&!campaignBlock(next,t.id)).map(t=>t.id):[];
  clearEffects();
  if(!same)build(next);
  const copies=removed.map(id=>nodes.get(id)?.cloneNode(true)).filter(Boolean);
  state=next;selected=selection;hints=hint;decorate();
  for(const [i,copy] of copies.entries()){
   copy.hidden=false;copy.className='mjc-tile mjc-ghost';copy.inert=true;copy.tabIndex=-1;
   copy.removeAttribute('data-tile-id');copy.setAttribute('aria-hidden','true');board.append(copy);ghosts.add(copy);
   animate(copy,[{opacity:1,transform:'translateY(0)'},{opacity:1,offset:.35,transform:`translate(${i?-4:4}px,-7px)`},{opacity:0,transform:'translateY(-22px) scale(.9)'}],{duration:360,easing:'ease-out'},true);
  }
  for(const id of newlyFree){const node=nodes.get(id);animate(node,[{filter:'brightness(1.25)'},{filter:'brightness(1)'}],{duration:400,easing:'ease-out'});}
  if(focused&&(!doc.activeElement.isConnected||doc.activeElement.hidden||doc.activeElement.classList.contains('mjc-ghost')))
   board.querySelector('.mjc-tile[tabindex="0"]')?.focus({preventScroll:true});
 };
 let pointerOrigin=null,suppressPointerClick=false,pointerClickReady=false;
 host.addEventListener('pointerdown',event=>{pointerOrigin={id:event.pointerId,x:event.clientX,y:event.clientY};suppressPointerClick=false;pointerClickReady=true;},{signal:abort.signal});
 host.addEventListener('pointermove',event=>{if(pointerOrigin?.id===event.pointerId&&Math.hypot(event.clientX-pointerOrigin.x,event.clientY-pointerOrigin.y)>6)suppressPointerClick=true;},{signal:abort.signal});
 host.addEventListener('pointercancel',()=>{pointerOrigin=null;suppressPointerClick=true;},{signal:abort.signal});
 host.addEventListener('pointerup',()=>{pointerOrigin=null;},{signal:abort.signal});
 host.addEventListener('click',event=>{
  // Browsers may synthesize a click after a touch drag on a locked Canvas.
  // Keyboard activation has detail=0 and must remain available.
  if(event.detail!==0){const allowed=pointerClickReady&&!suppressPointerClick;pointerClickReady=false;if(!allowed){event.preventDefault();return;}}
  const node=event.target.closest('[data-tile-id]');if(!node||!board.contains(node)||node.hidden)return;
  onTile(node.dataset.tileId);
 },{signal:abort.signal});
 host.addEventListener('keydown',event=>{
  const node=event.target.closest('[data-tile-id]');if(!node||!board.contains(node))return;
  const dirs={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]},dir=dirs[event.key];if(!dir)return;
  event.preventDefault();const p=geometry.points.find(p=>p.id===node.dataset.tileId);
  const candidates=geometry.points.filter(q=>q.id!==p.id&&!state.removed.includes(q.id)&&!campaignBlock(state,q.id))
   .map(q=>({id:q.id,dx:q.x-p.x,dy:q.y-p.y})).filter(q=>q.dx*dir[0]+q.dy*dir[1]>1);
  candidates.sort((a,b)=>(Math.abs(a.dx*dir[1]-a.dy*dir[0])*3+Math.hypot(a.dx,a.dy))-(Math.abs(b.dx*dir[1]-b.dy*dir[0])*3+Math.hypot(b.dx,b.dy)));
  if(candidates[0])nodes.get(candidates[0].id).focus({preventScroll:true});
 },{signal:abort.signal});
 const observer=new win.ResizeObserver(fit);observer.observe(host);
 const dispose=()=>{if(disposed)return;disposed=true;observer.disconnect();clearEffects();abort.abort();nodes.clear();board.remove();host.classList.remove('mjc-board-host');delete host.dataset.tileWidth;};
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)clearEffects();},{signal:abort.signal});
 win.addEventListener('pagehide',dispose,{once:true,signal:abort.signal});
 reduced.addEventListener('change',clearEffects,{signal:abort.signal});
 setState(initial);
 return {setState,dispose,clearEffects,stats:()=>({disposed,tiles:nodes.size,animations:motions.size,ghosts:ghosts.size})};
}
