(()=>{
  "use strict";
  const TOTAL=30,POOL=9,clamp=(value,min=1,max=TOTAL)=>Math.max(min,Math.min(max,value));
  const copy=(key,fallback,values={})=>String(window.BlockTrilogyConfig?.localeCopy?.[key]??fallback).replace(/\{(\w+)\}/gu,(_,name)=>String(values[name]??`{${name}}`));
  let api=null,cards=[],windowStart=1,settleRaf=0;
  const desired=stage=>clamp(stage-Math.floor(POOL/2),1,TOTAL-POOL+1);
  const status=(stage,save)=>stage>save.unlocked?copy("locked","Locked"):save.cleared[stage]?copy("cleared","Cleared · Replay"):copy("ready","Ready");
  const announceLocked=card=>{const hint=document.getElementById("stageHint");if(hint)hint.textContent=copy("lockedHint",[...card.querySelectorAll("small,strong,span")].map(node=>node.textContent.trim()).filter(Boolean).join(" · "))};
  function createCard(){
    const button=document.createElement("button");
    button.type="button";button.className="stage-card";button.innerHTML="<small></small><strong></strong><span></span>";
    button.addEventListener("click",()=>{const stage=Number(button.dataset.stage);if(!stage)return;if(stage!==api.getCentered()){select(stage,true);return}if(stage>api.save.unlocked){announceLocked(button);return}api.enter(stage)});
    return button;
  }
  function bind(button,stage){
    const locked=stage>api.save.unlocked,centered=stage===api.getCentered();
    button.dataset.stage=String(stage);button.setAttribute("aria-posinset",String(stage));button.setAttribute("aria-setsize",String(TOTAL));button.setAttribute("aria-disabled",String(locked));
    button.classList.toggle("locked",locked);button.classList.toggle("centered",centered);button.setAttribute("aria-current",centered?"true":"false");button.tabIndex=centered?0:-1;
    button.querySelector("small").textContent=api.chapters[api.chapterFor(stage)];button.querySelector("strong").textContent=copy("stage","Stage {n}",{n:stage});button.querySelector("span").textContent=status(stage,api.save);
  }
  function sync(){cards.forEach(card=>bind(card,Number(card.dataset.stage)))}
  function moveWindow(next){
    const rail=api.rail,target=clamp(next,1,TOTAL-POOL+1);let recycled=0;
    while(windowStart<target){const card=rail.firstElementChild,anchor=card?.nextElementSibling,before=anchor?.getBoundingClientRect().left;windowStart++;rail.append(card);bind(card,windowStart+POOL-1);const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=after-before;recycled++}
    while(windowStart>target){const card=rail.lastElementChild,anchor=card?.previousElementSibling,before=anchor?.getBoundingClientRect().left;windowStart--;rail.prepend(card);bind(card,windowStart);const after=anchor?.getBoundingClientRect().left;if(Number.isFinite(before)&&Number.isFinite(after))rail.scrollLeft+=after-before;recycled++}
    cards=[...rail.children];rail.dataset.wpStageWindowStart=String(windowStart);rail.dataset.wpStageWindowEnd=String(windowStart+POOL-1);if(recycled)rail.dataset.wpStageRecycleCount=String(Number(rail.dataset.wpStageRecycleCount||0)+recycled);return recycled;
  }
  function geometry(){const rail=api.rail,first=cards[0]?.getBoundingClientRect(),second=cards[1]?.getBoundingClientRect(),box=rail.getBoundingClientRect(),delta=first&&second?(second.left+second.width/2)-(first.left+first.width/2):0;return{rail,center:box.left+box.width/2,pitch:Math.abs(delta)||(first?.width||220)+12,orientation:Math.sign(delta)||1}}
  function nearest(){const center=geometry().center;return cards.reduce((best,card)=>{const box=card.getBoundingClientRect(),distance=Math.abs(box.left+box.width/2-center);return!best||distance<best.distance?{card,distance}:best},null)?.card}
  function logical(){const card=nearest();if(!card)return api.getCentered();const stage=Number(card.dataset.stage),box=card.getBoundingClientRect(),g=geometry();return clamp(stage+(g.center-(box.left+box.width/2))/(g.pitch*g.orientation))}
  function position(value){const logicalStage=clamp(value),anchor=Math.round(logicalStage);if(moveWindow(desired(anchor)))sync();const card=api.rail.querySelector(`[data-stage="${anchor}"]`);if(!card)return logicalStage;card.scrollIntoView({behavior:"auto",block:"nearest",inline:"center"});const g=geometry(),fraction=logicalStage-anchor;if(Math.abs(fraction)>.0001)g.rail.scrollLeft+=fraction*g.orientation*g.pitch;g.rail.dataset.wpStageDragLogical=logicalStage.toFixed(4);return logicalStage}
  function select(stage,smooth=false){stage=clamp(stage);api.setCentered(stage);moveWindow(desired(stage));sync();const card=api.rail.querySelector(`[data-stage="${stage}"]`);card?.scrollIntoView({behavior:smooth?"smooth":"auto",block:"nearest",inline:"center"});card?.focus({preventScroll:true})}
  function installDrag(){
    const rail=api.rail;if(rail.dataset.wpStageVirtualDrag==="true")return;rail.dataset.wpStageVirtualDrag="true";rail.dataset.wpStageCenterObserver="manual";rail.dataset.wpStageSettleDuration="340";
    let pointerId=null,startX=0,lastX=0,dragLogical=1,moved=false,suppressClick=false;
    rail.addEventListener("pointerdown",event=>{if(event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;cancelAnimationFrame(settleRaf);pointerId=event.pointerId;startX=lastX=event.clientX;dragLogical=logical();moved=false;rail.setPointerCapture?.(pointerId);rail.style.setProperty("scroll-behavior","auto","important");rail.style.setProperty("scroll-snap-type","none","important");event.stopImmediatePropagation()},true);
    rail.addEventListener("pointermove",event=>{if(event.pointerId!==pointerId)return;const delta=event.clientX-lastX;lastX=event.clientX;if(!moved&&Math.abs(event.clientX-startX)>4)moved=true;if(moved){if(event.cancelable)event.preventDefault();const box=rail.getBoundingClientRect(),scale=box.width?rail.clientWidth/box.width:1;dragLogical=position(dragLogical-delta*scale/geometry().pitch)}event.stopImmediatePropagation()},true);
    const finish=event=>{if(pointerId===null||event.pointerId!==pointerId)return;rail.releasePointerCapture?.(pointerId);pointerId=null;if(moved){if(event.cancelable)event.preventDefault();const from=dragLogical,target=clamp(Math.round(from)),start=performance.now();api.setCentered(target);rail.dataset.wpStageSettling="true";const settle=now=>{const progress=clamp((now-start)/340,0,1),eased=progress*progress*(3-2*progress);position(from+(target-from)*eased);if(progress<1)settleRaf=requestAnimationFrame(settle);else{position(target);sync();delete rail.dataset.wpStageSettling;rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type")}};settleRaf=requestAnimationFrame(settle);suppressClick=true;setTimeout(()=>{suppressClick=false},0)}else{rail.style.removeProperty("scroll-behavior");rail.style.removeProperty("scroll-snap-type")}moved=false;event.stopImmediatePropagation()};
    rail.addEventListener("pointerup",finish,true);rail.addEventListener("pointercancel",finish,true);
    rail.addEventListener("click",event=>{const card=event.target.closest?.(".stage-card")||document.elementFromPoint(event.clientX,event.clientY)?.closest?.(".stage-card"),stage=Number(card?.dataset.stage);if(!stage)return;event.preventDefault();event.stopImmediatePropagation();if(suppressClick){suppressClick=false;return}if(stage!==api.getCentered()){select(stage,true);return}if(stage>api.save.unlocked){announceLocked(card);return}api.enter(stage)},true);
    rail.addEventListener("keydown",event=>{const rtl=getComputedStyle(rail).direction==="rtl",step=event.key==="ArrowRight"?(rtl?-1:1):event.key==="ArrowLeft"?(rtl?1:-1):0;const target=step?api.getCentered()+step:event.key==="Home"?1:event.key==="End"?TOTAL:0;if(target){event.preventDefault();event.stopImmediatePropagation();select(target,true)}else if((event.key==="Enter"||event.key===" ")&&api.getCentered()>api.save.unlocked){event.preventDefault();announceLocked(rail.querySelector(".stage-card.centered"))}},true);
  }
  window.BlockTrilogyStageRenderer={render(nextApi){api=nextApi;const rail=api.rail;if(!cards.length||cards.some(card=>card.parentElement!==rail)){rail.replaceChildren();cards=Array.from({length:POOL},createCard);cards.forEach(card=>rail.append(card));windowStart=desired(api.getCentered());cards.forEach((card,index)=>bind(card,windowStart+index));Object.assign(rail.dataset,{wpStageVirtualized:"bounded-recycle",wpStagePoolSize:String(POOL),wpStageTotal:String(TOTAL),wpStageRecycleCount:"0"});installDrag()}select(api.getCentered());return true}};
})();
