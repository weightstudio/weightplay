const KEYS={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowDown:'brake',KeyS:'brake',Space:'drift',ShiftLeft:'boost',ShiftRight:'boost',KeyX:'boost'};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

export function actionsFromKeys(keys){return new Set([...keys].map(key=>KEYS[key]||key.replace('button:','')));}

// Negative physics yaw turns screen-left in the trailing-camera view.
export function steerFromActions(actions){return Number(actions.has('right'))-Number(actions.has('left'));}

export function steerFromGamepad(pad){
  const axis=pad.axes[0]||0,dead=.16;
  let steer=Math.abs(axis)>dead?clamp((Math.abs(axis)-dead)/(1-dead),0,1)*Math.sign(axis):0;
  if(pad.buttons[14]?.pressed)steer=-1;
  if(pad.buttons[15]?.pressed)steer=1;
  return steer;
}

export class RaceInput{
  constructor(root,{pause=()=>{},recover=()=>{},gesture=()=>{}}={}){
    this.root=root;this.enabled=false;this.keys=new Set();this.pointers=new Map();this.abort=new AbortController();this.lastButtons=[];this.actions={pause,recover,gesture};
    const listen=(target,type,fn,options={})=>target.addEventListener(type,fn,{...options,signal:this.abort.signal});
    listen(window,'keydown',e=>{
      if(e.defaultPrevented||!this.enabled||e.target?.closest('select,input,textarea,[role="dialog"]'))return;
      if(KEYS[e.code]){e.preventDefault();this.keys.add(e.code);gesture();}
      if(!e.repeat&&(e.code==='Escape'||e.code==='KeyP')){e.preventDefault();pause();}
      if(!e.repeat&&e.code==='KeyR'){e.preventDefault();recover();}
    });
    listen(window,'keyup',e=>{this.keys.delete(e.code);});
    for(const button of root.querySelectorAll('[data-drive]')){
      listen(button,'pointerdown',e=>{
        if(!this.enabled||(e.pointerType==='mouse'&&e.button!==0))return;
        e.preventDefault();gesture();button.setPointerCapture(e.pointerId);this.pointers.set(e.pointerId,{action:button.dataset.drive,button});button.classList.add('held');
      });
      const release=e=>{this.pointers.delete(e.pointerId);if(![...this.pointers.values()].some(p=>p.button===button))button.classList.remove('held');};
      listen(button,'pointerup',release);listen(button,'pointercancel',release);listen(button,'lostpointercapture',release);
      listen(button,'keydown',e=>{if(this.enabled&&(e.key==='Enter'||e.key===' ')){e.preventDefault();gesture();this.keys.add(`button:${button.dataset.drive}`);button.classList.add('held');}});
      listen(button,'keyup',e=>{if(e.key==='Enter'||e.key===' '){this.keys.delete(`button:${button.dataset.drive}`);button.classList.remove('held');}});
      listen(button,'blur',()=>{this.keys.delete(`button:${button.dataset.drive}`);button.classList.remove('held');});
    }
    listen(window,'blur',()=>this.clear());listen(document,'visibilitychange',()=>{if(document.hidden)this.clear();});
  }
  setEnabled(value){this.enabled=Boolean(value);if(!this.enabled)this.clear();}
  clear(){
    this.keys.clear();for(const [id,{button}]of this.pointers){try{if(button.hasPointerCapture(id))button.releasePointerCapture(id);}catch{/* Browser may already have cancelled. */}}
    this.pointers.clear();this.root.querySelectorAll('.held').forEach(button=>button.classList.remove('held'));this.lastButtons=[];
  }
  read(){
    if(!this.enabled)return {steer:0,throttle:0,brake:0,drift:false,boost:false};
    const active=actionsFromKeys(this.keys);
    for(const value of this.pointers.values())active.add(value.action);
    let steer=steerFromActions(active),brake=Number(active.has('brake')),drift=active.has('drift'),boost=active.has('boost');
    try{
      const pad=[...(navigator.getGamepads?.()||[])].find(p=>p?.connected&&p.mapping==='standard');
      if(pad){
        const padSteer=steerFromGamepad(pad);if(padSteer!==0)steer=padSteer;
        brake=Math.max(brake,pad.buttons[6]?.value||0);drift||=Boolean(pad.buttons[0]?.pressed);boost||=Boolean(pad.buttons[1]?.pressed||pad.buttons[7]?.pressed);
        const buttons=pad.buttons.map(b=>b.pressed);
        if(buttons[9]&&!this.lastButtons[9])this.actions.pause();
        if(buttons[3]&&!this.lastButtons[3])this.actions.recover();
        this.lastButtons=buttons;
      }else this.lastButtons=[];
    }catch{/* Gamepad API can be disabled by Permissions Policy. */}
    return {steer,throttle:1,brake,drift,boost};
  }
  destroy(){this.setEnabled(false);this.abort.abort();}
}
