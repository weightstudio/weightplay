/* Decorative only: gameplay timers, rewards and input ownership stay in game.js. */
(() => {
  "use strict";
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const owned=new Set(), heldNative=new Set(), reasons=new Set();
  let sceneKey="", previousEffects=new Map();
  const $=id=>document.getElementById(id);
  const running=()=>!media.matches&&!reasons.size&&!document.hidden;
  function forget(animation){owned.delete(animation);heldNative.delete(animation);}
  function tween(node,frames,options={},channel="effect") {
    if(!node?.animate||media.matches) return null;
    const key=`${node.id||node.dataset.abyssMotionId||"decoration"}:${channel}`;
    previousEffects.get(key)?.cancel();
    const animation=node.animate(frames,{duration:360,easing:"cubic-bezier(.2,.8,.2,1)",...options});
    owned.add(animation);previousEffects.set(key,animation);
    animation.onfinish=animation.oncancel=()=>{forget(animation);if(previousEffects.get(key)===animation)previousEffects.delete(key);};
    if(!running())animation.pause();
    return animation;
  }
  function clear(){
    for(const animation of [...owned])animation.cancel();
    for(const animation of [...heldNative])animation.cancel();
    owned.clear();heldNative.clear();previousEffects.clear();sceneKey="";
  }
  function hold(reason,value){
    if(value)reasons.add(reason);else reasons.delete(reason);
    const paused=!running();
    document.body.dataset.abyssPaused=String(paused);
    // Capture native CSS transitions too; do not disturb shared Canvas transforms.
    if(paused){
      for(const animation of $("diveField")?.getAnimations?.({subtree:true})||[]){
        if(animation.playState==="running"&&!owned.has(animation)){heldNative.add(animation);animation.pause();}
      }
      for(const animation of owned)if(animation.playState==="running")animation.pause();
    } else {
      for(const animation of [...owned,...heldNative])if(animation.playState==="paused")animation.play();
      heldNative.clear();
    }
  }
  function bubbles(){
    let layer=$("abyssMotes");
    if(!layer){
      layer=document.createElement("div");layer.id="abyssMotes";layer.setAttribute("aria-hidden","true");
      for(let i=0;i<8;i++){const mote=document.createElement("i");mote.dataset.abyssMotionId=`mote${i}`;mote.style.left=`${6+i*12}%`;layer.append(mote);}
      $("diveField")?.prepend(layer);
    }
    [...layer.children].forEach((mote,i)=>tween(mote,[{transform:"translate3d(0,24px,0)",opacity:0},{opacity:.45,offset:.2},{transform:`translate3d(${i%2?16:-16}px,-380px,0)`,opacity:0}],{duration:6200+i*460,delay:-i*830,iterations:Infinity},"ambient"));
  }
  function scene(name,result=false){
    const next=`${name}:${result}`;
    if(next===sceneKey)return;
    clear();sceneKey=next;reasons.delete("dive");reasons.delete("upgrade");
    // A reduced-motion change or bfcache restore must not resume an open modal.
    const open=id=>$(id)&&!$(id).classList.contains("hidden");
    if(name==="battle"&&!result){
      if(open("quitPanel")||open("diveCoach"))reasons.add("dive");
      if(open("upgradePanel"))reasons.add("upgrade");
    }
    document.body.dataset.abyssPaused=String(!running());
    if(name==="main"){
      const cover=document.querySelector("#mainScreen .cover");
      tween(cover,[{opacity:.35},{opacity:1}],{duration:500},"entrance");
    } else if(name==="stage"){
      [...document.querySelectorAll(".route-card strong")].forEach((node,i)=>{node.dataset.abyssMotionId=`route${i}`;tween(node,[{opacity:.25},{opacity:1}],{duration:260,delay:i*18},"entrance");});
    } else if(result){
      tween($("resultSummary"),[{opacity:0},{opacity:1}],{duration:300},"entrance");
    } else bubbles();
  }
  function pulse(kind="sonar"){
    if(media.matches)return;
    const field=$("diveField");if(!field)return;
    // One reusable ring. Repeated input replaces, rather than accumulates, effects.
    let ring=$("abyssPulse");
    if(!ring){ring=document.createElement("i");ring.id="abyssPulse";ring.setAttribute("aria-hidden","true");field.append(ring);}
    ring.dataset.kind=kind;
    tween(ring,[{transform:"translate(-50%,-50%) scale(.15)",opacity:.8},{transform:"translate(-50%,-50%) scale(1.4)",opacity:0}],{duration:kind==="sonar"?720:480},"pulse");
  }
  function event(name,details={}){
    if(media.matches)return;
    const diver=document.querySelector(".combat-diver img"),fish=$("fishSprite");
    if(name==="strike"){
      tween(diver,[{transform:"translateX(0)"},{transform:"translateX(26px) rotate(-7deg)",offset:.4},{transform:"translateX(0)"}],{duration:390},"combat");
      tween(fish,[{transform:"translateX(0)"},{transform:"translateX(9px)",opacity:.55,offset:.5},{transform:"translateX(0)",opacity:1}],{duration:300},"combat");
      if(details.guard)pulse("shield");
    } else if(name==="counter"){
      tween(fish,[{transform:"translateX(0)"},{transform:"translateX(-28px)",offset:.45},{transform:"translateX(0)"}],{duration:400},"combat");
      tween(diver,[{opacity:1},{opacity:.5,offset:.45},{opacity:1}],{duration:350},"combat");
    } else if(name==="sonar"||name==="shield")pulse(name);
    else if(name==="reward")tween($("salvageText"),[{opacity:.35},{opacity:1}],{duration:480},"reward");
    else if(name==="upgrade")tween($("upgradePanel"),[{opacity:.2},{opacity:1}],{duration:240},"entrance");
    else if(name==="fish"){
      tween(fish,[{opacity:0,transform:"translateX(35px)"},{opacity:1,transform:"translateX(0)"}],{duration:400},"combat");
    }
  }
  media.addEventListener("change",()=>{const [name,result]=sceneKey.split(":");clear();hold("reduced",media.matches);if(name)scene(name,result==="true");});
  document.addEventListener("visibilitychange",()=>hold("hidden",document.hidden));
  window.addEventListener("blur",()=>hold("focus",true));
  window.addEventListener("focus",()=>hold("focus",false));
  window.addEventListener("pagehide",clear);
  window.addEventListener("pageshow",()=>scene(document.body.dataset.screen||"main",!$("result")?.classList.contains("hidden")));
  window.AbyssDiverMotion=Object.freeze({scene,event,hold,clear,get reduced(){return media.matches;},snapshot:()=>({owned:owned.size,paused:!running(),scene:sceneKey})});
})();
