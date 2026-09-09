import '../../src/stage-virtualization-standard.js';
import {MAHJONG_CAMPAIGN} from './campaign-stages.mjs';
import {campaignCopy} from './campaign-copy.mjs';
import {mahjongStageName} from './campaign-names.mjs';
import {createFaceElement} from './campaign-faces.mjs';

// Data binding only: the shared controller exclusively owns drag, recycling,
// keyboard focus and activation. Progress remains owned by the campaign app.
export function createCampaignStageView({locale,progress,activate,home,settings}) {
 const root=document.createElement('section');root.className='mjc-stage';root.hidden=true;root.dataset.screen='stage';
 root.innerHTML='<div class="mjc-stage-canvas" data-wp-standard-stage-screen><div class="mjc-stage-logical"><header><button type="button" data-wp-return="stage">←</button><h2></h2><span></span></header><div class="mjc-stage-workspace"><div class="mjc-stage-rail stage-rail" data-wp-stage-selector></div></div><nav class="mjc-stage-tabs"><span></span><button type="button" aria-current="page"></button><span></span></nav></div></div><div class="mjc-stage-reserve" data-wp-stage-physical-reserve aria-hidden="true"></div>';
 if(settings)root.querySelector('header>span').append(settings.root);
 const canvas=root.querySelector('.mjc-stage-canvas'),logical=root.querySelector('.mjc-stage-logical'),rail=root.querySelector('.mjc-stage-rail');
 const lifetime=new AbortController();let controller,disposed=false;
 root.querySelector('header button').addEventListener('click',home,{signal:lifetime.signal});
 root.querySelector('nav button').addEventListener('click',()=>controller?.center(progress().unlocked-1),{signal:lifetime.signal});
 function fit(){
  if(disposed||root.hidden)return;
  const height=Math.max(1,(window.visualViewport?.height||innerHeight)-56),width=Math.min(920,document.documentElement.clientWidth);
  const wide=width>=680&&width>height*1.3,scale=Math.min(width/(wide?740:390),height/(wide?354:520));
  canvas.style.height=height+'px';canvas.style.setProperty('--wp-stage-canvas-scale',String(scale));
  logical.style.width=width/scale+'px';logical.style.height=height/scale+'px';logical.style.transform=`scale(${scale})`;
  controller?.center();
 }
 function bind(card,index){
  const stage=MAHJONG_CAMPAIGN[index],p=progress(),c=campaignCopy(locale()),locked=stage.id>p.unlocked;
  card.className='mjc-stage-card stage-card';card.dataset.stage=String(stage.id);card.dir=locale()==='ar'?'rtl':'ltr';
  card.setAttribute('aria-disabled',String(locked));card.replaceChildren();
  const number=document.createElement('span');number.textContent=`${c.stage} ${stage.id} / ${MAHJONG_CAMPAIGN.length}`;
  const preview=document.createElement('span');preview.className='mjc-stage-preview';preview.setAttribute('aria-hidden','true');
  const faces=[...new Set(stage.definition.tiles.map(t=>t.face))].slice(0,3);
  for(const face of faces)preview.append(createFaceElement(face));
  const name=document.createElement('strong');name.textContent=mahjongStageName(locale(),stage.id);
  const status=document.createElement('span');status.textContent=locked?c.locked:p.best[stage.id]?`${c.cleared} · ${'★'.repeat(p.best[stage.id].stars)}`:c.available;
  card.append(number,preview,name,status);
 }
 function refresh({resetSelection=false}={}){
  if(disposed)throw new Error('Stage view disposed');
  settings?.close();settings?.refresh();const c=campaignCopy(locale());root.querySelector('h2').textContent=c.stages;
  root.querySelector('header button').setAttribute('aria-label',c.back);root.querySelector('nav button').textContent=c.stages;
  fit();
  if(!controller)controller=window.WeightPlayStageV6.install(rail,{total:MAHJONG_CAMPAIGN.length,poolSize:9,bind,initialIndex:()=>progress().unlocked-1,activate:index=>{if(index+1<=progress().unlocked)activate(index+1);}});
  else {controller.refresh();if(resetSelection)controller.center(progress().unlocked-1);}
 }
 function dispose(){if(disposed)return;disposed=true;lifetime.abort();controller?.destroy();settings?.dispose();root.remove();}
 window.addEventListener('resize',fit,{signal:lifetime.signal});window.visualViewport?.addEventListener('resize',fit,{signal:lifetime.signal});
 window.addEventListener('pagehide',dispose,{once:true,signal:lifetime.signal});
 return {root,refresh,dispose};
}
