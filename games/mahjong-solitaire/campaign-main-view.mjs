import {CAMPAIGN_LOCALES,campaignCopy} from './campaign-copy.mjs?v=20261010-mahjong-order-availability-v1';
import {mahjongMainCopy,mahjongMainTags} from './campaign-main-copy.mjs?v=20261021-mahjong-v16-i9';
import {createFaceElement} from './campaign-faces.mjs';

// The settings component is supplied by the owning entry; this view does not
// create an independent audio preference or a second language controller.
export function createCampaignMainView({locale,title,lobbyHref,progress}) {
 const root=document.createElement('main');root.className='mjc-main';root.id='mainScreen';
 root.innerHTML='<header><a data-wp-return="main"><span aria-hidden="true">←</span><img alt="" draggable="false"></a><h1 data-wp-frame-title data-runtime-localize="off"></h1></header><div class="mjc-main-page-content"><img class="mjc-main-poster" data-wp-frame-poster width="1254" height="1254" alt=""><div class="mjc-main-copy" data-wp-frame-copy><p class="mjc-main-summary" data-wp-frame-summary></p><p class="mjc-main-progress" data-wp-frame-progress data-wp-main-progress></p><button type="button" data-wp-main-start="true" data-wp-frame-action="primary" data-wp-primary-action></button></div></div>';
 root.querySelector('.mjc-main-poster').classList.add('main-poster');
 root.querySelector('.mjc-main-summary').classList.add('main-summary');
 root.querySelector('a img').src=new URL('../../assets/weightplay-logo.png',import.meta.url).href;
 root.querySelector('.mjc-main-poster').src=new URL('../../assets/mahjong-solitaire-cover-v1.webp',import.meta.url).href;
 const guide=document.createElement('section');guide.className='mjc-guide game-page-info';guide.dataset.wpGameGuide='';
 root.append(guide);
 const startButton=root.querySelector('[data-wp-main-start]');
 const segments=['en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar'];
 const relatedIds=['klondike-solitaire','spider-solitaire'];
 const relatedImage={
  'klondike-solitaire':'/assets/lobby-thumbs/w480/assets__klondike-solitaire-cover.webp',
  'spider-solitaire':'/assets/lobby-thumbs/w480/assets__spider-solitaire-cover.webp',
 };
 function relatedGameTitle(id,l){
  const record=window.WEIGHTPLAY_GAME_TITLES?.[id];
  return record?.[l]||record?.en||id;
 }
 function refresh(){
  const l=locale(),c=campaignCopy(l),m=mahjongMainCopy(l);root.dir=guide.dir=l==='ar'?'rtl':'ltr';
  root.querySelector('h1').textContent=title(l);root.querySelector('a').href=lobbyHref(l);root.querySelector('a').setAttribute('aria-label',`${c.back} · WeightPlay`);
  root.querySelector('.mjc-main-summary').textContent=c.goal;root.querySelector('.mjc-main-progress').textContent=`${c.stage} ${progress().unlocked} / 30`;startButton.textContent=m.startGame;
  guide.setAttribute('aria-label',m.guide);guide.replaceChildren();
  const tags=document.createElement('div');tags.className='game-info-tags';tags.dataset.wpGameplayTags='1.3.1';
  for(const label of mahjongMainTags(l)){const tag=document.createElement('span');tag.textContent=label;tags.append(tag);}
  const heading=document.createElement('h2');heading.textContent=m.guide;
  const sections=document.createElement('div');sections.className='game-info-sections';
  for(const [label,copy,face] of [[m.guide,c.rule,'A'],[c.keys,c.sealRule,'B'],[c.order,c.orderRule,'C'],[c.hint,m.hintRule,null],[c.stars,m.starsRule,'O'],[c.stages,m.progression,'D']]){
   const card=document.createElement('section'),h=document.createElement('h3'),p=document.createElement('p');card.className='game-info-section mjc-guide-section';h.textContent=label;p.textContent=copy;
   if(face)card.append(createFaceElement(face));else card.classList.add('mjc-guide-text-card');
   card.append(h,p);sections.append(card);
  }
  const related=document.createElement('section');related.className='game-info-section game-info-related-section';related.dataset.wpGuideRelatedInterface='9';
  const relatedHeading=document.createElement('h3');relatedHeading.textContent=m.heading;related.append(relatedHeading);
  const relatedCards=document.createElement('div');relatedCards.className='game-info-related';
  for(const id of relatedIds){
   const relatedTitle=relatedGameTitle(id,l),relatedDescription=m[id==='klondike-solitaire'?'klondike':'spider'];
   const card=document.createElement('a');card.className='game-info-related-card';card.dataset.gameId=id;card.href=`/${segments[CAMPAIGN_LOCALES.indexOf(l)]}/games/${id}/`;card.setAttribute('aria-label',`${relatedTitle}: ${relatedDescription}`);
   const poster=document.createElement('span');poster.className='game-info-related-poster';const image=document.createElement('img');image.src=relatedImage[id];image.alt=relatedTitle;image.width=320;image.height=320;image.loading='lazy';image.decoding='async';poster.append(image);
   const copy=document.createElement('span');copy.className='game-info-related-copy';const title=document.createElement('strong'),description=document.createElement('span');title.textContent=relatedTitle;title.dataset.runtimeLocalize='off';description.textContent=relatedDescription;copy.append(title,description);card.append(poster,copy);relatedCards.append(card);
  }
  related.append(relatedCards);sections.append(related);guide.replaceChildren(tags,heading,sections);
 }
 refresh();return {root,guide,startButton,refresh,dispose(){root.remove();guide.remove()}};
}
