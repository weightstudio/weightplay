// Authoritative, renderer-independent race simulation. World: X across, Y forward.
export const LANES = [-5.7, -1.9, 1.9, 5.7];
export const COLORS = [0x20d9eb, 0xffbe46, 0x63df98, 0xb992ff];
export const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export function seeded(seed) {
  let n = (seed + 1) * 2654435761 >>> 0;
  return () => ((n = (Math.imul(n, 1664525) + 1013904223) >>> 0) / 4294967296);
}
export const STAGES = Array.from({length: 30}, (_, i) => {
  const chapter = Math.floor(i / 5), sectors = i < 5 ? 1 : i < 20 ? 2 : 3;
  return {index:i, number:i+1, chapter, sectors, steps:6+chapter+(i%5),
    goal:(6+chapter+(i%5))*sectors, time:65+sectors*30,
    aiSpeed:i<5?1.4+i*.07:1.85+(i-5)*.053, wind:chapter===2||chapter===4,
    hazard:chapter===1||chapter>=3, moving:chapter>=4,
    layout:['dawn','grove','wind','sunset','aurora','champion'][chapter],
    mode:'sky-race', champion:chapter===5};
});

export class SkyRace {
  constructor(index=0, upgrades={}) {
    this.stage=STAGES[clamp(Math.floor(index),0,29)];
    this.rng=seeded(index+26); this.elapsed=0; this.timeLeft=this.stage.time;
    this.ended=false; this.winner=null; this.paused=false; this.events=[];
    this.spills=0; this.firstPickup=false; this.firstBridge=false;
    this.position=1; this.effects=[]; this.pickups=[]; this.bridges=[]; this.platforms=[];
    this.upgrades={capacity:0,speed:0,grip:0,...upgrades};
    let y=0;
    for(let s=0;s<this.stage.sectors;s++) {
      this.platforms.push({start:y,end:y+10,sector:s});
      const steps=this.stage.steps+(s%2), start=y+10, end=start+steps*1.15;
      this.bridges.push({start,end,steps,sector:s, tiles:LANES.map(()=>Array(steps).fill(-1)),
        // Inner routes contain two already-built neutral stepping stones.
        bonuses:LANES.map((_,lane)=>lane===1||lane===2?[2,steps-2]:[])});
      for(let color=0;color<4;color++) for(let p=0;p<16;p++) {
        const column=p%4, row=Math.floor(p/4);
        this.pickups.push({color,sector:s,x:-6.7+column*4.25+(color%2)*.64,
          y:y+1.8+row*1.95+Math.floor(color/2)*.62,readyAt:0,phase:this.rng()*6.28});
      }
      y=end;
    }
    this.platforms.push({start:y,end:y+5.5,sector:this.stage.sectors});
    this.finishY=y+3.5;
    this.actors=COLORS.map((_,id)=>({id,color:id,x:LANES[id],y:.8,targetX:LANES[id],targetY:.8,
      stack:0,capacity:id===0?10+this.upgrades.capacity*2:9+(id===2?3:0)+Math.floor(index/10),
      speed:id===0?4.5+this.upgrades.speed*.16:this.stage.aiSpeed+[.1,-.15,.2][id-1],
      progress:0,dash:id===0?30:0,dashTime:0,stun:0,invulnerable:0,combo:0,lastPickup:-10,
      lane:id,sector:0,brain:'gather',built:0,facing:0,moving:false,waitCue:0}));
    for(const p of this.pickups)p.baseX=p.x;
    this.player=this.actors[0]; this.rivals=this.actors.slice(1);
    this.hazards=this.stage.hazard?this.platforms.slice(0,-1).map((p,i)=>({
      x:0,y:p.start+5.8,phase:i*1.8,radius:1.12,active:false})):[];
  }
  emit(type,actor=this.player,data={}) {
    this.events.push({type,id:actor.id,x:actor.x,y:actor.y,...data});
    if(this.events.length>64)this.events.shift();
  }
  target(x,y) {this.player.targetX=clamp(x,-7.5,7.5);this.player.targetY=clamp(y,.55,this.finishY+1);}
  dash() {
    const a=this.player;
    if(this.ended||this.paused||a.dash<100)return false;
    a.dash=0;a.dashTime=1.7;this.emit('dash');return true;
  }
  bridgeAt(y) {return this.bridges.find(b=>y>b.start&&y<b.end);}
  platformAt(y) {return this.platforms.find(p=>y>=p.start-.01&&y<=p.end+.01);}
  nearestTile(a) {
    let best=null,score=Infinity;
    for(const p of this.pickups) {
      if(p.color!==a.id||p.readyAt>this.elapsed||p.sector!==a.sector)continue;
      const d=Math.hypot(p.x-a.x,p.y-a.y);
      if(d<score){score=d;best=p;}
    }
    return best;
  }
  chooseLane(a,b) {
    let best=a.id,score=Infinity;
    LANES.forEach((x,l)=>{
      const cost=b.tiles[l].filter((owner,i)=>owner!==a.id&&!b.bonuses[l].includes(i)).length;
      const crowded=this.actors.some(o=>o!==a&&o.lane===l&&this.bridgeAt(o.y)===b)?3:0;
      const personality=a.id===1?Math.abs(l-a.id)*1.3:a.id===3?crowded:0;
      const value=Math.abs(a.x-x)*.6+cost+personality;
      if(value<score){score=value;best=l;}
    });
    return best;
  }
  steerAI(a) {
    const b=this.bridges[a.sector];
    if(!b){a.targetX=0;a.targetY=this.finishY+.2;return;}
    const onBridge=this.bridgeAt(a.y)===b;
    if(a.brain==='cross') {
      if(a.stack===0&&a.y<b.end-.1) {
        const ahead=clamp(Math.floor((a.y+.16-b.start)/1.15),0,b.steps-1);
        if(b.tiles[a.lane][ahead]!==a.id&&!b.bonuses[a.lane].includes(ahead))a.brain='refill';
      }
      if(a.brain==='cross'){a.targetX=LANES[a.lane];a.targetY=b.end+.6;return;}
    }
    if(onBridge){a.targetX=LANES[a.lane];a.targetY=b.start-.5;return;}
    const required=Math.min(a.capacity,this.stage.steps+(a.id===2?2:0));
    if(a.stack>=required){a.lane=this.chooseLane(a,b);a.brain='cross';a.targetX=LANES[a.lane];a.targetY=b.start-.12;}
    else {a.brain='gather';const p=this.nearestTile(a);if(p){a.targetX=p.x;a.targetY=p.y;}}
    // Approach the lane on solid ground before moving onto its narrow bridge.
    if(a.brain==='cross'&&Math.abs(a.x-LANES[a.lane])<.2)a.targetY=b.end+.6;
  }
  move(a,dt) {
    a.moving=false;
    if(a.stun>0)return;
    let dx=a.targetX-a.x,dy=a.targetY-a.y,d=Math.hypot(dx,dy);
    if(d<.04)return;
    const speed=a.speed*(a.dashTime>0?1.65:1)*(a.combo>=5?1.08:1);
    const step=Math.min(speed*dt,d),prevBridge=this.bridgeAt(a.y);
    let nx=clamp(a.x+dx/d*step,-7.5,7.5),ny=clamp(a.y+dy/d*step,.55,this.finishY+.5);
    const b=this.bridgeAt(ny);
    if(b) {
      let lane=prevBridge?a.lane:LANES.reduce((best,x,l)=>Math.abs(nx-x)<Math.abs(nx-LANES[best])?l:best,0);
      if(!prevBridge&&Math.abs(nx-LANES[lane])>.72){ny=a.y;}
      else {
        a.lane=lane;nx=LANES[lane];
        const tile=clamp(Math.floor((ny-b.start)/1.15),0,b.steps-1),owner=b.tiles[lane][tile];
        // Walking back is always free; never strand a racer without tiles.
        if(ny>a.y&&owner!==a.id&&!b.bonuses[lane].includes(tile)) {
          if(a.stack>0){a.stack--;a.built++;b.tiles[lane][tile]=a.id;this.emit('build',a,{lane,tile,sector:b.sector,stolen:owner>=0});if(a.id===0)this.firstBridge=true;}
          else {ny=a.y;if(a.waitCue<=0){this.emit('empty',a);a.waitCue=2;}}
        }
      }
    } else if(prevBridge) nx=LANES[a.lane];
    a.moving=Math.hypot(nx-a.x,ny-a.y)>.001;
    if(a.moving)a.facing=Math.atan2(nx-a.x,ny-a.y);
    a.x=nx;a.y=ny;a.progress=clamp(a.y/this.finishY,0,1)*this.stage.goal;
    const next=this.bridges[a.sector];
    if(next&&a.y>=next.end+.15){a.sector++;a.brain='gather';a.dash=Math.min(100,a.dash+25);this.emit('checkpoint',a);}
    if(a.y>=this.finishY){this.ended=true;this.winner=a.id;this.emit('finish',a);}
  }
  collect(a) {
    for(const p of this.pickups) {
      if(a.stack>=a.capacity||p.color!==a.id||p.readyAt>this.elapsed)continue;
      if(Math.hypot(p.x-a.x,p.y-a.y)>.87)continue;
      a.stack++;a.combo=this.elapsed-a.lastPickup<2.6?a.combo+1:1;a.lastPickup=this.elapsed;
      a.dash=Math.min(100,a.dash+12);p.readyAt=this.elapsed+4.2;
      if(a.id===0)this.firstPickup=true;
      this.emit('pickup',a,{fromX:p.x,fromY:p.y,combo:a.combo});
      if(a.stack===a.capacity)this.emit('full',a);
    }
  }
  hit(a,source) {
    if(a.invulnerable>0)return;
    a.invulnerable=1.2;
    if(a.dashTime>0){this.emit('shield',a);return;}
    const loss=Math.min(a.stack,Math.max(1,2-Math.floor(this.upgrades.grip/3)));
    a.stack-=loss;a.stun=.22;a.combo=0;
    if(a.id===0)this.spills+=loss;
    this.emit('bump',a,{loss,source});
  }
  step(dt,input={}) {
    if(this.ended||this.paused)return;
    dt=clamp(dt,0,.04);this.elapsed+=dt;this.timeLeft=Math.max(0,this.stage.time-this.elapsed);
    if(this.stage.moving)for(const p of this.pickups)p.x=p.baseX+Math.sin(this.elapsed*.8+p.phase)*.34;
    for(const h of this.hazards){h.x=Math.sin(this.elapsed*.65+h.phase)*5.6;h.active=(this.elapsed+h.phase)%5>2;}
    for(const a of this.actors){
      if(this.ended)break;
      a.dashTime=Math.max(0,a.dashTime-dt);a.stun=Math.max(0,a.stun-dt);
      a.invulnerable=Math.max(0,a.invulnerable-dt);a.waitCue=Math.max(0,a.waitCue-dt);
      if(this.elapsed-a.lastPickup>2.6)a.combo=0;
      if(a.id){this.steerAI(a);if(this.stage.champion&&a.dash>=100&&a.brain==='cross'){a.dash=0;a.dashTime=1.3;}}
      else if(input.x||input.y){this.target(a.x+(input.x||0)*3,a.y+(input.y||0)*3);}
      this.move(a,dt);this.collect(a);
      if(this.stage.wind&&!this.bridgeAt(a.y))a.x=clamp(a.x+Math.sin(this.elapsed*1.3)*.32*dt*(a.id?1:1-this.upgrades.grip*.12),-7.5,7.5);
      for(const h of this.hazards)if(h.active&&Math.hypot(a.x-h.x,a.y-h.y)<h.radius)this.hit(a,'storm');
    }
    if(this.stage.chapter>0)for(const a of this.rivals){
      if(this.bridgeAt(a.y)||this.bridgeAt(this.player.y))continue;
      if(Math.hypot(a.x-this.player.x,a.y-this.player.y)<.7){
        const loser=this.player.dashTime>0||this.player.stack>a.stack?a:this.player;
        this.hit(loser,'rival');
      }
    }
    this.position=[...this.actors].sort((a,b)=>b.y-a.y||b.stack-a.stack||a.id-b.id).findIndex(a=>a.id===0)+1;
    if(!this.ended&&this.timeLeft<=0){this.ended=true;this.winner=-1;this.emit('timeout');}
  }
}
