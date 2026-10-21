import {MAHJONG_CAMPAIGN} from './campaign-stages.mjs';
import {campaignCopy} from './campaign-copy.mjs';
import {mahjongStageName} from './campaign-names.mjs';

// Mahjong supplies stage records and state; the shared Play UI owns card DOM,
// layout, pooling, drag, snap and activation.
export function createCampaignStageView({locale,progress,activate,home}) {
 const root=document.createElement('section');root.className='mjc-stage';root.hidden=true;root.dataset.screen='stage';
 root.innerHTML='<header><button type="button" data-wp-return="stage"><span aria-hidden="true">←</span></button><h2 data-wp-frame-title></h2></header><div class="mjc-stage-workspace"><div id="mjcStageRail" class="mjc-stage-rail"></div></div><nav class="mjc-stage-tabs" data-wp-frame-nav data-wp-frame-stage-nav role="tablist"><button id="mjc-stage-stages-tab" type="button" role="tab" data-wp-frame-stage-slot="stages" data-wp-frame-action="tab" aria-selected="true"></button></nav>';
 const header=root.querySelector('header'),workspace=root.querySelector('.mjc-stage-workspace'),rail=root.querySelector('.mjc-stage-rail'),frameTitle=root.querySelector('[data-wp-frame-title]'),stagesTab=root.querySelector('#mjc-stage-stages-tab');
 const lifetime=new AbortController();let controller,selected=Math.max(0,progress().unlocked-1),disposed=false;
 const config={gameId:'mahjong-solitaire',count:MAHJONG_CAMPAIGN.length,poster:'/assets/mahjong-solitaire-cover-v1.webp',background:'/assets/lobby-block-atmosphere.svg',stage(index){
  const stage=MAHJONG_CAMPAIGN[index],p=progress(),c=campaignCopy(locale());
  const locked=stage.id>p.unlocked,best=p.best[stage.id];
  return {id:stage.id,kicker:`${c.stage} ${stage.id} / ${MAHJONG_CAMPAIGN.length}`,title:mahjongStageName(locale(),stage.id),subtitle:'',status:locked?c.locked:best?`${c.cleared} · ${'★'.repeat(best.stars)}`:c.available,summary:c.goal,details:[c.rule,c.sealRule,c.orderRule],poster:'/assets/mahjong-solitaire-cover-v1.webp',locked,cleared:Boolean(best)};
 }};
 function refreshLabels(){
  const label=campaignCopy(locale()).stages;
  frameTitle.textContent=label;
  stagesTab.textContent=label;stagesTab.setAttribute('aria-label',label);
  stagesTab.parentElement.setAttribute('aria-label',label);
 }
 header.querySelector('[data-wp-return="stage"]').addEventListener('click',home,{signal:lifetime.signal});
 function refresh(){
  if(disposed)throw new Error('Stage view disposed');
  refreshLabels();
  if(!controller){
   if(!window.WeightPlayPlayUI?.mountStage)throw new Error('SHARED_PLAY_UI_REQUIRED');
   controller=window.WeightPlayPlayUI.mountStage({page:workspace,rail,config,selected,isActive:()=>!root.hidden&&document.body.dataset.screen==='stage',onSelect(index){selected=index;},onStart(index){selected=index;if(index+1<=progress().unlocked)activate(index+1);}});
  }else controller.refresh(selected);
 }
 function dispose(){if(disposed)return;disposed=true;lifetime.abort();controller?.destroy();root.remove();}
 window.addEventListener('pagehide',event=>{if(!event.persisted)dispose()},{signal:lifetime.signal});
 return {root,header,workspace,rail,refresh,dispose,get selected(){return selected;}};
}
