const bound=(n,a,b)=>Math.max(a,Math.min(b,n));
export class YardCamera{
 constructor(canvas,camera,{signal,canControl=()=>true,onPick}){
  Object.assign(this,{canvas,camera,canControl,onPick});this.points=new Map();this.reset(false);
  const listen=(name,fn,options={})=>canvas.addEventListener(name,fn,{...options,signal});canvas.style.touchAction='none';canvas.tabIndex=0;
  listen('pointerdown',e=>{if(!canControl()||e.button>0)return;this.points.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY});this.dragged=this.points.size>1;this.pinch=this.distance();canvas.setPointerCapture(e.pointerId);});
  listen('pointermove',e=>{const p=this.points.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;if(!canControl()){this.dragged=true;return;}if(this.points.size>1){this.dragged=true;const distance=this.distance();if(this.pinch>0)this.zoomBy(distance/this.pinch);this.pinch=distance;}else if(this.dragged||Math.hypot(p.x-p.startX,p.y-p.startY)>5){this.dragged=true;this.yaw+=dx*.008;this.elevation=bound(this.elevation+dy*.006,.5,1.15);this.apply();}});
  const end=(e,cancel=false)=>{if(!this.points.has(e.pointerId))return;const pick=!cancel&&!this.dragged&&this.points.size===1&&canControl();this.points.delete(e.pointerId);if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(pick)onPick(e);if(!this.points.size){this.dragged=false;this.pinch=0;}};
  listen('pointerup',e=>end(e));listen('pointercancel',e=>end(e,true));listen('lostpointercapture',e=>end(e,true));
  listen('wheel',e=>{if(!canControl())return;e.preventDefault();this.zoomBy(Math.exp(-e.deltaY*.001));},{passive:false});
  signal.addEventListener('abort',()=>this.points.clear(),{once:true});
 }
 distance(){if(this.points.size<2)return 0;const [a,b]=[...this.points.values()];return Math.hypot(a.x-b.x,a.y-b.y);}
 apply(){const horizontal=20*Math.cos(this.elevation);this.camera.position.set(Math.sin(this.yaw)*horizontal,20*Math.sin(this.elevation),Math.cos(this.yaw)*horizontal);this.camera.zoom=this.zoom;this.camera.lookAt(0,.2,0);this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld(true);}
 zoomBy(factor){if(!this.canControl()||!Number.isFinite(factor))return false;this.zoom=bound(this.zoom*factor,.75,1.7);this.apply();return true;}
 reset(check=true){if(check&&!this.canControl())return false;this.yaw=Math.atan2(9,14);this.elevation=Math.atan2(12,Math.hypot(9,14));this.zoom=1;this.apply();return true;}
 snapshot(){return {yaw:this.yaw,elevation:this.elevation,zoom:this.zoom,pointers:this.points.size};}
}
