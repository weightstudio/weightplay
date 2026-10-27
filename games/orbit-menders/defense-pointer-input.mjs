// One native pointing gesture owns aim/fire. Combat still advances only on the
// shared simulation clock; this adapter never infers hits or changes cadence.
export function createDefensePointerInput({surface,isActive,onAim,onFire,onBlast,onFocus=()=>{},releaseTarget=surface.ownerDocument?.defaultView}){
  let owner=null,disposed=false;
  const listeners=[];
  const kind=event=>event.pointerType||'mouse';
  const listen=(target,type,callback)=>{
    if(!target)return;
    target.addEventListener(type,callback);
    listeners.push(()=>target.removeEventListener(type,callback));
  };
  const prevent=event=>{if(event.cancelable)event.preventDefault();};
  const release=pointerId=>{
    try{if(surface.hasPointerCapture?.(pointerId))surface.releasePointerCapture?.(pointerId);}catch{}
  };
  function clear(cancelled=true){
    if(!owner)return;
    const previous=owner;owner=null;
    onFire(false,{pointerType:previous.type,cancelled});
    release(previous.id);
  }
  function down(event){
    if(disposed||event.defaultPrevented||!isActive()||!Number.isFinite(event.pointerId))return;
    const type=kind(event);
    if(type==='mouse'&&event.button===2){
      if(owner&&(owner.id!==event.pointerId||owner.type!=='mouse'))return;
      onFocus();onAim(event);onBlast();prevent(event);return;
    }
    if(event.button!==0)return;
    // A second finger may press the separate Blast button, but cannot steal
    // this canvas's aim or release another finger's continuous shot.
    if(owner){prevent(event);return;}
    owner={id:event.pointerId,type};
    onFocus();onAim(event);onFire(true,{pointerType:type,cancelled:false});
    try{surface.setPointerCapture?.(owner.id);}catch{}
    prevent(event);
  }
  function move(event){
    if(disposed)return;
    if(!isActive()){clear();return;}
    if(owner){
      if(event.pointerId!==owner.id)return;
      if(owner.type==='mouse'&&typeof event.buttons==='number'&&(event.buttons&1)===0){clear();onAim(event);return;}
      onAim(event);prevent(event);return;
    }
    // Mouse hover aims normally. A lifted touch or an unowned secondary
    // contact cannot silently resume firing or move the target.
    if(kind(event)==='mouse')onAim(event);
  }
  function end(event,cancelled){
    if(owner?.id!==event.pointerId)return;
    clear(cancelled);
  }
  listen(surface,'pointerdown',down);
  listen(surface,'pointermove',move);
  listen(surface,'pointerup',event=>end(event,false));
  listen(surface,'pointercancel',event=>end(event,true));
  listen(surface,'lostpointercapture',event=>end(event,true));
  listen(surface,'contextmenu',prevent);
  // Capture is normally available. Window release also safely ends a mouse
  // gesture if the browser refused capture while it was leaving the canvas.
  if(releaseTarget!==surface){
    listen(releaseTarget,'pointerup',event=>end(event,false));
    listen(releaseTarget,'pointercancel',event=>end(event,true));
  }
  return Object.freeze({
    clear,
    dispose(){if(disposed)return;disposed=true;listeners.forEach(remove=>remove());clear();},
  });
}
