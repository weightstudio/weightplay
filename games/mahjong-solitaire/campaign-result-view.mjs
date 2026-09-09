import {campaignCopy} from './campaign-copy.mjs';
import {mahjongStageName} from './campaign-names.mjs';

// Battle-owned settlement; no independent scene, scoring or storage writer.
export function createCampaignResultView({locale,stages,next,replay}) {
 const root=document.createElement('section');root.className='mjc-result';root.hidden=true;
 root.setAttribute('role','region');root.setAttribute('aria-live','polite');
 root.innerHTML='<div class="mjc-result-content"><div class="mjc-result-medal" aria-hidden="true">✦</div><h2></h2><p class="mjc-result-stage"></p><div class="mjc-result-stars"></div><dl></dl><p class="mjc-result-storage"></p></div><div class="mjc-result-actions"><button type="button"></button><button type="button"></button><button type="button"></button></div>';
 const buttons=[...root.querySelectorAll('button')],lifetime=new AbortController();let disposed=false;
 for(const [i,action] of [stages,next,replay].entries())buttons[i].addEventListener('click',action,{signal:lifetime.signal});
 function render(state){
  if(disposed)throw new Error('Result view disposed');
  const complete=state.screen==='battle'&&state.outcome==='complete';root.hidden=!complete;if(!complete)return;
  const c=campaignCopy(locale());root.dir=locale()==='ar'?'rtl':'ltr';root.setAttribute('aria-label',c.won);
  root.querySelector('h2').textContent=c.won;root.querySelector('.mjc-result-stage').textContent=`${c.stage} ${state.stage} · ${mahjongStageName(locale(),state.stage)}`;
  const stars=root.querySelector('.mjc-result-stars');stars.textContent='★'.repeat(state.stars)+'☆'.repeat(3-state.stars);stars.setAttribute('aria-label',`${c.stars}: ${state.stars} / 3`);
  const stats=root.querySelector('dl');stats.replaceChildren();
  for(const [label,value] of [[c.hints,state.hints],[c.undos,state.undos]]){const pair=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=String(value);pair.append(dt,dd);stats.append(pair);}
  root.querySelector('.mjc-result-storage').textContent=state.persistent?'':c.storage;
  for(const [i,label] of [c.stages,c.next,c.replay].entries())buttons[i].textContent=label;
  buttons[1].disabled=!state.canNext;
 }
 function dispose(){if(disposed)return;disposed=true;lifetime.abort();root.remove();}
 return {root,render,dispose};
}
