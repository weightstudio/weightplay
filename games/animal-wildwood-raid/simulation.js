import {STAGES,TOOLS,ENEMIES,BOSS,guardianFor} from './game-data.js';
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const hostile=e=>e.kind==='enemy'||e.kind==='boss';
// Stage one teaches the rhythm; stage two starts the real combat curve.
// Fixed stage pressure preserves the value of permanent earned growth.
const pressure=id=>id===1?1:1.55+(id-2)*.025;
export function mission(stage){
 const s=typeof stage==='number'?STAGES[stage-1]:stage;
 const req=s.type==='gather'?{wood:s.target}:s.type==='defeat'?{kills:s.target}:s.type==='rescue'?{rescues:s.target}:s.type==='shrine'?{shrines:s.target}:s.type==='survive'?{seconds:s.target}:s.type==='boss'?{bosses:BOSS[s.boss].count||1}:s.id===3?{wood:8,kills:3}:{rescues:3,kills:6};
 const boss=guardianFor(s.id);req.bosses=BOSS[boss].count||1;
 return {...s,boss,req,sequence:s.id===27,protect:s.type==='survive',restricted:s.id===23};
}
export class Simulation {
 constructor(id,loadout=['bow','lantern','snare'],growth={health:0,attack:0}){
  this.stage=mission(id);this.time=0;this.tick=0;this.nextId=1;this.events=[];this.ents=[];this.shots=[];this.fields=[];this.drops=[];this.obstacles=[];this.zones=[];
  this.growth={health:Math.max(0,growth.health||0),attack:Math.max(0,growth.attack||0),regen:Math.max(0,growth.regen||0)};this.hazards=[];this.regenClock=0;this.regenHealed=0;
  this.hero={x:0,z:6.5,hp:100+this.growth.health,maxHp:100+this.growth.health,power:16+this.growth.attack,regen:1+this.growth.regen,angle:Math.PI,ward:0,boots:0,invulnerable:0,dash:0,recoil:0,attack:null};
  this.tally={wood:0,kills:0,rescues:0,shrines:0,bosses:0,seconds:0};this.cool={axe:.3,dash:0,...Object.fromEntries(TOOLS.slice(1).map(t=>[t.id,0]))};
  this.loadout=loadout.filter(id=>TOOLS.some(t=>t.id===id&&t.unlock<=this.stage.id)).slice(0,3);
  this.protectedHp=100;this.won=false;this.lost=false;this.exit={x:0,z:-7.1};this.nextWave=7;this.rng=id*713+19;this.combo=0;this.build();
 }
 random(){this.rng=(this.rng*1664525+1013904223)>>>0;return this.rng/4294967296;}
 log(type,data={}){this.events.push({type,time:this.time,...data});if(this.events.length>60)this.events.shift();}
 entity(kind,x,z,extra={}){const e={uid:this.nextId++,kind,x,z,hp:24,maxHp:24,r:.4,angle:0,recoil:0,...extra};
  if(['tree','enemy','boss'].includes(kind)){const stat=kind==='tree'?(e.uid%2?'health':'attack'):['health','attack','regen'][e.uid%3];e.reward={stat,amount:stat==='regen'?(kind==='boss'?.3:.1):kind==='boss'?(stat==='health'?30+this.stage.id*3:5+Math.floor(this.stage.id/3)):stat==='health'?(kind==='tree'?6:10)+Math.floor(this.stage.id/4)*2:(kind==='tree'?1:2)+Math.floor(this.stage.id/8)};if(kind!=='tree'&&stat!=='regen')e.reward.amount=Math.ceil(e.reward.amount*1.5);}
  if(kind==='tree'||kind==='enemy'&&!extra.summon)e.spawn={x,z};this.ents.push(e);return e;}
 syncGrowth(growth){const hp=Math.max(this.growth.health,growth.health||0),atk=Math.max(this.growth.attack,growth.attack||0);if(this.hero.hp>0)this.hero.hp+=hp-this.growth.health;this.growth={health:hp,attack:atk,regen:Math.max(this.growth.regen,growth.regen||0)};this.hero.maxHp=100+hp;this.hero.power=16+atk;this.hero.regen=Math.round((1+this.growth.regen)*10)/10;}
 grant(e){if(!e.reward)return;const {stat,amount}=e.reward;this.syncGrowth({...this.growth,[stat]:Math.round((this.growth[stat]+amount)*10)/10});this.log('growth',{uid:e.uid,stat,amount,x:e.x,z:e.z});}
 respawns(dt){for(const e of this.ents){if(e.hp>0||!e.spawn||e.respawn==null)continue;e.respawn-=dt;
   if(e.kind==='enemy'&&e.respawn<=2&&!e.spawnWarning){let spot=null;for(let i=0;i<16;i++){const a=i*2.4,p={x:clamp(e.spawn.x+Math.cos(a)*Math.floor(i/4),-6.3,6.3),z:clamp(e.spawn.z+Math.sin(a)*Math.floor(i/4),-7,7)};if(dist(p,this.hero)>3&&!this.obstacles.some(o=>o.hp>0&&Math.abs(p.x-o.x)<o.w+.6&&Math.abs(p.z-o.z)<o.h+.6)){spot=p;break;}}if(!spot){e.respawn=2.1;continue;}Object.assign(e,spot);e.spawnWarning=true;e.respawn=2;}
   if(e.respawn<=0){e.hp=e.maxHp;e.wind=null;e.charge=null;e.stun=0;e.exposed=0;e.recoil=0;e.cd=1.3;e.hidden=false;e.spawnWarning=false;e.respawn=null;this.log('respawn',{uid:e.uid});}
  }}
 enemy(type,x,z,extra={}){const base=ENEMIES[type],scale=(1+this.stage.id*.2+this.stage.id**2*.015)*pressure(this.stage.id),d={...base,hp:Math.round(base.hp*scale),damage:Math.round(base.damage*(1+this.stage.id*.18)*pressure(this.stage.id)),speed:base.speed*1.15};return this.entity('enemy',x,z,{...d,type,maxHp:d.hp,cd:1+this.random(),wind:null,slow:0,stun:0,hidden:type==='sneak',...extra});}
 build(){
  const q=this.stage;
  const treePos=[[-4,5],[3.7,4.6],[-5.2,1.5],[5.1,1.1],[-4.8,-3.4],[4.5,-4.8],[-2.8,-6.5],[2.8,-6.4],[-6,4],[6,4],[-6,-1],[6,-2]];
  treePos.slice(0,Math.max(q.req.wood?Math.ceil(q.req.wood/2)+1:6,6)).forEach(([x,z],i)=>this.entity('tree',x,z,{hp:5,maxHp:5,r:.52,variant:i%3}));
  if(q.req.rescues){const positions=[[-4,-1],[4,-4],[-4,-5],[4,2]];positions.slice(0,q.req.rescues).forEach(([x,z],i)=>this.entity('cage',x,z,{hp:24,maxHp:24,order:i+1}));}
  if(q.req.shrines){[[-4,-3],[4,-4],[0,1]].slice(0,q.req.shrines).forEach(([x,z],i)=>this.entity('shrine',x,z,{hp:1,maxHp:1,order:i+1,channel:0}));}
  if(q.protect){this.protectedHp=Math.round((200+q.id*60)*pressure(q.id)**2);this.entity('friend',0,-1,{hp:this.protectedHp,maxHp:this.protectedHp,r:.6});}
  const layouts={fork:[[-1,1,1,2]],long:[[-2,0,.7,3],[2,-2,.7,3]],split:[[0,0,1.5,3]],cover:[[-3,0,1,1],[3,-2,1,1]],ring:[[0,0,1.2,1.2]],gate:[[-3,0,1.8,.5],[3,0,1.8,.5]],branches:[[0,-1,.6,3]],current:[[-2,0,.7,2],[2,-3,.7,2]],switch:[[-2,-1,1,1],[2,-1,1,1]],chain:[[0,-2,1,2]],road:[[-4,0,1,2],[4,0,1,2]],gauntlet:[[0,1,1,1],[-3,-3,1,1]]};
  for(const [x,z,w,h] of layouts[q.layout]||[])this.obstacles.push({x,z,w,h,hp:q.layout==='switch'?1:Infinity,breakable:q.layout==='switch'});
  if(q.boss==='hornroot')this.obstacles.push({x:0,z:0,w:1.3,h:.7,hp:1,breakable:true});
  if(['mud','orchard','dense','gauntlet','current','finale'].includes(q.layout)){
   this.zones.push({x:-2.6,z:1.6,r:1.8,type:'mud'});
   if(q.id>=16)this.zones.push({x:2.7,z:-2,r:1.5,type:'thorn'});
   if(q.layout==='current')this.zones.push({x:0,z:-3,r:1.8,type:'current'});
  }
  const count=q.id===1?1:q.protect?3:q.req.kills||Math.min(6,2+Math.floor(q.id/6));
  for(let i=0;i<count;i++){const a=i*2.399+q.id*.4,r=3.5+i%2*1.5;this.enemy(q.enemies[i%q.enemies.length],Math.cos(a)*r,Math.sin(a)*r-2,{elite:q.id===29});}
  if(q.boss){const base=BOSS[q.boss],d={...base,hp:Math.round((300+q.id*105)*(1+q.id*.095)*(1+q.id*.08)*pressure(q.id)*(q.boss==='twinroot'?.62:1)),damage:Math.round((20+q.id*5.5)*(1+q.id*.07)*pressure(q.id)*(q.boss==='stormowl'?.7:1)),speed:base.speed*1.5};for(let i=0;i<(d.count||1);i++)this.entity('boss',d.count?(i?2.4:-2.4):0,-3.5,{...d,type:q.boss,boss:q.boss,maxHp:d.hp,r:.8,cd:1.6,wind:null,phase:1,slow:0,stun:0,exposed:0,role:d.count?(i?'healer':'tank'):null,summonCd:5,awake:false});}
  if(q.boss==='mosswitch')this.entity('totem',-3,-3,{hp:30,maxHp:30});
  for(const e of this.ents){for(const o of this.obstacles)if(Math.abs(e.x-o.x)<o.w+e.r+.15&&Math.abs(e.z-o.z)<o.h+e.r+.15)e.x=clamp(o.x+Math.sign(e.x-o.x||1)*(o.w+e.r+.3),-6.5,6.5);}
  for(const e of this.ents)if(e.spawn)e.spawn={x:e.x,z:e.z};
  this.drops.push({uid:this.nextId++,kind:'heart',x:5,z:5},{uid:this.nextId++,kind:q.id>=6?'boots':'ward',x:-5,z:-6});
 }
 alive(){return this.ents.filter(e=>e.hp>0);}
 target(range,tool='axe'){
  return this.alive().filter(e=>e.kind!=='friend'&&dist(e,this.hero)<=range&&(!e.hidden||dist(e,this.hero)<2)&&this.clearLine(this.hero,e))
   .sort((a,b)=>{const rank=e=>hostile(e)?(tool==='bow'&&['caster','shaman'].includes(e.type)?-2:0):e.kind==='shrine'?1:e.kind==='cage'?2:3;return rank(a)-rank(b)||dist(a,this.hero)-dist(b,this.hero);})[0];
 }
 clearLine(a,b){return !this.obstacles.some(o=>o.hp>0&&Array.from({length:12},(_,i)=>{const t=(i+1)/13;return Math.abs(a.x+(b.x-a.x)*t-o.x)<o.w&&Math.abs(a.z+(b.z-a.z)*t-o.z)<o.h;}).some(Boolean));}
 use(id){
  if(this.won||this.lost||this.cool[id]>0)return false;
  if(id==='dash'){this.cool.dash=3;this.hero.dash=.2;this.hero.invulnerable=.25;this.log('dash');return true;}
  if(!this.loadout.includes(id))return false;const tool=TOOLS.find(t=>t.id===id);if(!tool)return false;
  const h=this.hero;
  if(id==='bow'){const target=this.target(5.8,'bow');if(!target)return false;this.projectile(h,target,h.power*1.5,false,10);}
  if(id==='lantern'){this.alive().filter(e=>hostile(e)&&dist(e,h)<4.6).forEach(e=>{e.hidden=false;e.stun=1.2;e.wind=null;e.exposed=2;this.hit(e,h.power,'lantern');});this.log('pulse',{x:h.x,z:h.z});}
  if(id==='snare'){this.fields.push({x:h.x,z:h.z,life:5,r:3});if(this.fields.length>2)this.fields.shift();this.log('snare');}
  if(id==='ward'){h.ward=1;this.log('ward');}
  if(id==='mastery'){this.alive().filter(e=>hostile(e)&&dist(e,h)<3.8).forEach(e=>{e.wind=null;e.exposed=2;this.hit(e,h.power*2.5,'mastery');});this.log('mastery',{x:h.x,z:h.z});}
  this.cool[id]=tool.cooldown;return true;
 }
 projectile(from,to,power,enemy,speed=4){const d=dist(from,to)||1;this.shots.push({x:from.x,z:from.z,vx:(to.x-from.x)/d*speed,vz:(to.z-from.z)/d*speed,power,enemy,life:3});if(this.shots.length>30)this.shots.shift();}
 hit(e,power,source='axe'){
  if(e.hp<=0)return;if(e.boss)e.awake=true;
  if(e.kind==='cage'&&this.stage.sequence&&e.order!==this.tally.rescues+1){this.log('sequence',{order:this.tally.rescues+1});return;}
  if(e.kind==='shrine')return;
  if((e.type==='shield'||e.boss==='ironbark'||e.boss==='stumpback'||e.role==='tank')&&(!e.exposed||e.boss==='ironbark')){const dx=this.hero.x-e.x,dz=this.hero.z-e.z,d=Math.hypot(dx,dz)||1;if((dx*Math.sin(e.angle)+dz*Math.cos(e.angle))/d>.4){power*=e.boss==='ironbark'?.12:.25;this.log('blocked',{uid:e.uid});}}
  if(e.boss==='mosswitch'&&this.alive().some(x=>x.kind==='totem')){this.log('immune',{uid:e.uid});return;}
  if(e.kind==='tree')power=1;
  e.hp=Math.max(0,e.hp-power);e.recoil=.15;this.log('hit',{uid:e.uid,x:e.x,z:e.z,amount:power,source});
  if(e.hp===0){
   if(e.kind==='tree')this.tally.wood+=2;
   if(e.kind==='cage')this.tally.rescues++;
   if(e.kind==='enemy'&&!e.summon)this.tally.kills++;
   if(e.kind==='boss')this.tally.bosses++;
   this.grant(e);e.defeatedAt=this.time;if(e.spawn)e.respawn=e.kind==='tree'?12:16;
   if(hostile(e)&&++this.combo%3===0){this.drops.push({uid:this.nextId++,kind:'heart',x:e.x,z:e.z});if(this.drops.length>24)this.drops.splice(this.drops.findIndex(d=>d.kind==='heart'),1);}
   this.log('defeat',{uid:e.uid,kind:e.kind,x:e.x,z:e.z});
  }
 }
 hurt(power,target=this.hero){
  if(target.invulnerable>0)return;
  if(target===this.hero&&target.ward){target.ward=0;target.invulnerable=.4;this.log('wardBlock');return;}
  target.invulnerable=.65;target.recoil=.2;
  target.hp=Math.max(0,target.hp-power);if(target.kind==='friend')this.protectedHp=target.hp;
  this.log('hurt',{amount:power,friend:target!==this.hero,x:target.x,z:target.z});
 }
 moveObject(o,dx,dz,r=.35){
  const old={x:o.x,z:o.z};o.x=clamp(o.x+dx,-6.7,6.7);o.z=clamp(o.z+dz,-7.5,7.5);
  for(const wall of this.obstacles)if(wall.hp>0&&Math.abs(o.x-wall.x)<wall.w+r&&Math.abs(o.z-wall.z)<wall.h+r){
   if(Math.abs(old.x-wall.x)>=wall.w+r)o.x=old.x;else if(Math.abs(old.z-wall.z)>=wall.h+r)o.z=old.z;else {o.x=old.x;o.z=old.z;}
  }
 }
 prepare(e,target,kind,wind=.75){const d=dist(e,target)||1;e.wind={kind,left:wind,total:wind,x:target.x,z:target.z,dx:(target.x-e.x)/d,dz:(target.z-e.z)/d,target:target.uid||0};e.angle=Math.atan2(e.wind.dx,e.wind.dz);this.log('tell',{uid:e.uid,kind});}
 actEnemy(e,dt){
  e.swing=Math.max(0,(e.swing||0)-dt);e.recoil=Math.max(0,e.recoil-dt);if(e.boss&&!e.awake){if(dist(e,this.hero)<5.5||e.hp<e.maxHp)e.awake=true;else return;}e.exposed=Math.max(0,(e.exposed||0)-dt);e.slow=Math.max(0,e.slow-dt);
  for(const f of this.fields)if(dist(e,f)<f.r)e.slow=.2;
  if(e.hidden&&dist(e,this.hero)<2.3){e.hidden=false;this.log('reveal',{uid:e.uid});e.cd=.8;}
  if(e.stun>0){e.stun-=dt;return;}
  const friend=this.alive().find(x=>x.kind==='friend'),target=friend&&!e.boss&&dist(e,this.hero)>2.4?friend:this.hero;
  if(e.wind){const w=e.wind;w.left-=dt;if(w.left>0)return;e.wind=null;e.swing=.36;
   if(w.kind==='charge') {e.charge={left:.42,dx:w.dx,dz:w.dz};e.exposed=2;}
   else if(w.kind==='shot')this.projectile(e,{x:w.x,z:w.z},e.damage,true,e.boss?4.2:3.5);
   else if(w.kind==='burst'){const count=e.phase>=2?12:8;for(let i=0;i<count;i++){const angle=i*Math.PI*2/count+(e.phase===3?.25:0);this.projectile(e,{x:e.x+Math.sin(angle),z:e.z+Math.cos(angle)},e.damage,true,3.3);}this.log('burst',{uid:e.uid});}
   else if(w.kind==='roots'){for(const [x,z] of [[w.x,w.z],[w.x-2,w.z],[w.x+2,w.z],...(e.phase>=2?[[w.x,w.z-2],[w.x,w.z+2]]:[])])this.hazards.push({x:clamp(x,-6,6),z:clamp(z,-7,7),r:1,delay:.9,life:2.8,power:e.damage,hit:false});}
   else if(w.kind==='heal'){const targets=this.alive().filter(x=>x!==e&&hostile(x)&&dist(e,x)<4);targets.forEach(x=>x.hp=Math.min(x.maxHp,x.hp+Math.max(12,x.maxHp*.07)));this.log('heal',{x:e.x,z:e.z});}
   else if(w.kind==='summon'){if(this.alive().filter(hostile).length<9){this.enemy('thornling',e.x+1,e.z+1,{summon:true});this.enemy('caster',e.x-1,e.z+1,{summon:true});}this.log('summon');}
   else{const locked=w.target?this.ents.find(x=>x.uid===w.target):this.hero;if(locked&&locked.hp>0&&dist(e,locked)<(w.kind==='sweep'?2.5:1.65))this.hurt(e.damage,locked);e.exposed=e.boss?1.6:.4;this.log('swing',{uid:e.uid,x:e.x,z:e.z});}
   e.cd=(e.boss?1.7:ENEMIES[e.type].cooldown)*Math.max(.75,1-(this.stage.id-1)*.009);return;
  }
  if(e.charge){const c=e.charge;c.left-=dt;const nx=e.x+c.dx*12*dt,nz=e.z+c.dz*12*dt;
   const wall=this.obstacles.find(o=>o.hp>0&&Math.abs(nx-o.x)<o.w+.65&&Math.abs(nz-o.z)<o.h+.65);
   if(wall){if(wall.breakable){wall.hp=0;this.log('wallBreak',{x:wall.x,z:wall.z});}e.stun=1.7;e.exposed=2.5;c.left=0;}
   else{e.x=clamp(nx,-6.6,6.6);e.z=clamp(nz,-7.3,7.3);if(dist(e,this.hero)<1.1)this.hurt(e.damage);if(friend&&dist(e,friend)<1.2)this.hurt(e.damage,friend);}
   if(c.left<=0)e.charge=null;return;
  }
  e.cd-=dt;const d=dist(e,target),dx=target.x-e.x,dz=target.z-e.z;
  if(e.boss){const phase=Math.min(e.phases,1+Math.floor((1-e.hp/e.maxHp)*e.phases));if(phase>e.phase){e.phase=phase;this.log('phase',{uid:e.uid,phase});if(e.boss==='mosswitch')this.entity('totem',e.x+2,e.z,{hp:30,maxHp:30});if(e.boss==='heartwood'){this.zones.push({x:e.phase===2?-3:3,z:1,r:1.4,type:'thorn'});e.cd=.8;}}
  }
  const healer=e.type==='shaman'||e.role==='healer';
  if(e.cd<=0){
   if(e.boss==='stormowl'&&d<7){this.prepare(e,target,'burst',1.15);return;}
   if(e.boss==='rootweaver'&&d<7){this.prepare(e,target,'roots',.85);return;}
   if(healer&&this.alive().some(x=>hostile(x)&&x!==e&&x.hp<x.maxHp&&dist(x,e)<4)){this.prepare(e,target,'heal',1);return;}
   if((e.boss==='mosswitch'||e.boss==='heartwood'&&e.phase>=2)&&this.time>(e.summonCd||0)){e.summonCd=this.time+9;this.prepare(e,target,'summon',1.2);return;}
   if((e.type==='ram'||e.boss==='hornroot'||e.boss==='heartwood'&&e.phase===3)&&d<4.2){this.prepare(e,target,'charge',e.boss?1.05:.9);return;}
   if((e.type==='caster'||e.boss==='heartwood'&&e.phase===2)&&d<4.2&&this.clearLine(e,target)){this.prepare(e,target,'shot',1);return;}
   if(d<(e.boss?2.1:1.3)){this.prepare(e,target,e.boss?'sweep':'melee',e.boss?1:.7);return;}
  }
  if(d>(e.type==='caster'?3.8:1.1)&&!e.hidden){e.angle=Math.atan2(dx,dz);const speed=e.speed*(e.slow?.35:1)*(e.exposed?.3:1);this.moveObject(e,dx/(d||1)*speed*dt,dz/(d||1)*speed*dt,e.r);}
 }
 ready(){return Object.entries(this.stage.req).every(([k,v])=>this.tally[k]>=v);}
 step(dt,input={x:0,z:0}){
  if(this.won||this.lost)return;dt=clamp(dt,0,1/30);this.time+=dt;this.tick++;this.tally.seconds=this.time;const h=this.hero;
  for(const k in this.cool)this.cool[k]=Math.max(0,this.cool[k]-dt);
  h.invulnerable=Math.max(0,h.invulnerable-dt);h.recoil=Math.max(0,h.recoil-dt);h.boots=Math.max(0,h.boots-dt);h.dash=Math.max(0,h.dash-dt);
  let x=input.x||0,z=input.z||0,l=Math.hypot(x,z);if(l<=.1){x=0;z=0;}if(l>1){x/=l;z/=l;}h.moving=l>.1||h.dash>0;
  if(h.moving&&h.attack){h.attack.cancelled=true;h.attack=null;}
  if(l>.1)h.angle=Math.atan2(x,z);
  let speed=(h.boots?4.8:4);for(const zone of this.zones)if(dist(h,zone)<zone.r){if(zone.type==='mud')speed*=.6;if(zone.type==='current')z=Math.max(z,-.2);if(zone.type==='thorn'&&this.time%3>2.1)this.hurt(8);}
  if(h.dash>0){x=Math.sin(h.angle);z=Math.cos(h.angle);speed=12;}
  this.moveObject(h,x*speed*dt,z*speed*dt);
  if(h.attack){h.attack.left-=dt;if(!h.attack.contacted&&h.attack.left<=.14){h.attack.contacted=true;const target=this.ents.find(e=>e.uid===h.attack.uid);if(target&&target.hp>0&&dist(h,target)<2.05&&this.clearLine(h,target))this.hit(target,h.power);}if(h.attack.left<=0)h.attack=null;}
  else if(!h.moving&&this.cool.axe<=0){const target=this.target(1.65);if(target&&target.kind!=='shrine'){h.attack={uid:target.uid,left:.44,total:.44,contacted:false};h.angle=Math.atan2(target.x-h.x,target.z-h.z);this.cool.axe=.66;}}
  for(const e of this.alive()){
   if(e.kind==='friend')e.invulnerable=Math.max(0,(e.invulnerable||0)-dt);
   if(hostile(e))this.actEnemy(e,dt);
   else if(e.kind==='shrine'&&dist(h,e)<1.4){e.channel+=dt;if(e.channel>=.6){e.hp=0;this.tally.shrines++;this.log('shrine',{x:e.x,z:e.z});}}
   else if(e.kind==='totem'&&this.tick%120===0){this.alive().filter(x=>x.boss&&dist(e,x)<6).forEach(x=>x.hp=Math.min(x.maxHp,x.hp+5));}
  }
  for(const p of this.shots){p.life-=dt;p.x+=p.vx*dt;p.z+=p.vz*dt;
   if(this.obstacles.some(o=>o.hp>0&&Math.abs(p.x-o.x)<o.w&&Math.abs(p.z-o.z)<o.h))p.life=0;
   if(p.life<=0)continue;
   if(p.enemy){const target=[h,...this.alive().filter(e=>e.kind==='friend')].find(e=>dist(e,p)<.55);if(target){this.hurt(p.power,target);p.life=0;}}
   else{const target=this.alive().find(e=>e.kind!=='friend'&&e.kind!=='shrine'&&dist(e,p)<e.r+.2);if(target){this.hit(target,p.power,'bow');p.life=0;}}
  }
  for(const hazard of this.hazards){hazard.delay-=dt;hazard.life-=dt;if(!hazard.hit&&hazard.delay<=0&&dist(h,hazard)<hazard.r){hazard.hit=true;this.hurt(hazard.power);}}
  this.hazards=this.hazards.filter(p=>p.life>0);this.respawns(dt);
  this.ents=this.ents.filter(e=>e.hp>0||e.spawn||e.kind==='boss'||this.time-(e.defeatedAt??this.time)<1);
  this.shots=this.shots.filter(p=>p.life>0);this.fields.forEach(f=>f.life-=dt);this.fields=this.fields.filter(f=>f.life>0);
  this.drops=this.drops.filter(d=>{if(dist(d,h)>1)return true;if(d.kind==='heart'&&h.hp>0)h.hp=Math.min(h.maxHp,h.hp+Math.max(25,Math.round(h.maxHp*.22)));if(d.kind==='ward')h.ward=1;if(d.kind==='boots')h.boots=8;this.log('pickup',{kind:d.kind,x:d.x,z:d.z});return false;});
  if(this.stage.protect&&this.time>=this.nextWave&&!this.ready()){this.nextWave+=8;const n=this.stage.id===28?3:2;for(let i=0;i<n&&this.alive().filter(hostile).length<10;i++)this.enemy(this.stage.enemies[(Math.floor(this.time/8)+i)%this.stage.enemies.length],i%2?6:-6,-5+i*3,{summon:true});}
  if(h.hp<=0||this.protectedHp<=0){this.lost=true;this.log('loss');return;}
  this.regenClock+=dt;if(this.regenClock>=3-1e-9){this.regenClock=Math.max(0,this.regenClock-3);const healed=Math.min(h.regen,h.maxHp-h.hp);h.hp=Math.min(h.maxHp,Math.round((h.hp+healed)*1000)/1000);this.regenHealed+=healed;if(healed>0)this.log('regen',{amount:healed});}
  if(this.ready()&&dist(h,this.exit)<1.25){this.won=true;this.log('win');}
 }
 snapshot(){return {stage:this.stage.id,time:this.time,hp:this.hero.hp,maxHp:this.hero.maxHp,power:this.hero.power,regen:this.hero.regen,regenIn:3-this.regenClock,regenHealed:this.regenHealed,growth:{...this.growth},protectedHp:this.protectedHp,tally:{...this.tally},req:{...this.stage.req},won:this.won,lost:this.lost,ready:this.ready(),hero:{x:this.hero.x,z:this.hero.z},enemies:this.alive().filter(hostile).length,objects:this.alive().map(e=>({uid:e.uid,kind:e.kind,type:e.type,x:e.x,z:e.z,hp:e.hp,maxHp:e.maxHp,reward:e.reward,wind:e.wind?.kind})),cooldowns:{...this.cool}};}
}
