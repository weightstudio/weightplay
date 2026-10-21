import {createMahjongSession} from './campaign-session.mjs';
import {createCampaignStageView} from './campaign-stage-view.mjs?v=20261021-mahjong-v16-i9-stage-nav';
import {createCampaignBattleView} from './campaign-battle-view.mjs?v=20261021-mahjong-v16-i9-stage-nav';

// Mount once from the replacement entry. The shared Frame owns scene controls,
// settings and play layout; the campaign session remains the state owner.
export function mountMahjongCampaign({container,main,guide,startButton,locale,storage,mainSettings,onMain,sound,onEvent,onState}) {
 if(!container||!main||!guide||!startButton||typeof locale!=='function')throw new Error('Campaign Main/guide binding required');
 const session=createMahjongSession(storage,{onEvent}),lifetime=new AbortController(),doc=main.ownerDocument,win=doc.defaultView,body=doc.body;
 let disposed=false;
 const stageView=createCampaignStageView({locale,progress:()=>session.snapshot().progress,activate:id=>{session.start(id);show()},home:()=>{session.home();show()}});
 const battleView=createCampaignBattleView({session,locale,onStages:()=>show(),sound});
 container.append(stageView.root,battleView.root);
 const frame=win.WeightPlayScreenFrame?.mount({root:container,localeSelect:mainSettings?.select,playUI:true,scenes:{
  main:{root:main,header:main.querySelector('header'),content:main.querySelector('.mjc-main-page-content')},
  stage:{root:stageView.root,header:stageView.header,content:stageView.workspace},
  battle:{root:battleView.root,header:battleView.header,content:battleView.content,headerInfo:battleView.headerInfo},
 }});
 if(!frame)throw new Error('SHARED_SCREEN_FRAME_REQUIRED');
 function show(){
  if(disposed)throw new Error('Campaign app disposed');
  sound?.stop?.();const state=session.snapshot();body.dataset.screen=state.screen;
  main.hidden=state.screen!=='main';guide.hidden=state.screen!=='main';
  stageView.root.hidden=state.screen!=='stage';battleView.root.hidden=state.screen!=='battle';
  frame.activate(state.screen);
  if(state.screen==='stage')stageView.refresh();
  // Always notify Battle so leaving cancels the previous board's effects.
  battleView.render();
  if(state.screen==='main'){onMain?.();mainSettings?.refresh();startButton.focus({preventScroll:true});}
  try { onState?.(); } catch { /* Analytics never changes scene ownership. */ }
 }
 const openStages=()=>{session.stages();show();};startButton.addEventListener('click',openStages,{signal:lifetime.signal});
 function dispose(){if(disposed)return;disposed=true;lifetime.abort();stageView.dispose();battleView.dispose();frame.destroy();mainSettings?.dispose();}
 win.addEventListener('pagehide',event=>{if(!event.persisted){dispose();}else sound?.stop?.()},{signal:lifetime.signal});
 show();return Object.freeze({session,frame,show,openStages,dispose});
}
