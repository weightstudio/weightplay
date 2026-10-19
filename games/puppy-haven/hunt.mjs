// Authoritative, deterministic PvE auto-battles. Rendering never deals damage.
export const CELLS=[[-2.5,.3],[0,.3],[2.5,.3],[-2.5,2.1],[0,2.1],[2.5,2.1]];
export const ROLES={shiba:'balanced',corgi:'guard',labrador:'healer',husky:'flanker',dalmatian:'splash',beagle:'scout',shorgi:'guard',huskador:'healer',dalmeagle:'splash'};
const STATS={shiba:[130,20,1,1,1],corgi:[205,15,4,.9,.85],labrador:[125,12,1,1.1,.95],husky:[105,27,0,.8,1.45],dalmatian:[120,19,1,1.15,1.1],beagle:[110,23,0,1.15,1.2],shorgi:[175,22,3,.95,1],huskador:[125,20,1,.95,1.25],dalmeagle:[120,22,1,1.05,1.15]};
const ENEMY={boar:[75,8,2,1.35,.8],wolf:[65,11,0,1,1.3],armored:[110,10,8,1.5,.65],fox:[48,9,0,.85,1.4],stag:[90,7,1,1.4,.75],boss:[180,18,5,1.3,.7]};
// Each arc introduces a different target/counter problem, then combines it.
const PACKS=[
 [['boar'],['boar','boar'],['wolf','boar'],['boar','wolf','boar'],['boss','boar']],
 [['wolf','wolf'],['wolf','boar','wolf'],['wolf','wolf','fox'],['wolf','fox','wolf','fox'],['boss','wolf','wolf']],
 [['armored','boar'],['armored','armored'],['armored','wolf','armored'],['armored','armored','stag'],['boss','armored','wolf']],
 [['fox','fox','fox','fox'],['fox','wolf','fox','wolf'],['fox','fox','fox','fox','fox'],['fox','armored','fox','fox','stag'],['boss','fox','fox','fox']],
 [['stag','armored','wolf'],['stag','wolf','fox','wolf'],['stag','stag','armored','fox'],['stag','armored','fox','fox','wolf'],['boss','stag','armored','wolf']],
 [['armored','wolf','stag','fox'],['wolf','wolf','armored','fox','fox'],['armored','armored','stag','fox','wolf'],['stag','stag','wolf','armored','fox','fox'],['boss','stag','armored','wolf','fox','fox']],
];
export const HUNT_STAGES=Array.from({length:30},(_,i)=>{const arc=Math.floor(i/5),kind=i%5,pack=PACKS[arc][kind];return {id:i+1,arc,kind,reward:34+i*4,limit:arc<2?4:arc<4?5:6,waves:kind===4?[PACKS[arc][1],pack]:[pack],checkpoint:kind===4};});
const finite=(n,a,b)=>Number.isFinite(n)?Math.min(b,Math.max(a,n)):a;
export function normalizeHunt(raw,dogs=[]){
 const cleared=[...new Set((Array.isArray(raw?.cleared)?raw.cleared:[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=30))];let unlocked=1;while(unlocked<30&&cleared.includes(unlocked))unlocked++;
 const seen=new Set(),formation=Array.from({length:6},(_,i)=>{const id=raw?.formation?.[i];if(!Number.isSafeInteger(id)||seen.has(id)||!dogs.some(d=>d.id===id))return null;seen.add(id);return id;});
 return {cleared,unlocked,formation};
}
export function dogCombat(d){const a=STATS[d.breed]||STATS.shiba,care=.85+finite(Math.min(d.hunger,d.happy,d.clean),0,100)*.002,xp=finite(d.huntXp,0,100);return {maxHp:Math.round(a[0]*care*(1+xp/500)),atk:Math.round(a[1]*care*(1+xp/500)),armor:a[2],interval:a[3],speed:a[4],role:ROLES[d.breed]||'balanced'};}
export function eligible(d){return d?.age==='adult'&&!d.pregnancy;}
export class Hunt{
 constructor(stage,dogs,formation=[]){
  this.stage=HUNT_STAGES[stage-1];if(!this.stage)throw new Error('Invalid hunt stage');this.clock=0;this.acc=0;this.wave=0;this.wait=0;this.phase='prep';this.events=[];this.enemies=[];this.settled=false;
  const seen=new Set();this.allies=formation.slice(0,6).flatMap((id,cell)=>{const d=dogs.find(d=>d.id===id);if(!eligible(d)||seen.has(id)||seen.size>=this.stage.limit)return [];seen.add(id);const stat=dogCombat(d);return [{...stat,id:d.id,breed:d.breed,sex:d.sex,age:'adult',growth:100,parents:[],team:0,cell,x:CELLS[cell][0],z:CELLS[cell][1],heading:Math.PI,hp:stat.maxHp,shield:stat.role==='guard'?30:0,cooldown:.2+cell*.08,skillIn:2.5,windup:0,pending:null,hurt:0,attacks:0,deadAt:null,activity:'rest'}];});
  this.diverse=new Set(this.allies.map(d=>d.breed)).size>=3;if(this.diverse)for(const u of this.allies){u.maxHp=Math.round(u.maxHp*1.1);u.hp=u.maxHp;}
  this.spawn();
 }
 get units(){return [...this.allies,...this.enemies];}
 spawn(){const arc=this.stage.arc;this.enemies=this.stage.waves[this.wave].map((kind,i)=>{const a=ENEMY[kind],power=1+arc*.15;return {id:-1-i-this.wave*20,kind,team:1,role:kind==='stag'?'healer':kind==='wolf'||kind==='fox'?'flanker':'balanced',x:[-2.6,0,2.6][i%3],z:-1.8-Math.floor(i/3)*1.3,heading:0,maxHp:Math.round(a[0]*power),hp:Math.round(a[0]*power),atk:Math.round(a[1]*power),armor:a[2],interval:a[3],speed:a[4],shield:kind==='armored'?25:0,cooldown:.5+i*.1,skillIn:3,windup:0,pending:null,hurt:0,attacks:0,deadAt:null,activity:'rest'};});}
 begin(){if(this.phase!=='prep'||!this.allies.length)return false;this.phase='fight';this.events.push({type:'wave',boss:this.enemies.some(u=>u.kind==='boss')});return true;}
 target(u){const options=(u.team?this.allies:this.enemies).filter(t=>t.hp>0);const distance=t=>Math.hypot(t.x-u.x,t.z-u.z);return options.sort((a,b)=>{if(u.role==='scout'||u.role==='flanker'){const support=t=>t.role==='healer'?1:0;if(support(a)!==support(b))return support(b)-support(a);if(u.role==='scout'&&a.armor!==b.armor)return b.armor-a.armor;}return distance(a)-distance(b)||a.id-b.id;})[0];}
 damage(attacker,target,amount,critical=false,splash=false){
  if(target.hp<=0)return;const oldShield=target.shield;
  const guard=this.allies.some(a=>a.hp>0&&a.role==='guard'&&a.id!==target.id&&Math.hypot(a.x-target.x,a.z-target.z)<1.9);
  let damage=Math.max(1,Math.round(amount-((attacker.role==='scout'||attacker.breed==='dalmeagle')?target.armor*.25:target.armor)));if(target.team===0&&guard)damage=Math.max(1,Math.round(damage*.8));
  const absorbed=Math.min(target.shield,damage);target.shield-=absorbed;damage-=absorbed;const applied=Math.min(target.hp,damage);target.hp-=applied;target.hurt=.2;target.recoilX=(target.x-attacker.x);target.recoilZ=(target.z-attacker.z);
  this.events.push({type:applied?'hit':'block',actor:attacker.id,target:target.id,amount:applied,absorbed,shieldBreak:oldShield>0&&target.shield===0,critical:critical&&applied>0,splash});
  if(target.hp===0){target.deadAt=this.clock;target.windup=0;target.pending=null;this.events.push({type:'defeat',target:target.id,team:target.team});}
 }
 strike(u,target){if(!target||target.hp<=0||Math.hypot(u.x-target.x,u.z-target.z)>1.5)return;u.attacks++;const critical=(u.role==='flanker'||u.role==='scout')&&u.attacks%4===0;this.damage(u,target,u.atk*(critical?1.6:1),critical);if(u.role==='splash'){for(const t of (u.team?this.allies:this.enemies).filter(t=>t.hp>0&&t!==target&&Math.hypot(t.x-target.x,t.z-target.z)<1.55).slice(0,2))this.damage(u,t,u.atk*.6,false,true);}}
 step(dt){
  this.clock+=dt;if(this.clock>=90){this.finish(false,'timeout');return;}
  if(this.wait>0){this.wait-=dt;if(this.wait<=0){this.wave++;for(const a of this.allies)if(a.hp>0)a.hp=Math.min(a.maxHp,a.hp+Math.round(a.maxHp*.2));this.spawn();this.events.push({type:'wave',boss:this.enemies.some(u=>u.kind==='boss')});}return;}
  for(const u of this.units){u.hurt=Math.max(0,u.hurt-dt);if(u.hp<=0)continue;u.cooldown=Math.max(0,u.cooldown-dt);u.skillIn=Math.max(0,u.skillIn-dt);
   if(u.role==='healer'&&u.skillIn===0){const friend=(u.team?this.enemies:this.allies).filter(a=>a.hp>0&&a.hp<a.maxHp*.85&&Math.hypot(a.x-u.x,a.z-u.z)<3).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];if(friend){const amount=Math.min(friend.maxHp-friend.hp,u.team?14:24);friend.hp+=amount;u.skillIn=4.5;this.events.push({type:'heal',actor:u.id,target:friend.id,amount});}}
   if(u.windup>0){u.windup=Math.max(0,u.windup-dt);u.activity='attack';if(u.windup===0){const t=this.units.find(t=>t.id===u.pending);this.strike(u,t);u.pending=null;u.cooldown=u.interval;}continue;}
   const t=this.target(u);if(!t)continue;const dx=t.x-u.x,dz=t.z-u.z,distance=Math.hypot(dx,dz);u.heading=Math.atan2(dx,dz);
   if(distance>1.1){u.activity='walk';let vx=dx/(distance||1),vz=dz/(distance||1);for(const other of this.units){const ox=u.x-other.x,oz=u.z-other.z,apart=Math.hypot(ox,oz);if(other!==u&&other.hp>0&&apart>.001&&apart<.7){vx+=ox/apart*(.7-apart)*2;vz+=oz/apart*(.7-apart)*2;}}const l=Math.hypot(vx,vz)||1;u.x=finite(u.x+vx/l*u.speed*dt,-3.7,3.7);u.z=finite(u.z+vz/l*u.speed*dt,-3.6,2.7);}
   else if(u.cooldown===0){u.activity='attack';u.windup=.18;u.pending=t.id;this.events.push({type:'windup',actor:u.id,target:t.id});}else u.activity='rest';
  }
  if(!this.allies.some(a=>a.hp>0)){this.finish(false,'defeat');return;}
  if(!this.enemies.some(e=>e.hp>0)){if(this.wave+1===this.stage.waves.length)this.finish(true,'clear');else this.wait=1.1;}
 }
 finish(win,reason){if(this.phase!=='fight')return;this.phase=win?'won':'lost';this.reason=reason;this.events.push({type:'finish',win});}
 tick(seconds){if(this.phase!=='fight')return;this.acc+=finite(seconds,0,.25);while(this.acc>=1/30&&this.phase==='fight'){this.acc-=1/30;this.step(1/30);}}
 settle(state){if(this.phase!=='won'||this.settled)return {reward:0,xp:0};this.settled=true;const p=state.hunt;if(p.cleared.includes(this.stage.id))return {reward:0,xp:0};p.cleared.push(this.stage.id);p.unlocked=Math.max(p.unlocked,Math.min(30,this.stage.id+1));state.coins+=this.stage.reward;for(const u of this.allies){const d=state.dogs.concat(state.restDogs).find(d=>d.id===u.id);if(d)d.huntXp=Math.min(100,(d.huntXp||0)+6);}return {reward:this.stage.reward,xp:6};}
}
