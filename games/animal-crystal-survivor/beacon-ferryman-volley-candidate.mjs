// Unconnected fixed-aim attack draft; actual rendering and balance unverified.
export function makeFerrymanVolley(origin,target){
  const dx=target.x-origin.x,dy=target.y-origin.y,dist=Math.hypot(dx,dy);
  if(!Number.isFinite(dist)||dist<1)throw new RangeError('INVALID_VOLLEY_AIM');
  const angle=Math.atan2(dy,dx);
  return [-.42,0,.42].map(offset=>({kind:'arrow',bossSkill:'bossFerryman',x:origin.x,y:origin.y,
    vx:Math.cos(angle+offset)*245,vy:Math.sin(angle+offset)*245,r:22,warn:1.4,life:4.4,damage:10,color:'#c084fc'}));
}
export function volleySegmentHits(arrow,point,dt){
  if(!Number.isFinite(dt)||dt<0||dt>.25)throw new RangeError('INVALID_VOLLEY_STEP');
  if(arrow.warn>0||arrow.life<=0)return false;
  const dx=arrow.vx*dt,dy=arrow.vy*dt,t=Math.max(0,Math.min(1,((point.x-arrow.x)*dx+(point.y-arrow.y)*dy)/(dx*dx+dy*dy||1)));
  return Math.hypot(point.x-arrow.x-dx*t,point.y-arrow.y-dy*t)<=arrow.r+18;
}
