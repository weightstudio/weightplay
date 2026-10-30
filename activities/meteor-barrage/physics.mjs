// Durable run schema stays compatible across presentation-only revisions.
export const VERSION = 'meteor-barrage-1';
export const ACTIVITY_VERSION = 'meteor-barrage-3';
export const BLAST_RADIUS = 100;
export const WORLD = Object.freeze({ width: 360, height: 480, launchX: 180, launchY: 38, floor: 68 });
export const STEP = 1 / 120;
export const safeBlocks = n => Number.isSafeInteger(n) && n >= 0 ? n : 0;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const target = (id,x,y,type='stone',hp=1) => ({id,x,y,type,hp,maxHp:hp,r:type==='core'?32:19,armor:type==='armor'?1:0,flash:0});
export function waveTargets(wave) {
  if (wave === 0) return [target('a',74,345),target('b',142,352,'blast'),target('c',210,345),target('d',278,352,'blast'),target('e',180,408)];
  if (wave === 1) return [target('a',72,315,'armor',2),target('b',145,330,'blast'),target('c',217,315,'armor',2),target('d',287,330),target('e',110,401),target('f',250,401,'blast')];
  return [target('core',180,365,'core',6),target('a',86,330,'blast'),target('b',274,330,'blast')];
}
export function freshRun(blocks=24,mode='training') {
  const cap=mode==='training'?24:safeBlocks(blocks);
  return {version:VERSION,mode,cap,ammo:cap,hull:3,wave:0,score:0,shots:0,time:0,status:cap?'ready':'lost',targets:waveTargets(0),shields:[],shot:null,combo:0};
}
export function shieldPositions(run) {
  const core=run.targets.find(t=>t.type==='core'&&t.hp>0);
  if(!core)return [];
  return run.shields.filter(s=>s.hp>0).map(s=>{const a=run.time*.65+s.index*Math.PI*2/3;return {...s,x:core.x+Math.cos(a)*61,y:core.y+Math.sin(a)*61,r:14,angle:a};});
}
export function fire(run,angle,power=1) {
  if(run.status!=='ready'||!Number.isFinite(angle)||!Number.isSafeInteger(power)||power<1||power>run.ammo)return false;
  angle=clamp(angle,18,162)*Math.PI/180;
  run.ammo-=power;run.shots++;run.combo=0;run.status='shooting';
  run.shot={x:180,y:38,vx:Math.cos(angle)*440,vy:Math.sin(angle)*440,power,life:0,bounces:0,lastId:null,cooldown:0};
  return true;
}
function strike(run,t,power,events,chain=false,front=true,source) {
  if(t.hp<=0)return;
  if(t.armor&&!chain&&front){t.armor=0;t.flash=.2;events.push({kind:'armor',targetId:t.id,x:t.x,y:t.y});return;}
  const damage=Math.min(t.hp,power);t.hp-=damage;t.flash=.18;run.combo++;run.score+=damage*10+Math.min(5,run.combo-1)*5;
  events.push({kind:'hit',targetId:t.id,x:t.x,y:t.y,damage,combo:run.combo,source});
  if(t.hp>0)return;
  run.score+=t.type==='core'?200:40;events.push({kind:t.type==='core'?'core':'destroy',targetId:t.id,x:t.x,y:t.y,source});
  if(t.type==='blast'){
    events.push({kind:'blast',targetId:t.id,x:t.x,y:t.y,radius:BLAST_RADIUS});
    for(const other of run.targets) if(other.hp>0&&Math.hypot(t.x-other.x,t.y-other.y)<BLAST_RADIUS)strike(run,other,2,events,true,true,{id:t.id,x:t.x,y:t.y});
  }
}
function reflect(p,x,y,r) {
  let dx=p.x-x,dy=p.y-y,d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
  const dot=p.vx*dx+p.vy*dy;
  if(dot<0){p.vx-=2*dot*dx;p.vy-=2*dot*dy;}
  p.x=x+dx*(r+7.2);p.y=y+dy*(r+7.2);p.bounces++;
}
function settle(run,events) {
  run.shot=null;
  if(run.targets.every(t=>t.hp<=0)){run.status=run.wave===2?'won':'wave-clear';events.push({kind:run.status});return;}
  const targets=[];
  for(const t of run.targets)if(t.hp>0){const fromY=t.y;t.y-=22;const breached=t.y-t.r<WORLD.floor;targets.push({id:t.id,x:t.x,fromY,toY:t.y,breached});if(breached){t.hp=0;run.hull=t.type==='core'?0:Math.max(0,run.hull-1);events.push({kind:'breach',targetId:t.id,x:t.x,y:WORLD.floor});}}
  events.push({kind:'descent',targets});
  if(run.hull<=0){run.hull=0;run.status='lost';events.push({kind:'lost',reason:'breach'});}
  else if(run.targets.every(t=>t.hp<=0)){run.status='lost';events.push({kind:'lost',reason:'breach'});}
  else if(run.ammo<=0){run.status='lost';events.push({kind:'lost',reason:'empty'});}
  else run.status='ready';
}
export function advance(run) {
  if(run.status!=='wave-clear'||run.wave>=2)return false;
  run.wave++;run.targets=waveTargets(run.wave);run.shields=run.wave===2?[0,1,2].map(index=>({index,hp:1})):[];
  run.status=run.ammo>0?'ready':'lost';run.shot=null;run.combo=0;return true;
}
export function tick(run,dt=STEP) {
  const events=[];
  if(!['ready','shooting'].includes(run.status))return events;
  dt=clamp(dt,0,STEP);run.time+=dt;
  for(const t of run.targets)t.flash=Math.max(0,t.flash-dt);
  const p=run.shot;if(!p)return events;
  p.life+=dt;p.cooldown=Math.max(0,p.cooldown-dt);p.x+=p.vx*dt;p.y+=p.vy*dt;
  if(p.x<17||p.x>343){p.x=clamp(p.x,17,343);p.vx*=-1;p.bounces++;events.push({kind:'bounce',x:p.x,y:p.y});}
  if(p.y>459){p.y=459;p.vy=-Math.abs(p.vy);p.bounces++;events.push({kind:'bounce',x:p.x,y:p.y});}
  for(const s of shieldPositions(run)){
    if(p.cooldown===0&&Math.hypot(p.x-s.x,p.y-s.y)<s.r+7){run.shields.find(o=>o.index===s.index).hp=0;reflect(p,s.x,s.y,s.r);p.cooldown=.08;events.push({kind:'shield',x:s.x,y:s.y});break;}
  }
  for(const t of run.targets){
    if(t.hp<=0||(p.lastId===t.id&&p.cooldown>0))continue;
    if(Math.hypot(p.x-t.x,p.y-t.y)<t.r+7){const front=p.y<t.y&&Math.abs(p.x-t.x)<(t.r+7)*.8;reflect(p,t.x,t.y,t.r);p.lastId=t.id;p.cooldown=.12;strike(run,t,p.power,events,false,front);break;}
  }
  if(run.targets.every(t=>t.hp<=0)||p.y<24||p.life>4.5||p.bounces>8)settle(run,events);
  return events;
}
export function validRun(r) {
  if(!r||r.version!==VERSION||!['training','challenge'].includes(r.mode)||!['ready','shooting','wave-clear','won','lost'].includes(r.status))return false;
  if(!Number.isSafeInteger(r.cap)||r.cap<0||!Number.isSafeInteger(r.ammo)||r.ammo<0||r.ammo>r.cap||!Number.isInteger(r.hull)||r.hull<0||r.hull>3||!Number.isInteger(r.wave)||r.wave<0||r.wave>2||!Number.isSafeInteger(r.score)||r.score<0||!Number.isSafeInteger(r.shots)||r.shots<0||!Number.isFinite(r.time)||r.time<0||!Number.isInteger(r.combo)||r.combo<0)return false;
  if(r.mode==='training'&&r.cap!==24)return false;
  const original=waveTargets(r.wave);
  if(!Array.isArray(r.targets)||r.targets.length!==original.length||!r.targets.every((t,i)=>t.id===original[i].id&&t.type===original[i].type&&t.maxHp===original[i].maxHp&&t.r===original[i].r&&Number.isInteger(t.hp)&&t.hp>=0&&t.hp<=t.maxHp&&[0,1].includes(t.armor)&&[t.x,t.y,t.flash].every(Number.isFinite)))return false;
  if(!Array.isArray(r.shields)||r.shields.length!==(r.wave===2?3:0)||!r.shields.every((s,i)=>s.index===i&&[0,1].includes(s.hp)))return false;
  const cleared=r.targets.every(t=>t.hp===0);
  if(r.status==='won'&&(r.wave!==2||!cleared||r.hull===0))return false;
  if(r.status==='wave-clear'&&(r.wave===2||!cleared||r.hull===0))return false;
  if(r.status==='ready'&&(cleared||r.hull===0||r.ammo===0))return false;
  if(r.status==='lost'&&r.hull>0&&r.ammo>0&&!cleared)return false;
  if(r.status==='shooting')return !cleared&&r.hull>0&&r.shots>0&&!!r.shot&&['x','y','vx','vy','life','bounces','cooldown'].every(k=>Number.isFinite(r.shot[k]))&&r.shot.life>=0&&r.shot.life<=4.5+STEP&&Number.isInteger(r.shot.bounces)&&r.shot.bounces>=0&&r.shot.bounces<=9&&r.shot.cooldown>=0&&r.shot.cooldown<=.12&&(r.shot.lastId===null||r.targets.some(t=>t.id===r.shot.lastId))&&Number.isSafeInteger(r.shot.power)&&r.shot.power>0&&r.shot.power<=r.cap;
  return r.shot===null;
}
