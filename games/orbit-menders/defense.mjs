// Deterministic central-turret combat. Rendering never decides a hit or reward.
export const STEP=1/60;
export const LIMITS=Object.freeze({enemies:96,bullets:240,enemyProjectiles:96,catchUpSteps:8});
export const TURRET=Object.freeze({x:0,z:0,y:2.42,muzzle:2.18,heroZ:1.72});
export const TALENTS=Object.freeze({power:{max:8,base:22,step:14},rapid:{max:8,base:22,step:14},hull:{max:8,base:18,step:12},blast:{max:6,base:26,step:18},control:{max:6,base:26,step:18},support:{max:6,base:26,step:18}});
export const STANCES=Object.freeze(['pierce','frost','chain']);
export const talentCost=(id,rank)=>TALENTS[id]?TALENTS[id].base+TALENTS[id].step*rank:Infinity;
export function talentSpent(ranks={}){return Object.keys(TALENTS).reduce((sum,id)=>sum+Array.from({length:ranks[id]||0},(_,i)=>talentCost(id,i)).reduce((a,b)=>a+b,0),0);}
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const finite=(n,f)=>Number.isFinite(n)?n:f;
const TYPES=Object.freeze({walker:{hp:36,speed:1.03,radius:.54,damage:17,period:1.3,windup:.55,points:100},runner:{hp:29,speed:1.9,radius:.45,damage:13,period:.95,windup:.38,points:130},brute:{hp:160,speed:.72,radius:.82,damage:36,period:1.8,windup:.85,points:260},bomber:{hp:58,speed:1.3,radius:.57,damage:110,period:1.3,windup:1.15,points:200},spitter:{hp:67,speed:.9,radius:.57,damage:32,period:3.3,windup:.95,points:220},shield:{hp:85,speed:.88,radius:.64,damage:22,period:1.5,windup:.7,points:240},healer:{hp:62,speed:.78,radius:.55,damage:15,period:2.8,windup:.8,points:280},splitter:{hp:94,speed:1.12,radius:.64,damage:21,period:1.4,windup:.6,points:240},boss:{hp:900,speed:.55,radius:1.23,damage:90,period:4.2,windup:1.15,points:2000}});
// Each row specifies a different decision rule and authored formation. Packs:
// w walker, r runner, b brute, x bomber, a acid, s shield, h healer, t splitter.
const STAGE_DESIGNS=[
 ['晨光守望','front','priority','wwwrww|wrrwwrw|wwxwrrww',null],
 ['雙翼突襲','pincer','flank','rrwwrrww|wwrrwwrrww|rrxwrrwxrr',null],
 ['鐵甲橋頭','front','armour','bwwwbww|wrbwbrww|bbxwwrrbww',null],
 ['酸霧水道','cross','ranged','awwarwwa|awarrwawrw|abwarxwarw',null],
 ['爆桶夜市','fan','chain','xwwxwwxwww|wxrxwwxrrww|bxxwwxwwrwxw','rally'],
 ['最後的曙光','pincer','shield','swwwswww|wsrwwsrwwr|ssxwrrwwssww',null],
 ['折角防線','cross','crossfire','srwawsrwww|awsrrwsawwwr|ssawrrxwsawr',null],
 ['裂殼小隊','front','split','twwtwwww|wtrrwtrrww|ttxwrrwtwwrw',null],
 ['盾牆側翼','pincer','screen','sswwrrww|srstrrwsrrww|ssxtrrwssrww',null],
 ['鐵壁領主','front','shield','sswwwrrbww|bswrrwsbwwrr|ssbxrrwssbww','bulwark'],
 ['綠光救護站','front','healer','hwwwwwbww|whwrrwhwwbww|hhbwwxrrwwhw',null],
 ['兩側救援線','pincer','medic-flank','hrrwwhrrww|wrhswrhwwsrr|hhxrrswwhrrw',null],
 ['不能先打大隻','cross','triage','bhwbwwhwww|bwhaswrhwwrr|bbhxtwwhrrww',null],
 ['裂殼護送隊','fan','brood-medic','thwwtwhwww|twhswrhtwwrw|htxtwhstrwwr',null],
 ['回春司令','front','healing','hhbwwwrrww|hwsbwrhwrrww|hbxswrhwwrrw','medic'],
 ['遠程交叉火網','cross','acid','aawrrwaaww|awaswrrawwww|aaxhwrrawsww',null],
 ['酸桶連鎖','pincer','volatile-acid','xawwraxaww|axwrhaxwrwww|baxwrxaswrrw',null],
 ['環道游擊','orbit','orbit','arwawrrawrww|sawrraswrrww|atxhrrawrrww',null],
 ['彈幕前的寧靜','fan','barrage','aabwrrwaabww|aaxrrhwwaaww|aashxrrwaaww',null],
 ['酸雨炮王','cross','artillery','aawswraawwrr|asbwrraxwwww|aahsxrrwaasw','artillery'],
 ['環形封鎖','orbit','surround','srtwrsrtwwrr|whsrxwsrtwrw|sthaxrrwsrtw',null],
 ['先破盾再引爆','fan','shield-bomb','sxwwsxwwrrww|sxhwwsrxwwrr|ssxhtwwsxrrw',null],
 ['裂殼迴旋','orbit','swarm','ttwrrttwrrww|twhtrrtwsrrw|ttxhtrrwtaww',null],
 ['緊急維修線','pincer','attrition','bhwwsrrhwwwr|sxtwhraswwrr|htbsxrrhwwaw',null],
 ['裂巢巨獸','fan','brood','ttwhwrrtwwww|tswhxrrtwwaw|tthsxrrtwwsw','brood'],
 ['四門齊開','cross','four-gates','srhwatxrrwww|asthxwrrswww|tshbaxrrwwaw',null],
 ['救護盾陣','orbit','fortress','shwshwrrbwww|ashwsrrhwwtw|shxbwrrshtww',null],
 ['引爆時刻','pincer','detonation','xthwwxsrwwrr|xsawhrxtwwrw|xhbstxrrwwaw',null],
 ['破曉前線','cross','combined','bhsatxrrwwww|shatxrrwbsww|tshbaxrrwsaw',null],
 ['黎明守城戰','orbit','finale','shbatxrrwwww|htssaxrrwbww|bhsatxrrwsww|shbatxrrwsaw','commander'],
];
const symbols={w:'walker',r:'runner',b:'brute',x:'bomber',a:'spitter',s:'shield',h:'healer',t:'splitter'};
function formation(pack,layout,stage,wave){
 const tier=Math.floor(stage/5),spawns=[],gap=Math.max(.28,.64-tier*.055),hp=1+tier*.19;
 [...pack].forEach((letter,i)=>{let x,z;const lane=(i%5)-2;
  if(layout==='front'){x=lane*2.8;z=-15;}
  if(layout==='pincer'){x=i%2?-7.1:7.1;z=-12+(i%4)*6.4;}
  if(layout==='cross'){const side=i%3;x=side===0?-7.1:side===1?7.1:lane*2.8;z=side===2?-15.2:-12+(i%4)*6.4;}
  if(layout==='fan'){x=lane*3.4;z=-Math.sqrt(Math.max(0,1-x*x/64))*15;}
  if(layout==='orbit'){const a=-Math.PI/2+((i+wave*2)%12)*Math.PI*2/12;x=Math.cos(a)*7;z=Math.sin(a)*15;}
  spawns.push({at:.7+i*gap,type:symbols[letter],x,z,hpScale:hp,speedScale:1+tier*.035,route:layout==='orbit'?'orbit':stage%5===2?'weave':'direct'});
 });return spawns;
}
export const OPERATIONS=Object.freeze(STAGE_DESIGNS.map(([name,layout,rule,packs,boss],index)=>{
 const waves=packs.split('|').map((pack,w)=>{let spawns=formation(pack,layout,index,w); // follow-up rush is a deliberate second pressure, not the only difference
  if(index>=0)spawns.push(...formation(w%2?'rrwwrrww':'wwrwwwrw',layout,index,w+1).map(s=>({...s,at:s.at+pack.length*.54+1.8})));
  if(boss&&w===packs.split('|').length-1)spawns.push({at:2,type:'boss',x:0,z:-15,hpScale:1+Math.floor(index/5)*.38,bossMode:boss});
  return Object.freeze({name:`${index+1}-${w+1}`,spawns:Object.freeze(spawns.sort((a,b)=>a.at-b.at).map(Object.freeze))});});
 return Object.freeze({id:`D${String(index+1).padStart(2,'0')}`,name,title:name,subtitle:rule,chapter:Math.floor(index/5)+1,layout,rule,boss,theme:['sunrise','garden','foundry','canal','market','citadel'][Math.floor(index/5)],waves:Object.freeze(waves),modifier:Object.freeze({kind:rule,chainRadius:rule.includes('chain')||rule.includes('detonation')?3.8:2.65})});
}));
export const UPGRADE_INFO=Object.freeze(Object.fromEntries(['power','rapid','spread','repair','pierce','frost','chain','explosive','drone','shield'].map(id=>[id,Object.freeze({id})])));
export function segmentCircle(ax,az,bx,bz,cx,cz,radius){const dx=bx-ax,dz=bz-az,ox=ax-cx,oz=az-cz,a=dx*dx+dz*dz,c=ox*ox+oz*oz-radius*radius;if(c<=0)return 0;if(a<1e-12)return null;const b=2*(ox*dx+oz*dz),d=b*b-4*a*c;if(d<0)return null;const t=(-b-Math.sqrt(d))/(2*a);return t>=0&&t<=1?t:null;}
export function muzzleAt(angle){return {x:TURRET.x+Math.sin(angle)*TURRET.muzzle,z:TURRET.z+Math.cos(angle)*TURRET.muzzle,y:TURRET.y};}
export class DefenseRun{
 constructor({operation:selected=0,assist=false,training={}}={}){
  const index=typeof selected==='string'?OPERATIONS.findIndex(o=>o.id===selected):selected;if(!Number.isInteger(index)||!OPERATIONS[index])throw new RangeError('Unknown defence operation');
  this.operation=OPERATIONS[index];this.operationIndex=index;this.assist=Boolean(assist);this.runId=globalThis.crypto?.randomUUID?.()??`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const ranks=training.ranks??{};this.ranks=Object.fromEntries(Object.entries(TALENTS).map(([id,d])=>[id,clamp(Math.floor(finite(ranks[id],0)),0,d.max)]));this.stance=STANCES.includes(training.stance)?training.stance:'pierce';
  this.state='playing';this.maxHP=Math.round((this.assist?1400:1000)*(1+this.ranks.hull*.08));this.towerHP=this.maxHP;this.wave=1;this.totalWaves=this.operation.waves.length;this.time=0;this.waveTime=-1;
  this.score=0;this.kills=0;this.shots=0;this.hits=0;this.enemies=[];this.bullets=[];this.enemyProjectiles=[];this.events=[];
  this.weapon={damage:28*(1+this.ranks.power*.08),rate:6.6*(1+this.ranks.rapid*.055),spread:0,blastDamage:140*(1+this.ranks.blast*.12),blastRadius:3.6+this.ranks.blast*.12,pierce:this.stance==='pierce'?1:0,frost:this.stance==='frost'?1:0,chain:this.stance==='chain'?1:0,explosive:0,drone:this.ranks.support>=3?1:0};
  this.upgrades=Object.fromEntries(Object.keys(UPGRADE_INFO).map(id=>[id,0]));this.upgradeOptions=[];this.shield=0;this.maxShield=0;this.droneTimer=1;this.blastCooldown=0;this.fireCooldown=0;this.accumulator=0;this.steps=0;this.nextSpawn=0;this.nextId=1;this.pendingBlast=false;this.blastHeld=false;this.aim={x:0,z:-7};this.result=null;this.emit('wave-start',{wave:1});
 }
 get currentWave(){return this.operation.waves[this.wave-1];}get remainingSpawns(){return this.currentWave.spawns.length-this.nextSpawn;}get blastReady(){return this.blastCooldown<=0&&this.state==='playing';}
 emit(type,details={}){this.events.push({type,time:this.time,...details});}drainEvents(){const result=this.events;this.events=[];return result;}
 chooseUpgrade(id){if(this.state!=='upgrade'||!this.upgradeOptions.includes(id))return false;this.upgrades[id]++;
  if(id==='power'){this.weapon.damage*=1.25;this.weapon.blastDamage*=1.12;}if(id==='rapid')this.weapon.rate=Math.min(18,this.weapon.rate*1.2);if(id==='spread')this.weapon.spread=Math.min(3,this.weapon.spread+1);
  if(id==='repair'){this.maxHP=Math.round(this.maxHP*1.05);this.towerHP=Math.min(this.maxHP,this.towerHP+Math.round(this.maxHP*.3));}
  if(['pierce','frost','chain','explosive','drone'].includes(id))this.weapon[id]=Math.min(4,this.weapon[id]+1);
  if(id==='shield'){this.maxShield+=180;this.shield=this.maxShield;}
  this.emit('upgrade',{id,wave:this.wave});this.wave++;this.waveTime=-1.4;this.nextSpawn=0;this.state='playing';this.fireCooldown=0;this.blastCooldown=Math.max(0,this.blastCooldown-2);this.accumulator=0;this.upgradeOptions=[];this.blastHeld=false;this.pendingBlast=false;this.shield=this.maxShield;this.emit('wave-start',{wave:this.wave});return true;
 }
 advance(delta,input={}){if(this.state!=='playing'){this.accumulator=0;this.blastHeld=Boolean(input.blast);return 0;}this.aim.x=clamp(finite(input.aimX,this.aim.x),-8,8);this.aim.z=clamp(finite(input.aimZ,this.aim.z),-16,16);if(input.blast&&!this.blastHeld)this.pendingBlast=true;this.blastHeld=Boolean(input.blast);const dt=clamp(finite(delta,0),0,STEP*LIMITS.catchUpSteps);this.accumulator=Math.min(this.accumulator+dt,STEP*LIMITS.catchUpSteps);let n=0;while(this.accumulator+1e-10>=STEP&&n<LIMITS.catchUpSteps&&this.state==='playing'){this.step(STEP,Boolean(input.firing));this.accumulator=Math.max(0,this.accumulator-STEP);n++;}if(this.state!=='playing')this.accumulator=0;return n;}
 step(dt,firing){this.steps++;this.time+=dt;this.waveTime+=dt;this.fireCooldown=Math.max(0,this.fireCooldown-dt);this.blastCooldown=Math.max(0,this.blastCooldown-dt);if(this.pendingBlast){this.pendingBlast=false;this.useBlast();}
  const spawns=this.currentWave.spawns;while(this.nextSpawn<spawns.length&&spawns[this.nextSpawn].at<=this.waveTime&&this.enemies.length<LIMITS.enemies)this.spawn(spawns[this.nextSpawn++]);
  if(firing&&this.fireCooldown<=1e-9)this.fire();this.moveBullets(dt);for(const e of [...this.enemies])if(e.hp>0)this.updateEnemy(e,dt);this.moveEnemyProjectiles(dt);this.updateDrone(dt);this.enemies=this.enemies.filter(e=>e.hp>0);
  if(this.state==='playing'&&this.nextSpawn===spawns.length&&!this.enemies.length&&!this.enemyProjectiles.length)this.clearWave();
 }
 spawn(spec){const type=TYPES[spec.type]?spec.type:'walker',d=TYPES[type],hp=d.hp*(spec.hpScale||1);const e={id:this.nextId++,type,x:spec.x,z:spec.z,px:spec.x,pz:spec.z,hp,maxHP:hp,radius:d.radius,speed:d.speed*(spec.speedScale||1),age:0,hit:0,attack:0,warning:false,attackTimer:d.period,specialTimer:type==='healer'?3:5,summons:0,armour:type==='brute'?.72:1,shield:type==='shield'?hp*.7:0,shieldMax:type==='shield'?hp*.7:0,frozen:0,slow:1,route:spec.route??'direct',bossMode:spec.bossMode??this.operation.boss,phase:0};this.enemies.push(e);this.emit('spawn',{id:e.id,enemyType:type,x:e.x,z:e.z});return e;}
 fire(){if(this.bullets.length>=LIMITS.bullets)return;const dx=this.aim.x-TURRET.x,dz=this.aim.z-TURRET.z,d=Math.hypot(dx,dz);if(d<.2)return;const angle=Math.atan2(dx,dz),m=muzzleAt(angle),offsets=[0];for(let i=1;i<=this.weapon.spread;i++)offsets.push(i*.11,-i*.11);
  for(const offset of offsets){if(this.bullets.length>=LIMITS.bullets)break;this.bullets.push({id:this.nextId++,x:m.x,z:m.z,px:m.x,pz:m.z,startX:m.x,startZ:m.z,aimX:this.aim.x,aimZ:this.aim.z,travel:0,vx:Math.sin(angle+offset)*42,vz:Math.cos(angle+offset)*42,life:.85,damage:this.weapon.damage*(offset?.62:1),pierce:this.weapon.pierce,hitIds:[],side:offset!==0});}
  this.shots++;this.fireCooldown=1/this.weapon.rate;this.emit('shot',{...m,aimX:this.aim.x,aimZ:this.aim.z,angle,count:offsets.length});
 }
 moveBullets(dt){const alive=[];for(const b of this.bullets){b.px=b.x;b.pz=b.z;b.x+=b.vx*dt;b.z+=b.vz*dt;b.travel+=Math.hypot(b.vx,b.vz)*dt;b.life-=dt;
  const contacts=this.enemies.filter(e=>e.hp>0&&!b.hitIds.includes(e.id)).map(e=>({e,t:segmentCircle(b.px,b.pz,b.x,b.z,e.x,e.z,e.radius+.15)})).filter(c=>c.t!==null).sort((a,b)=>a.t-b.t);let consumed=false;
  for(const {e,t}of contacts){const x=b.px+(b.x-b.px)*t,z=b.pz+(b.z-b.pz)*t;this.hits++;b.hitIds.push(e.id);this.damageEnemy(e,b.damage,'shot',x,z);
   if(this.weapon.frost&&e.hp>0){e.frozen=1.5+this.ranks.control*.18;e.slow=Math.max(.28,.64-this.weapon.frost*.09);this.emit('freeze',{x:e.x,z:e.z,id:e.id});}
   if(this.weapon.chain)this.chain(e,b.damage*.48,this.weapon.chain+1);
   if(this.weapon.explosive){this.emit('splash',{x,z,radius:1.8+this.weapon.explosive*.3});for(const other of [...this.enemies])if(other!==e&&other.hp>0&&Math.hypot(other.x-x,other.z-z)<1.8+this.weapon.explosive*.3)this.damageEnemy(other,b.damage*.4,'splash');}
   if(b.pierce<=0){consumed=true;break;}b.pierce--;b.damage*=.83;
  }if(!consumed&&b.life>0&&Math.abs(b.x)<10&&Math.abs(b.z)<18)alive.push(b);
 }this.bullets=alive;}
 chain(origin,damage,count){let from=origin;const used=new Set([origin.id]);for(let n=0;n<count;n++){const target=this.enemies.filter(e=>e.hp>0&&!used.has(e.id)&&Math.hypot(e.x-from.x,e.z-from.z)<3.1).sort((a,b)=>Math.hypot(a.x-from.x,a.z-from.z)-Math.hypot(b.x-from.x,b.z-from.z)||a.id-b.id)[0];if(!target)break;used.add(target.id);this.emit('arc',{x:from.x,z:from.z,toX:target.x,toZ:target.z});this.damageEnemy(target,damage,'chain');from=target;damage*=.8;}}
 useBlast(){if(!this.blastReady)return false;this.blastCooldown=Math.max(4,8-this.ranks.blast*.45);this.emit('blast',{x:this.aim.x,z:this.aim.z,radius:this.weapon.blastRadius,damage:this.weapon.blastDamage});for(const e of [...this.enemies])if(e.hp>0&&Math.hypot(e.x-this.aim.x,e.z-this.aim.z)<=this.weapon.blastRadius+e.radius)this.damageEnemy(e,this.weapon.blastDamage,'blast');this.enemyProjectiles=this.enemyProjectiles.filter(p=>Math.hypot(p.x-this.aim.x,p.z-this.aim.z)>this.weapon.blastRadius);return true;}
 damageEnemy(e,damage,source,x=e.x,z=e.z){if(e.hp<=0||this.state!=='playing')return 0;
  if(e.shield>0){const absorbed=Math.min(e.shield,damage*(source==='blast'?2:1));e.shield-=absorbed;this.emit('block',{x,z,id:e.id,broken:e.shield<=0});if(source!=='blast')return 0;damage*=.55;}
  const applied=Math.min(e.hp,damage*((source==='shot'||source==='splash')?e.armour:1));e.hp=Math.max(0,e.hp-applied);e.hit=.16;
  this.emit('hit',{id:e.id,enemyType:e.type,x,z,damage:applied,hp:e.hp,maxHP:e.maxHP,source,armoured:e.armour<1&&source==='shot'});
  if(e.hp===0){this.kills++;this.score+=TYPES[e.type].points;this.emit('kill',{id:e.id,enemyType:e.type,x:e.x,z:e.z,score:TYPES[e.type].points,source});if(e.type==='bomber'){const radius=this.operation.modifier.chainRadius;this.emit('chain',{x:e.x,z:e.z,radius});for(const other of [...this.enemies])if(other!==e&&other.hp>0&&Math.hypot(other.x-e.x,other.z-e.z)<radius)this.damageEnemy(other,85,'chain');}
   if(e.type==='splitter'){this.emit('split',{x:e.x,z:e.z});for(const sign of[-1,1])if(this.enemies.length<LIMITS.enemies)this.spawn({type:'runner',x:clamp(e.x+sign*.7,-7.4,7.4),z:e.z,hpScale:.45,speedScale:1.15});}
  }return applied;
 }
 updateEnemy(e,dt){e.px=e.x;e.pz=e.z;e.age+=dt;e.hit=Math.max(0,e.hit-dt);e.frozen=Math.max(0,e.frozen-dt);e.specialTimer-=dt;const d=TYPES[e.type],dx=-e.x,dz=-e.z,distance=Math.hypot(dx,dz);let range=e.type==='spitter'?8:e.type==='healer'?7:e.type==='boss'?6:3.1;
  if(e.type==='healer'&&e.specialTimer<=0){e.specialTimer=3.2;this.healGroup(e,5.4,18);}
  if(e.type==='boss')this.bossSpecial(e,dt);
  e.attack=0;if(distance>range){const slowed=e.frozen>0?e.slow:1,speed=e.speed*slowed*(e.hit>0?.75:1),step=Math.min(distance-range,speed*dt);let tx=dx/distance,tz=dz/distance;
   if(e.route==='orbit'){const a=.35;[tx,tz]=[tx*Math.cos(a)-tz*Math.sin(a),tx*Math.sin(a)+tz*Math.cos(a)];}
   if(e.route==='weave'){const s=Math.sin(e.age*2+e.id)*.4;[tx,tz]=[tx+tz*s,tz-tx*s];const l=Math.hypot(tx,tz);tx/=l;tz/=l;}
   e.x+=tx*step;e.z+=tz*step;e.warning=false;
  }else{e.attackTimer-=dt*(e.frozen>0?.65:1);if(e.attackTimer<=d.windup&&!e.warning){e.warning=true;this.emit(e.type==='boss'?'boss-warning':'enemy-warning',{id:e.id,enemyType:e.type,x:e.x,z:e.z,duration:d.windup,damage:d.damage});}if(e.warning)e.attack=1-Math.max(0,e.attackTimer)/d.windup;if(e.attackTimer<=0){if(e.type==='spitter'||e.type==='boss')this.spit(e,d.damage);else{this.damageTower(d.damage,e.type,e.x,e.z);if(e.type==='bomber'){e.hp=0;this.emit('detonate',{id:e.id,x:e.x,z:e.z,radius:2.65});}}e.attackTimer=d.period;e.warning=false;}}
 }
 healGroup(e,radius,amount){let healed=0;for(const ally of this.enemies)if(ally!==e&&ally.hp>0&&Math.hypot(ally.x-e.x,ally.z-e.z)<radius){const gain=Math.min(amount,ally.maxHP-ally.hp);ally.hp+=gain;healed+=gain;}this.emit('heal',{id:e.id,x:e.x,z:e.z,radius,healed});}
 bossSpecial(e){const mode=e.bossMode,phase=e.hp/e.maxHP<.33?2:e.hp/e.maxHP<.66?1:0;if(e.phase!==phase){e.phase=phase;this.emit('phase',{id:e.id,x:e.x,z:e.z,phase});}
  if(e.specialTimer>0)return;e.specialTimer=6.4;e.summons++;
  if(mode==='bulwark'||mode==='commander'&&phase===0){e.shield=120+this.operation.chapter*20;e.shieldMax=e.shield;this.emit('boss-shield',{x:e.x,z:e.z,id:e.id});}
  if(mode==='rally'||mode==='brood'||mode==='commander'&&phase===1){for(let n=0;n<(mode==='brood'?3:2);n++)if(this.enemies.length<LIMITS.enemies)this.spawn({type:mode==='brood'?'splitter':'runner',x:clamp(e.x+(n-1)*1.5,-7.4,7.4),z:e.z-.7,hpScale:mode==='brood'?.6:1});this.emit('summon',{x:e.x,z:e.z});}
  if(mode==='medic'){if(this.enemies.filter(a=>a.type==='healer'&&a.hp>0).length<2)for(const sign of[-1,1])if(this.enemies.length<LIMITS.enemies)this.spawn({type:'healer',x:sign*5,z:e.z-1});const medics=this.enemies.filter(a=>a.type==='healer'&&a.hp>0);if(medics.length){e.hp=Math.min(e.maxHP,e.hp+medics.length*45);this.emit('heal',{x:e.x,z:e.z,radius:5});}}
  if(mode==='artillery'||mode==='commander'&&phase===2){for(let n=0;n<4;n++)this.spit(e,30,Math.sin(n*2)*.2);this.emit('barrage',{x:e.x,z:e.z});}
 }
 spit(e,damage,offset=0){if(this.enemyProjectiles.length>=LIMITS.enemyProjectiles)return;const a=Math.atan2(-e.x,-e.z)+offset;this.enemyProjectiles.push({id:this.nextId++,x:e.x,z:e.z,px:e.x,pz:e.z,vx:Math.sin(a)*7,vz:Math.cos(a)*7,damage,source:e.type,life:4});this.emit('projectile',{x:e.x,z:e.z});}
 moveEnemyProjectiles(dt){const alive=[];for(const p of this.enemyProjectiles){p.px=p.x;p.pz=p.z;p.x+=p.vx*dt;p.z+=p.vz*dt;p.life-=dt;if(segmentCircle(p.px,p.pz,p.x,p.z,0,0,2.4)!==null)this.damageTower(p.damage,p.source,p.x,p.z);else if(p.life>0)alive.push(p);}this.enemyProjectiles=alive;}
 updateDrone(dt){if(!this.weapon.drone)return;this.droneTimer-=dt;if(this.droneTimer>0)return;this.droneTimer=Math.max(.35,1.1-this.weapon.drone*.12);const target=this.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x,a.z)-Math.hypot(b.x,b.z)||a.id-b.id)[0];if(target){this.emit('drone',{x:-2,z:1,toX:target.x,toZ:target.z});this.damageEnemy(target,(20+this.weapon.drone*12)*(1+this.ranks.support*.1),'drone');}}
 damageTower(damage,source,x,z){if(this.state!=='playing')return;const blocked=Math.min(this.shield,damage);this.shield-=blocked;if(blocked)this.emit('tower-block',{x,z,damage:blocked});const applied=Math.min(this.towerHP,damage-blocked);this.towerHP-=applied;if(applied)this.emit('tower-hit',{x,z,damage:applied,hp:this.towerHP,source});if(this.towerHP<=0)this.finish('lost');}
 clearWave(){this.bullets=[];this.emit('wave-clear',{wave:this.wave,score:this.score,hp:this.towerHP});if(this.wave===this.totalWaves)this.finish('won');else{this.state='upgrade';this.fireCooldown=0;const tactical=['spread','frost','pierce','chain','explosive','drone'];const at=(this.operationIndex*2+this.wave-1)%tactical.length;this.upgradeOptions=[this.wave%2?'power':'rapid',tactical[at],this.towerHP<this.maxHP*.72?'repair':this.wave%2?'shield':'repair'];}}
 finish(state){if(this.state==='won'||this.state==='lost')return;this.state=state;this.accumulator=0;this.pendingBlast=false;this.result=Object.freeze({runId:this.runId,state,operationId:this.operation.id,score:this.score,kills:this.kills,time:this.time,towerHP:this.towerHP,maxHP:this.maxHP,shots:this.shots,hits:this.hits,wave:this.wave,gears:this.kills+Math.max(0,this.wave-1)*4+(state==='won'?16+this.operationIndex*2:0),mode:this.assist?'assist':'standard'});this.emit(state==='won'?'victory':'defeat',{...this.result});}
}
