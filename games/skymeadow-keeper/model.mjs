import {STAGES,SPECIES,FOOD,PRODUCE,RESEARCH,stageById,createWorld} from './campaign.mjs?wp-media=bb72a7777a2deab8';
export const SAVE_KEY='weightplay:skymeadow-keeper:v1';
export const clone=x=>JSON.parse(JSON.stringify(x));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const inside=(r,x,z,pad=0)=>Math.abs(x-r.x)<=r.w/2+pad&&Math.abs(z-r.z)<=r.d/2+pad;
export function freshProfile(){return {schema:1,cleared:[],research:0,upgrades:[],specialism:'balanced',run:null};}
export function limits(profile){return {range:profile.upgrades.includes('lens')?8:6,herd:(profile.specialism==='guardian'?4:profile.specialism==='swift'?2:3)+(profile.upgrades.includes('bell')?1:0),speed:4.2*(profile.specialism==='swift'?1.1:1)*(profile.upgrades.includes('bell')?.9:1)};}
export function heightAt(state,x,z){return state.stage.layout==='terraces'?clamp((-z-8)*.15,0,3):0;}
export function windSheltered(state,zone){return state.anchors.some(a=>distance(a,zone)<9);}
export function terrainAt(state,x,z){
  const w=state.world;
  if(w.obstacles.some(r=>inside(r,x,z,.28)))return 'wall';
  if(!w.land.some(r=>inside(r,x,z))&&!w.bridges.some(b=>b.built&&inside(b,x,z))) {
    if(w.zones.some(r=>r.type==='water'&&inside(r,x,z)))return 'water';
    return 'gap';
  }
  for(const r of w.zones)if(inside(r,x,z)){
    if(r.type==='wind'&&!w.objects.find(o=>o.id===r.gate)?.open&&!windSheltered(state,r))return 'wind';
    if(r.type==='door'&&!w.objects.find(o=>o.id===r.plate)?.latched)return 'door';
    if(r.type==='thorn'&&!w.bridges.some(b=>b.built))return 'thorn';
  }
  return 'ground';
}
export function walkable(state,x,z,actor='player'){
  const b=state.world.bounds;
  if(x<b.minX||x>b.maxX||z<b.minZ||z>b.maxZ)return false;
  const t=terrainAt(state,x,z);
  if(actor==='fox'&&!lit(state,{x,z}))return false;
  if(t==='wall'||t==='door')return false;
  if(actor==='bird')return true;
  if(t==='water')return actor==='otter';
  if(t==='gap')return false;
  if(t==='wind')return actor==='player';
  if(t==='thorn')return actor!=='deer';
  return true;
}
export function visible(state,a,b){
  const n=Math.max(1,Math.ceil(distance(a,b)*3));
  for(let i=1;i<n;i++){
    const t=terrainAt(state,a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n);
    if(t==='wall'||t==='door')return false;
  }
  return true;
}
export function nearestGround(state,point,actor='player'){
  for(let r=0;r<=12;r++)for(let x=-r;x<=r;x++)for(let z=-r;z<=r;z++) {
    if(r>0&&Math.abs(x)!==r&&Math.abs(z)!==r)continue;
    const p={x:Math.round(point.x)+x,z:Math.round(point.z)+z};
    if(walkable(state,p.x,p.z,actor)&&terrainAt(state,p.x,p.z)==='ground')return p;
  }
  return {...state.world.camp};
}
export function findPath(state,from,to,actor='player'){
  const start={x:Math.round(from.x),z:Math.round(from.z)},end={x:Math.round(to.x),z:Math.round(to.z)};
  if(!walkable(state,end.x,end.z,actor))return [];
  const key=p=>`${p.x},${p.z}`,queue=[start],seen=new Map([[key(start),null]]);
  for(let at=0;at<queue.length&&at<4000;at++){
    const p=queue[at];
    if(p.x===end.x&&p.z===end.z){
      const result=[];let current=p;
      while(current){result.push(current);current=seen.get(key(current));}
      return result.reverse();
    }
    const choices=[[1,0],[-1,0],[0,1],[0,-1]].sort((a,b)=>Math.abs(p.x+a[0]-end.x)+Math.abs(p.z+a[1]-end.z)-Math.abs(p.x+b[0]-end.x)-Math.abs(p.z+b[1]-end.z));
    for(const [dx,dz] of choices){
      const next={x:p.x+dx,z:p.z+dz},k=key(next);
      if(!seen.has(k)&&walkable(state,next.x,next.z,actor)){seen.set(k,p);queue.push(next);}
    }
  }
  return [];
}
export function createRun(id,profile=freshProfile()){
  const stage=stageById(id);if(!stage)throw new Error('unknownStage');
  const state={schema:1,stage,world:createWorld(stage),player:{x:0,z:8,y:0,yaw:0,pitch:0,vy:0,safe:{x:0,z:8}},food:{berry:0,root:0,nectar:0},produce:[0,0,0],beacons:3,anchors:[],events:[],time:0,status:'active',finalTime:0,selectedFood:'berry',tool:'feed',stats:{harvest:0,feed:0,homes:0,falls:0,builds:0,anchors:0,relocations:0},limits:limits(profile),upgrades:[...profile.upgrades],specialism:profile.specialism,freeAnchorUsed:false};
  for(const a of state.world.animals)Object.assign(a,nearestGround(state,a,a.species));
  for(const o of state.world.objects)if(o.type==='food')Object.assign(o,nearestGround(state,o));
  return state;
}
function event(s,type,data={}){s.events.push({type,time:s.time,...data});if(s.events.length>40)s.events.shift();}
function fail(s,reason){event(s,'reject',{reason});return {ok:false,reason};}
function ok(s,type,data={}){event(s,type,data);return {ok:true,...data};}
export function allTargets(s){return [...s.world.objects,...s.world.habitats,...s.world.animals.map(a=>({...a,type:'animal'})),{...s.world.tree,id:'windtree',type:'tree'},...s.anchors.map(a=>({...a,type:'anchor'}))];}
export function targetAt(s){
  const direction={x:-Math.sin(s.player.yaw),z:-Math.cos(s.player.yaw)};
  const fog=s.stage.rules.includes('fog')&&!s.world.lamps.some(l=>distance(l,s.player)<4)&&!s.anchors.some(a=>distance(a,s.player)<7);
  const range=fog?Math.min(3.5,s.limits.range):s.limits.range;
  return allTargets(s).filter(o=>!o.taken&&(o.type!=='food'||o.remaining>0)).map(o=>{
    const d=distance(o,s.player),dot=((o.x-s.player.x)*direction.x+(o.z-s.player.z)*direction.z)/Math.max(.01,d);
    return {o,d,dot};
  }).filter(t=>t.d<=range&&t.dot>.92&&visible(s,s.player,t.o)).sort((a,b)=>(1-a.dot)*8+a.d*.1-((1-b.dot)*8+b.d*.1))[0]?.o||null;
}
export function reachable(s,target,range=s.limits.range){return distance(s.player,target)<=range&&visible(s,s.player,target);}
const residentCount=(s,id)=>s.world.animals.filter(a=>a.home===id).length;
function giveProduce(s,a){
  const yieldValue=[...SPECIES[a.species].yield];
  if(s.upgrades.includes('garden')&&s.stats.feed%3===0)yieldValue[yieldValue.findIndex(v=>v>0)]++;
  if(s.produce.reduce((a,b)=>a+b,0)+yieldValue.reduce((a,b)=>a+b,0)>30)return false;
  yieldValue.forEach((v,i)=>s.produce[i]+=v);event(s,'produce',{id:a.id,amount:yieldValue,from:{x:a.x,z:a.z}});return true;
}
export function feed(s,id,food=s.selectedFood){
  if(s.status!=='active')return {ok:false,reason:'inactive'};
  const a=s.world.animals.find(a=>a.id===id);
  if(!a||!reachable(s,a))return fail(s,'outOfReach');
  if(SPECIES[a.species].food!==food)return fail(s,'wrongFood');
  if(s.food[food]<=0)return fail(s,'noFood');
  if(a.state!=='home'&&a.fed>0)return fail(s,'alreadyFed');
  if(a.state==='home'&&s.produce.reduce((a,b)=>a+b,0)+SPECIES[a.species].yield.reduce((a,b)=>a+b,0)+(s.upgrades.includes('garden')?1:0)>30)return fail(s,'produceFull');
  if(a.state!=='home'&&s.world.animals.filter(a=>a.state==='follow').length>=s.limits.herd)return fail(s,'herdFull');
  s.food[food]--;a.fed++;s.stats.feed++;
  if(a.state==='home')giveProduce(s,a);else{a.state='follow';a.repath=0;}
  return ok(s,'feed',{id:a.id,from:{x:s.player.x,z:s.player.z},to:{x:a.x,z:a.z},food});
}
export function guide(s,id){
  const a=s.world.animals.find(a=>a.id===id);
  if(s.status!=='active'||!a||!reachable(s,a))return fail(s,'outOfReach');
  if(!a.fed||a.state==='home')return fail(s,'feedFirst');
  if(a.state!=='follow'&&s.world.animals.filter(a=>a.state==='follow').length>=s.limits.herd)return fail(s,'herdFull');
  a.state=a.state==='follow'?'wait':'follow';a.path=[];a.repath=0;
  return ok(s,'guide',{id:a.id,following:a.state==='follow'});
}
export function setHabitat(s,id,recipe){
  const h=s.world.habitats.find(h=>h.id===id);
  if(!h||!['grass','water','flower'].includes(recipe))return fail(s,'badHabitat');
  if(!reachable(s,h))return fail(s,'outOfReach');
  if(residentCount(s,id)>0)return fail(s,'habitatOccupied');
  h.recipe=recipe;return ok(s,'habitat',{id,recipe});
}
export function homeAnimals(s,id){
  const h=s.world.habitats.find(h=>h.id===id);
  if(!h||!reachable(s,h)||!h.recipe)return fail(s,'badHabitat');
  let count=0;
  for(const a of s.world.animals){
    if(a.state==='home'||!a.fed||distance(a,h)>5||!visible(s,a,h)||SPECIES[a.species].habitat!==h.recipe)continue;
    if(residentCount(s,id)>=6)return fail(s,'habitatFull');
    if(!giveProduce(s,a))return fail(s,'produceFull');
    a.home=id;a.state='home';a.path=[];a.homeSlot=residentCount(s,id)-1;
    // Walk the last steps; renderer never teleports a resident into its pen.
    a.homeTarget={x:h.x+((a.homeSlot%3)-1)*1.2,z:h.z+(Math.floor(a.homeSlot/3)-.5)*1.4};
    s.stats.homes++;count++;event(s,'home',{id:a.id});
  }
  return count?{ok:true,count}:fail(s,'bringCloser');
}
export function requirements(s){
  const r=s.stage.rules,needs=[];
  const demanded={};for(const name of s.stage.residents)demanded[name]=(demanded[name]||0)+1;
  for(const [species,n] of Object.entries(demanded)){const have=s.world.animals.filter(a=>a.species===species&&a.state==='home').length;if(have<n)needs.push({type:'resident',species,have,need:n});}
  s.stage.quota.forEach((need,i)=>{const have=s.produce[i]+(s.deposited?.[i]||0);if(have<need)needs.push({type:'produce',resource:PRODUCE[i],have,need});});
  if(r.includes('build')&&s.stats.builds===0)needs.push({type:'build'});
  if(r.includes('plate')&&!s.world.objects.filter(o=>o.type==='plate').every(o=>o.latched))needs.push({type:'plate'});
  if(r.includes('anchor')&&s.stats.anchors<(r.includes('double')?2:1))needs.push({type:'anchor'});
  if(r.includes('relocate')&&s.stats.relocations===0)needs.push({type:'relocate'});
  if(r.includes('floating')&&!s.world.bridges.some(b=>b.type==='floating'&&b.built))needs.push({type:'floating'});
  return needs;
}
export function interact(s,id){
  if(s.status!=='active')return {ok:false,reason:'inactive'};
  const o=allTargets(s).find(o=>o.id===id);
  if(!o||!reachable(s,o))return fail(s,'outOfReach');
  if(o.type==='animal')return s.tool==='guide'?guide(s,id):feed(s,id);
  if(o.type==='habitat')return homeAnimals(s,id);
  if(o.type==='tree'){
    s.deposited ||= [0,0,0];
    let deposited=0;
    s.stage.quota.forEach((need,i)=>{const n=Math.min(s.produce[i],need-s.deposited[i]);s.produce[i]-=n;s.deposited[i]+=n;deposited+=n;});
    const needs=requirements(s);if(needs.length)return fail(s,'goalsRemain');
    s.status='finishing';s.finalTime=0;return ok(s,'restore',{from:{...s.player},to:{...s.world.tree}});
  }
  if(o.type==='anchor'){
    s.anchors=s.anchors.filter(a=>a.id!==id);s.stats.relocations++;
    updateFloating(s);return ok(s,'anchorRecall',{id});
  }
  if(o.type==='food'){
    const live=s.world.objects.find(x=>x.id===id);
    if(live.remaining<=0)return fail(s,'emptyPlant');
    if(live.pollen&&!s.anchors.some(a=>distance(a,live)<10))return fail(s,'needsWind');
    const n=Math.min(2,live.remaining,12-s.food[o.food]);if(n<=0)return fail(s,'foodFull');
    s.food[o.food]+=n;live.remaining-=n;s.stats.harvest+=n;return ok(s,'collect',{id,food:o.food,amount:n,from:{x:o.x,z:o.z}});
  }
  if(o.type==='gate'){
    const gate=s.world.objects.find(x=>x.id===id);gate.open=!gate.open;
    if(s.stage.rules.includes('twin'))for(const g of s.world.objects.filter(x=>x.type==='gate'&&x.id!==id))g.open=!gate.open;
    return ok(s,'gate',{id,open:gate.open});
  }
  if(o.type==='build'){
    const b=s.world.bridges.find(b=>b.id===id);if(b.built)return fail(s,'alreadyBuilt');
    if(s.produce[1]<b.cost)return fail(s,'needSeed');
    s.produce[1]-=b.cost;b.built=true;s.stats.builds++;return ok(s,'build',{id,from:{x:b.x,z:b.z}});
  }
  if(o.type==='supply'){
    const live=s.world.objects.find(x=>x.id===id);if(live.taken)return fail(s,'emptyPlant');
    live.taken=true;live.produce.forEach((v,i)=>s.produce[i]+=v);return ok(s,'supply',{id});
  }
  if(o.type==='relay'){
    s.player.safe={x:o.x,z:o.z};return ok(s,'relay',{id});
  }
  if(o.type==='cache'){
    if(s.produce[1]<2)return fail(s,'needSeed');
    const live=s.world.objects.find(x=>x.id===id);if(live.taken)return fail(s,'emptyPlant');
    live.taken=true;s.produce[1]-=2;s.produce[0]+=2;return ok(s,'cache',{id});
  }
  return fail(s,o.type==='plate'?'needsTurtle':'needsAnchor');
}
function updateFloating(s){for(const b of s.world.bridges.filter(b=>b.type==='floating'))b.built=s.anchors.some(a=>distance(a,b)<13&&a.direction===1);}
export function placeAnchor(s,point,direction=1){
  if(s.status!=='active'||!s.stage.rules.includes('anchor'))return fail(s,'lockedTool');
  if(s.anchors.length>=2)return fail(s,'anchorFull');
  if(!point||distance(s.player,point)>8||!visible(s,s.player,point)||!walkable(s,point.x,point.z)||s.world.habitats.some(h=>distance(h,point)<3))return fail(s,'badPlacement');
  if(s.anchors.some(a=>distance(a,point)<3))return fail(s,'anchorSpacing');
  const free=s.upgrades.includes('circuit')&&s.stats.anchors>=1&&!s.freeAnchorUsed;
  if(!free&&s.produce[2]<1)return fail(s,'needFeather');
  if(free)s.freeAnchorUsed=true;else s.produce[2]--;
  const a={id:`anchor-${++s.stats.anchors}`,x:point.x,z:point.z,direction:direction===1?1:-1};s.anchors.push(a);updateFloating(s);return ok(s,'anchorPlace',{id:a.id,from:{...point}});
}
function movePoint(s,p,dx,dz,actor){
  if(walkable(s,p.x+dx,p.z,actor))p.x+=dx;
  if(walkable(s,p.x,p.z+dz,actor))p.z+=dz;
}
function lit(s,a){return s.world.lamps.some(l=>distance(l,a)<=l.radius)||distance(s.world.camp,a)<11;}
export function step(s,dt,input={}){
  if(!Number.isFinite(dt)||dt<=0||dt>.1)return;
  if(s.status==='finishing'||s.status==='failing'){s.finalTime+=dt;if(s.finalTime>=1.25)s.status=s.status==='finishing'?'won':'lost';return;}
  if(s.status!=='active')return;
  s.time+=dt;const p=s.player;
  p.yaw+=(input.lookX||0);p.pitch=clamp(p.pitch+(input.lookY||0),-1.13,1.13);
  const ix=clamp(input.x||0,-1,1),iz=clamp(input.z||0,-1,1),len=Math.max(1,Math.hypot(ix,iz)),speed=s.limits.speed*(terrainAt(s,p.x,p.z)==='wind'?.65:1);
  const dx=(Math.cos(p.yaw)*ix+Math.sin(p.yaw)*iz)/len*speed*dt,dz=(-Math.sin(p.yaw)*ix+Math.cos(p.yaw)*iz)/len*speed*dt;
  const ground=heightAt(s,p.x,p.z);
  if(input.jump&&p.y<=ground+.01&&walkable(s,p.x,p.z))p.vy=5.3;
  // Walls stay solid in the air; gaps are intentional fall/jump opportunities.
  if(!['wall','door'].includes(terrainAt(s,p.x+dx,p.z)))p.x+=dx;
  if(!['wall','door'].includes(terrainAt(s,p.x,p.z+dz)))p.z+=dz;
  const floor=heightAt(s,p.x,p.z);
  if(walkable(s,p.x,p.z)&&p.y<=floor&&p.vy<=0){p.y=floor;p.vy=0;if(terrainAt(s,p.x,p.z)==='ground')p.safe={x:p.x,z:p.z};}
  else {p.vy-=14*dt;p.y+=p.vy*dt;}
  if(p.y<-5||Math.abs(p.x)>30||p.z<-40||p.z>24){
    s.beacons--;s.stats.falls++;Object.assign(p,p.safe,{y:heightAt(s,p.safe.x,p.safe.z),vy:0});event(s,'rescue');
    if(s.beacons<=0){s.status='failing';s.finalTime=0;}
  }
  for(const a of s.world.animals){
    if(a.state==='home'){
      if(a.homeTarget&&distance(a,a.homeTarget)>.05){const d=distance(a,a.homeTarget),m=Math.min(d,SPECIES[a.species].speed*dt);movePoint(s,a,(a.homeTarget.x-a.x)/d*m,(a.homeTarget.z-a.z)/d*m,a.species);}continue;
    }
    if(a.state!=='follow')continue;
    if(distance(a,p)>16){a.waitReason='distance';continue;}
    if(a.species==='fox'&&!lit(s,a)){a.waitReason='light';continue;}
    if(distance(a,p)<2){a.path=[];a.waitReason=null;continue;}
    a.repath-=dt;
    if(a.repath<=0){a.path=findPath(s,a,p,a.species).slice(1);a.repath=.65;}
    if(!a.path.length){a.waitReason='path';continue;}
    const next=a.path[0],d=distance(a,next),m=Math.min(d,SPECIES[a.species].speed*dt);
    if(d<.08){a.path.shift();continue;}
    const x=a.x+(next.x-a.x)/d*m,z=a.z+(next.z-a.z)/d*m;
    if(walkable(s,x,z,a.species)){a.x=x;a.z=z;a.heading=Math.atan2(next.x-a.x,next.z-a.z);a.waitReason=null;}
    else {a.path=[];a.repath=0;a.waitReason='path';}
  }
  for(const plate of s.world.objects.filter(o=>o.type==='plate'&&!o.latched))if(s.world.animals.some(a=>a.species==='turtle'&&a.state!=='home'&&distance(a,plate)<1.8)){
    plate.latched=true;event(s,'plate',{id:plate.id});
  }
}
export function snapshotRun(s){
  const data=clone(s);data.events=[];for(const a of data.world.animals){a.path=[];a.repath=0;}return data;
}
export function parseProfile(raw){
  if(raw===null||raw===undefined||raw==='')return freshProfile();
  let p;try{p=typeof raw==='string'?JSON.parse(raw):clone(raw);}catch{throw new Error('corruptSave');}
  if(!p||p.schema!==1||!Array.isArray(p.cleared)||!Array.isArray(p.upgrades)||!Number.isInteger(p.research)||p.research<0||p.research>72||p.cleared.some(n=>!Number.isInteger(n)||n<1||n>60)||p.upgrades.some(k=>!RESEARCH[k])||!['balanced','swift','guardian'].includes(p.specialism))throw new Error('corruptSave');
  p.cleared=[...new Set(p.cleared)].sort((a,b)=>a-b);p.upgrades=[...new Set(p.upgrades)];
  // A malformed run is reported, never silently discarded or overwritten.
  if(p.run){
    const s=p.run;
    if(s.schema!==1||!stageById(s.stage?.id)||s.world?.stageId!==s.stage.id||!s.player||!Array.isArray(s.world.animals)||!Array.isArray(s.world.objects)||!Array.isArray(s.world.habitats)||!Array.isArray(s.produce)||s.produce.length!==3||s.produce.some(n=>!Number.isInteger(n)||n<0||n>60)||!FOOD.every(k=>Number.isInteger(s.food?.[k])&&s.food[k]>=0&&s.food[k]<=12)||![s.player.x,s.player.y,s.player.z,s.player.yaw,s.player.pitch,s.time].every(Number.isFinite)||!['active','finishing','failing','won','lost'].includes(s.status)||!Number.isInteger(s.beacons)||s.beacons<0||s.beacons>3||s.world.animals.some(a=>!SPECIES[a.species]||!Number.isFinite(a.x)||!Number.isFinite(a.z)))throw new Error('corruptSave');
    // Authored geometry and rules always come from current code, not persisted data.
    const fresh=createRun(s.stage.id,p),byId=new Map(s.world.animals.map(a=>[a.id,a]));
    if(fresh.world.animals.some(a=>!byId.has(a.id)||byId.get(a.id).species!==a.species))throw new Error('corruptSave');
    s.stage=fresh.stage;
    for(const key of ['land','obstacles','zones','lamps','bounds','camp','tree'])s.world[key]=fresh.world[key];
    s.events=[];s.limits=limits(p);s.upgrades=[...p.upgrades];for(const a of s.world.animals){a.path=[];a.repath=0;}
  }
  return p;
}
export function writeProfile(storage,profile){storage.setItem(SAVE_KEY,JSON.stringify(profile));return profile;}
export function buyResearch(storage,profile,key){
  const entry=RESEARCH[key];if(!entry)return {ok:false,reason:'unknownUpgrade'};
  if(profile.upgrades.includes(key))return {ok:false,reason:'owned'};
  if(profile.research<entry.cost)return {ok:false,reason:'needResearch'};
  const next=clone(profile);next.research-=entry.cost;next.upgrades.push(key);
  try{writeProfile(storage,next);}catch{return {ok:false,reason:'saveFailed'};}
  return {ok:true,profile:next};
}
export function settle(storage,profile,s){
  if(s.status!=='won')return {ok:false,reason:'notWon'};
  const next=clone(profile),first=!next.cleared.includes(s.stage.id);
  if(first){next.cleared.push(s.stage.id);next.cleared.sort((a,b)=>a-b);next.research+=1+(s.stage.id%5===0?1:0);}
  next.run=null;
  try{writeProfile(storage,next);}catch{return {ok:false,reason:'saveFailed'};}
  return {ok:true,profile:next,first,stageId:s.stage.id};
}
export function unlocked(profile,id){return id===1||profile.cleared.includes(id)||profile.cleared.includes(id-1);}
export function campaignSummary(){return {stages:STAGES.length,chapters:2,checkpoints:STAGES.filter(s=>s.checkpoint).map(s=>s.id)};}
