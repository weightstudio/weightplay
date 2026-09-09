import '../../src/stage-virtualization-standard.js';
import {createHabitatArt} from './habitat-art.mjs?v=20260909-grove-campaign-v6';
export function createStageView({campaign,copy,locale,progress,activate,home,sound,soundLabel,toggleSound}){
 const root=document.createElement('section');root.id='stageView';root.hidden=true;root.dataset.screen='stage';
 root.innerHTML='<div class="grove-stage-canvas" data-wp-standard-stage-screen><div class="grove-stage-logical"><header><button type="button" data-wp-return="stage">←</button><h2></h2><button type="button" class="utility-button" data-sound-toggle></button></header><div class="grove-stage-workspace"><div class="grove-stage-rail stage-rail" data-wp-stage-selector></div></div><nav class="grove-stage-tabs stage-tabs"><span></span><button type="button" aria-current="page"></button><span></span></nav></div></div><div class="battle-ad-reserve" data-wp-stage-physical-reserve aria-hidden="true"></div>';
 document.querySelector('#battleView').before(root);
 const canvas=root.querySelector('.grove-stage-canvas'),logical=root.querySelector('.grove-stage-logical'),rail=root.querySelector('.grove-stage-rail');
 let controller,settleFrame=0,selectedIndex=0;
 const lifecycle=new AbortController();
 root.querySelector('header button').addEventListener('click',home,{signal:lifecycle.signal});
 root.querySelector('[data-sound-toggle]').addEventListener('click',toggleSound,{signal:lifecycle.signal});
 root.querySelector('nav button').addEventListener('click',()=>controller?.center(progress().unlocked-1),{signal:lifecycle.signal});
 const fit=()=>{
   if(root.hidden)return;
   const height=Math.max(1,(window.visualViewport?.height||innerHeight)-56),width=Math.min(920,document.documentElement.clientWidth);
   const wide=width>=680&&width>height*1.3;
   canvas.dataset.headerLayout=width>=700||wide?'single':'stacked';
   const scale=Math.min(width/(wide?740:390),height/(wide?354:520));
   canvas.style.setProperty('--wp-stage-canvas-scale',String(scale));
   canvas.style.height=height+'px';logical.style.width=width/scale+'px';logical.style.height=height/scale+'px';logical.style.transform=`scale(${scale})`;
   controller?.center();
 };
 window.addEventListener('resize',fit,{signal:lifecycle.signal});window.visualViewport?.addEventListener('resize',fit,{signal:lifecycle.signal});
 const bind=(card,index)=>{
   const level=campaign[index],p=progress(),c=copy();
   card.className='grove-stage-card stage-card';card.dataset.stage=String(level.id);
   card.setAttribute('aria-disabled',String(level.id>p.unlocked));card.replaceChildren();
   const preview=document.createElement('span');preview.className='grove-stage-preview';preview.setAttribute('aria-hidden','true');
   preview.append(createHabitatArt(level.start));
   const arrow=document.createElement('span');arrow.className='grove-stage-route-arrow';arrow.textContent='→';preview.append(arrow,createHabitatArt(level.goal));
   for(const [tag,text] of [['span',`${c.stages} ${level.id} / ${campaign.length}`],['strong',level.names[locale()]||`${c.stages} ${level.id}`],['span',level.id>p.unlocked?c.locked:p.best[level.id]?c.cleared:c.play]]){
     const node=document.createElement(tag);node.textContent=text;card.append(node);
   }
   card.children[0].after(preview);
 };
 function refresh({resetSelection=false}={}){
   selectedIndex=resetSelection||!controller?progress().unlocked-1:Number(rail.dataset.wpStageDragLogical)||0;
   const c=copy();root.querySelector('h2').textContent=c.stages;root.querySelector('header button').setAttribute('aria-label',c.backStages);
   const utility=root.querySelector('[data-sound-toggle]');utility.textContent=sound()?'♪':'×';utility.setAttribute('aria-label',soundLabel());utility.setAttribute('aria-pressed',String(sound()));
   root.querySelector('nav button').textContent=c.stages;fit();
   if(!controller)controller=window.WeightPlayStageV6.install(rail,{total:campaign.length,poolSize:9,bind,initialIndex:()=>selectedIndex,activate:index=>{if(index+1<=progress().unlocked)activate(index);}});
   else controller.refresh();
   cancelAnimationFrame(settleFrame);
   const expected=selectedIndex;
   settleFrame=requestAnimationFrame(()=>{
     settleFrame=0;
     // A native key/drag after opening owns selection. Do not overwrite it
     // with the deferred initial paint alignment.
     if(!root.hidden&&Number(rail.dataset.wpStageDragLogical)===expected)controller.center(expected);
   });
 }
 const dispose=()=>{cancelAnimationFrame(settleFrame);lifecycle.abort();controller?.destroy();};
 window.addEventListener('pagehide',dispose,{once:true});
 return {root,refresh,dispose};
}
