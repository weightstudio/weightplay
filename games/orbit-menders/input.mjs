export class InputRouter {
  constructor(canvas,{pause,onLook,onAction}){
    this.canvas=canvas;this.keys=new Set();this.edges=new Set();this.dragging=false;this.active=false;this.wasLocked=false;this.abort=new AbortController();const signal=this.abort.signal;
    const listen=(target,type,fn,options={})=>target.addEventListener(type,fn,{...options,signal});
    const supported=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','ShiftLeft','ShiftRight','KeyE','KeyQ','KeyR','KeyF','Escape']);
    listen(window,'keydown',e=>{if(e.defaultPrevented||!this.active||e.ctrlKey||e.metaKey||e.altKey||!supported.has(e.code))return;if(document.activeElement!==canvas&&document.pointerLockElement!==canvas)return;e.preventDefault();if(!this.keys.has(e.code))this.edges.add(e.code);this.keys.add(e.code);if(e.code==='Escape'){this.clear();pause('escape');}});
    listen(window,'keyup',e=>{this.keys.delete(e.code);});
    listen(canvas,'pointerdown',e=>{if(!this.active)return;canvas.focus({preventScroll:true});if(e.button===2){this.dragging=true;canvas.setPointerCapture(e.pointerId);}else if(e.button===0)onAction('pulse');});
    listen(canvas,'pointerup',()=>{this.dragging=false;});listen(canvas,'lostpointercapture',()=>{this.dragging=false;});
    listen(canvas,'contextmenu',e=>e.preventDefault());
    listen(window,'mousemove',e=>{if(this.active&&(this.dragging||document.pointerLockElement===canvas))onLook(e.movementX,e.movementY);});
    listen(document,'pointerlockchange',()=>{const locked=document.pointerLockElement===canvas;if(this.wasLocked&&!locked&&this.active){this.clear();pause('unlock');}this.wasLocked=locked;});
    listen(window,'blur',()=>{if(this.active){this.clear();pause('blur');}});
    listen(document,'visibilitychange',()=>{if(document.hidden&&this.active){this.clear();pause('hidden');}});
  }
  clear(){this.keys.clear();this.edges.clear();this.dragging=false;}
  setActive(value){this.active=value;this.clear();}
  take(code){const result=this.edges.has(code);this.edges.delete(code);return result;}
  sample(){const k=this.keys;return {x:Number(k.has('KeyD')||k.has('ArrowRight'))-Number(k.has('KeyA')||k.has('ArrowLeft')),y:Number(k.has('KeyW')||k.has('ArrowUp'))-Number(k.has('KeyS')||k.has('ArrowDown')),jump:this.take('Space'),jumpHeld:k.has('Space'),dash:this.take('ShiftLeft')||this.take('ShiftRight')};}
  async requestLock(){if(!this.active||!this.canvas.requestPointerLock)return false;try{await this.canvas.requestPointerLock();return document.pointerLockElement===this.canvas;}catch{return false;}}
  dispose(){this.active=false;this.clear();this.abort.abort();if(document.pointerLockElement===this.canvas)document.exitPointerLock();}
}
