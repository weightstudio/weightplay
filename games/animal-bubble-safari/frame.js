/* Animal Bubble Safari supplies content; the shared frame owns screen chrome. */
(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const makeContent = (id, parent, keep = []) => {
    const content = document.createElement('div');
    content.id = id;
    content.className = 'wp-bubble-screen-content';
    for (const child of [...parent.childNodes]) {
      if (keep.includes(child)) continue;
      content.append(child);
    }
    parent.append(content);
    return content;
  };

  function mount() {
    if (window.BubbleSafariFrame) return window.BubbleSafariFrame;
    const root = byId('viewport');
    const main = byId('mainScreen');
    const stage = byId('stageScreen');
    const battle = byId('safariBattleScreen');
    const mainHeader = main?.querySelector('.topbar');
    const stageHeader = stage?.querySelector('.topbar');
    const battleHeader = battle?.querySelector('.battle-header');
    if (!root || !mainHeader || !stageHeader || !battleHeader || !window.WeightPlayScreenFrame) return null;

    const mainTitle = byId('gameTitle');
    const stageTitle = byId('stageTitle');
    mainTitle?.setAttribute('data-wp-frame-title', '');
    stageTitle?.setAttribute('data-wp-frame-title', '');
    const battleTitle = document.createElement('strong');
    battleTitle.dataset.wpFrameTitle = '';
    battleTitle.textContent = mainTitle?.textContent || document.title;
    battleHeader.append(battleTitle);

    const mainContent = makeContent('mainContent', main, [mainHeader]);
    mainContent.querySelector('.poster-wrap')?.setAttribute('data-wp-frame-poster', '');

    const stageSummary = byId('stageSummary');
    const stageTopInfo = document.createElement('div');
    stageTopInfo.id = 'stageTopInfo';
    const stageContent = document.createElement('div');
    stageContent.id = 'stageContent';
    stageContent.className = 'wp-bubble-screen-content';
    const stageStatus = byId('stageStatus');
    for (const child of [...stage.childNodes]) {
      if (child === stageHeader || child === stageSummary || child === stageStatus || child.matches?.('.stage-art')) continue;
      stageContent.append(child);
    }
    if (stageSummary) stageTopInfo.append(stageSummary);
    stageContent.append(stageTopInfo);
    stage.append(stageContent);

    const battleStats = document.createElement('div');
    battleStats.id = 'battleTopInfo';
    for (const stat of [...battleHeader.querySelectorAll(':scope > div')]) battleStats.append(stat);
    const battleContent = document.createElement('div');
    battleContent.id = 'battleContent';
    battleContent.className = 'wp-bubble-screen-content';
    for (const child of [...battle.childNodes]) {
      if (child === battleHeader) continue;
      battleContent.append(child);
    }
    battleContent.append(battleStats);
    battleContent.querySelector('.play-frame')?.setAttribute('data-wp-logical-battle-canvas', '');
    battle.prepend(battleHeader, battleContent);

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect: byId('localeSelect'),
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        stage: { root: stage, header: stageHeader, content: stageContent, headerInfo: stageTopInfo },
        battle: { root: battle, header: battleHeader, content: battleContent, headerInfo: battleStats },
      },
    });

    const stageStart = document.createElement('button');
    stageStart.id = 'stageStartAction';
    stageStart.type = 'button';
    stageStart.className = 'primary-button';
    stageStart.dataset.i18n = 'startLevel';
    stageStart.dataset.wpFrameAction = 'primary';
    stageStart.textContent = 'Start Level';
    frame.commonDownButton.clear().add(stageStart);

    // The hidden controls remain as the existing game's locale/audio state
    // source; the visible controls are created by the shared frame.
    for (const id of ['soundMain', 'soundStage', 'localeSelect']) {
      const node = byId(id);
      if (node) node.hidden = true;
    }
    window.BubbleSafariFrame = frame;
    window.addEventListener('pagehide', event => { if (!event.persisted) frame.destroy(); });
    return frame;
  }

  mount();
})();
