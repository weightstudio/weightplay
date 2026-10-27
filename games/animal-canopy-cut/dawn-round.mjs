// Closed chapter-two rules wrapping the unchanged v17 engine. Not runtime-wired.
export function makeDawnRound(BaseRound,definition,width,height){
  if(!Number.isInteger(definition?.id)||definition.id<31||definition.id>60||!Number.isInteger(definition.markEvery)||definition.markEvery<1||!Number.isInteger(definition.markedGoal)||definition.markedGoal<1||!Number.isFinite(definition.ripeAge)||definition.ripeAge<0)throw Error('INVALID_DAWN_STAGE');
  return new (class extends BaseRound{
    constructor(){
      // Keep the chapter-one stage-24 physical speed; only the seed retains ID.
      super({...definition,id:24},width,height);this.seed=definition.id*100+1;
      this.markedHarvested=0;this.netUses=2;this.netUntil=0;this.netReadyAt=0;this.lastMarkedGroup=-1;this.frozen=null;
    }
    freezeTarget(target){
      if(!this.frozen||target.hazard)return;
      this.frozen.set(target,{x:target.x,baseX:target.baseX,y:target.y,vx:target.vx,vy:target.vy,gravity:target.gravity,age:target.age});
      target.vx=target.vy=target.gravity=0;
    }
    spawn(hazard=false,lane=null){
      const count=this.targets.length;super.spawn(hazard,lane);if(this.targets.length===count)return;
      const target=this.targets.at(-1);
      if(!hazard){target.marked=!!target.checkpoint||(this.group%definition.markEvery===0&&this.lastMarkedGroup!==this.group);if(target.marked)this.lastMarkedGroup=this.group;target.ripeAge=target.marked?definition.ripeAge:0;this.freezeTarget(target);}
      const event=this.events.at(-1);if(event?.type==='spawn')event.target={...target};
    }
    useNet(){
      if(this.finished||this.netUses<=0||this.time<this.netReadyAt||!this.targets.some(t=>!t.hazard&&t.y-t.r<this.height))return false;
      this.netUses--;this.netUntil=this.time+.75;this.netReadyAt=this.time+1.5;this.events.push({type:'net',remaining:this.netUses});return true;
    }
    swipe(a,b,padding=5){
      if(this.finished)return [];
      const waiting=this.targets.filter(t=>!t.hazard&&t.marked&&t.age<t.ripeAge);
      const near=(p)=>{const dx=b.x-a.x,dy=b.y-a.y,s=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-s*dx,p.y-a.y-s*dy)<=p.r+padding;};
      if(waiting.some(t=>t.y-t.r<this.height&&near(t)))this.events.push({type:'unripe'});
      if(waiting.length)this.targets=this.targets.filter(t=>!waiting.includes(t));
      const hits=super.swipe(a,b,padding);this.markedHarvested+=hits.filter(e=>e.target.marked).length;
      this.targets.push(...waiting);this.targets.sort((x,y)=>x.id-y.id);
      return hits;
    }
    tick(dt){
      if(this.time<this.netUntil){this.frozen=new Map();for(const target of this.targets)this.freezeTarget(target);}
      try{super.tick(dt);}finally{if(this.frozen){for(const [target,old] of this.frozen)Object.assign(target,old);this.frozen=null;}}
    }
    end(reason){
      if(reason==='clear'&&(this.markedHarvested<definition.markedGoal||(definition.checkpoint&&!this.checkpointHit)))reason='quota';
      super.end(reason);
    }
  })();
}
