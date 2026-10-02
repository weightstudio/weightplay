// Presentation only. Never inspect hidden ranks or replace blind-draw controls.
(function () {
  'use strict';
  const hand=document.getElementById('cardGameHand');
  if(!hand||!window.WPCardTablePresentation)return;
  document.body.classList.add('wp-premium-table','old-maid-royal-table');
  document.body.dataset.gameVersion='v29';
  document.body.dataset.cardDeck='klondike';
  let previous=new Set();
  const score=document.getElementById('cardGameScore');
  let scoreValue=score?.textContent;
  let scoreTimer=0;
  const scoreObserver=score?new MutationObserver(()=>{
    const next=score.textContent;
    if(next===scoreValue)return;
    scoreValue=next;
    score.classList.remove('old-maid-score-pop');
    void score.offsetWidth;
    score.classList.add('old-maid-score-pop');
    clearTimeout(scoreTimer);
    scoreTimer=setTimeout(()=>score.classList.remove('old-maid-score-pop'),560);
  }):null;
  scoreObserver?.observe(score,{childList:true,characterData:true,subtree:true});
  function decorate(){
    const cards=[...hand.querySelectorAll('.playing-card')];
    const current=new Set(cards.map(card=>card.getAttribute('aria-label')));
    cards.filter(card=>!card.dataset.deckRank).forEach(card=>{
      const match=card.textContent.trim().match(/^(A|[2-9]|10|J|Q|K)([♠♥♣♦])$/u);
      if(!match)return;
      const [,rank,suit]=match;
      card.classList.add('classic-card','front');
      if(previous.size&&!previous.has(card.getAttribute('aria-label')))card.classList.add('old-maid-arrival');
      card.replaceChildren(...['top','bottom'].map(position=>{
        const corner=document.createElement('span');corner.className='rank '+position;corner.textContent=rank;return corner;
      }));
      window.WPCardTablePresentation.decorateCard(card,rank,suit);
    });
    previous=current;
  }
  const observer=new MutationObserver(decorate);
  function connect(){observer.observe(hand,{childList:true});decorate();}
  window.addEventListener('pagehide',()=>{observer.disconnect();scoreObserver?.disconnect();clearTimeout(scoreTimer);});
  window.addEventListener('pageshow',event=>{if(event.persisted)connect();});
  connect();
})();
