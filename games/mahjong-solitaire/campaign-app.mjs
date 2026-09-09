import {createMahjongSession} from './campaign-session.mjs';
import {createCampaignStageView} from './campaign-stage-view.mjs';
import {createCampaignBattleView} from './campaign-battle-view.mjs';

// Mount once from the replacement entry. The existing Main/guide renderer
// supplies its real elements; do not attach beside the retired arcade mount.
export function mountMahjongCampaign({main,guide,startButton,locale,storage,mainSettings,stageSettings,onMain,sound,onEvent}) {
 if(!main||!guide||!startButton||typeof locale!=='function')throw new Error('Campaign Main/guide binding required');
 const session=createMahjongSession(storage,{onEvent}),lifetime=new AbortController(),doc=main.ownerDocument,win=doc.defaultView;
 const root=doc.documentElement,body=doc.body;
 const original={html:root.getAttribute('style'),body:body.getAttribute('style'),screen:body.dataset.screen,mainHidden:main.hidden,guideHidden:guide.hidden};
 const properties={html:['overflow','overflow-y','overscroll-behavior','overscroll-behavior-y','touch-action'],body:['position','inset','width','overflow','overscroll-behavior','touch-action']};
 const savedStyles=new Map();for(const [kind,element] of [['html',root],['body',body]])for(const name of properties[kind])savedStyles.set(kind+name,[element.style.getPropertyValue(name),element.style.getPropertyPriority(name)]);
 let frame=0,disposed=false,active=false;
 const restore=()=>{for(const [kind,element] of [['html',root],['body',body]])for(const name of properties[kind]){const [value,priority]=savedStyles.get(kind+name);if(value)element.style.setProperty(name,value,priority);else element.style.removeProperty(name);}};
 const resetScroll=()=>{root.scrollTop=0;body.scrollTop=0;win.scrollTo({left:0,top:0,behavior:'instant'});};
 function lock(next){
  if(next===active)return;active=next;win.cancelAnimationFrame(frame);frame=0;
  if(next){root.style.overflow='hidden';root.style.overscrollBehavior='none';body.style.position='fixed';body.style.inset='0';body.style.width='100%';body.style.overflow='hidden';body.style.overscrollBehavior='none';resetScroll();frame=win.requestAnimationFrame(()=>{frame=0;if(active&&!disposed)resetScroll()});}
  else {restore();root.style.overflowY='auto';root.style.overscrollBehaviorY='contain';root.style.touchAction='pan-y';}
 }
 const stageView=createCampaignStageView({locale,progress:()=>session.snapshot().progress,activate:id=>{session.start(id);show()},home:()=>{session.home();show()},settings:stageSettings});
 const battleView=createCampaignBattleView({session,locale,onStages:()=>show(),sound});body.append(stageView.root,battleView.root);
 function show(){
  if(disposed)throw new Error('Campaign app disposed');
  sound?.stop?.();mainSettings?.close();stageSettings?.close();const state=session.snapshot();body.dataset.screen=state.screen;main.hidden=state.screen!=='main';guide.hidden=state.screen!=='main';lock(state.screen!=='main');
  stageView.root.hidden=state.screen!=='stage';battleView.root.hidden=state.screen!=='battle';
  if(state.screen==='stage')stageView.refresh({resetSelection:true});
  // Always notify Battle so leaving cancels the previous board's effects.
  battleView.render();
  if(state.screen==='main'){onMain?.();mainSettings?.refresh();startButton.focus({preventScroll:true});}
 }
 const openStages=()=>{session.stages();show();};startButton.addEventListener('click',openStages,{signal:lifetime.signal});
 function dispose(){if(disposed)return;disposed=true;win.cancelAnimationFrame(frame);lifetime.abort();stageView.dispose();battleView.dispose();mainSettings?.dispose();restore();main.hidden=original.mainHidden;guide.hidden=original.guideHidden;if(original.screen===undefined)delete body.dataset.screen;else body.dataset.screen=original.screen;}
 win.addEventListener('pagehide',dispose,{once:true,signal:lifetime.signal});
 show();return Object.freeze({session,show,openStages,dispose});
}
