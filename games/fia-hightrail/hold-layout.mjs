// Keep the 46px controls and their captions apart without changing world rules.
export function layoutHolds(points,width,height){
 const placed=[],clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 for(const point of points){
  const base={x:clamp(point.x,56,width-56),y:clamp(point.y,64,height-125)},candidates=[];
  for(let row=-4;row<=4;row++)for(let col=-4;col<=4;col++){
   const x=clamp(base.x+col*108,56,width-56),y=clamp(base.y+row*72,64,height-125);
   candidates.push({x,y,distance:(x-point.x)**2+(y-point.y)**2});
  }
  candidates.sort((a,b)=>a.distance-b.distance);
  const position=candidates.find(p=>placed.every(q=>Math.abs(p.x-q.x)>=106||Math.abs(p.y-q.y)>=70));
  placed.push(position||base);
 }
 return placed;
}
