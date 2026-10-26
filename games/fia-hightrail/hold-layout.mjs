// Keep the 46px controls and their captions apart without changing world rules.
export function layoutHolds(points,width,height){
 const placed=[],clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 for(const point of points){
  const base={x:clamp(point.x,60,width-60),y:clamp(point.y,64,height-140)},candidates=[];
  for(let row=-4;row<=4;row++)for(let col=-4;col<=4;col++){
   const x=clamp(base.x+col*120,60,width-60),y=clamp(base.y+row*90,64,height-140);
   candidates.push({x,y,distance:(x-point.x)**2+(y-point.y)**2});
  }
  candidates.sort((a,b)=>a.distance-b.distance);
  const position=candidates.find(p=>placed.every(q=>Math.abs(p.x-q.x)>=116||Math.abs(p.y-q.y)>=84));
  placed.push(position||base);
 }
 return placed;
}
