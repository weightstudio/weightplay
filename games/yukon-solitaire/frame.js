/* Yukon content bindings only. Shared frame owns controls and preferences. */
(() => {
  'use strict';
  let installed = false;
  window.installYukonFrame = view => {
    if (installed) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => window.installYukonFrame(view), {once:true});
      return;
    }
    const $ = id => document.getElementById(id);
    const root = $('gameFrame');
    const main = $('mainScreen');
    const battle = $('battleScreen')?.querySelector('.battle-canvas');
    const guide = $('gameGuide');
    if (!root || !main || !battle || !guide || !window.WeightPlayScreenFrame) {
      throw new Error('Yukon shared-frame content contract is incomplete');
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
    content.className = 'yukon-main-content';
    const wrapper = content.querySelector('.poster-frame');
    const image = wrapper.querySelector('img');
    image.className = '';
    image.dataset.wpFramePoster = '';
    image.src = '/assets/interface7-redrawn/yukon-solitaire.webp';
    wrapper.replaceWith(image);
    const copy = content.querySelector('.main-copy');
    // Keep main-copy identity: the game's live remaining-card writer owns it.
    copy.dataset.wpFrameCopy = '';
    copy.querySelector('h1').hidden = true;
    copy.querySelector('small').hidden = true;
    // The shared engine keeps this legacy statistics node empty.
    if ($('statistics')) $('statistics').hidden = true;
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
    info.append(...[...battleHeader.querySelectorAll('.header-stat')]);
    info.querySelectorAll('small').forEach((label, index) => {
      const span = document.createElement('span');
      span.dataset.label = ['moves','score','combo'][index];
      span.textContent = label.textContent;
      label.replaceWith(span);
    });
    board.prepend(info);
    root.after(guide);
    let comparison = guide.querySelector('[data-wp-market-comparison]');
    if (!comparison) {
      comparison = document.createElement('article');
      comparison.className = 'game-info-section';
      comparison.dataset.wpMarketComparison = '1.3.0';
      comparison.dataset.runtimeLocalize = 'off';
      comparison.innerHTML = '<h3 data-i18n="compareTitle"></h3>' +
        '<div class="game-info-tags"><span><bdi>Yukon Russian Solitaire</bdi></span></div>' +
        '<p data-i18n="compareBody"></p>' +
        '<p data-i18n="compareDisclaimer"></p>' +
        '<p><a data-wp-comparison-product href="https://apps.apple.com/us/app/yukon-russian-solitaire-game/id1459576037" rel="noopener noreferrer" data-i18n="compareProduct"></a> · ' +
        '<a data-wp-comparison-rules href="https://www.mobilityware.com/how-to-play-yukon-solitaire-a-complete-guide/" rel="noopener noreferrer" data-i18n="compareRules"></a></p>';
      guide.append(comparison);
    }
    const faqSection = [...guide.querySelectorAll('.game-info-section')]
      .find(section => !section.dataset.wpMarketComparison && section.querySelector('dl'));
    if (faqSection) {
      const faqKeys = [
        'faqStockQuestion','faqStockAnswer',
        'faqGroupQuestion','faqGroupAnswer',
        'faqKingQuestion','faqKingAnswer',
        'faqAlternatingQuestion','faqAlternatingAnswer',
        'faqUndoQuestion','faqUndoAnswer',
      ];
      faqSection.querySelector('h3')?.setAttribute('data-i18n','faqTitle');
      faqSection.querySelectorAll('dt,dd').forEach((node,index) => {
        if (faqKeys[index]) node.setAttribute('data-i18n',faqKeys[index]);
      });
    }
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
      const strings = window.YUKON_GUIDE_LOCALES?.[code] || window.YUKON_GUIDE_LOCALES?.en || {};
      comparison.dataset.comparisonLocale = code;
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
