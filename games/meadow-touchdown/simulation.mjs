import {STAGES,PLAYBOOKS,LANES,CAST} from './content.mjs';
export const DT = 1/60;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const point=(x,y)=>({x,y});
function move(p,target,speed,dt){
  const dx=target.x-p.x,dy=target.y-p.y,d=Math.hypot(dx,dy),travel=Math.min(d,speed*dt);
  if(d>1e-9){p.x+=dx/d*travel;p.y+=dy/d*travel;p.heading=Math.atan2(dx,dy);}
  return d<=speed*dt+1e-9;
}
export function receiverAt(book,index,s,elapsed){
  const b=PLAYBOOKS.find(b=>b.id===book)||PLAYBOOKS[0];
  const p={x:[-6,0,6][index],y:s};
  let remaining=Math.max(0,elapsed-b.delay[index])*3.8;
  for(const [x,y] of b.paths[index]){
    const target=point(x,Math.min(41,s+y)),d=distance(p,target);
    if(d>remaining){move(p,target,remaining,1);return p;}
    Object.assign(p,target);remaining-=d;
  }
  return p;
}
export function windOffset(a,t,flip=false){
  if(!flip||t<=.4)return .5*a*t*t;
  const u=t-.4;
  return .5*a*.4*.4+a*.4*u-.5*a*u*u;
}
export function flightPoint(ball,t){
  const u=clamp(t/ball.duration,0,1);
  return {x:ball.from.x+(ball.to.x-ball.from.x)*u+windOffset(ball.wind,t,ball.flip),
    y:ball.from.y+(ball.to.y-ball.from.y)*u,
    z:ball.lateral?1.2:1.2*(1-u)+3*Math.sin(Math.PI*u)};
}
// Earliest swept contact of two moving centres, clipped to the catchable height.
export function sweptContact(a,b,p,q,r,height=Infinity){
  let lo=0,hi=1;
  if(a.z>height&&b.z>height)return null;
  if(a.z>height)lo=(a.z-height)/(a.z-b.z);
  if(b.z>height)hi=(height-a.z)/(b.z-a.z);
  const rx=a.x-p.x,ry=a.y-p.y,dx=(b.x-a.x)-(q.x-p.x),dy=(b.y-a.y)-(q.y-p.y);
  const A=dx*dx+dy*dy,B=2*(rx*dx+ry*dy),C=rx*rx+ry*ry-r*r;
  if(A<1e-12)return C<=0&&lo<=hi?lo:null;
  const discriminant=B*B-4*A*C;
  if(discriminant<0)return null;
  const entry=(-B-Math.sqrt(discriminant))/(2*A),exit=(-B+Math.sqrt(discriminant))/(2*A);
  const t=Math.max(lo,entry,0);
  return t<=Math.min(hi,exit,1)+1e-9?t:null;
}
function makeDefenders(code,s,stage){
  const defs=[];
  const man=i=>defs.push({kind:'man',target:i,cushion:stage.manCushion,x:[-6,0,6][i]+(stage.number===3&&i===0?2:0),y:s+(stage.number===3&&i===1?10:4)});
  const zone=(x,y,switchTarget=null)=>defs.push({kind:'zone',x,y:s+y,home:point(x,s+y),zoneTarget:null,switchTarget});
  for(const tag of code.split(' ')){
    if(tag==='M2'){man(0);man(2);}else if(tag==='M3'){man(0);man(1);man(2);}
    else if(tag==='ML')man(0);else if(tag==='MR')man(2);
    else if(tag==='ZL')zone(-4,9);else if(tag==='ZR')zone(4,9);else if(tag==='ZC')zone(0,12);else if(tag==='ZD')zone(0,15);
    else if(tag==='S'){zone(-4,9,0);zone(4,9,2);}
    else if(tag==='BL'||tag==='BR')defs.push({kind:'blitz',x:tag==='BL'?-5:5,y:s+2});
  }
  return defs.map((d,i)=>({...d,id:i,heading:Math.PI,decision:0,destination:point(d.x,d.y)}));
}
// Describe observed landing geometry, never an assumed intended receiver.
export function diagnoseMiss(ball,receivers){
  const nearest=receivers.reduce((a,b)=>distance(ball,a)<distance(ball,b)?a:b);
  const dx=ball.x-nearest.x,dy=ball.y-nearest.y;
  const kind=Math.hypot(dx,dy)<1.5?'near':Math.abs(dy)>=Math.abs(dx)?dy<0?'short':'long':dx<0?'left':'right';
  return {kind,receiver:nearest.id,ball:point(ball.x,ball.y),player:point(nearest.x,nearest.y)};
}
export class Match {
  constructor(stageNumber=1,book='P1'){
    this.stage=STAGES[clamp(Number.isFinite(stageNumber)?Math.floor(stageNumber)-1:0,0,29)];this.book=book;this.clock=this.stage.time;
    this.totalTime=0;this.leg=1;this.down=1;this.snapCount=0;this.s=40-this.stage.distance;
    this.firstDown=Math.min(40,this.s+10);this.caught=new Set();this.medals={clean:true,early:true};
    this.events=[];this.eventSeq=0;this.result=null;this.blockedBook=null;this.pendingBlock=null;
    this.relayed=false;this.relayUsed=false;this.lastMiss=null;this.interception=null;this.setup();
  }
  event(type,data={}){const e={id:++this.eventSeq,type,...data};this.events.push(e);if(this.events.length>16)this.events.shift();return e;}
  setup(){
    this.phase='ready';this.elapsed=0;this.ball=null;this.runner=null;this.deadTimer=0;
    this.qb={id:'leo',x:0,y:this.s-3,heading:0};
    this.receivers=CAST.map((id,i)=>({id,index:i,x:[-6,0,6][i],y:this.s,heading:0}));
    const code=this.stage.special==='relay'&&this.leg===2?'S ZC':this.stage.defense;
    this.defenders=makeDefenders(code,this.s,this.stage);
    this.aim=point(0,Math.min(42,this.s+8));this.aimSide=0;this.feintAt=null;this.feintDone=false;
    this.wind=(this.stage.special==='relay'&&this.leg===2?2:this.stage.wind)*(this.snapCount%2?-1:1);
    this.gate=this.snapCount%2?-1:1;this.lane=2;this.shift=null;
    if(this.book===this.blockedBook)this.book=this.availableBooks().find(b=>b!==this.blockedBook)||'P1';
  }
  availableBooks(){return PLAYBOOKS.slice(0,this.stage.maxBook).map(b=>b.id);}
  selectBook(id){if(this.phase!=='ready'||!this.availableBooks().includes(id)||id===this.blockedBook)return false;this.book=id;return true;}
  snap(){
    if(this.phase!=='ready'||this.result)return false;
    if(this.clock<=0){this.finish(false,'time');return false;}
    this.phase='live';this.lastMiss=null;this.snapCount++;if(this.down===4)this.medals.early=false;
    this.event('snap');return true;
  }
  setAim(x,y){
    if(this.phase!=='live')return false;
    this.aim=point(clamp(x,-8,8),Math.min(42,clamp(y,this.s+4,this.s+18)));
    const side=this.aim.x<=-1?-1:this.aim.x>=1?1:0;
    if(this.stage.special==='feint'&&side&&this.aimSide&&side!==this.aimSide&&this.feintAt===null){
      this.feintAt=this.elapsed+.6;this.event('feint');
    }
    if(side)this.aimSide=side;return true;
  }
  preview(){return {from:point(this.qb.x,this.qb.y),to:{...this.aim},wind:this.wind,flip:this.stage.special==='gust',
    duration:.38+.025*distance(this.qb,this.aim),time:0,lateral:false};}
  pass(){if(this.phase!=='live')return false;this.ball=this.preview();this.phase='flight';this.event('throw');return true;}
  changeLane(direction){
    if(this.phase!=='run'||!this.runner)return false;
    const next=clamp(this.lane+Math.sign(direction),0,4);
    if(next===this.lane)return false;
    this.lane=next;this.shift={from:this.runner.x,to:LANES[next],time:0};this.event('sidestep');return true;
  }
  stop(){if(this.phase!=='run')return false;this.endDown(this.runner.y,'stop');return true;}
  relayTarget(){
    if(this.stage.special!=='relay'||this.phase!=='run'||this.relayUsed)return null;
    return this.receivers.filter(p=>p!==this.runner&&p.y<=this.runner.y&&distance(p,this.runner)<=6)
      .sort((a,b)=>(Math.sign(a.x)===Math.sign(this.runner.x)?0:1)-(Math.sign(b.x)===Math.sign(this.runner.x)?0:1)||distance(a,this.runner)-distance(b,this.runner))[0]||null;
  }
  lateral(){
    const target=this.relayTarget();if(!target)return false;
    this.ball={from:point(this.runner.x,this.runner.y),to:point(target.x,target.y),wind:0,flip:false,duration:.35,time:0,lateral:true,target:target.index,thrower:this.runner.index};
    this.relayUsed=true;this.phase='flight';this.event('relayThrow');return true;
  }
  finish(won,reason){
    if(this.result)return;
    this.phase='result';this.result={won,reason,medals:won?[true,this.medals.early,this.medals.clean]:[false,false,false],activeMs:Math.round(this.totalTime*1000)};
    this.event(won?'win':'lose',{reason});
  }
  score(){
    if(this.stage.special==='pair'&&this.caught.size<2){this.endDown(39,'pairMissing');return;}
    if(this.stage.special==='gate'&&Math.sign(this.runner.x)!==this.gate){this.endDown(39,'wrongGate');return;}
    if(this.stage.special==='relay'&&!this.relayed){this.endDown(39,'relayMissing');return;}
    if(this.stage.special==='relay'&&this.leg===1){
      this.leg=2;this.s=40-this.stage.distance;this.firstDown=Math.min(40,this.s+10);this.down=1;
      this.relayed=false;this.relayUsed=false;this.phase='dead';this.deadTimer=.8;this.event('leg');return;
    }
    this.finish(true,'touchdown');
  }
  endDown(spot,reason){
    if(this.result)return;
    const advance=Math.max(this.s,Math.min(39.9,spot));
    if(['incomplete','timeout','sack'].includes(reason))this.medals.clean=false;
    const gained=advance>=this.firstDown-1e-7;
    this.event(reason,{spot:advance,firstDown:gained});
    if(this.clock<=0){this.finish(false,'time');return;}
    if(!gained&&this.down===4){this.finish(false,'downs');return;}
    this.s=advance;
    if(gained){this.down=1;this.firstDown=Math.min(40,this.s+10);this.event('firstDown');}else this.down++;
    this.blockedBook=this.pendingBlock;this.pendingBlock=null;
    this.phase='dead';this.deadTimer=.55;
  }
  updateDefenders(dt){
    for(const d of this.defenders){
      if(d.switchTarget!==null&&d.switchTarget!==undefined&&this.elapsed>=1.4){d.kind='man';d.target=d.switchTarget;delete d.switchTarget;d.decision=0;this.event('switch');}
      if(this.feintAt!==null&&!this.feintDone&&this.elapsed>=this.feintAt){
        for(const man of this.defenders.filter(x=>x.kind==='man')){man.target=man.target===0?2:0;man.decision=0;}
        this.feintDone=true;
      }
      d.decision-=dt;
      let speed=d.kind==='blitz'?4:d.kind==='zone'?3.2:3.1;
      if(this.phase==='run')speed=3.6;
      if(d.kind==='blitz'&&this.elapsed<.8)continue;
      if(d.decision<=0){
        d.decision=.25;
        if(this.phase==='run')d.destination=point(this.runner.x,this.runner.y);
        // Authored cushion coverage tracks the receiver's visible position,
        // never the uncommitted aim. Crosses/feints can pull it out of a lane.
        else if(d.kind==='man')d.destination=point(this.receivers[d.target].x,Math.min(41,this.receivers[d.target].y+(d.cushion||0)));
        else if(d.kind==='zone'){
          let target=d.zoneTarget===null?null:this.receivers[d.zoneTarget];
          if(!target||distance(target,d.home)>4.5){
            target=this.receivers.filter(p=>distance(p,d.home)<=4.5).sort((a,b)=>distance(a,d)-distance(b,d)||a.index-b.index)[0];
            d.zoneTarget=target?target.index:null;
          }
          d.destination=target?point(target.x,target.y):{...d.home};
        }else{
          const target=this.phase==='live'?this.qb:this.runner||this.receivers.reduce((a,b)=>distance(a,d)<distance(b,d)?a:b);
          d.destination=point(target.x,target.y);
        }
      }
      move(d,d.destination,speed,dt);
    }
  }
  step(dt=DT){
    if(!Number.isFinite(dt)||dt<=0||dt>.05)throw new RangeError('Simulation step must be in (0, .05]');
    if(this.phase==='ready'||this.phase==='result')return;
    if(this.phase==='dead'){this.deadTimer-=dt;if(this.deadTimer<=0)this.setup();return;}
    this.clock=Math.max(0,this.clock-dt);this.totalTime+=dt;this.elapsed+=dt;
    if(this.clock<=0){this.finish(false,'time');return;}
    const beforePlayers=this.receivers.map(p=>point(p.x,p.y));
    const beforeDefense=this.defenders.map(p=>point(p.x,p.y));
    if(this.phase==='run'){
      this.runner.y+=4.2*dt;
      if(this.shift){this.shift.time+=dt;const u=clamp(this.shift.time/.24,0,1);this.runner.x=this.shift.from+(this.shift.to-this.shift.from)*(u*u*(3-2*u));if(u===1)this.shift=null;}
      if(this.stage.special==='relay'){
        let side=-1;for(const p of this.receivers){if(p===this.runner)continue;move(p,point(clamp(this.runner.x+side*4,-8,8),this.runner.y-3.5),6.5,dt);side=1;}
      }
    }else if(!this.ball?.lateral){
      this.receivers.forEach((p,i)=>{const target=receiverAt(this.book,i,this.s,this.elapsed);p.heading=Math.atan2(target.x-p.x,target.y-p.y);Object.assign(p,target);});
    }
    this.updateDefenders(dt);
    if(this.phase==='live'){
      if(this.clock<=0){this.finish(false,'time');return;}
      if(this.defenders.some(d=>distance(d,this.qb)<=.9)){this.endDown(this.s,'sack');return;}
      if(this.elapsed>=this.stage.throwTime)this.endDown(this.s,'timeout');
    }else if(this.phase==='flight'){
      const ball=this.ball,previous=flightPoint(ball,ball.time);ball.time=Math.min(ball.duration,ball.time+dt);
      const current=flightPoint(ball,ball.time),contacts=[];
      this.receivers.forEach((p,i)=>{
        if(ball.lateral&&(i!==ball.target||i===ball.thrower))return;
        const t=sweptContact(previous,current,beforePlayers[i],p,1.1,1.6);
        if(t!==null)contacts.push({t,attack:true,p});
      });
      this.defenders.forEach((p,i)=>{const t=sweptContact(previous,current,beforeDefense[i],p,.8,1.8);if(t!==null)contacts.push({t,attack:false,p});});
      contacts.sort((a,b)=>Math.abs(a.t-b.t)<1e-9?Number(b.attack)-Number(a.attack):a.t-b.t);
      const hit=contacts[0];
      if(hit){
        if(!hit.attack){
          const contactTime=ball.time-dt+dt*hit.t;
          const contact={x:previous.x+(current.x-previous.x)*hit.t,y:previous.y+(current.y-previous.y)*hit.t,z:previous.z+(current.z-previous.z)*hit.t};
          this.interception={defender:hit.p.id,side:contact.x<-2?'Left':contact.x>2?'Right':'Centre',point:contact,time:Math.max(0,contactTime),flight:{...ball,from:{...ball.from},to:{...ball.to}}};
          this.event('intercept',{...contact,defender:hit.p.id});this.finish(false,'intercept');return;
        }
        this.runner=hit.p;this.lane=LANES.reduce((best,x,i)=>Math.abs(x-hit.p.x)<Math.abs(LANES[best]-hit.p.x)?i:best,0);
        // Preserve the exact catch position until the player explicitly changes lane.
        this.shift=null;this.phase='run';this.caught.add(hit.p.id);
        if(ball.lateral)this.relayed=true;
        if(this.stage.special==='change')this.pendingBlock=this.book;
        this.event(ball.lateral?'relayCatch':'catch',{receiver:hit.p.id,x:hit.p.x,y:hit.p.y});
        if(this.runner.y>=40)this.score();
      }else if(ball.time>=ball.duration){this.lastMiss=diagnoseMiss(current,this.receivers);this.event('drop',{x:current.x,y:current.y});this.endDown(this.s,'incomplete');}
    }else if(this.phase==='run'){
      // Flag pulls use swept relative motion, so a fast lane change is never invulnerable.
      let first=null;
      for(let i=0;i<this.defenders.length;i++){
        const t=sweptContact({...beforePlayers[this.runner.index],z:0},{...this.runner,z:0},beforeDefense[i],this.defenders[i],.9);
        if(t!==null&&(first===null||t<first))first=t;
      }
      const before=beforePlayers[this.runner.index];
      const touchdownT=this.runner.y>=40?(40-before.y)/(this.runner.y-before.y):Infinity;
      if(touchdownT<=1&&(first===null||touchdownT<=first)){this.runner.y=40;this.score();return;}
      if(first!==null){this.runner.x=before.x+(this.runner.x-before.x)*first;this.runner.y=before.y+(this.runner.y-before.y)*first;this.endDown(this.runner.y,'flag');}
    }
  }
}
export function normalizeSave(raw={}){
  if(!raw||typeof raw!=='object')raw={};
  const ids=new Set(STAGES.map(s=>s.id)),completed=[...new Set(Array.isArray(raw.completedStageIds)?raw.completedStageIds:[])].filter(id=>ids.has(id));
  const medals={},times={};
  for(const id of completed){medals[id]=[true,...[1,2].map(i=>raw.bestMedalsByStage?.[id]?.[i]===true)];const t=raw.bestActiveMsByStage?.[id];if(Number.isSafeInteger(t)&&t>=0&&t<=3600000)times[id]=t;}
  const unlocked=PLAYBOOKS.filter(b=>b.unlock===0||completed.includes(STAGES[b.unlock-1].id)).map(b=>b.id);
  return {schemaVersion:1,completedStageIds:completed,bestMedalsByStage:medals,bestActiveMsByStage:times,
    unlockedPlaybooks:unlocked,ownedPennants:STAGES.filter(s=>s.checkpoint&&completed.includes(s.id)).map(s=>s.arc),
    selectedPlaybook:unlocked.includes(raw.selectedPlaybook)?raw.selectedPlaybook:'P1',
    selectedStageId:ids.has(raw.selectedStageId)?raw.selectedStageId:'meadow-01',
    tutorialSeen:[...new Set(Array.isArray(raw.tutorialSeen)?raw.tutorialSeen:[])].filter(s=>typeof s==='string'&&s.length<40),
    equippedKit:raw.equippedKit==='aurora-kit'?'aurora-kit':'classic',equippedStands:raw.equippedStands==='twilight-stands'?'twilight-stands':'classic',
    pendingStageCompletions:[...new Set(Array.isArray(raw.pendingStageCompletions)?raw.pendingStageCompletions:[])].filter(id=>completed.includes(id))};
}
export function unlockedStage(save){let n=1;while(n<30&&save.completedStageIds.includes(STAGES[n-1].id))n++;return n;}
export function saveWin(save,stage,result){
  const next=normalizeSave(save);if(!result.won)return next;
  if(!next.completedStageIds.includes(stage.id))next.completedStageIds.push(stage.id);
  next.bestMedalsByStage[stage.id]=result.medals.map((v,i)=>v||next.bestMedalsByStage[stage.id]?.[i]===true);
  next.bestActiveMsByStage[stage.id]=Math.min(result.activeMs,next.bestActiveMsByStage[stage.id]??Infinity);
  next.pendingStageCompletions.push(stage.id);return normalizeSave(next);
}
