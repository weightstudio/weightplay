/* Game-owned content bindings; shared core owns every header and preference. */
(() => {
  'use strict';
  window.installFreecellFrame = view => {
    // Localized generator may append the authored guide after game scripts.
    if (!document.querySelector('#gameGuide') && document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded',()=>window.installFreecellFrame(view),{once:true});
      return;
    }
    const $ = id => document.getElementById(id);
    const root = $('gameFrame'), main = $('mainScreen');
    const battle = $('battleScreen').querySelector('.battle-canvas');
    const header = main.querySelector('header'), battleHeader = battle.querySelector('header');
    const legacy = header.querySelector('.header-utilities');
    legacy.hidden = true;
    root.append(legacy);
    legacy.append($('soundToggleBattle'));
    const hero = main.querySelector('.main-hero');
    hero.className = 'freecell-main-content';
    hero.querySelector('.feature-list').hidden = true;
    const poster = hero.querySelector('.poster-frame');
    const image = poster.querySelector('img');
    image.className = '';
    image.dataset.wpFramePoster = '';
    image.src = '/assets/interface7-redrawn/freecell-solitaire.webp';
    poster.replaceWith(image);
    const guide = document.querySelector('.game-page-info-static');
    root.after(guide);
    const copy = hero.querySelector('.main-copy');
    copy.className = 'freecell-main-copy';
    copy.dataset.wpFrameCopy = '';
    copy.querySelector('h1').hidden = true;
    copy.querySelector('small').hidden = true;
    copy.querySelector('[data-copy="target"]').dataset.wpFrameSummary = '';
    const details = document.createElement('details');
    const detailsTitle = document.createElement('summary');
    detailsTitle.dataset.i18n = 'more';
    details.append(detailsTitle,$('statistics'),$('restartBtn'),$('newGameBtn'));
    copy.append(details);
    $('mainProgress').hidden = true;
    const refreshCopy = () => {
      const code = ({'zh-Hant':'zh-tw','zh-Hans':'zh-cn','pt-BR':'pt-br'}[view.locale] || view.locale || 'en');
      const strings = window.FREECELL_GUIDE_LOCALES[code] || window.FREECELL_GUIDE_LOCALES.en;
      for (const node of document.querySelectorAll('[data-i18n]')) {
        const text = strings[node.dataset.i18n];
        if (text) node.textContent = text;
      }
    };
    header.querySelector('strong').dataset.wpFrameTitle = '';
    header.querySelector('strong').dataset.i18n = 'guideTitle';
    const title = document.createElement('strong');
    title.dataset.wpFrameTitle = '';
    title.hidden = true;
    battleHeader.append(title);
    const info = document.createElement('div');
    info.dataset.wpFrameInfo = '';
    info.append(...battleHeader.querySelectorAll('.header-stat'));
    info.querySelectorAll('small').forEach((label,index) => {
      const span = document.createElement('span');
      span.dataset.label = ['moves','score','combo'][index];
      span.textContent = label.textContent;
      label.replaceWith(span);
    });
    const board = $('classicBoard');
    board.prepend(info);
    for (const id of ['startBtn','resultNewGame']) $(id).dataset.wpFrameAction = 'primary';
    for (const id of ['restartBtn','newGameBtn','undoBtn','hintBtn','battleRestartBtn','battleNewBtn','resultRestart','resultClose']) $(id).dataset.wpFrameAction = 'secondary';
    const frame = WeightPlayScreenFrame.mount({root, localeSelect:$('localeSelect'), scenes:{
      main:{root:main,header,content:hero},
      battle:{root:battle,header:battleHeader,content:board,headerInfo:info},
    }});
    const abort = new AbortController();
    const syncSound = () => {
      view.audio.setEnabled(!window.WonderSound.isMuted());
      view.refreshSound?.();
    };
    window.addEventListener('wonder:audio-volume-change',syncSound,{signal:abort.signal});
    syncSound();
    const sync = () => {
      const scene = document.body.dataset.screen === 'battle' ? 'battle' : 'main';
      const covered = scene === 'battle' && !$('resultOverlay').hidden;
      guide.hidden = scene !== 'main';
      refreshCopy();
      // Result lives inside the board: never make its buttons inert with the board.
      for (const node of board.children) if (node.id !== 'resultOverlay') node.inert = scene !== 'battle' || covered;
      frame.activate(scene,{covered});
    };
    // Instance-only hooks, no changes to the shared card engine or peer games.
    for (const key of ['showMain','showBattle','render']) {
      const original = view[key];
      view[key] = function(...args) { const result = original.apply(this,args); sync(); return result; };
    }
    window.addEventListener('pagehide', event => {if (!event.persisted) {abort.abort();frame.destroy();}},{signal:abort.signal});
    sync();
  };
})();
