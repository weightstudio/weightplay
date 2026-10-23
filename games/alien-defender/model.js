// Pure deterministic simulation. Positions use fractions of the playfield;
// hitboxes follow the same isotropic model scale as the orthographic renderer.
export const TOTAL_STAGES = 30;
export const RULES = ['ruleScout','ruleVolley','ruleArmor','ruleRelay','ruleCrossfire','ruleCore'];
// Every row is authored: columns, rows, pattern, speed, fire interval, armor.
const ENCOUNTERS = [
 [5,2,'grid',10,3.4,0],[5,3,'wedge',12,3,0],[6,3,'split',13,2.8,0],[6,3,'diamond',14,2.5,0],[4,1,'boss',13,2.5,0],
 [6,3,'wedge',14,2.6,0],[6,3,'split',15,2.4,0],[7,3,'diamond',14,2.2,0],[7,3,'grid',16,2,0],[4,1,'boss',15,2.2,0],
 [6,3,'grid',14,2.4,1],[6,3,'wedge',15,2.2,1],[7,3,'split',16,2.1,1],[7,4,'diamond',16,2,1],[4,1,'boss',14,2.1,2],
 [6,3,'split',15,2.4,0],[6,3,'diamond',16,2.2,1],[7,3,'wedge',17,2.1,1],[7,4,'grid',17,2,1],[4,1,'boss',15,2.2,1],
 [6,3,'wedge',17,2.2,0],[7,3,'split',18,2.1,1],[7,3,'diamond',18,2,1],[7,4,'wedge',19,1.9,1],[4,1,'boss',17,2,1],
 [7,3,'split',18,2,1],[7,4,'diamond',18,1.9,1],[7,4,'wedge',19,1.8,1],[7,4,'grid',20,1.7,1],[4,1,'boss',18,1.9,2],
];
export const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
export function stageConfig(number) {
 const stage=clamp(Math.floor(Number(number)||1),1,30), chapter=Math.floor((stage-1)/5);
 const [cols,rows,pattern,speed,fireEvery,armor]=ENCOUNTERS[stage-1];
 return {stage,chapter,cols,rows,pattern,speed,fireEvery,armor,boss:stage%5===0,ruleKey:RULES[chapter],clearReward:80+stage*8};
}
export function createWorld(stage, upgrades={}, aspect=1.6) {
 const config=stageConfig(stage), enemies=[];
 const add=(x,y,kind,hp)=>enemies.push({id:enemies.length,x,y,px:x,py:y,kind,hp,maxHp:hp,hit:0,telegraph:0});
 if(config.boss) {
   add(50,.20,'boss',[18,50,90,120,170,240][config.chapter]);
   for(let i=0;i<4;i++)add(23+i*18,.34,i===0||i===3?'relay':'armor',3+config.armor);
 } else {
   for(let r=0;r<config.rows;r++)for(let c=0;c<config.cols;c++) {
     if(config.pattern==='diamond' && (r===0||r===config.rows-1) && (c===0||c===config.cols-1))continue;
     const x=20+c*60/(config.cols-1), y=.16+r*.085+(config.pattern==='wedge'?Math.abs(c-(config.cols-1)/2)*.022:0)+(config.pattern==='split'&&c%2?.028:0);
     const kind=config.chapter===3&&r===0&&(c===0||c===config.cols-1)?'relay':config.armor&&r===config.rows-1?'armor':(c+r)%3===0?'scout':'drone';
     add(x,y,kind,kind==='armor'?3+config.armor:kind==='relay'?4:config.stage===1?1:2+Math.floor(config.chapter/2));
   }
 }
 return {config,enemies,total:enemies.length,aspect,player:{x:50,y:.84},upgrades:{firepower:1,shield:0,hull:0,rapid:0,...upgrades},
   shots:[],hostile:[],warnings:[],events:[],time:0,fireTimer:0,enemyTimer:2.6,dir:1,
   score:0,credits:0,kills:0,combo:0,comboTimer:0,pulse:0,lives:4+(upgrades.hull||0),shield:1+(upgrades.shield||0),
   invulnerable:1.5,status:'playing',hitstop:0,serial:0,volley:0,phase:0};
}
export function modelScale(w) { return Math.min(1,w.aspect/0.9); }
export function enemyScale(w,e){return modelScale(w)*(e.kind==='boss'?1.75:w.config.cols<=5?1.3:1.08);}
export function shielded(w,e) { return (w.config.chapter===3 || w.config.chapter===5 && w.config.boss) && e.kind==='boss' && w.enemies.some(x=>x.hp>0&&x.kind==='relay'); }
function event(w,type,details={}) {w.events.push({type,...details});}
function damageEnemy(w,e,damage,x,y) {
 if(shielded(w,e)) {event(w,'block',{x,y});return;}
 const before=e.hp;const armor=e.kind==='boss'&&w.config.chapter===2&&e.hp>e.maxHp*.66;
 e.hp=Math.max(0,e.hp-damage*(armor?.5:1));e.hit=.14;
 event(w,e.hp===0?'kill':e.kind==='armor'&&before>1&&e.hp<=1?'armor':'hit',{x,y,kind:e.kind,id:e.id});
 if(e.hp===0){w.kills++;w.combo=Math.min(5,w.combo+1);w.comboTimer=2.4;w.score+=(e.kind==='boss'?300:25)*w.combo;w.credits+=e.kind==='boss'?25:5;w.pulse=Math.min(6,w.pulse+1);w.hitstop=e.kind==='boss'?.07:.025;
   if(w.kills%8===0){w.shield=Math.min(1+w.upgrades.shield,w.shield+1);event(w,'pickup',{x,y});}
 } else {w.score+=5;w.pulse=Math.min(6,w.pulse+.16);}
}
export function usePulse(w) {
 if(w.status!=='playing'||w.pulse<6)return false;
 w.pulse=0;w.hostile.length=0;w.warnings.length=0;w.invulnerable=Math.max(w.invulnerable,.8);event(w,'pulse',{x:w.player.x,y:w.player.y});
 for(const e of w.enemies)if(e.hp>0&&(e.kind==='boss'||Math.abs(e.x-w.player.x)<30))damageEnemy(w,e,e.kind==='boss'?5:1,e.x,e.y);
 // Pulse kills cannot refill their own charge and recursively erase a fleet.
 w.pulse=0;
 return true;
}
function hitPlayer(w,x,y) {
 if(w.invulnerable>0)return;
 w.invulnerable=1.05;w.combo=0;
 if(w.shield>0){w.shield--;event(w,'shield',{x,y});}else{w.lives--;event(w,'hurt',{x,y});}
 if(w.lives<=0){w.status='lost';event(w,'lose',{reason:'hull'});}
}
export function step(w,delta,input={}) {
 if(w.status!=='playing')return;
 const dt=Math.min(.033,Math.max(0,delta));w.time+=dt;
 w.comboTimer=Math.max(0,w.comboTimer-dt);if(!w.comboTimer)w.combo=0;
 w.invulnerable=Math.max(0,w.invulnerable-dt);
 const scale=modelScale(w), radiusY=3.8*scale/(100*w.aspect);
 const travel=input.targetX!=null?clamp(input.targetX-w.player.x,-68*dt,68*dt):((input.right?1:0)-(input.left?1:0))*68*dt;
 w.player.x=clamp(w.player.x+travel,7*scale,100-7*scale);
 w.fireTimer=Math.max(0,w.fireTimer-dt);
 if(input.fire&&w.fireTimer<=0){
   const count=Math.min(10,w.upgrades.firepower);
   for(let i=0;i<count;i++)if(w.shots.length<96)w.shots.push({id:++w.serial,x:w.player.x+(i-(count-1)/2)*2.5*scale,y:w.player.y-.02,vx:(i-(count-1)/2)*3,damage:1+Math.floor((w.upgrades.firepower-1)/5)});
   w.fireTimer=.23-w.upgrades.rapid*.025-Math.max(0,w.upgrades.firepower-4)*.008;event(w,'fire',{x:w.player.x,y:w.player.y});
 }
 if(input.pulse)usePulse(w);
 const active=w.enemies.filter(e=>e.hp>0);
 if(!active.length){w.status='won';event(w,'win');return;}
 let edge=false;for(const e of active)if((e.x>90&&w.dir>0)||(e.x<10&&w.dir<0))edge=true;
 if(edge)w.dir*=-1;
 for(const e of active){
   e.px=e.x;e.py=e.y;e.hit=Math.max(0,e.hit-dt);
   if(w.config.boss&&e.kind==='boss'){e.x=50+Math.sin(w.time*.65)*24;e.y=.20+Math.sin(w.time*.8)*.015;}
   else if(w.config.boss){e.x=23+(e.id-1)*18+Math.sin(w.time*.85)*5;}
   else{e.x+=w.dir*w.config.speed*dt;e.y+=dt*.00065+(edge?.026:0);}
   if(e.y>.76){w.status='lost';event(w,'lose',{reason:'line'});return;}
 }
 const boss=active.find(e=>e.kind==='boss'),oldPhase=w.phase;w.phase=boss?(boss.hp/boss.maxHp<.33?2:boss.hp/boss.maxHp<.66?1:0):0;
 if(boss&&w.phase!==oldPhase)event(w,'phase',{x:boss.x,y:boss.y,phase:w.phase});
 w.enemyTimer-=dt;
 if(w.enemyTimer<=0){
   w.enemyTimer=w.config.fireEvery-(w.config.chapter===5?w.phase*.25:0);
   const source=active[w.volley++%active.length];
   const count=w.config.chapter===5&&w.phase===2?5:w.config.chapter===1||w.config.chapter>=4?3:1;
   for(let i=0;i<count;i++)if(w.warnings.length<12)w.warnings.push({source:source.id,x:source.x,y:source.y,tx:clamp(w.player.x+(i-(count-1)/2)*15,5,95),remaining:.85,life:.85,spread:w.config.chapter>=4});
   event(w,'warning',{x:source.x,y:source.y});
 }
 for(const warn of w.warnings){const source=w.enemies.find(e=>e.id===warn.source&&e.hp>0);if(!source){warn.remaining=-1;continue;}warn.x=source.x;warn.y=source.y;warn.remaining-=dt;if(warn.remaining<=0&&w.hostile.length<64){
   const speed=.34+w.config.chapter*.025;
   w.hostile.push({id:++w.serial,x:warn.x,y:warn.y,vx:(warn.tx-warn.x)*speed/(w.player.y-warn.y),vy:speed});
 }}
 w.warnings=w.warnings.filter(a=>a.remaining>0);
 for(const b of w.shots){const oldY=b.y;b.y-=dt*.95;b.x+=b.vx*dt;
   for(const e of active){if(e.hp<=0)continue;
     const es=enemyScale(w,e)/scale;
     if(Math.abs(e.x-b.x)<3.8*enemyScale(w,e)+1 && b.y<=Math.max(e.py,e.y)+radiusY*es && oldY>=Math.min(e.py,e.y)-radiusY*es){
       damageEnemy(w,e,b.damage,b.x,e.y);b.y=-1;break;
     }
   }
 }
 w.shots=w.shots.filter(b=>b.y>-.05&&b.x>0&&b.x<100);
 for(const b of w.hostile){const oldY=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;
   if(Math.abs(b.x-w.player.x)<3.6*scale&&oldY<=w.player.y+radiusY&&b.y>=w.player.y-radiusY){hitPlayer(w,w.player.x,w.player.y);b.y=2;}
 }
 w.hostile=w.hostile.filter(b=>b.y<1.04&&b.x>-5&&b.x<105);
 if(w.enemies.every(e=>e.hp<=0)&&w.status==='playing'){w.status='won';event(w,'win');}
}
