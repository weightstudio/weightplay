import {STAGES} from './stages.mjs?v=3';
export const STORE='weightplay:blade-orbit:v1';
export const LIMITS={swords:24,enemies:100,pickups:220,effects:120,hazards:48,projectiles:100};
export const ENEMIES={
 chaser:{hp:22,speed:1},small:{hp:12,speed:1.45},charger:{hp:26,speed:1.55},
 guard:{hp:65,speed:.65},ranger:{hp:24,speed:.95},healer:{hp:35,speed:.9},
 splitter:{hp:38,speed:1},stalker:{hp:21,speed:1.35},bomber:{hp:34,speed:1.05},summoner:{hp:48,speed:.72},
};
export const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const num=(n,d=0)=>Number.isFinite(Number(n))?Number(n):d;
export function normalizeSave(raw={}){
 if(!raw||typeof raw!=='object')raw={};
 const stars=Array.from({length:30},(_,i)=>clamp(Math.floor(num(raw.stars?.[i])),0,3));
 const cleared=stars.reduce((max,n,i)=>n?Math.max(max,i+1):max,0);
 return {version:1,unlocked:clamp(Math.max(1,Math.floor(num(raw.unlocked,1)),cleared+1),1,30),stars,coins:clamp(Math.floor(num(raw.coins)),0,999999),training:{vitality:clamp(Math.floor(num(raw.training?.vitality)),0,5),edge:clamp(Math.floor(num(raw.training?.edge)),0,5),magnet:clamp(Math.floor(num(raw.training?.magnet)),0,5)},path:['ember','frost','storm'].includes(raw.path)?raw.path:'ember',tutorial:raw.tutorial===true};
}
export const UPGRADES = {
 blade:{zh:'飛劍 +2',en:'Two more blades',desc:['追加兩把飛劍，填滿劍陣空隙','Add two swords to close gaps in your orbit.'],cap:12,icon:'sword'},
 speed:{zh:'御劍加速',en:'Rapid orbit',desc:['轉速 +20%，更密集地切開敵潮','Spin 20% faster for more frequent contacts.'],cap:8,icon:'speed'},
 power:{zh:'淬鍊劍鋒',en:'Hone the edge',desc:['劍傷 +30%，解鎖更高階劍身','Deal 30% more sword damage.'],cap:8,icon:'power'},
 reach:{zh:'擴張劍陣',en:'Wider orbit',desc:['劍陣半徑 +12%，增加接敵距離','Increase orbit reach by 12%.'],cap:4,icon:'reach'},
 magnet:{zh:'靈晶牽引',en:'Crystal magnet',desc:['拾取範圍 +35%，更快累積升級','Increase pickup range by 35%.'],cap:4,icon:'gem'},
 haste:{zh:'疾風步',en:'Swift paws',desc:['移速 +12%，閃避冷卻縮短','Move 12% faster and dash more often.'],cap:4,icon:'speed'},
 heal:{zh:'回春靈泉',en:'Restoring spring',desc:['立即回復 40 點生命','Restore 40 health immediately.'],cap:99,icon:'heal'},
 evolve:{zh:'神劍覺醒',en:'Sword awakening',desc:['元素效果進化，劍傷翻倍','Evolve your element and double blade damage.'],cap:1,icon:'evolve'},
 ember:{zh:'赤焰劍',en:'Ember blades',desc:['命中點燃敵人，持續灼傷','Hits ignite enemies for lasting damage.'],icon:'ember'},
 frost:{zh:'霜華劍',en:'Frost blades',desc:['命中減速，爭取收集與走位空間','Hits slow enemies, creating room to move.'],icon:'frost'},
 storm:{zh:'驚雷劍',en:'Storm blades',desc:['命中時雷擊鄰近敵人','Hits arc lightning to nearby enemies.'],icon:'storm'},
};
const d2=(a,b)=>(a.x-b.x)**2+(a.z-b.z)**2;
const angleDiff=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
export class Run {
 constructor(stageId,save,{seed=Date.now(),practice=false}={}){
  this.stage=STAGES[clamp(stageId-1,0,29)];this.save=save;this.practice=practice;this.seed=seed>>>0||1;
  this.time=0;this.state='running';this.id=0;this.events=[];this.enemies=[];this.pickups=[];this.projectiles=[];this.hazards=[];this.effects=[];
  this.level=1;this.xp=0;this.nextXP=7;this.kills=0;this.runCoins=0;this.objectives=0;this.swords=3;this.rotation=0;
  this.up={speed:0,power:0,reach:0,magnet:0,haste:0,heal:0,blade:0,evolve:0};this.path='';this.chosenPath=false;this.options=[];
  this.player={x:0,z:0,vx:0,vz:0,health:100+save.training.vitality*12,maxHealth:100+save.training.vitality*12,inv:0,dash:0,dashCD:0,face:0};
  this.spawnClock=1;this.lootClock=7;this.hazardClock=4;this.wave=0;this.eliteClock=19;this.introduced=new Set();this.bossSpawned=false;this.bossDefeated=false;this.settled=false;this.combo=0;this.comboTimer=0;this.bestCombo=0;
  this.pillars=['pillars','crown'].includes(this.stage.layout)?[[-4,-3],[4,-3],[-4,4],[4,4]].map(([x,z])=>({x,z,r:.8})):[];
  this.goals=[];
  for(let i=0;i<3;i++)this.drop('sword',Math.cos(i*2.1)*2.1,Math.sin(i*2.1)*2.1);
  const positions=[[-5,-5],[5,-5],[5,5],[-5,5],[0,-7]];
  for(let i=0;i<this.stage.goal;i++){
   const [x,z]=positions[i];
   if(this.stage.rule==='caches')this.drop('cache',x,z);
   else this.goals.push({id:++this.id,x,z,kind:this.stage.rule,hp:50+this.stage.id*2,progress:0,done:false});
  }
 }
 random(){this.seed=(Math.imul(1664525,this.seed)+1013904223)>>>0;return this.seed/4294967296;}
 emit(type,data={}){this.events.push({type,...data});}
 get speed(){return 2.6*(1+.2*this.up.speed);}
 get radius(){return 1.65*(1+.12*this.up.reach);}
 get damage(){return (14+this.save.training.edge*2)*(1+.3*this.up.power)*(this.up.evolve?2:1);}
 get tier(){return this.up.evolve?3:Math.min(2,Math.floor(this.up.power/2));}
 get pendingEvolution(){return !this.up.evolve&&this.path&&this.up.power>=3&&this.up.speed>=2&&this.swords>=8;}
 bladePositions(){return Array.from({length:this.swords},(_,i)=>{const outer=i>=12,count=outer?this.swords-12:Math.min(12,this.swords),index=outer?i-12:i,r=this.radius+(outer?.6:0),a=this.rotation*(outer?-.8:1)+index*Math.PI*2/count;return {x:this.player.x+Math.cos(a)*r,z:this.player.z+Math.sin(a)*r,a,r};});}
 drop(kind,x,z,value=1){if(this.pickups.length>=LIMITS.pickups){const same=this.pickups.find(p=>p.kind===kind&&kind==='xp');if(same)same.value+=value;return;}this.pickups.push({id:++this.id,kind,x,z,value,born:this.time});}
 spawn(kind,boss=0,x,z,elite=false){
  if(this.enemies.length>=LIMITS.enemies)return;
  if(x===undefined){const a=this.random()*Math.PI*2;x=Math.cos(a)*8;z=Math.sin(a)*9.3;}
  const arc=this.stage.arc,base=ENEMIES[kind]||ENEMIES.chaser,hp=boss?Math.round((420+boss*140)*1.12):(base.hp+arc*7)*(elite?1.6:1);
  const e={id:++this.id,kind,x,z,hp,maxHp:hp,boss,elite,r:boss?1.05:elite?.52:.42,speed:(boss?.95:base.speed+arc*.06)*(elite?1.1:1),hitCD:0,flash:0,recoil:0,burn:0,slow:0,attack:1+this.random()*2,wind:0,mode:'walk',dx:0,dz:0,born:this.time,grace:.45,phase:0,shield:kind==='guard'?2:0,flank:this.random()<.5?-1:1};
  this.enemies.push(e);return e;
 }
 hazard(data){if(this.hazards.length<LIMITS.hazards)this.hazards.push({id:++this.id,...data});}
 get spawnInterval(){return Math.max(.38,1.1-this.stage.arc*.105-this.time/175);}
 spawnWave(){
  const next=Math.floor(this.time/16);if(next<=this.wave)return;
  this.wave=next;const kinds=this.stage.enemies,count=Math.min(7,2+this.stage.arc+Math.floor(next/2));
  for(let i=0;i<count;i++)this.spawn(kinds[(i+next)%kinds.length]);
  this.emit('wave',{wave:next+1,x:this.player.x,z:this.player.z});
 }
 dash(x,z){const p=this.player;if(this.state!=='running'||p.dashCD>0)return false;let n=Math.hypot(x,z);if(!n){x=Math.sin(p.face);z=Math.cos(p.face);n=1;}p.vx=x/n*13;p.vz=z/n*13;p.dash=.24;p.inv=Math.max(p.inv,.32);p.dashCD=4.8/(1+.12*this.up.haste);this.emit('dash',{x:p.x,z:p.z,dx:x/n,dz:z/n});return true;}
 tick(dt,input={x:0,y:0}){if(this.state!=='running')return;let left=clamp(dt,0,.1);while(left>0&&this.state==='running'){const step=Math.min(left,1/60);this.step(step,input);left-=step;}}
 step(dt,input){
  const p=this.player;this.time+=dt;p.inv=Math.max(0,p.inv-dt);p.dashCD=Math.max(0,p.dashCD-dt);p.dash=Math.max(0,p.dash-dt);
  const x=num(input.x),z=num(input.y),n=Math.max(1,Math.hypot(x,z)),speed=3.2*(1+.12*this.up.haste);
  if(!p.dash){const blend=this.stage.layout==='ice'?Math.min(1,dt*4):1;p.vx+=(x/n*speed-p.vx)*blend;p.vz+=(z/n*speed-p.vz)*blend;}
  p.x=clamp(p.x+p.vx*dt,-7.5,7.5);p.z=clamp(p.z+p.vz*dt,-8.5,8.5);if(Math.hypot(p.vx,p.vz)>.2)p.face=Math.atan2(p.vx,p.vz);
  for(const b of this.pillars){const d=Math.hypot(p.x-b.x,p.z-b.z);if(d<b.r+.35&&d>.001){p.x=b.x+(p.x-b.x)/d*(b.r+.35);p.z=b.z+(p.z-b.z)/d*(b.r+.35);}}
  const oldRotation=this.rotation;this.rotation+=this.speed*dt;
  this.spawnClock-=dt;this.lootClock-=dt;this.hazardClock-=dt;
  if(this.spawnClock<=0){this.spawnClock=this.spawnInterval;const count=Math.min(5,1+Math.floor(this.time/22));for(let j=0;j<count;j++)this.spawn(this.stage.enemies[Math.floor(this.random()*this.stage.enemies.length)]);}
  this.spawnWave();
  for(const kind of ['stalker','bomber','summoner'])if(this.time>=6&&this.stage.enemies.includes(kind)&&!this.introduced.has(kind)){this.introduced.add(kind);this.spawn(kind);this.emit('enemyIntro',{kind});}
  this.eliteClock-=dt;if(this.stage.id>=7&&this.eliteClock<=0){this.eliteClock=24;const e=this.spawn(this.stage.enemies[this.wave%this.stage.enemies.length],0,undefined,undefined,true);if(e)this.emit('elite',{x:e.x,z:e.z});}
  if(this.lootClock<=0){this.lootClock=8;this.drop('sword',(this.random()-.5)*12,(this.random()-.5)*13);if(this.time>16)this.drop('heal',(this.random()-.5)*11,(this.random()-.5)*12);}
  if(this.stage.boss&&!this.bossSpawned&&this.time>=this.stage.duration*.43){this.bossSpawned=true;this.spawn('boss',this.stage.boss,0,-6.5);this.emit('boss',{boss:this.stage.boss});}
  if(this.hazardClock<=0){this.hazardClock=4.2;if(['lava','storm','curse','crown'].includes(this.stage.layout)){const isLava=this.stage.layout==='lava';this.hazard({x:isLava?(this.random()<.5?-3.8:3.8):p.x,z:isLava?(this.random()-.5)*12:p.z,r:isLava?2.2:1.65,delay:1.25,life:isLava?2.3:.6,kind:this.stage.layout});}}
  for(const e of this.enemies){
   if(e.hp<=0)continue;e.hitCD=Math.max(0,e.hitCD-dt);e.flash=Math.max(0,e.flash-dt);e.recoil=Math.max(0,e.recoil-dt);e.slow=Math.max(0,e.slow-dt);e.grace=Math.max(0,e.grace-dt);
   if(e.burn>0){e.burn-=dt;e.hp-=dt*this.damage*(this.up.evolve?.7:.22);if(e.hp<=0){this.defeat(e);continue;}}
   const dx=p.x-e.x,dz=p.z-e.z,dist=Math.hypot(dx,dz)||1;e.attack-=dt;
   if(e.boss&&e.hp<e.maxHp*.5&&!e.enraged){e.enraged=true;e.attack=Math.min(e.attack,1.2);this.emit('enrage',{x:e.x,z:e.z});}
   if(e.mode==='charge'){e.wind-=dt;const v=e.kind==='stalker'?7.5:9;e.x+=e.dx*dt*v;e.z+=e.dz*dt*v;if(e.wind<=0){e.mode='recover';e.wind=e.kind==='stalker'?.9:1.2;}}
   else if(e.mode==='windup'){e.wind-=dt;if(e.wind<=0){e.mode='charge';e.wind=e.kind==='stalker'?.42:.65;this.emit('rush',{x:e.x,z:e.z,dx:e.dx,dz:e.dz});}}
   else if(['detonate','summon','volley','mend'].includes(e.mode)){e.wind-=dt;if(e.wind<=0)this.finishCast(e);}
   else if(e.mode==='recover'){e.wind-=dt;if(e.wind<=0)e.mode='walk';}
   else {
    if(e.boss)this.bossAction(e,dx,dz,dist);
    else if((e.kind==='charger'||e.kind==='stalker'&&dist<6)&&e.attack<=0){e.mode='windup';e.wind=.85;e.dx=dx/dist;e.dz=dz/dist;e.attack=e.kind==='stalker'?3.2:3.8;}
    else if(e.kind==='bomber'&&dist<2.9&&e.attack<=0){e.mode='detonate';e.wind=.95;}
    else if(e.kind==='summoner'&&e.attack<=0){e.mode='summon';e.wind=1.2;e.attack=5.6;}
    else if(e.kind==='ranger'&&e.attack<=0){e.mode='volley';e.wind=.8;e.dx=dx/dist;e.dz=dz/dist;e.attack=2.6;}
    else if(e.kind==='healer'&&e.attack<=0){e.mode='mend';e.wind=.9;e.attack=3.2;}
    const ranged=['ranger','summoner'].includes(e.kind),retreat=ranged&&dist<4?-1:1,moving=e.mode==='walk'&&!(ranged&&dist>=4&&dist<5.5);
    if(moving){const v=e.speed*(e.slow>0?.42:1)*retreat,flank=e.kind==='stalker'&&dist<7?e.flank*.8:0,radial=flank&&dist<3?.18:1;e.x+=(dx/dist*radial-dz/dist*flank)*v*dt;e.z+=(dz/dist*radial+dx/dist*flank)*v*dt;}
   }
   e.x=clamp(e.x,-8.3,8.3);e.z=clamp(e.z,-9.2,9.2);
   for(const b of this.pillars){const d=Math.hypot(e.x-b.x,e.z-b.z);if(d<b.r+e.r&&d>.01){e.x=b.x+(e.x-b.x)/d*(b.r+e.r);e.z=b.z+(e.z-b.z)/d*(b.r+e.r);}}
   if(e.hp<=0)continue;if(e.grace<=0&&d2(p,e)<(e.r+.35)**2)this.hurt(e.boss?22:e.elite?15:12,e);
   this.swordContact(e,oldRotation,dt);
  }
  this.enemies=this.enemies.filter(e=>e.hp>0);
  for(const h of this.hazards){h.delay-=dt;if(h.delay<0){if(!h.triggered){h.triggered=true;this.emit('eruption',{x:h.x,z:h.z,kind:h.kind,r:h.r});}h.life-=dt;if(d2(p,h)<h.r*h.r)this.hurt(h.damage||18,h);}}
  this.hazards=this.hazards.filter(h=>h.life>0);
  for(const b of this.projectiles){b.x+=b.vx*dt;b.z+=b.vz*dt;b.life-=dt;if(d2(p,b)<.38){this.hurt(11,b);b.life=0;}}
  this.projectiles=this.projectiles.filter(b=>b.life>0&&Math.abs(b.x)<10&&Math.abs(b.z)<11);
  const pickupRadius=1.15*(1+this.up.magnet*.35+this.save.training.magnet*.12);
  for(const item of this.pickups){const dist=Math.hypot(p.x-item.x,p.z-item.z);const reach=item.kind==='cache'?1.0:pickupRadius;if(dist<reach){if(dist>.28){const pull=Math.min(dist,dt*(8+10*(1-dist/reach)));item.x+=(p.x-item.x)/dist*pull;item.z+=(p.z-item.z)/dist*pull;}else{item.collected=true;this.collect(item);}}}
  this.pickups=this.pickups.filter(i=>!i.collected);
  for(const g of this.goals){if(g.done)continue;if(g.kind==='beacons'){if(d2(p,g)<2.5)g.progress+=dt;if(g.progress>=2.4){g.done=true;this.objectives++;this.drop('cache',g.x,g.z);this.emit('objective',{x:g.x,z:g.z});}}
   else {g.hitCD=Math.max(0,(g.hitCD||0)-dt);this.swordContact(g,oldRotation,dt);if(g.hp<=0){g.done=true;this.objectives++;this.drop('cache',g.x,g.z);this.emit('objective',{x:g.x,z:g.z});}else if(Math.floor(this.time/6)!==g.spawn){g.spawn=Math.floor(this.time/6);this.spawn('chaser',0,g.x,g.z);}}
  }
  if(this.comboTimer>0)this.comboTimer-=dt;else this.combo=0;
  if(p.health<=0){this.state='lost';this.emit('result',{won:false});return;}
  const goalReady=this.objectives>=this.stage.goal;
  if((this.stage.boss?this.bossDefeated:this.time>=this.stage.duration&&goalReady)){this.state='won';this.emit('result',{won:true});return;}
  if(this.xp>=this.nextXP)this.levelUp();
 }
 finishCast(e){
  if(e.hp<=0)return;
  if(e.mode==='detonate'){
   this.hazard({x:e.x,z:e.z,r:2.05,delay:0,life:.24,damage:20,kind:'blast'});
   e.hp=0;e.defeated=true;this.emit('detonate',{x:e.x,z:e.z,kind:e.kind});return;
  }
  if(e.mode==='summon'){
   const count=this.enemies.filter(o=>o.kind==='small'&&o.hp>0).length;
   for(let i=0;i<Math.min(3,14-count);i++){const a=i*Math.PI*2/3;this.spawn('small',0,clamp(e.x+Math.cos(a)*.9,-8,8),clamp(e.z+Math.sin(a)*.9,-9,9));}
   this.emit('summon',{x:e.x,z:e.z});
  }else if(e.mode==='volley'){
   const aim=Math.atan2(e.dz,e.dx),fan=e.boss?3:0;
   for(let i=-fan;i<=fan;i++)this.shoot(e,Math.cos(aim+i*.26),Math.sin(aim+i*.26));
   this.emit('volley',{x:e.x,z:e.z});
  }else if(e.mode==='mend'){
   let healed=false;for(const other of this.enemies)if(other!==e&&!other.boss&&other.hp>0&&other.hp<other.maxHp&&d2(e,other)<16){other.hp=Math.min(other.maxHp,other.hp+12);healed=true;this.emit('mend',{x:other.x,z:other.z});}
   if(healed)this.emit('healCast');
  }
  e.mode='recover';e.wind=e.boss?.6:.45;
 }
 swordContact(e,oldRotation,dt){
  if(e.hitCD>0||e.hp<=0)return;const dx=e.x-this.player.x,dz=e.z-this.player.z,d=Math.hypot(dx,dz),a=Math.atan2(dz,dx),r=e.r||.7;
  for(let i=0;i<this.swords;i++){
   const outer=i>=12,count=outer?this.swords-12:Math.min(12,this.swords),idx=outer?i-12:i,orbit=this.radius+(outer?.6:0),direction=outer?-.8:1;
   if(Math.abs(d-orbit)>.62+r)continue;
   const bladeA=this.rotation*direction+idx*Math.PI*2/count,previous=oldRotation*direction+idx*Math.PI*2/count;
   const swept=Math.abs(angleDiff(bladeA,previous));
   if(Math.abs(angleDiff(a,bladeA))>Math.asin(Math.min(1,(r+.24)/Math.max(.1,d)))+swept)continue;
   if(e.boss===5&&this.enemies.some(o=>o!==e&&!o.boss)&&e.mode!=='recover'){e.hitCD=.25;this.emit('block',{x:e.x,z:e.z});return;}
   if(e.shield>0){e.shield--;e.hitCD=.2;this.emit(e.shield?'block':'break',{x:e.x,z:e.z});return;}
   const critical=this.random()<.12,amount=this.damage*(critical?1.7:1)*(e.mode==='recover'?1.4:1);
   const applied=Math.min(e.hp,amount);e.hp-=amount;e.hitCD=.16;e.flash=.13;e.recoil=.18;e.impactX=dx/Math.max(.01,d);e.impactZ=dz/Math.max(.01,d);
   if(!e.boss&&e.kind!=='nests'&&d>.01){e.x+=dx/d*.16;e.z+=dz/d*.16;}
   if(this.path==='ember')e.burn=this.up.evolve?3:1.8;
   if(this.path==='frost')e.slow=this.up.evolve?3:1.5;
   if(this.path==='storm'){let links=0;for(const other of this.enemies){if(other!==e&&other.hp>0&&d2(e,other)<(this.up.evolve?16:7)&&links<(this.up.evolve?3:1)){const chainDamage=Math.min(other.hp,amount*.45);other.hp-=chainDamage;other.flash=.13;this.emit('chain',{x:e.x,z:e.z,toX:other.x,toZ:other.z,amount:Math.round(chainDamage)});links++;if(other.hp<=0)this.defeat(other);}}}
   this.emit('hit',{x:e.x,z:e.z,amount:Math.round(applied),critical,element:this.path,angle:a});
   if(e.hp<=0&&e.kind!=='nests')this.defeat(e);return;
  }
 }
 hurt(amount,source){const p=this.player;if(p.inv>0||this.state!=='running')return;p.health=Math.max(0,p.health-amount);p.inv=1;this.emit('hurt',{amount,x:p.x,z:p.z});}
 defeat(e){if(e.defeated)return;e.defeated=true;e.hp=0;this.kills++;this.combo++;this.comboTimer=2;this.bestCombo=Math.max(this.bestCombo,this.combo);this.runCoins+=e.boss?30:1;
  this.drop('xp',e.x,e.z,e.boss?12:1);if(this.kills%4===0)this.drop('sword',e.x+.25,e.z);if(this.kills%19===0)this.drop('heal',e.x,e.z);
  if(e.kind==='splitter'){this.spawn('small',0,e.x-.4,e.z);this.spawn('small',0,e.x+.4,e.z);}
  if(e.boss)this.bossDefeated=true;this.emit('defeat',{x:e.x,z:e.z,boss:e.boss,elite:e.elite,kind:e.kind});
 }
 shoot(e,dx,dz){if(this.projectiles.length<LIMITS.projectiles)this.projectiles.push({id:++this.id,x:e.x,z:e.z,vx:dx*4.2,vz:dz*4.2,life:6});}
 bossAction(e,dx,dz,dist){
  if(e.attack>0)return;e.phase++;
  const type=e.boss===6?1+e.phase%3:e.boss;
  if(type===2){e.mode='windup';e.wind=1.1;e.dx=dx/dist;e.dz=dz/dist;e.attack=4.2;}
  else if(type===3){e.mode='volley';e.wind=.9;e.dx=dx/dist;e.dz=dz/dist;e.attack=2.7;}
  else if(type===4){for(let i=0;i<3;i++)this.hazard({x:this.player.x+(i-1)*2.3,z:this.player.z,r:1.4,delay:1+i*.25,life:.4,kind:'storm'});e.attack=3;}
  else if(type===5){if(this.enemies.filter(o=>!o.boss).length<14)for(let i=0;i<5;i++)this.spawn(i===0?'stalker':'chaser',0,e.x+Math.cos(i*1.25)*2,e.z+Math.sin(i*1.25)*2);e.mode='recover';e.wind=1.8;e.attack=5.4;}
  else {for(let i=0;i<8;i++){const a=i*Math.PI/4+e.phase*.4;this.hazard({x:e.x+Math.cos(a)*3,z:e.z+Math.sin(a)*3,r:1.3,delay:1.2,life:.5,kind:'ring'});}e.mode='recover';e.wind=1.4;e.attack=3.8;}
  if(e.enraged)e.attack*=.84;
  this.emit('bossAttack',{boss:e.boss,pattern:type});
 }
 collect(item){
  if(item.kind==='xp')this.xp+=item.value;
  else if(item.kind==='sword'){if(this.swords<LIMITS.swords)this.swords++;else this.xp+=2;}
  else if(item.kind==='heal')this.player.health=Math.min(this.player.maxHealth,this.player.health+25);
  else if(item.kind==='cache'){this.swords=Math.min(LIMITS.swords,this.swords+3);this.xp+=4;this.runCoins+=5;if(this.stage.rule==='caches')this.objectives++;}
  this.emit('pickup',{kind:item.kind,x:item.x,z:item.z});
 }
 levelUp(){this.xp-=this.nextXP;this.level++;this.nextXP=Math.floor(6+this.level*2.2);this.player.health=Math.min(this.player.maxHealth,this.player.health+5);this.state='upgrade';
  if(this.level>=3&&!this.chosenPath)this.options=['ember','frost','storm'];
  else {const pool=Object.keys(this.up).filter(k=>this.up[k]<UPGRADES[k].cap&&k!=='evolve'&&(k!=='blade'||this.swords<24)&&(k!=='heal'||this.player.health<this.player.maxHealth-10));this.options=[];
   if(this.pendingEvolution)this.options.push('evolve');
   while(this.options.length<3&&pool.length){const at=Math.floor(this.random()*pool.length);this.options.push(pool.splice(at,1)[0]);}if(!this.options.length)this.options=['heal'];}
  this.emit('upgrade');
 }
 choose(key){if(this.state!=='upgrade'||!this.options.includes(key))return false;
  if(['ember','frost','storm'].includes(key)){this.path=key;this.chosenPath=true;}
  else {this.up[key]++;if(key==='blade')this.swords=Math.min(24,this.swords+2);if(key==='heal')this.player.health=Math.min(this.player.maxHealth,this.player.health+40);}
  this.options=[];this.state='running';this.emit(key==='evolve'?'evolve':'choice',{key,x:this.player.x,z:this.player.z});return true;
 }
 settle(){if(this.settled||!['won','lost'].includes(this.state))return null;this.settled=true;const won=this.state==='won',first=!this.save.stars[this.stage.id-1];const stars=won?1+(this.player.health/this.player.maxHealth>=.4?1:0)+(this.player.health/this.player.maxHealth>=.75?1:0):0;
  const gold=this.runCoins+(won?(first?this.stage.reward:Math.floor(this.stage.reward/4)):0);
  if(!this.practice){this.save.coins=Math.min(999999,this.save.coins+gold);this.save.stars[this.stage.id-1]=Math.max(stars,this.save.stars[this.stage.id-1]);if(won)this.save.unlocked=Math.max(this.save.unlocked,Math.min(30,this.stage.id+1));this.save.tutorial=true;}
  return {won,stars,gold,first,kills:this.kills,swords:this.swords,level:this.level,time:this.time,combo:this.bestCombo,practice:this.practice};
 }
}
export function train(save,key){if(!Object.hasOwn(save.training,key))return false;const level=save.training[key],cost=50+level*45;if(level>=5||save.coins<cost)return false;save.coins-=cost;save.training[key]++;return true;}
