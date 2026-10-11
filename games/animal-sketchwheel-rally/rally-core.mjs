// Pure geometry/simulation. Rendering and input never decide race outcomes.
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export function resample(points,count=96){
  const clean=points.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));
  if(clean.length<4)return null;
  const path=[clean[0]];
  for(const p of clean.slice(1))if(Math.hypot(p.x-path.at(-1).x,p.y-path.at(-1).y)>.1)path.push(p);
  if(path.length<4)return null;
  path.push(path[0]);
  const lengths=[0];for(let i=1;i<path.length;i++)lengths.push(lengths.at(-1)+Math.hypot(path[i].x-path[i-1].x,path[i].y-path[i-1].y));
  if(lengths.at(-1)<24)return null;
  let j=1;return Array.from({length:count},(_,i)=>{const d=i*lengths.at(-1)/count;while(j<path.length-1&&lengths[j]<d)j++;const f=(d-lengths[j-1])/(lengths[j]-lengths[j-1]||1);return{x:path[j-1].x+(path[j].x-path[j-1].x)*f,y:path[j-1].y+(path[j].y-path[j-1].y)*f}});
}
export function measureWheel(input,w=240,h=116){
  const points=resample(input);if(!points)return null;
  const xs=points.map(p=>p.x),ys=points.map(p=>p.y),bw=Math.max(...xs)-Math.min(...xs),bh=Math.max(...ys)-Math.min(...ys);
  if(bw<Math.min(w,h)*.09||bh<Math.min(w,h)*.09)return null;
  const cx=(Math.max(...xs)+Math.min(...xs))/2,cy=(Math.max(...ys)+Math.min(...ys))/2;
  const r=points.map(p=>Math.hypot((p.x-cx)/bw,(p.y-cy)/bh)),avg=r.reduce((a,b)=>a+b)/r.length;
  const deviation=Math.sqrt(r.reduce((a,b)=>a+(b-avg)**2,0)/r.length)/avg;
  const aspect=bw/bh,roundness=clamp(1-deviation*1.8-Math.abs(Math.log(aspect))*.32);
  let corners=0;
  for(let i=0;i<points.length;i++){const a=points[(i+93)%96],b=points[i],c=points[(i+3)%96];const u=Math.atan2(b.y-a.y,b.x-a.x),v=Math.atan2(c.y-b.y,c.x-b.x);if(Math.abs(Math.atan2(Math.sin(v-u),Math.cos(v-u)))>.85)corners++;}
  const width=clamp(.62*Math.pow(aspect,.7),.25,1),height=clamp(.56/Math.pow(aspect,.7),.25,1);
  const grip=clamp(.28+deviation*2.2+Math.min(corners,24)*.025);
  // The centered normalized path is shared by the pad and extruded wheel mesh.
  const scale=Math.max(bw,bh);
  return{kind:'custom',speed:clamp(.35+roundness*.62),width,height,grip,roundness,
    points:points.map(p=>({x:.5+(p.x-cx)/scale*.88,y:.5+(p.y-cy)/scale*.88}))};
}
export function wheelOutline(p){
  if(p.points?.length>3)return p.points.map(q=>({x:(q.x-.5)*2,y:-(q.y-.5)*2}));
  return Array.from({length:p.kind==='spike'?16:48},(_,i)=>{const a=i*Math.PI*2/(p.kind==='spike'?16:48),r=p.kind==='spike'?(i%2?.58:1):1;return{x:Math.cos(a)*r*p.width/.62,y:Math.sin(a)*r*p.height/.56}});
}
export function stepRace(run,level,dt,{pass,performance,axle=0,drawing=false}={}){
  if(run.ended||run.firstProfile)return [];
  const events=[];
  dt=clamp(dt,0,.05);
  if(drawing){run.drawingTime=(run.drawingTime||0)+dt;if(run.drawingTime<1.2)dt*=.32;}else run.drawingTime=0;
  run.elapsed+=dt;run.time-=dt;run.boost=Math.max(0,run.boost-dt);run.impact=Math.max(0,run.impact-dt*3);run.forgePulse=Math.max(0,(run.forgePulse||0)-dt);
  const i=run.terrainIndex,type=level.terrain[i],pos=level.positions[i],entry=pos-34;
  const near=type&&run.player>=entry-1&&run.player<=pos+54;
  const fits=!type||pass(type,run.profile),quality=type?performance(type,run.profile):1;
  run.terrainScore=quality;
  let target=(18+run.profile.speed*19+axle*1.4)*(run.boost>0?1.3:1);
  const hard=['stairs','tunnel','gap','wind'].includes(type);
  if(near){target*=fits?(.86+quality*.24):(.18+quality*.12);if(!fits&&hard)target=0;}
  const wasStalled=run.stalled;
  run.stalled=!!(near&&!fits);
  if(run.stalled&&!wasStalled){run.chain=0;run.clean=false;run.impact=.7;events.push({kind:'stall',type});}
  if(!run.stalled&&wasStalled)events.push({kind:'recover',type});
  run.speed+=(target-run.speed)*Math.min(1,dt*7);
  let next=run.player+run.speed*dt;
  // Sweep against entry: a long frame cannot tunnel through an unmet obstacle.
  if(type&&!fits&&hard&&next>=entry&&run.player<=pos+54){next=Math.min(next,entry);run.speed=0;}
  run.player=next;
  const rivalObstacle=level.terrain.findIndex((_,j)=>Math.abs(run.rival-level.positions[j])<44);
  const rivalFactor=rivalObstacle<0?1.08:({stairs:.82,mud:.72,tunnel:.84,gap:.82,ice:.76,wind:.85,flat:1.03}[level.terrain[rivalObstacle]]);
  run.rival+=level.rival*rivalFactor*dt;
  if(type&&run.player>pos+54){
    run.passed.push(type);run.terrainIndex++;
    if(run.clean!==false&&fits){run.chain=(run.chain||0)+1;run.bestChain=Math.max(run.bestChain||0,run.chain);run.boost=1.2+Math.min(3,run.chain)*.25;}
    run.clean=true;events.push({kind:'pass',type,chain:run.chain||0});
  }
  if(run.player>=1000){run.player=1000;events.push({kind:'finish',win:true});}
  else if(run.rival>=1000||run.time<=0){run.rival=Math.min(1000,run.rival);events.push({kind:'finish',win:false});}
  return events;
}
