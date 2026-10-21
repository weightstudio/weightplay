import {campaignCopy} from './campaign-copy.mjs';
import {mahjongStageName} from './campaign-names.mjs';

// Battle-owned settlement; no independent scene, scoring or storage writer.
export function createCampaignResultView({locale,stages,next,replay}) {
 const root=document.createElement('section');root.className='mjc-result';root.hidden=true;
 root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','mjcResultTitle');root.setAttribute('aria-describedby','mjcResultDescription');
 root.innerHTML='<div class="mjc-result-content" data-wp-frame-result-card><div class="mjc-result-medal" aria-hidden="true">✦</div><h2 id="mjcResultTitle"></h2><p class="mjc-result-stage" id="mjcResultDescription"></p><div class="mjc-result-stars"></div><dl></dl><p class="mjc-result-storage"></p></div><div class="mjc-result-actions"><button type="button" data-wp-frame-action="secondary"></button><button type="button" data-wp-frame-action="primary" data-wp-primary-action></button><button type="button" data-wp-frame-action="secondary"></button></div>';
 const buttons=[...root.querySelectorAll('button')],lifetime=new AbortController();let disposed=false,wasComplete=false;
 for(const [i,action] of [stages,next,replay].entries())buttons[i].addEventListener('click',action,{signal:lifetime.signal});
 root.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const available=buttons.filter(button=>!button.disabled&&!button.hidden);
  if(!available.length)return;
  const first=available[0],last=available[available.length-1],active=root.ownerDocument.activeElement;
  if(event.shiftKey&&active===first){event.preventDefault();last.focus({preventScroll:true});}
  else if(!event.shiftKey&&active===last){event.preventDefault();first.focus({preventScroll:true});}
  else if(!root.contains(active)){event.preventDefault();first.focus({preventScroll:true});}
 },{signal:lifetime.signal});
 function render(state){
  if(disposed)throw new Error('Result view disposed');
  const complete=state.screen==='battle'&&state.outcome==='complete',entering=complete&&!wasComplete;wasComplete=complete;root.hidden=!complete;if(!complete)return;
  const c=campaignCopy(locale());root.dir=locale()==='ar'?'rtl':'ltr';root.setAttribute('aria-label',c.won);
  root.querySelector('h2').textContent=c.won;root.querySelector('.mjc-result-stage').textContent=`${c.stage} ${state.stage} · ${mahjongStageName(locale(),state.stage)}`;
  const stars=root.querySelector('.mjc-result-stars');stars.textContent='★'.repeat(state.stars)+'☆'.repeat(3-state.stars);stars.setAttribute('aria-label',`${c.stars}: ${state.stars} / 3`);
  const stats=root.querySelector('dl');stats.replaceChildren();
  for(const [label,value] of [[c.hints,state.hints],[c.undos,state.undos]]){const pair=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=String(value);pair.append(dt,dd);stats.append(pair);}
  root.querySelector('.mjc-result-storage').textContent=state.persistent?'':c.storage;
  for(const [i,label] of [c.stages,c.next,c.replay].entries())buttons[i].textContent=label;
  buttons[1].disabled=!state.canNext;
  // The last tile disappears at settlement. Transfer keyboard focus once to
  // a usable continuation, never leave it on the hidden board or disabled Next.
  if(entering)buttons[state.canNext?1:2].focus({preventScroll:true});
 }
 function dispose(){if(disposed)return;disposed=true;lifetime.abort();root.remove();}
 return {root,render,dispose};
}
