import {STEP,MAX_RANK,WAVES,TROOPS,PADS,STAGES,RECIPES,ENEMIES,BOSSES,LIMITS,normalizeDeck} from './data.mjs';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const pad=i=>Number.isInteger(i)&&i>=0&&i<PADS.length;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const finite=(n,fallback=0)=>Number.isFinite(n)?n:fallback;
/** Authoritative fixed-step simulation. Rendering and input cannot award damage or rewards. */
export class Battle {
 constructor(stageId=1,deck,seed=1,advancement={}){
  this.advancement=Object.fromEntries(Object.keys(TROOPS).map(type=>[type,clamp(Math.trunc(finite(advancement?.[type])),0,5)]));
  const id=clamp(Math.trunc(finite(Number(stageId),1)),1,STAGES.length);
  this.stage=STAGES[id-1];this.deck=normalizeDeck(deck);this.rng=(seed>>>0)||1;this.nextId=1;
  this.board=Array(9).fill(null);this.frozen=Array(9).fill(0);this.enemies=[];this.events=[];
  this.shots=[];this.pending=[];this.queue=[];this.warnings=[];this.gold=this.stage.initialGold;
  this.hp=this.maxHp=5000;this.summons=0;this.upgrades=0;this.kills=0;this.merges=0;
  this.time=0;this.wave=0;this.breakTime=3;this.spawnTime=0;this.spellCooldown=5;this.environment=12;
  this.status='playing';this.targetMode='front';this.settled=false;this.bossDefeated=!this.stage.boss;
  [0,4,8].forEach((index,i)=>this.board[index]=this.unit(this.deck[i],1));
 }
 random(){let x=this.rng;x^=x<<13;x^=x>>>17;x^=x<<5;this.rng=x>>>0;return this.rng/4294967296;}
 pick(list){return list[Math.floor(this.random()*list.length)];}
 unit(type,rank){return {id:this.nextId++,type,rank,cooldown:.15};}
 emit(type,detail={}){this.events.push({type,time:this.time,...detail});if(this.events.length>LIMITS.events)this.events.shift();}
 drainEvents(){return this.events.splice(0);}
 get summonCost(){return Math.round((65+Math.min(175,this.summons*7))*(this.stage.lean?1.25:1));}
 get upgradeCost(){return 150+this.upgrades*130;}
 get stars(){return this.status!=='won'?0:this.hp>=4500?3:this.hp>=2500?2:1;}
 pause(value=true){if(value&&this.status==='playing')this.status='paused';else if(!value&&this.status==='paused')this.status='playing';}
 canMove(from,to){
  if(this.status!=='playing')return 'inactive';
  if(!pad(from)||!pad(to)||from===to||!this.board[from])return 'invalid';
  if(this.frozen[from]>0||this.frozen[to]>0)return 'frozen';
  const a=this.board[from],b=this.board[to];if(!b)return 'move';
  if(a.rank!==b.rank||a.type!==b.type)return 'rank';return a.rank>=MAX_RANK?'max':'merge';
 }
 move(from,to,expectedUnitId){
  const result=this.canMove(from,to);
  if(!['move','merge'].includes(result))return result;
  if(expectedUnitId!==undefined&&this.board[from].id!==expectedUnitId)return 'invalid';
  if(result==='move'){this.board[to]=this.board[from];this.board[from]=null;this.emit('move',{from,to});return result;}
  const unit=this.unit(this.pick(this.deck),this.board[from].rank+1);
  this.board[to]=unit;this.board[from]=null;this.merges++;
  this.emit('merge',{from,to,troop:unit.type,rank:unit.rank});return result;
 }
 summon(){
  if(this.status!=='playing')return 'inactive';
  const free=this.board.map((u,i)=>!u&&this.frozen[i]<=0?i:-1).filter(i=>i>=0);
  if(!free.length)return 'full';if(this.gold<this.summonCost)return 'gold';
  this.gold-=this.summonCost;this.summons++;const index=this.pick(free),unit=this.unit(this.pick(this.deck),1);
  this.board[index]=unit;this.emit('summon',{pad:index,troop:unit.type});return 'summon';
 }
 upgrade(){
  if(this.status!=='playing')return 'inactive';if(this.upgrades>=LIMITS.upgrades)return 'max';
  if(this.gold<this.upgradeCost)return 'gold';this.gold-=this.upgradeCost;this.upgrades++;
  this.emit('upgrade',{level:this.upgrades});return 'upgrade';
 }
 spell(){
  if(this.status!=='playing')return 'inactive';if(this.spellCooldown>0)return 'cooldown';this.spellCooldown=24;
  for(const enemy of [...this.enemies]){
   if(enemy.dead)continue;
   this.damage(enemy,160+this.wave*13+this.stage.id*5,true);
   if(enemy.dead)continue;enemy.slow=3.5;enemy.slowPower=.28;enemy.stun=1.25;
   if(enemy.cast){enemy.cast=null;enemy.ability=7;this.emit('interrupt',{id:enemy.id});}
  }
  this.emit('spell');return 'spell';
 }
 spawn(type,x,z=-7,wave=this.wave){
  if(!ENEMIES[type]&&!BOSSES.includes(type))throw new Error('UNKNOWN_ENEMY_TYPE');
  if(this.enemies.filter(e=>!e.dead).length>=LIMITS.enemies)return null;
  const boss=BOSSES.includes(type),base=ENEMIES[type]||{hp:14,speed:.22,damage:1600,reward:140};
  const factor=(1+this.stage.id*.058)*(1+wave*.2),maxHp=Math.round(100*base.hp*factor*(boss?2.5:1));
  const enemy={id:this.nextId++,type,boss,x:clamp(finite(x),-3.2,3.2),z:finite(z,-7),hp:maxHp,maxHp,
   speed:base.speed,damage:base.damage,reward:base.reward,armor:base.armor||0,slow:0,slowPower:1,
   poison:0,poisonDps:0,stun:0,heal:3,ability:boss?1.5:0,cast:null,phase:0,charge:0,dead:false,
   armored:type==='mirror',armorClock:5};
  this.enemies.push(enemy);this.emit('spawn',{id:enemy.id,boss});return enemy;
 }
 deferSpawn(type,x,z=-7){
  // A finite current wave owns descendants; none disappear to meet a render budget.
  if(!this.spawn(type,x,z))this.pending.push({type,x,z});
 }
 damage(enemy,amount,pierce=false,quiet=false){
  if(enemy.dead||!Number.isFinite(amount)||amount<=0)return;
  const armor=enemy.type==='mirror'?(enemy.armored?.8:0):enemy.armor;
  const dealt=amount*(pierce?1:1-armor);enemy.hp=Math.max(0,enemy.hp-dealt);
  if(!quiet)this.emit('hit',{id:enemy.id,x:enemy.x,z:enemy.z,amount:Math.round(dealt),pierce});
  if(enemy.hp>0)return;enemy.dead=true;this.kills++;
  this.gold+=Math.round(enemy.reward*(this.stage.bounty?1.4:1));
  if(enemy.boss)this.bossDefeated=true;
  this.emit('kill',{id:enemy.id,x:enemy.x,z:enemy.z,boss:enemy.boss});
  if(enemy.type==='splitter'){this.deferSpawn('small',enemy.x-.3,enemy.z);this.deferSpawn('small',enemy.x+.3,enemy.z);}
 }
 beginWave(){
  this.wave++;this.emit('wave',{wave:this.wave});
  const recipe=RECIPES[this.stage.recipe],count=6+Math.floor(this.wave*.65);
  this.queue=Array.from({length:count},(_,i)=>({type:recipe[(i+this.wave-1)%recipe.length],index:i}));
  if(this.wave===WAVES&&this.stage.boss)this.queue.push({type:this.stage.boss,index:count});this.spawnTime=0;
 }
 warnFreeze(indices,duration=4){
  const valid=[...new Set(indices)].filter(pad);if(!valid.length)return;
  this.warnings.push({indices:valid,remaining:1.8,duration});this.emit('freezeWarning',{indices:valid});
 }
 castBoss(enemy){
  const kind=enemy.type==='crown'?['ram','frost','brood'][enemy.phase++%3]:enemy.type;
  if(kind==='mirror'){enemy.ability=5;return;}
  const indices=kind==='frost'?(()=>{const row=Math.floor(this.random()*3);return [row*3,row*3+1,row*3+2];})():[];
  enemy.cast={kind,remaining:1.8,duration:1.8,indices};this.emit('bossWarning',{id:enemy.id,kind,indices});
 }
 resolveBoss(enemy,kind,indices){
  if(kind==='ram')enemy.charge=2.2;
  if(kind==='brood')for(let i=0;i<4;i++)this.deferSpawn(i%2?'runner':'grunt',enemy.x+(i-1.5)*.6,Math.min(2.8,enemy.z+.3));
  if(kind==='frost'){
   if(!indices?.length){const row=Math.floor(this.random()*3);indices=[row*3,row*3+1,row*3+2];}
   for(const i of indices)this.frozen[i]=Math.max(this.frozen[i],4);this.emit('freeze',{indices});
  }
  if(kind==='thief'){const amount=Math.min(120,Math.floor(this.gold*.25));this.gold-=amount;this.emit('theft',{amount});}
  enemy.ability=kind==='brood'?10:9;this.emit('bossCast',{id:enemy.id,kind});
 }
 targetList(index){
  return this.enemies.filter(e=>!e.dead).sort((a,b)=>{
   const primary=this.targetMode==='strong'?b.hp-a.hp:b.z-a.z;
   return primary||distance(a,PADS[index])-distance(b,PADS[index])||a.id-b.id;
  });
 }
 attack(index,unit){
  const targets=this.targetList(index);if(!targets.length)return false;
  const stats=TROOPS[unit.type],target=targets[0];let support=1;
  for(let j=0;j<9;j++)if(j!==index&&this.board[j]?.type==='deer'&&this.frozen[j]<=0
   &&Math.abs(j%3-index%3)+Math.abs(Math.floor(j/3)-Math.floor(index/3))===1)support+=TROOPS.deer.support;
  const power=stats.damage*2.16**(unit.rank-1)*(1+this.upgrades*.2)*Math.min(1.9,support)*(1+this.advancement[unit.type]*.1);
  if(this.shots.length>=LIMITS.shots)return false;
  const shot={id:this.nextId++,pad:index,unitId:unit.id,troop:unit.type,rank:unit.rank,power,
   targetId:target.id,x:target.x,z:target.z,from:{...PADS[index]},start:this.time,duration:.22,remaining:.22};
  this.shots.push(shot);this.emit('shot',{...shot});return true;
 }
 impact(shot){
  const stats=TROOPS[shot.troop];let target=this.enemies.find(e=>e.id===shot.targetId&&!e.dead);
  // Projectiles finish at the last visible position; a dead target is never silently retargeted.
  const center=target||{x:shot.x,z:shot.z};
  const alive=this.enemies.filter(e=>!e.dead);
  const victims=stats.splash?alive.filter(e=>distance(e,center)<=stats.splash)
   :!target?[]:stats.chain?[target,...alive.filter(e=>e!==target).sort((a,b)=>distance(a,target)-distance(b,target)||a.id-b.id).slice(0,stats.chain-1)]:[target];
  victims.forEach((enemy,i)=>{
   this.damage(enemy,shot.power*(stats.chain?.78**i:1),stats.pierce);
   if(!enemy.dead&&stats.slow){enemy.slow=2;enemy.slowPower=stats.slow;}
   if(!enemy.dead&&stats.poison){enemy.poison=3;enemy.poisonDps=Math.max(enemy.poisonDps,stats.poison*2.16**(shot.rank-1)*(1+this.upgrades*.2)*(1+this.advancement[shot.troop]*.1));}
  });
  this.emit('impact',{id:shot.id,troop:shot.troop,x:center.x,z:center.z,targets:victims.map(e=>({x:e.x,z:e.z}))});
 }
 step(dt=STEP){
  if(this.status!=='playing')return;
  dt=clamp(finite(Number(dt)),0,STEP);if(dt<=0)return;
  this.time+=dt;this.spellCooldown=Math.max(0,this.spellCooldown-dt);
  for(let i=0;i<9;i++)this.frozen[i]=Math.max(0,this.frozen[i]-dt);
  for(const warning of this.warnings){warning.remaining-=dt;if(warning.remaining<=0){for(const i of warning.indices)this.frozen[i]=Math.max(this.frozen[i],warning.duration);this.emit('freeze',{indices:warning.indices});}}
  this.warnings=this.warnings.filter(w=>w.remaining>0);
  if(this.stage.freeze){this.environment-=dt;if(this.environment<=0){this.warnFreeze([Math.floor(this.random()*9)]);this.environment=15;}}
  if(this.breakTime>0){this.breakTime=Math.max(0,this.breakTime-dt);if(this.breakTime===0)this.beginWave();}
  this.enemies=this.enemies.filter(e=>!e.dead);
  while(this.pending.length&&this.enemies.length<LIMITS.enemies){const p=this.pending.shift();this.spawn(p.type,p.x,p.z);}
  if(this.queue.length&&this.enemies.length<LIMITS.enemies){
   this.spawnTime-=dt;
   if(this.spawnTime<=0){const item=this.queue.shift(),i=item.index,pattern=this.stage.pattern;
    const x=pattern==='sides'?(i%2?2.5:-2.5):pattern==='column'?(this.wave%3-1)*2.1:(this.random()-.5)*(pattern==='cluster'?2:6);
    this.spawn(item.type,x);this.spawnTime=pattern==='burst'?(i%4===3?1.8:.3):pattern==='cluster'?.32:.65;
   }
  }
  for(const enemy of [...this.enemies]){
   if(enemy.dead)continue;enemy.slow=Math.max(0,enemy.slow-dt);enemy.stun=Math.max(0,enemy.stun-dt);
   if(enemy.poison>0){const poisonDt=Math.min(dt,enemy.poison);enemy.poison=Math.max(0,enemy.poison-dt);this.damage(enemy,enemy.poisonDps*poisonDt,true,true);if(enemy.dead)continue;}
   if(enemy.type==='healer'){
    enemy.heal-=dt;if(enemy.heal<=0){enemy.heal=3;for(const other of this.enemies)if(!other.dead&&distance(enemy,other)<2.4)other.hp=Math.min(other.maxHp,other.hp+other.maxHp*.09);this.emit('heal',{id:enemy.id,x:enemy.x,z:enemy.z});}
   }
   if(enemy.type==='mirror'){
    enemy.armorClock-=dt;if(enemy.armorClock<=0){enemy.armored=!enemy.armored;enemy.armorClock=5;this.emit('armorPhase',{id:enemy.id,armored:enemy.armored});}
   }else if(enemy.boss){
    if(enemy.cast){enemy.cast.remaining-=dt;if(enemy.cast.remaining<=0){const cast=enemy.cast;enemy.cast=null;this.resolveBoss(enemy,cast.kind,cast.indices);}}
    else{enemy.ability-=dt;if(enemy.ability<=0)this.castBoss(enemy);}
   }
   enemy.charge=Math.max(0,enemy.charge-dt);
   if(!enemy.cast&&enemy.stun<=0)enemy.z+=enemy.speed*(enemy.slow>0?enemy.slowPower:1)*(enemy.charge>0?5:1)*dt;
   if(enemy.z>=3.6){enemy.dead=true;this.hp=Math.max(0,this.hp-enemy.damage);this.emit('leak',{damage:enemy.damage,boss:enemy.boss});
    // Checkpoint guardians must actually be defeated, not paid through with wall HP.
    if(enemy.boss)this.hp=0;
   }
  }
  this.enemies=this.enemies.filter(e=>!e.dead);
  for(const shot of this.shots){const target=this.enemies.find(e=>e.id===shot.targetId);if(target){shot.x=target.x;shot.z=target.z;}shot.remaining-=dt;if(shot.remaining<=0)this.impact(shot);}
  this.shots=this.shots.filter(s=>s.remaining>0);
  this.enemies=this.enemies.filter(e=>!e.dead);
  if(this.hp<=0){this.status='lost';this.shots=[];this.emit('result',{won:false});return;}
  for(let i=0;i<9;i++){
   const unit=this.board[i];if(!unit)continue;
   // Idle periods never bank attacks; frozen units cannot bank them either.
   unit.cooldown=Math.max(0,unit.cooldown-dt);
   if(this.frozen[i]<=0&&unit.cooldown===0&&this.attack(i,unit))unit.cooldown=TROOPS[unit.type].interval;
  }
  if(this.wave>0&&this.breakTime===0&&!this.queue.length&&!this.pending.length&&!this.enemies.length&&!this.shots.length){
   if(this.wave===WAVES){if(this.bossDefeated){this.status='won';this.emit('result',{won:true});}}
   else{let income=45+this.wave*3;for(const unit of this.board)if(unit&&TROOPS[unit.type].income)income+=TROOPS[unit.type].income*unit.rank;
    this.gold+=income;this.breakTime=3.2;this.emit('income',{amount:income});}
  }
 }
}
