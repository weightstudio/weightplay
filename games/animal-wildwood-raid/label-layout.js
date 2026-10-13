function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
function overlaps(a,b,gap){
 return a.x-a.width/2<b.x+b.width/2+gap&&a.x+a.width/2>b.x-b.width/2-gap&&a.y-a.height<b.y+gap&&a.y>b.y-b.height-gap;
}

// Place actor labels near their projected target while avoiding labels already
// assigned to higher-priority actors (hero, boss, enemies, then scenery).
export function layoutLabels(anchors,viewport){
 if(!viewport||!(viewport.width>0)||!(viewport.height>0))return anchors.map(({x,y})=>({x,y,offset:{x:0,y:0}}));
 const width=viewport.width,height=viewport.height,margin=viewport.margin??4,gap=viewport.gap??4,maxDisplacement=viewport.maxDisplacement??72;
 const placed=[];
 return anchors.map(anchor=>{
  const labelWidth=anchor.width??viewport.labelWidth??76,labelHeight=anchor.height??viewport.labelHeight??38;
  const halfWidth=Math.min(labelWidth/2,Math.max(0,(width-margin*2)/2));
  const minX=margin+halfWidth,maxX=width-margin-halfWidth;
  const minY=Math.min(height-margin,labelHeight+margin),maxY=height-margin;
  const base={x:clamp(anchor.x,minX,maxX),y:clamp(anchor.y,minY,maxY)};
  const xStep=labelWidth+gap,yStep=labelHeight+gap;
  const offsets=[[0,0],[0,-yStep],[0,yStep],[-xStep,0],[xStep,0],[-xStep,-yStep],[xStep,-yStep],[-xStep,yStep],[xStep,yStep],[-2*xStep,0],[2*xStep,0]];
  if(anchor.offset)offsets.unshift([anchor.offset.x,anchor.offset.y]);
  const seen=new Set(),candidates=[];
  for(const [dx,dy] of offsets){
   const x=clamp(base.x+dx,minX,maxX),y=clamp(base.y+dy,minY,maxY),key=`${x.toFixed(2)}:${y.toFixed(2)}`;
   if(seen.has(key))continue;seen.add(key);
   const distance=Math.hypot(x-anchor.x,y-anchor.y);
   if(distance>maxDisplacement&&Math.hypot(x-base.x,y-base.y)>0)continue;
   const item={x,y,width:halfWidth*2,height:labelHeight,offset:{x:x-base.x,y:y-base.y},distance};
   const stability=anchor.offset?Math.hypot(item.offset.x-anchor.offset.x,item.offset.y-anchor.offset.y)*.7:0;
   candidates.push({...item,score:Math.hypot(item.offset.x,item.offset.y)+stability});
  }
  candidates.sort((a,b)=>a.score-b.score);
  let chosen=candidates.find(candidate=>!placed.some(other=>overlaps(candidate,other,gap)));
  if(!chosen)chosen=candidates.sort((a,b)=>{
   const countA=placed.filter(other=>overlaps(a,other,gap)).length,countB=placed.filter(other=>overlaps(b,other,gap)).length;
   return countA-countB||a.score-b.score;
  })[0]??{...base,width:halfWidth*2,height:labelHeight,offset:{x:0,y:0}};
  placed.push(chosen);
  return {x:chosen.x,y:chosen.y,offset:chosen.offset};
 });
}

// Keep the original one-label API for call sites that only need edge clamping.
export function placeLabel(anchor,viewport){
 const {x,y}=layoutLabels([anchor],viewport)[0];
 return {x,y};
}
