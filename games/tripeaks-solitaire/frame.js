/* Tripeaks content bindings only. Shared frame owns controls and preferences. */
(() => {
  'use strict';
  let installed = false;
  window.installTripeaksFrame = view => {
    if (installed) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => window.installTripeaksFrame(view), {once:true});
      return;
    }
    const $ = id => document.getElementById(id);
    const root = $('gameFrame');
    const main = $('mainScreen');
    const battle = $('battleScreen')?.querySelector('.battle-canvas');
    const guide = $('gameGuide');
    if (!root || !main || !battle || !guide || !window.WeightPlayScreenFrame) {
      throw new Error('Tripeaks shared-frame content contract is incomplete');
    }
    const header = main.querySelector('header');
    // Retire the legacy full-viewport Main envelope; shared frame owns sizing.
    main.classList.remove('main-screen');
    const battleHeader = battle.querySelector('header');
    const content = main.querySelector('.main-hero');
    const board = $('classicBoard');
    const legacy = document.createElement('div');
    legacy.append($('audioMenuBtn'),$('audioPopover'));
    legacy.hidden = true;
    root.append(legacy);
    if ($('soundToggleBattle')) legacy.append($('soundToggleBattle'));
    content.className = 'tripeaks-main-content';
    const wrapper = content.querySelector('.poster-frame');
    const image = wrapper.querySelector('img');
    image.className = '';
    image.dataset.wpFramePoster = '';
    image.src = '/assets/interface7-redrawn/tripeaks-solitaire.webp';
    wrapper.replaceWith(image);
    const copy = content.querySelector('.main-copy');
    // Keep main-copy identity: the game's live remaining-card writer owns it.
    copy.dataset.wpFrameCopy = '';
    copy.querySelector('h1').hidden = true;
    copy.querySelector('small').hidden = true;
    const features = content.querySelector('.feature-list');
    if (features) features.hidden = true;
    copy.querySelector('[data-copy="target"]').dataset.wpFrameSummary = '';
    if ($('mainProgress')) $('mainProgress').dataset.wpFrameProgress = '';
    header.querySelector('strong').dataset.wpFrameTitle = '';
    const title = document.createElement('strong');
    title.hidden = true;
    title.dataset.wpFrameTitle = '';
    battleHeader.append(title);
    const info = document.createElement('div');
    info.dataset.wpFrameInfo = '';
    info.append(...[...battleHeader.querySelectorAll('.header-stat')].filter(node => node.id !== 'tripeaksPeakProgress'));
    info.querySelectorAll('small').forEach((label, index) => {
      const span = document.createElement('span');
      span.dataset.label = ['moves','score','combo'][index];
      span.textContent = label.textContent;
      label.replaceWith(span);
    });
    board.prepend(info);
    // This fourth field is game content, not a fourth shared header column.
    if ($('tripeaksPeakProgress')) {
      const peak = $('tripeaksPeakProgress');
      peak.className = 'board-group tripeaks-peak-content';
      board.querySelector('.board-middle').append(peak);
    }
    root.after(guide);
    for (const id of ['startBtn','resultNewGame']) $(id).dataset.wpFrameAction = 'primary';
    for (const id of ['restartBtn','newGameBtn','undoBtn','hintBtn','battleRestartBtn','battleNewBtn','resultRestart','resultClose']) {
      $(id).dataset.wpFrameAction = 'secondary';
    }
    const frame = WeightPlayScreenFrame.mount({root,localeSelect:$('localeSelect'),scenes:{
      main:{root:main,header,content},
      battle:{root:battle,header:battleHeader,content:board,headerInfo:info},
    }});
    const abort = new AbortController();
    const syncSound = () => {
      view.audio.setEnabled(!window.WonderSound.isMuted());
      view.refreshSound?.();
    };
    window.addEventListener('wonder:audio-volume-change',syncSound,{signal:abort.signal});
    const sync = () => {
      const code = ({'zh-Hant':'zh-tw','zh-Hans':'zh-cn','pt-BR':'pt-br'}[view.locale] || view.locale || 'en');
      const strings = window.TRIPEAKS_GUIDE_LOCALES?.[code] || window.TRIPEAKS_GUIDE_LOCALES?.en || {};
      for (const node of guide.querySelectorAll('[data-i18n]')) {
        if (strings[node.dataset.i18n]) node.textContent = strings[node.dataset.i18n];
      }
      const scene = document.body.dataset.screen === 'battle' ? 'battle' : 'main';
      const covered = scene === 'battle' && !$('resultOverlay').hidden;
      guide.hidden = scene !== 'main';
      for (const node of board.children) {
        if (node.id !== 'resultOverlay') node.inert = scene !== 'battle' || covered;
      }
      frame.activate(scene,{covered});
    };
    for (const key of ['showMain','showBattle','render']) {
      const original = view[key];
      view[key] = function(...args) {
        const result = original.apply(this,args);
        sync();
        return result;
      };
    }
    window.addEventListener('pagehide',event => {
      if (!event.persisted) {abort.abort();frame.destroy();}
    },{signal:abort.signal});
    installed = true;
    syncSound();
    sync();
  };
})();
