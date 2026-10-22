// The only owner of movement, contact, pickups and outcomes. Renderer is read-only.
export const STEP = 1 / 120;
export const SPEED = 235;
export const JUMP = 660;
export const GRAVITY = 1100;
export function createRun(stage) {
  return { stage, time:0, moves:0, score:0, done:false, success:false, shards:new Set(), switches:new Set(),
    bodies:stage.floors.map((floor,lane)=>({lane,x:92,y:floor,vx:0,vy:0,w:38,h:66,ground:true,coyote:.12,buffer:0,land:0,jump:0})),
    events:[], action:'ready', failureLane:-1, exits:0 };
}
export function requestJump(s) {
  if(s.done)return;
  s.moves++; s.action='jump';
  for(const b of s.bodies)b.buffer=.15;
  if(s.bodies.every(b=>!b.ground&&b.coyote<=0))s.events.push({type:'reject'});
}
const overlap=(b,h)=>b.x+b.w/2>h.x&&b.x-b.w/2<h.x+h.w&&b.y>h.y&&b.y-b.h<h.y+h.h;
const near=(b,p)=>Math.abs(b.x-p.x)<b.w/2+17&&p.y>b.y-b.h-14&&p.y<b.y+14;
export function stepRun(s,axis,dt=STEP) {
  if(s.done)return;
  s.time+=dt;
  for(const b of s.bodies){
    b.coyote=b.ground?.12:Math.max(0,b.coyote-dt);
    b.buffer=Math.max(0,b.buffer-dt);
    b.land=Math.max(0,b.land-dt);b.jump=Math.max(0,b.jump-dt);
    if(b.buffer>0&&b.coyote>0){b.buffer=0;b.coyote=0;b.ground=false;b.vy=-JUMP;b.jump=.18;s.events.push({type:'jump',lane:b.lane,x:b.x,y:b.y});}
    const previous=b.y,grounded=b.ground;
    b.vx=axis*SPEED;b.x=Math.max(25,Math.min(935,b.x+b.vx*dt));
    b.vy+=GRAVITY*dt;b.y+=b.vy*dt;b.ground=false;
    let surface=s.stage.floors[b.lane];
    for(const p of s.stage.platforms[b.lane])if(b.vy>=0&&previous<=p.y+.01&&b.y>=p.y&&b.x+b.w/2>p.x&&b.x-b.w/2<p.x+p.w)surface=Math.min(surface,p.y);
    if(b.y>=surface){b.y=surface;b.vy=0;b.ground=true;}
    if(!grounded&&b.ground){b.land=.17;s.events.push({type:'land',lane:b.lane,x:b.x,y:b.y});}
    if((s.stage.hazards[b.lane]||[]).some(h=>overlap(b,h))){s.done=true;s.failureLane=b.lane;s.events.push({type:'hit',lane:b.lane,x:b.x,y:b.y});return;}
  }
  s.stage.shards.forEach((p,i)=>{if(!s.shards.has(i)&&near(s.bodies[p.lane],p)){s.shards.add(i);s.score+=100;s.events.push({type:'shard',lane:p.lane,x:p.x,y:p.y,index:i});}});
  s.stage.switches.forEach((p,i)=>{if(!s.switches.has(i)&&near(s.bodies[p.lane],p)){s.switches.add(i);s.events.push({type:'switch',lane:p.lane,x:p.x,y:p.y,index:i});if(s.switches.size===s.stage.switches.length)s.events.push({type:'gate'});}});
  s.exits=s.bodies.filter((b,i)=>b.x>=s.stage.gates[i].x-24&&Math.abs(b.y-s.stage.floors[i])<40).length;
  if(s.shards.size===s.stage.shards.length&&s.switches.size===s.stage.switches.length&&s.exits===2){s.done=true;s.success=true;s.score+=Math.max(0,500-Math.floor(s.time*5));s.events.push({type:'win'});}
}
