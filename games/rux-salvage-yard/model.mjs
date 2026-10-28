// Authoritative planar physics for the first development slice. Matter.js 0.20.0.
// Coordinates are pixels (100 pixels per metre), with positive y downward.
export class SalvageSlice {
  constructor(Matter, { twoTargets = false, stage = null } = {}) {
    this.M = Matter;
    const { Engine, Bodies, Composite, Events } = Matter;
    this.engine = Engine.create({ enableSleeping: true });
    this.engine.gravity.y = 1;
    this.engine.gravity.scale = .001;
    this.state = 'ready';
    this.shots = 0;
    this.limit = stage?.shots ?? 3;
    this.recovered = 0;
    this.events = [];
    this.pendingBreak = new Set();
    this.pendingRemove = new Set();
    this.recoveryShot = new Map();
    this.clampsRemaining = stage?.clamps ?? 0;
    this.clamped = [];
    this.platformTime = 0;
    this.elapsed = 0;
    this.quiet = 0;
    this.ballRetireQuiet = 0;
    this.bodies = [];
    const add = (body, kind) => {
      body.plugin.salvageKind = kind;
      this.bodies.push(body);
      Composite.add(this.engine.world, body);
      return body;
    };
    const surface = { friction: .55, restitution: .08, frictionAir: .001 };
    this.ground = add(Bodies.rectangle(500, 820, 1200, 40, { isStatic: true }), 'ground');
    this.stage = stage;
    if(stage?.platform){this.platform=add(Bodies.rectangle(660,700,120,20,{isStatic:true,friction:.8}),'platform');}
    if(stage?.guard){const height=stage.guardHeight??160;const guard=add(Bodies.rectangle(320,800-height/2,25,height,{isStatic:true,restitution:.08}),'guard');guard.plugin.height=height;}
    if(stage?.reflector)add(Bodies.rectangle(400,stage.reflectorY??400,25,160,{isStatic:true,restitution:.85,angle:stage.reflector*Math.PI/4}),'reflector');
    const columns = stage?.columns ?? [0,1,0];
    this.targets=[];
    for (let column=0; column<3; column++) {
      const height=stage?.platform&&column===1 ? 0 : columns[column], x=[500,660,820][column];
      for(let k=0;k<height;k++) {
        const metal=column===stage?.metalColumn && k===0;
        const wood=add(Bodies.rectangle(x,760-80*k,70,80,{...surface,density:metal ? .002 : .001}),metal?'metal':'wood');
        wood.plugin.fragile=stage?.fragile?.[0]===column&&stage?.fragile?.[1]===k;wood.plugin.column=column;wood.plugin.level=k;
      }
      if(height){
        for(const targetX of twoTargets ? [x-28,x+28] : [x]) {
          const heavy=column===stage?.heavyColumn;
          const part=add(Bodies.rectangle(targetX,800-80*height-32.5,twoTargets?55:65,65,{...surface,density:heavy ? .0009 : .0006}),'target');
          part.plugin.column=column;part.plugin.heavy=heavy;part.plugin.first=column===stage?.firstColumn;part.plugin.last=column===stage?.lastColumn;part.plugin.clampRequired=column===stage?.clampColumn;part.plugin.linked=stage?.sameShot?.includes(column)||false;this.targets.push(part);
        }
      }
    }
    if(stage?.platform){
      const part=add(Bodies.rectangle(660,657.5,65,65,{...surface,density:.0006}),'target');
      Object.assign(part.plugin,{column:1,first:stage.firstColumn===1,last:stage.lastColumn===1,clampRequired:stage.clampColumn===1,linked:stage.sameShot?.includes(1)||false});this.targets.push(part);
    }
    this.recoveredTargets = new Set();
    if (stage?.sameShot) {
      const linked=stage.sameShot.map(column=>this.targets.find(target=>target.plugin.column===column));
      if(linked.every(Boolean)) {
        const [a,b]=linked, length=Math.hypot(a.position.x-b.position.x,a.position.y-b.position.y);
        this.linkConstraint=this.M.Constraint.create({bodyA:a,bodyB:b,length,stiffness:.3,damping:.08});this.M.Composite.add(this.engine.world,this.linkConstraint);
      }
    }
    Events.on(this.engine, 'collisionStart', event => {
      for (const pair of event.pairs) {
        if (this.state === 'lost' || this.state === 'won') break;
        const a = pair.bodyA, b = pair.bodyB;
        const target = a === this.ground ? b : b === this.ground ? a : null;
        if (target && this.targets.includes(target)) {
          if (!this.recoveredTargets.has(target)) {
            this.recoveredTargets.add(target); this.recovered++;this.recoveryShot.set(target.plugin.column,this.shots);
            target.plugin.recovered=true;this.events.push({ type: 'recovered',x:target.position.x,y:target.position.y });
            if(!target.plugin.linked)this.pendingRemove.add(target);
            else if(this.targets.filter(part=>part.plugin.linked).every(part=>this.recoveredTargets.has(part))){for(const part of this.targets.filter(part=>part.plugin.linked))this.pendingRemove.add(part);if(this.linkConstraint){this.M.Composite.remove(this.engine.world,this.linkConstraint);this.linkConstraint=null;}}
            if(this.stage?.firstColumn!==undefined && this.recovered===1 && target.plugin.column!==this.stage.firstColumn){this.state='lost';this.events.push({type:'wrongOrder'});this.events.push({type:'lose'});continue;}
            if(this.stage?.lastColumn===target.plugin.column && this.recovered<this.targets.length){this.state='lost';this.events.push({type:'wrongLast'});this.events.push({type:'lose'});continue;}
            if(target.plugin.clampRequired&&!target.plugin.wasClamped){this.state='lost';this.events.push({type:'missingClamp'});this.events.push({type:'lose'});continue;}
            const linked=this.stage?.sameShot;
            if(linked?.every(column=>this.recoveryShot.has(column))&&this.recoveryShot.get(linked[0])!==this.recoveryShot.get(linked[1])){this.state='lost';this.events.push({type:'wrongLink'});this.events.push({type:'lose'});continue;}
            if (this.recovered === this.targets.length) { this.state = 'won'; this.events.push({ type: 'win' }); }
          }
        } else if (a === this.ball || b === this.ball) {
          const other = a === this.ball ? b : a;
          const contact=pair.collision.supports[0] || this.ball.position;
          this.events.push({ type: 'impact', material: other.plugin.salvageKind, x:contact.x, y:contact.y });
          if(other.plugin.fragile && this.ball.speed > 1.8 && !this.pendingBreak.has(other)) {
            this.pendingBreak.add(other);this.events.push({type:'break',x:contact.x,y:contact.y});
          }
        }
      }
    });
  }
  clampAt(x,y) {
    if(!this.clampsRemaining || ['won','lost','stalled'].includes(this.state))return false;
    const candidates=this.bodies.filter(body=>!body.isStatic && body!==this.ball && x>=body.bounds.min.x-10&&x<=body.bounds.max.x+10&&y>=body.bounds.min.y-10&&y<=body.bounds.max.y+10);
    const body=candidates.sort((a,b)=>Math.hypot(a.position.x-x,a.position.y-y)-Math.hypot(b.position.x-x,b.position.y-y))[0];
    return this.clampBody(body);
  }
  clampBody(body) {
    if(!body || !this.bodies.includes(body) || body.isStatic || body===this.ball || this.recoveredTargets.has(body) || !this.clampsRemaining || ['won','lost','stalled'].includes(this.state))return false;
    this.M.Body.setStatic(body,true);body.plugin.wasClamped=true;this.clamped.push({body,remaining:3});this.clampsRemaining--;this.events.push({type:'clamp'});return true;
  }
  shoot(angle, power) {
    if (this.state !== 'ready' || !Number.isFinite(angle) || !Number.isFinite(power)) return false;
    const { Bodies, Body, Composite } = this.M;
    this.shots++;
    this.state = 'flight';
    this.elapsed = 0;
    this.quiet = 0;
    this.ballRetireQuiet = 0;
    this.ball = Bodies.circle(80, 680, 22, { density: .002, restitution: .2, frictionAir: 0, label: 'ball' });
    this.ball.plugin.salvageKind = 'ball';
    this.bodies.push(this.ball);
    Composite.add(this.engine.world, this.ball);
    const speed = 700 + Math.max(0, Math.min(1, power)) * 500;
    Body.setVelocity(this.ball, { x: Math.cos(angle) * speed / 60, y: -Math.sin(angle) * speed / 60 });
    this.events.push({ type: 'shot' });
    return true;
  }
  step(seconds = 1 / 60) {
    if (this.state === 'won' || this.state === 'lost') return;
    for(const held of this.clamped)held.remaining-=seconds;
    for(let i=this.clamped.length-1;i>=0;i--)if(this.clamped[i].remaining<=0){const held=this.clamped.splice(i,1)[0];this.M.Body.setStatic(held.body,false);this.events.push({type:'release'});}
    if(this.platform){
      this.platformTime+=seconds;
      const phase=(this.platformTime*50+50)%200, x=610+(phase<=100?phase:200-phase);
      const dx=x-this.platform.position.x;
      for(const body of this.targets){
        const bottom=body.bounds.max.y;
        if(!body.isStatic && Math.abs(bottom-690)<5 && Math.abs(body.position.x-this.platform.position.x)<85){
          this.M.Body.translate(body,{x:dx,y:0});
        }
      }
      this.M.Body.setPosition(this.platform,{x,y:700});
    }
    // Four substeps prevent a fast ball crossing the narrowest collision shape.
    for (let i = 0; i < 4; i++) {
      this.M.Engine.update(this.engine, seconds * 250);
      for(const body of this.pendingBreak){this.M.Composite.remove(this.engine.world,body);const index=this.bodies.indexOf(body);if(index>=0)this.bodies.splice(index,1);}
      this.pendingBreak.clear();
      for(const body of this.pendingRemove){this.M.Composite.remove(this.engine.world,body);const index=this.bodies.indexOf(body);if(index>=0)this.bodies.splice(index,1);}
      this.pendingRemove.clear();
    }
    if (this.state !== 'flight') return;
    this.elapsed += seconds;
    if (this.ball && (this.ball.position.x > 1150 || this.ball.position.y > 1000 || this.ball.position.x < -150)) {
      this.M.Composite.remove(this.engine.world, this.ball);
      this.bodies.splice(this.bodies.indexOf(this.ball), 1);
      this.ball = null;
    }
    // A ball rolling slowly away from every remaining object can no longer
    // affect this board. Retire it after a short quiet interval instead of
    // making players wait for many seconds of irrelevant rolling friction.
    if(this.ball){
      const ball=this.ball, direction=Math.sign(ball.velocity.x), others=this.bodies.filter(body=>body!==ball&&body!==this.ground);
      const othersQuiet=others.every(body=>body.isStatic||body.isSleeping||(body.speed<=.08&&Math.abs(body.angularSpeed)<=.004));
      const noObjectAhead=direction!==0&&others.every(body=>(body.position.x-ball.position.x)*direction<0);
      const safe=ball.position.y>750&&Math.abs(ball.velocity.y)<.2&&ball.speed<1&&othersQuiet&&noObjectAhead;
      this.ballRetireQuiet=safe?this.ballRetireQuiet+seconds:0;
      if(this.ballRetireQuiet>=.5){this.M.Composite.remove(this.engine.world,ball);const index=this.bodies.indexOf(ball);if(index>=0)this.bodies.splice(index,1);this.ball=null;}
    }
    const moving = this.bodies.some(b => !b.isStatic && !b.isSleeping && (b.speed > .08 || Math.abs(b.angularSpeed) > .004));
    this.quiet = moving ? 0 : this.quiet + seconds;
    if (this.elapsed > .4 && this.quiet >= .5) {
      const linked=this.stage?.sameShot;
      if(linked?.some(column=>this.recoveryShot.get(column)===this.shots)&&!linked.every(column=>this.recoveryShot.get(column)===this.shots)){
        this.state='lost';this.events.push({type:'wrongLink'},{type:'lose'});return;
      }
      if(this.ball){this.M.Composite.remove(this.engine.world,this.ball);const index=this.bodies.indexOf(this.ball);if(index>=0)this.bodies.splice(index,1);this.ball=null;}
      this.state = this.shots >= this.limit ? 'lost' : 'ready';
      this.events.push({ type: this.state === 'lost' ? 'lose' : 'ready' });
    }
    if (this.elapsed > 15 && this.state === 'flight') {
      this.state = 'stalled';
      this.events.push({ type: 'stalled' });
    }
  }
  drain() { return this.events.splice(0); }
  dispose() { this.M.Composite.clear(this.engine.world, false); this.M.Engine.clear(this.engine); this.bodies.length = 0; }
}
