// Keep the 46px controls and their captions apart without changing world rules.
export function layoutHolds(points,width,height){
 const placed=[],clamp=(value,min,max)=>Math.max(min,Math.min(max,value)),short=height<260&&width>620;
 const maxX=short?width-370:width-60,maxY=short?height-50:height-140,gapY=short?74:90,footprintY=short?73:84;
 for(const point of points){
  const base={x:clamp(point.x,60,maxX),y:short?clamp(64+Math.round((clamp(point.y,64,maxY)-64)/gapY)*gapY,64,maxY):clamp(point.y,64,maxY)},candidates=[];
  for(let row=-4;row<=4;row++)for(let col=-4;col<=4;col++){
   const x=clamp(base.x+col*120,60,maxX),y=clamp(base.y+row*gapY,64,maxY);
   candidates.push({x,y,distance:(x-point.x)**2+(y-point.y)**2});
  }
  candidates.sort((a,b)=>a.distance-b.distance);
  const position=candidates.find(p=>placed.every(q=>Math.abs(p.x-q.x)>=116||Math.abs(p.y-q.y)>=footprintY));
  placed.push(position||base);
 }
 return placed;
}
