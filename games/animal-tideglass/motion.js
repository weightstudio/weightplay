/* One cancellable clock; animation never owns progress, input, or saved results. */
(function (root) {
  'use strict';
  class TideglassMotion {
    constructor({raf=root?.requestAnimationFrame?.bind(root), caf=root?.cancelAnimationFrame?.bind(root), media=root?.matchMedia?.('(prefers-reduced-motion: reduce)')}={}) {
      this.raf=raf;this.caf=caf;this.media=media;this.reduced=Boolean(media?.matches);
      this.items=new Map();this.reasons=new Set();this.frame=0;this.last=null;this.dead=false;
      this.tick=this.tick.bind(this);
      this.onPreference=()=>{this.reduced=Boolean(media.matches);if(this.reduced)this.finish();};
      media?.addEventListener?.('change',this.onPreference);
    }
    tween(key,duration,update,release=()=>{}) {
      this.cancel(key);
      if(this.dead)return Promise.resolve(false);
      if(this.reduced||duration<=0){update(1);release();return Promise.resolve(true);}
      return new Promise(resolve=>{this.items.set(key,{duration,elapsed:0,update,release,resolve});update(0);this.schedule();});
    }
    schedule(){if(!this.dead&&!this.frame&&!this.reasons.size&&this.items.size)this.frame=this.raf(this.tick);}
    tick(now){
      this.frame=0;
      if(this.dead||this.reasons.size){this.last=null;return;}
      const delta=this.last===null?0:Math.min(64,Math.max(0,now-this.last));this.last=now;
      for(const [key,item] of [...this.items]){
        item.elapsed+=delta;const p=Math.min(1,item.elapsed/item.duration);
        item.update(1-Math.pow(1-p,3));
        if(p>=1){this.items.delete(key);item.release();item.resolve(true);}
      }
      if(!this.items.size)this.last=null;this.schedule();
    }
    cancel(key){
      for(const [id,item] of [...this.items])if(key===undefined||key===id){this.items.delete(id);item.release();item.resolve(false);}
      if(!this.items.size&&this.frame){this.caf(this.frame);this.frame=0;}if(!this.items.size)this.last=null;
    }
    finish(){
      const items=[...this.items];this.items.clear();if(this.frame)this.caf(this.frame);this.frame=0;this.last=null;
      for(const [,item] of items){item.update(1);item.release();item.resolve(true);}
    }
    pause(reason){this.reasons.add(reason);if(this.frame)this.caf(this.frame);this.frame=0;this.last=null;}
    resume(reason){this.reasons.delete(reason);this.schedule();}
    fade(node){return this.tween(node,320,p=>{node.style.opacity=String(.35+.65*p);},()=>{node.style.removeProperty('opacity');});}
    pulse(node,wrong=false){return this.tween(node,360,p=>{node.style.transform=wrong?`translateX(${Math.sin(p*Math.PI*6)*5*(1-p)}px)`:`scale(${1+Math.sin(p*Math.PI)*.045})`;},()=>{node.style.removeProperty('transform');});}
    snapshot(){return {active:this.items.size,frame:Boolean(this.frame),paused:[...this.reasons],reduced:this.reduced};}
    destroy(){this.dead=true;this.cancel();this.media?.removeEventListener?.('change',this.onPreference);}
  }
  if(root)root.TideglassMotion=TideglassMotion;
  if(typeof module!=='undefined'&&module.exports)module.exports=TideglassMotion;
})(typeof window==='undefined'?null:window);
