import {PORTS} from './simulation.mjs';
import {actionFootprint} from './guidance.mjs';

// Project through the renderer's camera so portrait/landscape share one truth.
export function mountGuidance(playfield,{dismiss,label}){
 const ns='http://www.w3.org/2000/svg',layer=document.createElement('div');layer.className='board-guidance';layer.hidden=true;
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('aria-hidden','true');svg.classList.add('guidance-marks');
 const card=document.createElement('div');card.className='guidance-card';
 const copy=document.createElement('p');copy.id='boardTip';copy.setAttribute('role','status');copy.setAttribute('aria-live','polite');
 const skip=document.createElement('button');skip.type='button';skip.className='guidance-dismiss';skip.textContent='×';skip.setAttribute('aria-label',label);skip.title=label;skip.addEventListener('pointerdown',e=>e.stopPropagation());skip.addEventListener('click',e=>{e.stopPropagation();dismiss();});
 card.append(copy,skip);layer.append(svg,card);playfield.append(layer);
 const clear=()=>{layer.hidden=true;svg.replaceChildren();copy.textContent='';playfield.removeAttribute('aria-describedby');for(const node of document.querySelectorAll('[data-board-cue]'))delete node.dataset.boardCue;};
 function render(data,view,state,text){
  clear();if(!data)return;
  layer.hidden=false;layer.dataset.kind=data.kind||'hint';layer.classList.toggle('landscape',view.landscape);copy.textContent=text;playfield.setAttribute('aria-describedby',copy.id);
  const left=view.project([[0,0]],.12).x,cellWidth=view.project([[1,0]],.12).x-left,gutter=left-cellWidth/2-24;
  layer.classList.toggle('side',!view.landscape&&gutter>=150);layer.style.setProperty('--guidance-side-width',Math.min(240,gutter)+'px');
  svg.setAttribute('viewBox',`0 0 ${view.width} ${view.height}`);
  const mark=(name,attributes)=>{const node=document.createElementNS(ns,name);for(const [key,value]of Object.entries(attributes))node.setAttribute(key,String(value));svg.append(node);return node;};
  const cells=(list,kind)=>list.forEach(([c,r])=>{const points=[[-.45,-.45],[.45,-.45],[.45,.45],[-.45,.45]].map(([x,y])=>view.project([[c+x,r+y]],.12)).map(p=>`${p.x},${p.y}`).join(' ');mark('polygon',{points,class:'guidance-cell '+kind});});
  const footprint=actionFootprint(state,data.action);
  if(footprint){cells(footprint.to,'destination');if(data.action.type==='move'){const a=view.project(footprint.from,.62),b=view.project(footprint.to,.62),dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy),ux=dx/length,uy=dy/length;mark('path',{d:`M ${a.x} ${a.y} L ${b.x} ${b.y} M ${b.x-ux*12-uy*6} ${b.y-uy*12+ux*6} L ${b.x} ${b.y} L ${b.x-ux*12+uy*6} ${b.y-uy*12-ux*6}`,class:'guidance-arrow'});}}
  if(data.table)cells([[2,3],[3,3],[2,4],[3,4]],'table');
  const tray=data.tray||data.action?.id;if(tray)playfield.querySelector(`[data-piece="${tray}"]`)?.setAttribute('data-board-cue','tray');
  for(const i of data.ports||[]){const port=PORTS[i];cells([[port.c,port.r]],'port');playfield.querySelector(`[data-port="${port.id}"]`)?.setAttribute('data-board-cue','port');}
  const control=data.control||(data.action?.type==='switch'?'switchBtn':data.action?.type==='rotate'?'rotateBtn':null);
  if(control)document.getElementById(control)?.setAttribute('data-board-cue','action');
 }
 return {render,clear};
}
