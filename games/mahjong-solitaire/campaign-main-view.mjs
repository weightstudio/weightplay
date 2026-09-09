import {campaignCopy} from './campaign-copy.mjs';
import {mahjongMainCopy} from './campaign-main-copy.mjs';
import {createFaceElement} from './campaign-faces.mjs';

// The settings component is supplied by the owning entry; this view does not
// create an independent audio preference or a second language controller.
export function createCampaignMainView({locale,title,lobbyHref,progress,settings}) {
 const root=document.createElement('main');root.className='mjc-main';
 root.innerHTML='<header><a data-wp-return="main"><span aria-hidden="true">←</span><img alt="" draggable="false"></a><h1 data-runtime-localize="off"></h1><div class="mjc-main-settings"></div></header><div class="mjc-main-content"><img class="mjc-main-poster" width="1254" height="1254" alt=""><div class="mjc-main-copy"><p class="mjc-main-summary"></p><p class="mjc-main-progress"></p><button type="button" data-wp-main-start="true"></button></div></div>';
 root.querySelector('a img').src=new URL('../../assets/weightplay-logo.png',import.meta.url).href;
 root.querySelector('.mjc-main-poster').src=new URL('../../assets/mahjong-solitaire-cover-v1.webp',import.meta.url).href;
 if(settings)root.querySelector('.mjc-main-settings').append(settings);
 const guide=document.createElement('section');guide.className='mjc-guide';guide.dataset.wpGameGuide='';
 const startButton=root.querySelector('[data-wp-main-start]');
 function refresh(){
  const l=locale(),c=campaignCopy(l),m=mahjongMainCopy(l);root.dir=guide.dir=l==='ar'?'rtl':'ltr';
  root.querySelector('h1').textContent=title(l);root.querySelector('a').href=lobbyHref(l);root.querySelector('a').setAttribute('aria-label',`${c.back} · WeightPlay`);
  root.querySelector('.mjc-main-summary').textContent=c.goal;root.querySelector('.mjc-main-progress').textContent=`${c.stage} ${progress().unlocked} / 30`;startButton.textContent=m.startGame;
  guide.setAttribute('aria-label',m.guide);guide.replaceChildren();const heading=document.createElement('h2');heading.textContent=m.guide;guide.append(heading);
  for(const [label,copy,face] of [[m.guide,c.rule,'A'],[c.keys,c.sealRule,'B'],[c.order,c.orderRule,'C'],[c.stars,m.starsRule,'O'],[c.stages,m.progression,'D']]){
   const card=document.createElement('section'),h=document.createElement('h3'),p=document.createElement('p');h.textContent=label;p.textContent=copy;card.append(createFaceElement(face),h,p);guide.append(card);
  }
 }
 refresh();return {root,guide,startButton,refresh,dispose(){root.remove();guide.remove()}};
}
