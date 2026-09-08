// Game-owned presentation adapter. Native rules, indices, labels and handlers survive.
(function () {
  'use strict';
  const roots=['cardGameHand','cardGameCenter'].map(id=>document.getElementById(id)).filter(Boolean);
  if(roots.length!==2||!window.WPCardTablePresentation)return;
  document.body.classList.add('wp-premium-table','casino-royal-table');
  document.body.dataset.gameVersion='v22';
  const signatures=new WeakMap();
  function decorate(root) {
    const signature=[...root.querySelectorAll('.playing-card')].map(card=>card.getAttribute('aria-label')).join('|');
    const previous=signatures.get(root);
    const changed=previous!==undefined&&previous!==signature;
    const priorLabels=new Set((previous||'').split('|'));
    signatures.set(root,signature);
    root.querySelectorAll('.playing-card:not([data-deck-rank]):not(.is-face-down)').forEach(card=>{
      const match=card.textContent.trim().match(/^(A|[2-9]|10|J|Q|K)([♠♥♣♦])$/u);
      if(!match)return; // Unknown/localized content is preserved, never guessed.
      const [,rank,suit]=match;
      card.classList.add('classic-card','front');
      if(changed&&!priorLabels.has(card.getAttribute('aria-label')))card.classList.add('casino-card-arrival');
      const corners=['top','bottom'].map(position=>{
        const node=document.createElement('span');node.className='rank '+position;node.textContent=rank;return node;
      });
      card.replaceChildren(...corners);
      window.WPCardTablePresentation.decorateCard(card,rank,suit);
    });
  }
  // The existing engine replaces these two roots on its native render cycle.
  // Observe their direct child lists only, not card descendants or the document.
  // Decorative writes therefore never retrigger the observer. No extra polling.
  const observers=roots.map(root=>new MutationObserver(()=>decorate(root)));
  function connect(){roots.forEach((root,i)=>{observers[i].observe(root,{childList:true});decorate(root);});}
  function disconnect(){observers.forEach(observer=>observer.disconnect());}
  window.addEventListener('pagehide',disconnect);
  window.addEventListener('pageshow',event=>{if(event.persisted)connect();});
  connect();
})();
