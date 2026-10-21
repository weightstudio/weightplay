import {MAHJONG_CAMPAIGN} from './campaign-stages.mjs';
import {campaignCopy} from './campaign-copy.mjs';
import {mahjongMainCopy} from './campaign-main-copy.mjs?v=20261021-mahjong-v16-i9';
import {mahjongStageName} from './campaign-names.mjs';

// Mahjong supplies stage records and state; the shared Play UI owns card DOM,
// layout, pooling, drag, snap and activation.
export function createCampaignStageView({locale,progress,activate,home}) {
 const root=document.createElement('section');root.className='mjc-stage';root.hidden=true;root.dataset.screen='stage';
 root.innerHTML='<header><button type="button" data-wp-return="stage"><span aria-hidden="true">←</span></button><h2 data-wp-frame-title></h2></header><div class="mjc-stage-workspace"><div id="mjcStageRail" class="mjc-stage-rail"></div></div><nav data-wp-frame-nav><button type="button" data-wp-frame-action="primary" data-wp-primary-action></button></nav>';
 const header=root.querySelector('header'),workspace=root.querySelector('.mjc-stage-workspace'),rail=root.querySelector('.mjc-stage-rail'),startButton=root.querySelector('nav button');
 const lifetime=new AbortController();let controller,selected=Math.max(0,progress().unlocked-1),disposed=false;
 const config={gameId:'mahjong-solitaire',count:MAHJONG_CAMPAIGN.length,poster:'/assets/mahjong-solitaire-cover-v1.webp',background:'/assets/lobby-block-atmosphere.svg',stage(index){
  const stage=MAHJONG_CAMPAIGN[index],p=progress(),c=campaignCopy(locale());
  const locked=stage.id>p.unlocked,best=p.best[stage.id];
  return {id:stage.id,kicker:`${c.stage} ${stage.id} / ${MAHJONG_CAMPAIGN.length}`,title:mahjongStageName(locale(),stage.id),subtitle:'',status:locked?c.locked:best?`${c.cleared} · ${'★'.repeat(best.stars)}`:c.available,summary:c.goal,details:[c.rule,c.sealRule,c.orderRule],poster:'/assets/mahjong-solitaire-cover-v1.webp',locked,cleared:Boolean(best)};
 }};
 function refreshAction(){
  const c=campaignCopy(locale()),locked=selected+1>progress().unlocked;
  startButton.textContent=mahjongMainCopy(locale()).startGame;startButton.disabled=locked;
  startButton.setAttribute('aria-label',`${c.start} · ${mahjongStageName(locale(),selected+1)}`);
 }
 function startSelected(){if(selected+1<=progress().unlocked)activate(selected+1);}
 header.querySelector('[data-wp-return="stage"]').addEventListener('click',home,{signal:lifetime.signal});
 startButton.addEventListener('click',startSelected,{signal:lifetime.signal});
 function refresh(){
  if(disposed)throw new Error('Stage view disposed');
  refreshAction();
  if(!controller){
   if(!window.WeightPlayPlayUI?.mountStage)throw new Error('SHARED_PLAY_UI_REQUIRED');
   controller=window.WeightPlayPlayUI.mountStage({page:workspace,rail,config,selected,isActive:()=>!root.hidden&&document.body.dataset.screen==='stage',onSelect(index){selected=index;refreshAction();},onStart(index){selected=index;if(index+1<=progress().unlocked)activate(index+1);}});
  }else controller.refresh(selected);
  refreshAction();
 }
 function dispose(){if(disposed)return;disposed=true;lifetime.abort();controller?.destroy();root.remove();}
 window.addEventListener('pagehide',event=>{if(!event.persisted)dispose()},{signal:lifetime.signal});
 return {root,header,workspace,rail,refresh,dispose,get selected(){return selected;}};
}
