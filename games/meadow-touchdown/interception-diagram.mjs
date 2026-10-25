import {flightPoint} from './simulation.mjs';

// A top-down record of the settled contact, never an invented intended target.
export function interceptionDiagram(hit){
  if(!hit)return null;
  const path=Array.from({length:33},(_,i)=>i===32?{...hit.point}:flightPoint(hit.flight,hit.time*i/32));
  const minY=Math.min(hit.flight.from.y,hit.point.y,hit.defenderPoint.y)-1.5;
  const maxY=Math.max(hit.flight.from.y,hit.point.y,hit.defenderPoint.y)+1.5;
  const scale=Math.min(14,106/Math.max(6,maxY-minY));
  const map=p=>({x:160+p.x*scale,y:124-(p.y-minY)*scale});
  return {path:path.map(map),source:map(hit.flight.from),contact:map(hit.point),defender:map(hit.defenderPoint),
    field:{x:160-10*scale,y:124-(maxY-minY)*scale,width:20*scale,height:(maxY-minY)*scale}};
}

export function drawInterceptionDiagram(svg,hit){
  svg.replaceChildren();const record=interceptionDiagram(hit);if(!record)return;
  const node=(name,attrs)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [key,value]of Object.entries(attrs))n.setAttribute(key,String(value));svg.append(n);return n;};
  const field=record.field;
  node('rect',{...field,fill:'#6f9d60',stroke:'#d9e5c0','stroke-width':1.5,rx:2});
  for(let i=1;i<4;i++)node('line',{x1:field.x,y1:field.y+field.height*i/4,x2:field.x+field.width,y2:field.y+field.height*i/4,stroke:'#d9e5c0','stroke-width':1});
  const d=record.path.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
  node('path',{d,fill:'none',stroke:'#173f43','stroke-width':6,'stroke-linecap':'round'});
  node('path',{d,fill:'none',stroke:'#fff4be','stroke-width':3,'stroke-linecap':'round','data-recorded-flight':''});
  node('circle',{cx:record.source.x,cy:record.source.y,r:5,fill:'#75e3e6',stroke:'#173f43','stroke-width':2});
  const {x,y}=record.defender;
  node('path',{d:`M${x},${y-8} L${x+8},${y} L${x},${y+8} L${x-8},${y} Z`,fill:'#a73f42',stroke:'#fff4be','stroke-width':2,'data-recorded-defender':''});
  const contact=record.contact;
  const cross=`M${contact.x-4},${contact.y-4} L${contact.x+4},${contact.y+4} M${contact.x-4},${contact.y+4} L${contact.x+4},${contact.y-4}`;
  node('path',{d:cross,stroke:'#173f43','stroke-width':5,'stroke-linecap':'round'});
  node('path',{d:cross,stroke:'#fff8e9','stroke-width':2.5,'stroke-linecap':'round','data-recorded-contact':''});
}
