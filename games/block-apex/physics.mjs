import {TRACKS, STAGES, STEP, GATE_COUNT, vehicleStats} from './data.mjs';
export {STEP};
export const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
export const wrap = (x,n) => ((x%n)+n)%n;
export const angle = x => Math.atan2(Math.sin(x),Math.cos(x));
const hypot = Math.hypot;
function catmull(a,b,c,d,t) { return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t); }

export function buildTrack(index, reverse = false) {
  const def = TRACKS[index];
  if (!def) throw new RangeError('UNKNOWN_TRACK');
  const source = reverse ? [def.points[0],...def.points.slice(1).reverse()] : def.points;
  const points = [], count = source.length;
  for(let i=0;i<count;i++) for(let k=0;k<24;k++) {
    const p = [0,1,2].map(axis=>catmull(source[wrap(i-1,count)][axis],source[i][axis],source[(i+1)%count][axis],source[(i+2)%count][axis],k/24));
    points.push({x:p[0],z:p[1],y:p[2],s:0});
  }
  points.push({...points[0]});
  let length=0;
  for(let i=0;i<points.length-1;i++) {
    const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z,segment=hypot(dx,dz);
    if(segment<.01) throw new Error('DEGENERATE_TRACK');
    Object.assign(a,{s:length,segment,tx:dx/segment,tz:dz/segment,nx:dz/segment,nz:-dx/segment,slope:Math.atan2(b.y-a.y,segment)});
    length+=segment;
  }
  points.at(-1).s=length;
  const track={...def,reverse,points,length,interval:length/GATE_COUNT};
  track.gates=Array.from({length:GATE_COUNT},(_,i)=>sampleTrack(track,i*track.interval));
  return track;
}
export function sampleTrack(track,distance,offset=0) {
  const s=wrap(distance,track.length), p=track.points;
  let lo=0,hi=p.length-2;
  while(lo<hi) {const mid=(lo+hi+1)>>1;if(p[mid].s<=s)lo=mid;else hi=mid-1;}
  const a=p[lo],b=p[lo+1],t=clamp((s-a.s)/a.segment,0,1);
  return {x:a.x+(b.x-a.x)*t+a.nx*offset,z:a.z+(b.z-a.z)*t+a.nz*offset,y:a.y+(b.y-a.y)*t,
    tx:a.tx,tz:a.tz,nx:a.nx,nz:a.nz,heading:Math.atan2(a.tx,a.tz),slope:a.slope,s,index:lo};
}
export function nearestTrack(track,x,z) {
  let best=null,dist2=Infinity;
  for(let i=0;i<track.points.length-1;i++) {
    const a=track.points[i],b=track.points[i+1];
    const t=clamp(((x-a.x)*a.tx+(z-a.z)*a.tz)/a.segment,0,1);
    const px=a.x+(b.x-a.x)*t,pz=a.z+(b.z-a.z)*t,dx=x-px,dz=z-pz,d=dx*dx+dz*dz;
    if(d<dist2) {dist2=d;best={...a,x:px,z:pz,y:a.y+(b.y-a.y)*t,s:a.s+t*a.segment,lateral:dx*a.nx+dz*a.nz,index:i,heading:Math.atan2(a.tx,a.tz)};}
  }
  return best;
}
export function segmentDistance(ax,az,bx,bz,x,z) {
  const dx=bx-ax,dz=bz-az,n=dx*dx+dz*dz;
  const t=n>1e-9?clamp(((x-ax)*dx+(z-az)*dz)/n,0,1):0;
  return hypot(ax+t*dx-x,az+t*dz-z);
}
function event(race,type,value=0) { if(race.events.length<48)race.events.push({type,value}); }
export const driftTier = bank => bank>=2?3:bank>=1.2?2:bank>=.4?1:0;
function carAt(track,id,stats,s,offset) {
  const p=sampleTrack(track,s,offset);
  return {id,stats,x:p.x,z:p.z,y:p.y,prevX:p.x,prevZ:p.z,prevY:p.y,yaw:p.heading,prevYaw:p.heading,motion:p.heading,
    slope:p.slope,speed:0,steer:0,nitro:stats.tank,boost:false,miniBoost:0,driftBank:0,drifting:false,driftSeconds:0,
    contacts:0,contactCooldown:0,impact:0,draftCharge:0,draftBoost:0,driftLevel:0,boostLevel:0,gates:-1,nextGate:0,completedLaps:0,progress:s,near:nearestTrack(track,p.x,p.z),
    collected:new Set(),ringCount:0,padCooldown:0,resetCount:0,lastReset:-10,finished:false,finishTime:Infinity};
}
export function createRace(stageId,save={},options={}) {
  const stage=STAGES[stageId-1];
  if(!stage)throw new RangeError('UNKNOWN_STAGE');
  const track=buildTrack(stage.track,stage.reverse),stats=vehicleStats(save.vehicle||0,save.tuning||{});
  const player=carAt(track,0,stats,-23,1.8);player.nitro=stats.tank*stage.fuel;
  const cars=[player];
  for(let id=1;id<=stage.rivals;id++) {
    const opponent=vehicleStats((id+stage.arc)%4,{});
    cars.push(carAt(track,id,opponent,-6-Math.floor((id-1)/2)*7,id%2?-2:2));
  }
  const race={id:options.id||globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`,
    stage,track,cars,player,time:0,penalty:0,countdown:3,status:'countdown',result:null,events:[],lastCountdown:3,
    cones:stage.cones.map(([s,l])=>sampleTrack(track,s*track.length,l*track.width)),
    rings:stage.rings.map(([s,l])=>sampleTrack(track,s*track.length,l*track.width)),
    pads:stage.pads.map(([s,l])=>sampleTrack(track,s*track.length,l*track.width)),rank:cars.length,lastOvertake:-10};
  return race;
}
export function aiControl(race,car) {
  const {track,stage}=race;
  const lane=Math.sin(car.id*2.8+car.near.s/70)*1.4;
  const target=sampleTrack(track,car.near.s+10+car.speed*.52,lane);
  const direction=Math.atan2(target.x-car.x,target.z-car.z),error=angle(direction-car.yaw);
  const ahead=sampleTrack(track,car.near.s+25);
  const curvature=Math.abs(angle(ahead.heading-car.near.heading));
  const skill=stage.skill+(car.id%3)*.018;
  const desired=clamp(car.stats.speed*skill/(1+curvature*1.5),12,car.stats.speed);
  return {steer:clamp(error*1.8,-1,1),throttle:car.speed<desired?1:.08,brake:car.speed>desired+1?clamp((car.speed-desired)/8,0,.85):0,
    drift:false,boost:Math.abs(error)<.085&&curvature<.14&&car.nitro>.42&&car.speed>18};
}
function countContact(race,car) {
  if(car.contactCooldown<=0) {
    car.contacts++;car.contactCooldown=.55;car.impact=1;
    car.driftBank=0;car.driftLevel=0;car.draftCharge=0;car.draftBoost=0;car.miniBoost=0;
    if(car.id===0)event(race,'contact');
  }
}
function checkpointCross(race,car,ax,az) {
  const gate=race.track.gates[car.nextGate];
  const before=(ax-gate.x)*gate.tx+(az-gate.z)*gate.tz;
  const after=(car.x-gate.x)*gate.tx+(car.z-gate.z)*gate.tz;
  if(before<=0&&after>0) {
    const fraction=clamp(-before/(after-before),0,1);
    const x=ax+(car.x-ax)*fraction,z=az+(car.z-az)*fraction;
    const lateral=Math.abs((x-gate.x)*gate.nx+(z-gate.z)*gate.nz);
    if(lateral<=race.track.width+1.35) {
      car.gates++;car.nextGate=(car.nextGate+1)%GATE_COUNT;
      const laps=Math.max(0,Math.floor(car.gates/GATE_COUNT));
      if(laps>car.completedLaps&&car.id===0)event(race,'lap',laps);
      car.completedLaps=laps;
      if(laps>=race.stage.laps) {
        car.finished=true;car.finishTime=race.time-STEP+STEP*fraction+(car.id===0?race.penalty:0);
        car.boost=false;car.drifting=false;
      }
    }
  }
}
function moveCar(race,car,input,dt) {
  if(car.finished)return;
  const {stage,track}=race;
  car.prevX=car.x;car.prevZ=car.z;car.prevY=car.y;car.prevYaw=car.yaw;
  car.contactCooldown=Math.max(0,car.contactCooldown-dt);car.padCooldown=Math.max(0,car.padCooldown-dt);
  car.miniBoost=Math.max(0,car.miniBoost-dt);
  car.draftBoost=Math.max(0,car.draftBoost-dt);car.impact=Math.max(0,car.impact-dt*4);
  const steer=clamp(Number(input.steer)||0,-1,1),throttle=clamp(Number(input.throttle)||0,0,1),brake=clamp(Number(input.brake)||0,0,1);
  car.steer+=(steer-car.steer)*Math.min(1,dt*12);
  const onRoad=Math.abs(car.near.lateral)<track.width-.25;
  const position=car.near.s/track.length;
  const wet=stage.wet.some(([from,to])=>position>=from&&position<=to);
  const drifting=Boolean(input.drift)&&Math.abs(steer)>.18&&car.speed>10&&onRoad&&car.contactCooldown<=0;
  if(drifting) {
    car.driftBank=clamp(car.driftBank+dt*car.stats.drift,0,2.4);car.driftSeconds+=dt;
    const tier=driftTier(car.driftBank);
    if(tier>car.driftLevel&&car.id===0)event(race,'driftCharge',tier);
    car.driftLevel=tier;
    if(!stage.noRefill)car.nitro=Math.min(car.stats.tank,car.nitro+dt*.11*car.stats.drift);
  } else if(car.drifting) {
    const tier=onRoad&&car.contactCooldown<=0?driftTier(car.driftBank):0;
    if(tier) {
      car.miniBoost=[0,.65,1.05,1.5][tier];car.boostLevel=tier;
      car.speed=Math.min(car.stats.speed+7,car.speed+2+tier*1.5);
      if(car.id===0)event(race,'driftBoost',tier);
    }
    car.driftBank=0;car.driftLevel=0;
  }
  car.drifting=drifting;
  const oldBoost=car.boost;
  car.boost=Boolean(input.boost)&&car.nitro>.015&&car.speed>4;
  if(car.boost)car.nitro=Math.max(0,car.nitro-dt*.32);
  else if(!stage.noRefill&&car.speed>5)car.nitro=Math.min(car.stats.tank,car.nitro+dt*.014);
  if(car.boost&&!oldBoost&&car.id===0)event(race,'boost');
  let drafting=false;
  if(car.speed>13&&onRoad&&car.contactCooldown<=0)for(const other of race.cars) {
    if(other===car||other.finished)continue;
    const dx=other.x-car.x,dz=other.z-car.z,forward=dx*Math.sin(car.yaw)+dz*Math.cos(car.yaw),side=dx*Math.cos(car.yaw)-dz*Math.sin(car.yaw);
    if(forward>4&&forward<22&&Math.abs(side)<2.3&&Math.abs(angle(other.yaw-car.yaw))<.28) {drafting=true;break;}
  }
  car.drafting=drafting;
  if(drafting) {
    const before=car.draftCharge;car.draftCharge=Math.min(1.4,before+dt);
    if(before<1.4&&car.draftCharge>=1.4&&car.id===0)event(race,'draftReady');
  }else if(car.draftCharge>=1.4) {
    if(onRoad&&car.contactCooldown<=0) {
      car.draftBoost=.85;car.speed=Math.min(car.stats.speed+5,car.speed+3);
      if(car.id===0)event(race,'draftBoost');
    }
    car.draftCharge=0;
  }else car.draftCharge=Math.max(0,car.draftCharge-dt*2);
  if(drafting&&!stage.noRefill)car.nitro=Math.min(car.stats.tank,car.nitro+dt*.035);
  const maxSpeed=(onRoad?car.stats.speed:15)+(car.boost?11:0)+(car.miniBoost>0?7:0)+(car.draftBoost>0?5:0)+(drafting?2:0);
  const acceleration=throttle*(car.stats.acceleration+(car.boost?8:0)+(car.miniBoost>0?10:0)+(car.draftBoost>0?6:0))-brake*34-(1.1+car.speed*car.speed*.0024)-(drifting?1.3:0);
  car.speed=clamp(car.speed+acceleration*dt,0,maxSpeed);
  const yawRate=(.35+1.85*clamp(car.speed/car.stats.speed,0,1))*(drifting?1.18:1);
  car.yaw=angle(car.yaw+car.steer*yawRate*dt);
  const grip=car.stats.grip*(wet?.55:1)*(drifting?.35:1);
  car.motion=angle(car.motion+angle(car.yaw-car.motion)*Math.min(1,grip*dt));
  car.x+=Math.sin(car.motion)*car.speed*dt;car.z+=Math.cos(car.motion)*car.speed*dt;
  car.inWind=false;
  if(stage.wind&&position>=stage.wind[0]&&position<=stage.wind[1]) {
    const push=stage.wind[2]*(.75+.25*Math.sin(race.time*1.5));
    car.x+=car.near.nx*push*dt;car.z+=car.near.nz*push*dt;car.inWind=true;
  }
  car.near=nearestTrack(track,car.x,car.z);car.y=car.near.y;car.slope=car.near.slope;
  if(Math.abs(car.near.lateral)>track.width+1.25) {
    const edge=Math.sign(car.near.lateral)*(track.width+1.25);
    car.x=car.near.x+car.near.nx*edge;car.z=car.near.z+car.near.nz*edge;
    car.speed*=Math.pow(.15,dt);countContact(race,car);
    // A glancing impact scrubs speed; it never teleports along the course.
    car.near=nearestTrack(track,car.x,car.z);
  }
  for(const cone of race.cones)if(segmentDistance(car.prevX,car.prevZ,car.x,car.z,cone.x,cone.z)<1.4) {
    if(car.contactCooldown<=0)car.speed*=.60;countContact(race,car);
  }
  if(car.padCooldown<=0)for(const pad of race.pads)if(segmentDistance(car.prevX,car.prevZ,car.x,car.z,pad.x,pad.z)<2.7) {
    car.miniBoost=Math.max(car.miniBoost,1.25);car.boostLevel=2;car.speed=Math.min(car.stats.speed+7,car.speed+5);car.padCooldown=1.5;if(car.id===0)event(race,'pad');break;
  }
  if(car.id===0)race.rings.forEach((ring,i)=>{
    const key=`${car.completedLaps}:${i}`;
    if(!car.collected.has(key)&&segmentDistance(car.prevX,car.prevZ,car.x,car.z,ring.x,ring.z)<2.2) {
      car.collected.add(key);car.ringCount++;const before=car.nitro;if(!stage.noRefill)car.nitro=Math.min(car.stats.tank,car.nitro+.08);
      if(race.events.length<48)race.events.push({type:'ring',value:car.ringCount,refilled:car.nitro>before,source:{x:ring.x,y:ring.y+1.7,z:ring.z}});
    }
  });
  checkpointCross(race,car,car.prevX,car.prevZ);
  if(car.gates<0)car.progress=-hypot(car.x-track.gates[0].x,car.z-track.gates[0].z);
  else {
    const within=wrap(car.near.s-(car.gates%GATE_COUNT)*track.interval,track.length);
    car.progress=car.gates*track.interval+(within<track.interval*1.6?clamp(within,0,track.interval):0);
  }
}
export function positions(race) {
  return [...race.cars].sort((a,b)=>a.finished&&b.finished?a.finishTime-b.finishTime:a.finished?-1:b.finished?1:b.progress-a.progress||a.id-b.id);
}
export function settle(race,timeout=false) {
  if(race.result)return race.result;
  const {player:p,stage:s}=race,time=race.time+race.penalty,rank=positions(race).findIndex(c=>c.id===0)+1;
  const goals={finish:p.finished&&!timeout,position:rank<=s.place,drift:p.driftSeconds+1e-6>=s.drift,
    rings:p.ringCount>=s.collect,clean:p.contacts<=s.contactCap,time:time<=s.limit};
  const success=Object.values(goals).every(Boolean);
  const stars=success?1+Number(time<=s.par)+Number(time<=s.ace&&p.resetCount===0):0;
  race.status='result';race.rank=rank;
  race.result={runId:race.id,stageId:s.id,success,stars,time,rank,goals,drift:p.driftSeconds,rings:p.ringCount,contacts:p.contacts,resets:p.resetCount,
    progress:clamp(p.progress/(race.track.length*s.laps),0,1)};
  event(race,success?'win':'lose');return race.result;
}
export function stepRace(race,input={},dt=STEP) {
  if(!Number.isFinite(dt)||dt<=0||dt>STEP+1e-8)throw new RangeError('FIXED_STEP_REQUIRED');
  if(race.status==='result'||race.status==='paused')return;
  if(race.status==='countdown') {
    race.countdown=Math.max(0,race.countdown-dt);
    const count=Math.ceil(race.countdown);
    if(count!==race.lastCountdown) {event(race,'countdown',count);race.lastCountdown=count;}
    if(race.countdown===0) {race.status='running';event(race,'go');}
    return;
  }
  race.time+=dt;
  for(const car of race.cars)moveCar(race,car,car.id===0?input:aiControl(race,car),dt);
  for(let i=0;i<race.cars.length;i++)for(let j=i+1;j<race.cars.length;j++) {
    const a=race.cars[i],b=race.cars[j];if(a.finished||b.finished)continue;
    const dx=b.x-a.x,dz=b.z-a.z,d=hypot(dx,dz),minimum=2.05;
    if(d>0&&d<minimum) {
      const correction=(minimum-d)*.5,nx=dx/d,nz=dz/d;
      a.x-=nx*correction/a.stats.mass;a.z-=nz*correction/a.stats.mass;b.x+=nx*correction/b.stats.mass;b.z+=nz*correction/b.stats.mass;
      if(a.contactCooldown<=0&&b.contactCooldown<=0) {a.speed*=.92;b.speed*=.92;}
      countContact(race,a);countContact(race,b);
    }
  }
  const previousRank=race.rank;
  race.rank=positions(race).findIndex(c=>c.id===0)+1;
  if(race.rank<previousRank&&race.time>3&&race.time-race.lastOvertake>1.2&&!race.player.finished) {
    race.lastOvertake=race.time;event(race,'overtake',race.rank);
  }
  if(race.player.finished)settle(race);
  else if(race.time+race.penalty>=race.stage.limit)settle(race,true);
}
export function recoverCar(race) {
  if(race.status!=='running'||race.time-race.player.lastReset<2)return false;
  const car=race.player,s=car.gates<0?-4:(car.gates%GATE_COUNT)*race.track.interval+2.5,p=sampleTrack(race.track,s);
  Object.assign(car,{x:p.x,z:p.z,y:p.y,prevX:p.x,prevZ:p.z,prevY:p.y,yaw:p.heading,prevYaw:p.heading,motion:p.heading,speed:8,
    miniBoost:0,nitro:0,driftBank:0,driftLevel:0,boostLevel:0,draftCharge:0,draftBoost:0,drafting:false,impact:0,drifting:false,steer:0,lastReset:race.time});
  car.near=nearestTrack(race.track,p.x,p.z);car.resetCount++;race.penalty+=3;event(race,'recover');return true;
}
export function pauseRace(race) {
  if(race&&(race.status==='running'||race.status==='countdown')) {race.beforePause=race.status;race.status='paused';}
}
export function resumeRace(race) {
  if(race?.status==='paused')race.status=race.beforePause||'running';
}
