/* Opt-in presentation only: never changes a card, rule, save or action. */
(function () {
  'use strict';
  const positions = {
    1: [[50,50]], 2: [[50,18],[50,82]], 3: [[50,18],[50,50],[50,82]],
    4: [[24,18],[76,18],[24,82],[76,82]],
    5: [[24,18],[76,18],[50,50],[24,82],[76,82]],
    6: [[24,18],[76,18],[24,50],[76,50],[24,82],[76,82]],
    7: [[24,18],[76,18],[50,34],[24,50],[76,50],[24,82],[76,82]],
    8: [[24,18],[76,18],[50,34],[24,50],[76,50],[50,66],[24,82],[76,82]],
    9: [[24,12],[76,12],[24,37],[76,37],[50,50],[24,63],[76,63],[24,88],[76,88]],
    10: [[24,12],[76,12],[50,26],[24,37],[76,37],[24,63],[76,63],[50,74],[24,88],[76,88]],
  };
  function decorateCard(card, rank, suit, cornerSelector = '.rank') {
      if (!card || !rank || !['♠','♥','♣','♦'].includes(suit)) return;
      // Pooled renderers may replace children while retaining the element.
      card.querySelectorAll(':scope > .deck-center').forEach(node => node.remove());
      card.dataset.deckRank = rank;
      card.querySelectorAll(cornerSelector).forEach(corner => {
        corner.setAttribute('aria-hidden', 'true');
        corner.dataset.suit = suit;
      });
      const center = document.createElement('span');
      center.className = 'deck-center';
      center.setAttribute('aria-hidden', 'true');
      center.dataset.runtimeLocalize = 'off';
      if (document.body.dataset.cardDeck === 'klondike') {
        const pip = document.createElement('span');
        pip.className = 'deck-pip'; pip.textContent = suit;
        center.append(pip);
      } else if (['J','Q','K'].includes(rank)) {
        center.classList.add('deck-court');
      } else {
        for (const [x,y] of positions[rank === 'A' ? 1 : Number(rank)] || []) {
          const pip = document.createElement('span');
          pip.className = 'deck-pip'; pip.textContent = suit;
          pip.style.left = `${x}%`; pip.style.top = `${y}%`;
          if (y > 50) pip.classList.add('inverted');
          center.append(pip);
        }
      }
      card.append(center);
  }
  function decorate(root) {
    root.querySelectorAll('.classic-card.front:not([data-deck-rank])').forEach(card => {
      decorateCard(card, card.querySelector('.rank.top')?.textContent.trim(),
        card.querySelector('.suit')?.textContent.trim());
    });
  }
  window.WPCardTablePresentation = Object.freeze({
    decorateCard,
    install(view) {
      if (!view || view.premiumTableInstalled) return;
      const root = document.getElementById('classicBoard');
      if (!root) return;
      view.premiumTableInstalled = true;
      document.body.classList.add('wp-premium-table');
      const render = view.render;
      view.render = function (...args) {
        const result = render.apply(this, args);
        decorate(root);
        return result;
      };
      decorate(root);
      // No observer, animation timer, global renderer or new input handler.
      // Existing render disposal removes decorative nodes with their cards.
    },
  });
})();
