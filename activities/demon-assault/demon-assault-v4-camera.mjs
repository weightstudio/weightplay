// Camera owns no gameplay state. All exits from flight go through finish().
export class BattleCamera {
 constructor(world, sling, boss) { Object.assign(this,{world,sling,boss,x:boss,span:500,mode:'idle',elapsed:0,vertical:0,reduced:false,flightExits:0}); }
 clamp(x) { return Math.max(this.span/2,Math.min(this.world-this.span/2,x)); }
 resize(span) { this.span=Math.min(this.world,span);this.x=this.clamp(this.x);if(this.motion)this.motion.to=this.clamp(this.motion.to); }
 get locked() { return this.mode!=='idle'&&this.mode!=='pan'; }
 intro() { this.x=this.clamp(this.boss);this.vertical=0;this.go(this.sling,'intro',2.7,.65); }
 go(target,mode='travel',duration=.7,delay=0) { this.motion={from:this.x,to:this.clamp(target),duration,delay};this.elapsed=0;this.mode=mode;if(this.reduced){this.x=this.motion.to;this.motion=null;this.mode='idle';this.vertical=0;} }
 pan(dx) { if(this.locked)return;this.mode='pan';this.x=this.clamp(this.x+dx);this.vertical=0; }
 endPan() { if(this.mode==='pan')this.mode='idle'; }
 aim() { this.x=this.clamp(this.sling);this.vertical=0;this.mode='aim'; }
 cancelAim() { if(this.mode==='aim')this.mode='idle';this.endPan(); }
 follow() { this.mode='follow';this.motion=null;this.elapsed=0; }
 finish() { this.mode='hold';this.motion=null;this.elapsed=0;this.flightExits++; }
 reset() { this.motion=null;this.mode='idle';this.vertical=0;this.x=this.clamp(this.sling); }
 reduce(value) { this.reduced=value;if(value&&this.motion){this.x=this.motion.to;this.motion=null;this.mode='idle';this.vertical=0;} }
 update(dt,shot) {
  this.elapsed+=dt;
  if(this.motion){const m=this.motion,u=Math.max(0,Math.min(1,(this.elapsed-m.delay)/m.duration));const smooth=u*u*u*(u*(u*6-15)+10);this.x=this.clamp(m.from+(m.to-m.from)*smooth);this.vertical*=Math.exp(-dt*8);if(u===1){this.motion=null;this.mode='idle';}}
  if(this.mode==='follow'){
   if(!shot){this.finish();return;}
   // Essential camera tracking stays active under reduced motion; no look-ahead or overshoot.
   const target=this.clamp(shot.x+(this.reduced?0:Math.sign(shot.vx)*this.span*.12));
   this.x=this.clamp(this.x+(target-this.x)*(1-Math.exp(-dt*12)));
   this.vertical+=(Math.max(0,shot.y-360)-this.vertical)*(1-Math.exp(-dt*12));
  }
  if(this.mode==='hold'&&this.elapsed>=(this.reduced?.15:.8))this.mode='idle';
 }
 snapshot(){return{mode:this.mode,locked:this.locked,x:this.x,span:this.span,min:this.span/2,max:this.world-this.span/2,vertical:this.vertical,flightExits:this.flightExits};}
}
