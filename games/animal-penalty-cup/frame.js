/* Game-owned content adapter. The shared I9 frame owns scene controls, card
   geometry, Stage pooling, drag settling, and localized Settings. */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const text = (dictionary, key, vars = {}) => {
    let value = dictionary[key] ?? window.ANIMAL_PENALTY_LOCALES?.en?.[key] ?? key;
    for (const [name, item] of Object.entries(vars)) value = String(value).replaceAll(`{${name}}`, String(item));
    return value;
  };

  window.mountAnimalPenaltyCupFrame = function mountAnimalPenaltyCupFrame() {
    const root = $('gameFrame');
    const main = $('mainScreen');
    const stage = document.querySelector('#stageScreen .stage-canvas');
    const battle = $('battleCanvas');
    const mainHeader = main.querySelector('header');
    const stageHeader = stage.querySelector('header');
    const battleHeader = battle.querySelector('header');
    const localeSelect = $('localeSelect');
    const runtime = window.__animalPenaltyCupTest;
    if (!root || !runtime || !window.WeightPlayScreenFrame || !window.WeightPlayPlayUI) {
      throw new Error('PENALTY_CUP_I9_DEPENDENCIES_REQUIRED');
    }

    const mainTitle = mainHeader.querySelector('[data-wp-game-title]');
    mainTitle.dataset.wpFrameTitle = '';
    main.querySelector('.main-poster').dataset.wpFramePoster = '';
    main.querySelector('.main-copy').dataset.wpFrameCopy = '';
    main.querySelector('.main-copy > p[data-i18n="pitch"]').dataset.wpFrameSummary = '';
    $('mainProgress').dataset.wpFrameProgress = '';
    main.querySelector('.main-copy > small').hidden = true;
    main.querySelector('.main-copy > h1').hidden = true;

    const stageTitle = stageHeader.querySelector('[data-wp-frame-title]');
    stageTitle.hidden = true;
    const battleTitle = battleHeader.querySelector('[data-wp-frame-title]');
    battleTitle.hidden = true;

    const battlePlayArea = $('battlePlayArea');
    const battleInfo = document.createElement('div');
    battleInfo.dataset.wpFrameInfo = '';
    battlePlayArea.append(battleInfo);

    for (const button of root.querySelectorAll('button:not([data-wp-return])')) {
      button.dataset.wpFrameAction = button.classList.contains('primary-action') ? 'primary' : 'secondary';
    }
    for (const button of document.querySelectorAll('#tutorialPanel button')) {
      button.dataset.wpFrameAction = button.classList.contains('primary-action') ? 'primary' : 'secondary';
    }

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector('.main-hero') },
        stage: { root: stage, header: stageHeader, content: $('stageWorkspace') },
        battle: { root: battle, header: battleHeader, content: battlePlayArea, headerInfo: battleInfo },
      },
    });

    const stageProgress = document.createElement('span');
    stageProgress.id = 'stageProgressStat';
    const stageGroup = window.WeightPlayScreenFrame.createGroup().add(stageProgress);
    frame.stageTopUI.add(stageGroup);

    const battleGroup = window.WeightPlayScreenFrame.createGroup()
      .add(battlePlayArea.querySelector('.battle-heading'))
      .add(battlePlayArea.querySelector('.score-box'));
    frame.battleTopUI.add(battleGroup);

    const stageAction = $('stageTabsBtn');
    stageAction.dataset.wpFrameAction = 'tab';
    stageAction.setAttribute('aria-pressed', 'true');
    frame.commonDownButton.clear().add(stageAction);

    const getDictionary = () => window.ANIMAL_PENALTY_LOCALES?.[runtime.getState().lang]
      ?? window.ANIMAL_PENALTY_LOCALES?.en
      ?? {};
    const getStage = index => {
      const state = runtime.getState();
      const level = runtime.LEVELS[index];
      const dictionary = getDictionary();
      const name = state.lang === 'en' ? level.opponent : text(dictionary, 'teamName', { n: index + 1 });
      const locked = index >= state.save.unlocked;
      const chapter = level.chapter;
      const stars = locked ? '' : `${'★'.repeat(state.save.stars[index])}${'☆'.repeat(3 - state.save.stars[index])}`;
      const chapterName = dictionary.chapterNames?.[chapter] ?? '';
      const chapterRule = dictionary.chapterRules?.[chapter] ?? '';
      return {
        id: index + 1,
        kicker: text(dictionary, 'chapter', { n: chapter + 1 }),
        title: text(dictionary, 'match', { n: index + 1 }),
        subtitle: locked ? text(dictionary, 'locked') : text(dictionary, 'opponent', { name }),
        status: stars,
        summary: [chapterName, chapterRule].filter(Boolean).join(' · '),
        details: [text(dictionary, locked ? 'locked' : state.save.completed[index] ? 'cleared' : 'opponent', { name }), chapterRule],
        poster: '/games/animal-penalty-cup/assets/animal-penalty-cup-cover-v1.webp',
        posterPosition: 'center',
        locked,
        cleared: Boolean(state.save.completed[index]),
      };
    };
    const stageSelector = window.WeightPlayPlayUI.mountStage({
      page: $('stageWorkspace'),
      rail: $('stageRail'),
      selected: runtime.getState().selectedStage,
      config: {
        count: runtime.LEVELS.length,
        poster: '/games/animal-penalty-cup/assets/animal-penalty-cup-cover-v1.webp',
        background: '/games/animal-penalty-cup/assets/animal-penalty-cup-stadium-v1.webp',
        stage: getStage,
      },
      onSelect: index => runtime.selectStage(index),
      onStart: index => runtime.startMatch(index, 'stage'),
      isActive: () => document.body.dataset.screen === 'stage',
    });

    const refreshProgress = () => {
      const state = runtime.getState();
      const index = state.selectedStage;
      const dictionary = getDictionary();
      stageProgress.textContent = `${index + 1}/30`;
      stageProgress.setAttribute('aria-label', text(dictionary, 'match', { n: index + 1 }));
    };
    refreshProgress();
    const sync = () => frame.activate(document.body.dataset.screen || 'main');
    window.addEventListener('weightplay:shell-sync', sync);
    frame.activate(document.body.dataset.screen || 'main');
    window.addEventListener('pagehide', event => {
      if (event.persisted) return;
      window.removeEventListener('weightplay:shell-sync', sync);
      stageSelector.destroy();
      frame.destroy();
    }, { once: true });

    return { frame, stageSelector, refreshProgress };
  };
})();
