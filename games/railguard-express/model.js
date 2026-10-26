// Railguard Express: deterministic simulation. No DOM, audio, storage or renderer.
import {CAMPAIGN_ROUTES} from './campaign-data.mjs';
export const MODULES=Object.freeze({
 empty:{power:0,unlock:1},gun:{power:2,unlock:1,damage:6,cooldown:.72,range:5.3},
 piercer:{power:3,unlock:3,damage:19,cooldown:1.65,range:7.2},
 frost:{power:2,unlock:2,damage:4,cooldown:1.1,range:5.8},
 shield:{power:2,unlock:4},repair:{power:2,unlock:5}
});
const routes=[
 ['First Freight','初次護送','front','scout',7],['Tailwind','逆風追兵','rear','scout',7],
 ['Iron Convoy','鐵甲車隊','front','armor',7],['Dune Ram','沙丘撞槌','front','ram',8],
 ['Split Pass','雙向山口','split','mixed',8],['Whiteout','雪霧疾影','rear','rush',6],
 ['Signal Snare','訊號陷阱','split','jammer',8],['The Conductor','冰原指揮官','split','conductor',8],
 ['Thin Wire','纖細電網','split','mixed',6],['Repair Window','維修窗口','front','armor',8],
 ['Three Signals','三重訊號','split','jammer',7],['Last Light','最後曙光','split','warden',9]
];
export const ROUTES=Object.freeze([...routes.map((r,i)=>Object.freeze({id:i+1,en:r[0],zh:r[1],direction:r[2],kind:r[3],power:r[4],region:Math.floor(i/4),boss:[4,8,12].includes(i+1)})),...CAMPAIGN_ROUTES]);
export const POSITIONS=[-3,0,3];
export function normalizeSave(raw){
 const obj=raw&&typeof raw==='object'?raw:{};
 const cleared=[...new Set((Array.isArray(obj.cleared)?obj.cleared:[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=ROUTES.length))].sort((a,b)=>a-b);
 const max=Math.max(1,...cleared.map(n=>Math.min(ROUTES.length,n+1)));
 return {schema:1,unlocked:Math.max(max,Math.min(ROUTES.length,Math.max(1,Number.isInteger(obj.unlocked)?obj.unlocked:1))),cleared};
}
export function mergeSave(a,b){a=normalizeSave(a);b=normalizeSave(b);return normalizeSave({unlocked:Math.max(a.unlocked,b.unlocked),cleared:[...a.cleared,...b.cleared]});}
export function recordWin(save,id){if(!Number.isInteger(id)||id<1||id>ROUTES.length)throw new RangeError('route');return mergeSave(save,{unlocked:Math.min(ROUTES.length,id+1),cleared:[id]});}
export function newRun(id){
 const route=ROUTES[id-1];if(!route)throw new RangeError('route');
 const run={route,status:'fitting',wave:0,time:0,tick:0,hull:100,shield:0,power:route.power,damageBonus:0,kills:0,
  mounts:['gun','gun','gun'].map(type=>({type,on:true,cooldown:0})),enemies:[],shots:[],events:[],serial:0,spawned:0,spawnClock:0,
  selectedUpgrade:false,jamSlot:-1,jamRemaining:0,pulseClock:0,warning:0,lastThreat:null};
 if(route.encounters)Object.assign(run,{cells:route.cells,cargo:0,branch:route.chapter===2?null:'signal',waveTime:0,pulsesUsed:0});
 return run;
}
export function chooseBranch(s,branch){
 if(s.route.chapter!==2||!['fitting','station'].includes(s.status)||!['freight','service'].includes(branch))return false;
 s.branch=branch;event(s,'branch',{branch});return true;
}
export function pulse(s,side){
 if(!s.route.encounters||s.status!=='combat'||s.cells<=0||![1,-1].includes(side))return false;
 const targets=s.enemies.filter(e=>e.side===side&&e.hp>0);if(!targets.length)return false;
 s.cells--;s.pulsesUsed++;event(s,'pulse',{side});
 for(const e of targets){if(e.ward){e.ward=false;event(s,'wardBreak',{id:e.id,x:e.x,z:e.z});}e.stun=2;}
 return true;
}
export function encounter(s){return s.route.encounters?.[Math.max(0,s.wave-1)]?.[s.branch||'signal'];}
export function usedPower(s){return s.mounts.reduce((n,m)=>n+(m.on?MODULES[m.type].power:0),0);}
function event(s,type,data={}){s.events.push({type,...data});if(s.events.length>100)s.events.shift();}
export function fit(s,index,type){
 if(!['fitting','station'].includes(s.status)||!s.mounts[index]||!MODULES[type])return {ok:false,reason:'stationOnly'};
 if(MODULES[type].unlock>s.route.id)return {ok:false,reason:'locked'};
 const old=s.mounts[index],candidate={type,on:true,cooldown:0};s.mounts[index]=candidate;
 if(usedPower(s)>s.power){s.mounts[index]=old;return {ok:false,reason:'powerLow'};}
 event(s,'fit',{index,module:type});return {ok:true};
}
export function toggle(s,index){
 if(!s.mounts[index]||['won','lost'].includes(s.status))return {ok:false,reason:'unavailable'};
 const m=s.mounts[index];m.on=!m.on;
 if(usedPower(s)>s.power){m.on=false;return {ok:false,reason:'powerLow'};}
 event(s,'toggle',{index,on:m.on});return {ok:true};
}
export function depart(s){
 if(s.status!=='fitting'&&s.status!=='station')return false;
 if(s.status==='station'&&!s.selectedUpgrade)return false;
 if(s.route.chapter===2&&!s.branch)return false;
 s.wave++;s.status='combat';s.spawned=0;s.spawnClock=.5;s.pulseClock=0;s.warning=0;s.selectedUpgrade=false;
 if(s.route.encounters){s.waveTime=0;if(s.branch==='service'){s.cells=Math.min(3,s.cells+1);event(s,'recharge',{source:'service'});}}
 event(s,'depart',{wave:s.wave});return true;
}
export function upgrade(s,choice){
 if(s.status!=='station'||s.selectedUpgrade)return false;
 if(choice==='power')s.power++;
 else if(choice==='damage')s.damageBonus+=.25;
 else if(choice==='repair')s.hull=Math.min(100,s.hull+32);
 else if(choice==='recharge'&&s.route.encounters)s.cells=Math.min(3,s.cells+1);
 else return false;
 s.selectedUpgrade=true;event(s,'upgrade',{choice});return true;
}
function composition(s,n){
 const k=s.route.kind;
 if(s.route.boss&&s.wave===3&&n===0)return k;
 if(k==='armor'||k==='ram')return n%3===2?'scout':'armor';
 if(k==='rush')return 'rush';
 if(k==='jammer'||k==='conductor'||k==='warden')return n%3===0?'jammer':n%3===1?'armor':'rush';
 if(k==='mixed')return n%3===0?'armor':n%3===1?'rush':'scout';
 return 'scout';
}
function spawn(s){
 const n=s.spawned++,authored=encounter(s)?.[n],kind=authored?.kind||composition(s,n),boss=['ram','conductor','warden'].includes(kind);
 const side=authored?.side||(s.route.direction==='rear'?-1:s.route.direction==='front'?1:((n+s.wave)%2?1:-1));
 const hp=boss?(authored?(s.route.chapter===2?180:150):110+s.route.id*3):kind==='armor'?28:kind==='jammer'?22:['ward','insulator'].includes(kind)?20:kind==='sapper'?17:kind==='rush'?13:15;
 s.enemies.push({id:++s.serial,kind,boss,side,x:side*9,z:(n%2?1:-1)*2.15,hp,maxHp:hp,
  speed:boss?.55:kind==='armor'?.65:kind==='rush'?1.65:kind==='sapper'?1.2:1.0,armor:kind==='armor'||boss,slow:0,attackClock:0,flash:0,age:0,phase:0,ramClock:6,telegraph:0,charging:false,
  ...(authored?{ward:['ward','insulator'].includes(kind),stun:0,raided:false,theftClock:null}:{} )});
 event(s,boss?'boss':'spawn',{id:s.serial,kind});
}
function hurt(s,amount,enemy){
 const absorbed=Math.min(s.shield,amount);s.shield-=absorbed;const damage=amount-absorbed;
 if(absorbed>0)event(s,s.shield<=0?'shieldBreak':'block',{amount:absorbed});
 if(damage>0){s.hull=Math.max(0,s.hull-damage);s.lastThreat=enemy.kind;event(s,'hurt',{amount:damage});}
}
export function step(s,dt){
 if(s.status!=='combat')return;
 dt=Math.min(1/15,Math.max(0,dt));s.time+=dt;s.tick++;s.spawnClock-=dt;
 const plan=encounter(s),total=plan?.length??(5+Math.min(3,Math.floor(s.route.id/4))+(s.wave-1));
 if(plan){s.waveTime+=dt;if(s.spawned<total&&s.waveTime>=plan[s.spawned].at)spawn(s);}
 else if(s.spawned<total&&s.spawnClock<=0){spawn(s);s.spawnClock=2.5;}
 s.jamRemaining=Math.max(0,s.jamRemaining-dt);if(!s.jamRemaining)s.jamSlot=-1;
 const jammers=s.enemies.filter(e=>!e.stun&&(e.kind==='jammer'||e.kind==='conductor'||(e.kind==='warden'&&e.phase===2)));
 if(jammers.length){
  s.pulseClock+=dt;
  if(s.pulseClock>6&&s.warning===0){s.warning=1.5;event(s,'warning',{slot:s.wave%3});}
  if(s.warning>0){s.warning=Math.max(.00001,s.warning-dt);if(s.warning<=.00002){s.jamSlot=s.wave%3;s.jamRemaining=3;s.warning=0;s.pulseClock=0;event(s,'jam',{index:s.jamSlot});}}
 }
 // Projectile arrivals precede next firing decisions: no ghost shots at dead targets.
 for(const p of s.shots){p.remaining-=dt;if(p.remaining>0)continue;
  const e=s.enemies.find(e=>e.id===p.target&&e.hp>0);if(!e)continue;
  if(e.ward){
   if(p.type==='frost'&&e.kind!=='insulator'){e.ward=false;e.stun=Math.max(e.stun||0,.2);event(s,'wardBreak',{id:e.id,x:e.x,z:e.z});}
   else event(s,'wardBlock',{id:e.id,x:e.x,z:e.z});
   continue;
  }
  const damage=p.damage*(e.armor&&p.type!=='piercer'?.28:1);e.hp=Math.max(0,e.hp-damage);e.flash=.16;
  if(p.type==='frost')e.slow=2.4;
  event(s,'hit',{id:e.id,module:p.type,damage,x:e.x,z:e.z});
  if(e.hp===0){s.kills++;event(s,'defeat',{id:e.id,boss:e.boss,x:e.x,z:e.z});}
 }
 s.shots=s.shots.filter(p=>p.remaining>0);
 s.enemies=s.enemies.filter(e=>e.hp>0);
 for(const [i,m] of s.mounts.entries()){
  m.cooldown=Math.max(0,m.cooldown-dt);if(!m.on||i===s.jamSlot)continue;
  const def=MODULES[m.type];
  if(m.type==='shield'){const old=s.shield;s.shield=Math.min(24,s.shield+dt*3.4);if(old===0&&s.shield>0)event(s,'shield');continue;}
  if(m.type==='repair'){if(s.hull<100){s.hull=Math.min(100,s.hull+dt*1.9);if(s.tick%60===0)event(s,'heal');}continue;}
  if(!def.damage||m.cooldown>0)continue;
  const targets=s.enemies.filter(e=>Math.hypot(e.x-POSITIONS[i],e.z)<def.range).sort((a,b)=>Math.abs(a.x)-Math.abs(b.x)||a.id-b.id);
  const e=targets[0];if(!e)continue;
  const travel=.19+Math.abs(e.x-POSITIONS[i])*.025;
  s.shots.push({id:++s.serial,from:i,target:e.id,type:m.type,damage:def.damage*(1+s.damageBonus),remaining:travel,total:travel,x:e.x,z:e.z});
  m.cooldown=def.cooldown;event(s,'fire',{index:i,module:m.type,target:e.id});
 }
 for(const e of s.enemies){
  e.age+=dt;e.flash=Math.max(0,e.flash-dt);e.slow=Math.max(0,e.slow-dt);
  if(e.stun>0){e.stun=Math.max(0,e.stun-dt);continue;}
  if(e.boss&&e.kind!=='ram'){
   const phase=e.hp/e.maxHp<.33?2:e.hp/e.maxHp<.66?1:0;
   if(phase!==e.phase){e.phase=phase;e.armor=phase===0;e.speed=phase===1?1.65:.7;event(s,'bossPhase',{id:e.id,phase});}
  }
  if(e.kind==='ram'){
   e.ramClock-=dt;
   if(e.ramClock<=0&&!e.telegraph&&!e.charging){e.telegraph=1.3;event(s,'ramWarning',{id:e.id});}
   if(e.telegraph>0){e.telegraph=Math.max(0,e.telegraph-dt);if(!e.telegraph)e.charging=true;}
  }
  const stop=e.side*3.4;
  if(Math.abs(e.x)>3.4)e.x-=e.side*(e.charging?7:e.telegraph>0?0:e.speed)*(e.slow>0?.45:1)*dt;
  else {e.x=stop;
   if(e.kind==='sapper'&&!e.raided){
    if(s.cargo<=0)e.raided=true;
    else {if(e.theftClock===null){e.theftClock=1.4;event(s,'theftWarning',{id:e.id,side:e.side});}e.theftClock-=dt;if(e.theftClock>0)continue;s.cargo=Math.max(0,s.cargo-1);e.raided=true;event(s,'cargoLost',{id:e.id,x:e.x,z:e.z});}
   }
   if(e.charging){hurt(s,22,e);e.charging=false;e.ramClock=7;e.attackClock=2.8;event(s,'ramImpact',{id:e.id});}e.attackClock-=dt;if(e.attackClock<=0){hurt(s,e.boss?16:e.kind==='rush'?5:8,e);e.attackClock=e.boss?2.8:1.8;}}
 }
 if(s.hull<=0){s.status='lost';s.shots=[];event(s,'lose');return;}
 if(s.spawned>=total&&!s.enemies.length&&!s.shots.length){
  s.jamSlot=-1;s.jamRemaining=0;s.warning=0;
  if(s.route.chapter===2&&s.branch==='freight'){s.cargo++;event(s,'cargoDelivered',{cargo:s.cargo});}
  s.status=s.wave===3?'won':'station';
  if(s.status==='won'&&s.cargo<s.route.cargoGoal){s.status='lost';s.lastThreat='cargo';}
  if(s.status==='station'&&s.route.chapter===2)s.branch=null;
  event(s,s.status==='won'?'win':s.status==='lost'?'lose':'station');
 }
}
export function drainEvents(s){return s.events.splice(0);}
