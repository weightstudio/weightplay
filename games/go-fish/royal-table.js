// Game-owned presentation adapter. Native rules, indices, labels and handlers survive.
(function () {
  'use strict';
  const roots=['cardGameHand','cardGameCenter'].map(id=>document.getElementById(id)).filter(Boolean);
  if(roots.length!==2||!window.WPCardTablePresentation)return;
  document.body.classList.add('wp-premium-table','go-fish-royal-table');
  document.body.dataset.gameVersion='v28';
  document.body.dataset.cardDeck='klondike';
  const signatures=new WeakMap();
  const hand=roots[0];
  const header=hand.parentElement.querySelector('.card-game-player-header');
  const handLabel=header.querySelector('strong');
  handLabel.id='goFishHandLabel';
  hand.tabIndex=0;
  hand.setAttribute('role','group');
  hand.setAttribute('aria-labelledby',handLabel.id);
  hand.addEventListener('keydown',event=>{
    if(event.target!==hand||!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();
    hand.scrollBy({left:(event.key==='ArrowRight'?1:-1)*Math.max(44,hand.clientWidth*.75),behavior:'auto'});
  });
  const scrollCopy={
    en:['Scroll hand left','Scroll hand right'],
    'zh-Hant':['向左捲動手牌','向右捲動手牌'],
    'zh-Hans':['向左滚动手牌','向右滚动手牌'],
    ja:['手札を左にスクロール','手札を右にスクロール'],
    ko:['패를 왼쪽으로 스크롤','패를 오른쪽으로 스크롤'],
    es:['Desplazar cartas a la izquierda','Desplazar cartas a la derecha'],
    'pt-BR':['Rolar cartas para a esquerda','Rolar cartas para a direita'],
    fr:['Faire défiler la main vers la gauche','Faire défiler la main vers la droite'],
    de:['Handkarten nach links scrollen','Handkarten nach rechts scrollen'],
    it:['Scorri le carte a sinistra','Scorri le carte a destra'],
    ru:['Прокрутить карты влево','Прокрутить карты вправо'],
    hi:['हाथ के पत्ते बाईं ओर स्क्रॉल करें','हाथ के पत्ते दाईं ओर स्क्रॉल करें'],
    ar:['تمرير بطاقات اليد إلى اليسار','تمرير بطاقات اليد إلى اليمين'],
  };
  const nav=document.createElement('div');
  nav.dataset.goFishHandScroll='';
  nav.className='go-fish-hand-scroll';
  nav.dataset.runtimeLocalize='off';
  const arrows=['left','right'].map((direction,index)=>{
    const button=document.createElement('button');
    button.type='button';button.dataset.direction=direction;
    button.setAttribute('aria-controls',hand.id);
    button.textContent=index?'›':'‹';
    button.disabled=true;
    button.addEventListener('click',()=>hand.scrollBy({left:(index?1:-1)*Math.max(44,hand.clientWidth*.75),behavior:'auto'}));
    nav.append(button);return button;
  });
  header.append(nav);
  // Preserve the player's view when the native renderer replaces card nodes.
  // New deals reset explicitly; selection never scrolls or moves focus to a rank control.
  let rememberedScroll=0,focusedCardLabel=null,resetHandView=false;
  function syncHandScroll(){
    const locale=window.WonderI18n?.actualLocale?.()||document.documentElement.lang;
    const labels=scrollCopy[locale]||scrollCopy.en;
    const max=Math.max(0,hand.scrollWidth-hand.clientWidth);
    const overflow=hand.clientWidth>0&&max>1;
    const offset=Math.min(max,Math.max(0,getComputedStyle(hand).direction==='rtl'?max+hand.scrollLeft:hand.scrollLeft));
    nav.dataset.hasOverflow=String(overflow);
    arrows.forEach((button,index)=>{
      const wasFocused=document.activeElement===button;
      button.setAttribute('aria-label',labels[index]);
      button.disabled=!overflow||(index?offset>=max-1:offset<=1);
      if(wasFocused&&button.disabled&&hand.clientWidth>0)hand.focus({preventScroll:true});
    });
  }
  hand.addEventListener('scroll',()=>{rememberedScroll=hand.scrollLeft;syncHandScroll();},{passive:true});
  document.addEventListener('focusin',event=>{
    focusedCardLabel=event.target.closest?.('#cardGameHand .playing-card')?.getAttribute('aria-label')||null;
  });
  document.addEventListener('click',event=>{
    if(event.target.closest?.('#startBtn,#restartBtn,#newGameBtn,#resultNewGame,#resultRestart,#battleRestartBtn,#battleNewBtn,[data-action="players"]')){
      resetHandView=true;rememberedScroll=0;focusedCardLabel=null;
    }else if(event.target.closest?.('#cardGameHand .playing-card')){
      rememberedScroll=hand.scrollLeft;
    }
  },true);
  window.addEventListener('wonder:locale-change',syncHandScroll);
  const handResize=new ResizeObserver(syncHandScroll);
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
      if(changed&&!priorLabels.has(card.getAttribute('aria-label')))card.classList.add('go-fish-card-arrival');
      const corners=['top','bottom'].map(position=>{
        const node=document.createElement('span');node.className='rank '+position;node.textContent=rank;return node;
      });
      card.replaceChildren(...corners);
      window.WPCardTablePresentation.decorateCard(card,rank,suit);
    });
    if(root===hand){
      if(resetHandView||previous===signature)hand.scrollLeft=resetHandView?0:rememberedScroll;
      resetHandView=false;
      if(previous===signature&&focusedCardLabel&&document.activeElement===document.body){
        [...hand.querySelectorAll('.playing-card')].find(card=>card.getAttribute('aria-label')===focusedCardLabel)?.focus({preventScroll:true});
      }
      syncHandScroll();
    }
  }
  // The existing engine replaces these two roots on its native render cycle.
  // Observe their direct child lists only, not card descendants or the document.
  // Decorative writes therefore never retrigger the observer. No extra polling.
  const observers=roots.map(root=>new MutationObserver(()=>decorate(root)));
  function connect(){roots.forEach((root,i)=>{observers[i].observe(root,{childList:true});decorate(root);});handResize.observe(hand);}
  function disconnect(){observers.forEach(observer=>observer.disconnect());handResize.disconnect();}
  window.addEventListener('pagehide',disconnect);
  window.addEventListener('pageshow',event=>{if(event.persisted)connect();});
  connect();
})();
