/* Permanent content bindings only; all header/preferences presentation is shared. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('gameFrame'), main = $('mainScreen');
  // One-time Main/guide sibling normalization, before game boot and first paint.
  root.after($('gameGuide'));
  const battle = $('battleScreen').querySelector('.battle-canvas');
  const mainHeader = main.querySelector('header'), battleHeader = battle.querySelector('header');
  const locale = $('localeSelect');
  // Keep legacy sound/locale listener identities, but never expose two panels.
  const legacy = mainHeader.querySelector('.header-utilities');
  legacy.hidden = true;
  root.append(legacy);
  $('soundToggleBattle').hidden = true;
  legacy.append($('soundToggleBattle'));
  const hero = main.querySelector('.main-hero');
  hero.className = 'klondike-main-content';
  hero.querySelector('.feature-list').remove();
  hero.querySelector('.poster-frame').dataset.wpFramePoster = '';
  const copy = hero.querySelector('.main-copy');
  copy.className = 'klondike-main-copy';
  copy.dataset.wpFrameCopy = '';
  copy.querySelector('h1').hidden = true;
  copy.querySelector('small').hidden = true;
  $('menuHint').dataset.wpFrameSummary = '';
  // Statistics remain reachable below the primary entry; not an extra Main dashboard.
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.dataset.i18n = 'noteTitle';
  details.append(summary, $('statistics'), $('restartBtn'), $('newGameBtn'));
  copy.append(details);
  $('mainProgress').hidden = true; // This game has deals, not authored levels.
  for (const id of ['startBtn','resultNewGame']) $(id).dataset.wpFrameAction = 'primary';
  for (const id of ['restartBtn','newGameBtn','resultRestart','resultClose','undoBtn','hintBtn','autoFinishBtn','drawModeBtn']) $(id).dataset.wpFrameAction = 'secondary';
  mainHeader.querySelector('strong').dataset.wpFrameTitle = '';
  const battleTitle = document.createElement('strong');
  battleTitle.dataset.wpFrameTitle = '';
  battleTitle.hidden = true;
  battleHeader.append(battleTitle);
  const board = battle.querySelector('.board-shell');
  const info = document.createElement('div');
  info.dataset.wpFrameInfo = '';
  info.append(...battleHeader.querySelectorAll('.header-stat'));
  // Shared info styles use label spans; existing live-value IDs are preserved.
  info.querySelectorAll('small').forEach(label => {
    const span = document.createElement('span');
    for (const attr of label.attributes) span.setAttribute(attr.name, attr.value);
    span.textContent = label.textContent;
    label.replaceWith(span);
  });
  board.prepend(info);
  board.querySelector('.control-row').prepend($('drawModeBtn'));
  const frame = WeightPlayScreenFrame.mount({root, localeSelect: locale, scenes: {
    main: {root: main, header: mainHeader, content: hero},
    battle: {root: battle, header: battleHeader, content: board, headerInfo: info},
  }});
  const refreshCopy = () => {
    const code = document.documentElement.lang;
    const strings = window.KLONDikeGuideLocales[code] || window.KLONDikeGuideLocales.en;
    document.querySelectorAll('[data-i18n]').forEach(node => {
      if (strings[node.dataset.i18n]) node.textContent = strings[node.dataset.i18n];
    });
  };
  const sync = () => {
    const scene = document.body.dataset.screen === 'battle' ? 'battle' : 'main';
    const covered = scene === 'battle' && !$('resultOverlay').hidden;
    $('gameGuide').hidden = scene !== 'main';
    board.inert = scene !== 'battle' || covered;
    frame.activate(scene, {covered});
    refreshCopy();
  };
  window.KlondikeFrame = {sync};
  const abort = new AbortController();
  for (const type of ['wonder:locale-change','weightplay:locale-change']) window.addEventListener(type, () => queueMicrotask(refreshCopy), {signal:abort.signal});
  window.addEventListener('pagehide', event => {
    if (!event.persisted) {abort.abort();frame.destroy();delete window.KlondikeFrame;}
  }, {signal:abort.signal});
  sync();
})();
