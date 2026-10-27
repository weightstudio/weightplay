/* Wonder Crash content adapter; the shared frame owns I9 scene chrome and Stage. */
(() => {
  'use strict';

  let mounted = null;

  window.mountWonderCrashFrame = function mountWonderCrashFrame(options) {
    if (mounted) return mounted;

    const root = document.querySelector('.game-shell');
    const main = document.getElementById('wonderMain');
    const overlay = document.getElementById('overlay');
    const canvas = document.getElementById('game');
    const loading = document.getElementById('loadingPanel');
    const guide = document.querySelector('.game-page-info');
    const menuTabs = document.getElementById('menuTabs');
    const mainHeader = main?.querySelector('header');
    const mainTitle = mainHeader?.querySelector('[data-i18n="game_title"]');
    const poster = main?.querySelector('.wonder-main-cover');
    const mainStart = document.getElementById('wonderMainStart');
    const summary = main?.querySelector('.main-summary');
    const stageBack = document.getElementById('wonderStageBack');
    const stageWallet = document.getElementById('menuCoinLine');
    const battleReturn = document.getElementById('backToMenuBtn');
    const battleHud = document.getElementById('battleHud');
    const pauseButton = document.getElementById('settingsBtn');
    const weaponModal = document.getElementById('weaponModal');
    const localeSource = options?.localeSelect;
    const core = window.WeightPlayScreenFrame;
    const playUI = window.WeightPlayPlayUI;

    if (!root || !main || !overlay || !canvas || !mainHeader || !mainTitle || !poster || !mainStart
      || !summary || !stageBack || !stageWallet || !battleReturn || !battleHud || !pauseButton
      || !menuTabs || !core || !playUI || !window.WeightPlayStageRailI9 || !options?.stageConfig) {
      throw new Error('WONDER_CRASH_I9_FRAME_INPUTS_REQUIRED');
    }

    root.removeAttribute('data-wp-canvas-max-width');
    root.removeAttribute('data-wp-stage-landscape-width');
    root.removeAttribute('data-wp-stage-landscape-height');
    root.classList.add('wp-standard-main-flow-owner');

    const mainContent = document.createElement('div');
    mainContent.className = 'wonder-main-content wp-standard-main-flow-node';
    const composition = document.createElement('div');
    composition.className = 'wp-standard-main-composition';
    const posterPane = document.createElement('div');
    posterPane.className = 'wp-standard-main-poster';
    poster.classList.add('wp-standard-main-poster-media');
    poster.dataset.wpFramePoster = '';
    posterPane.append(poster);
    const mainCopy = document.createElement('div');
    mainCopy.className = 'wp-standard-main-copy';
    mainCopy.dataset.wpFrameCopy = '';
    summary.classList.add('wp-standard-main-summary');
    summary.dataset.wpFrameSummary = '';

    const progress = document.createElement('section');
    progress.className = 'wp-standard-main-progress wonder-main-progress';
    progress.dataset.wpFrameProgress = '';
    progress.setAttribute('aria-label', options.progressTitle || 'Campaign progress');
    const progressText = document.createElement('span');
    progressText.className = 'wonder-main-progress-copy';
    const progressBar = document.createElement('span');
    progressBar.className = 'wonder-main-progress-bar';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', '0');
    const progressFill = document.createElement('i');
    progressFill.className = 'wonder-main-progress-fill';
    progressBar.append(progressFill);
    progress.append(progressText, progressBar);

    mainTitle.dataset.wpFrameTitle = '';
    mainStart.dataset.wpFrameAction = 'primary';
    mainStart.dataset.wpMainStart = '';
    mainCopy.append(summary, progress, mainStart);
    composition.append(posterPane, mainCopy);
    mainContent.append(composition);
    if (guide) {
      guide.classList.add('wp-standard-main-flow-node');
      mainContent.append(guide);
    }
    main.replaceChildren(mainHeader, mainContent);
    main.classList.add('wp-standard-main-screen', 'wp-standard-main-flow-node');

    const stageRoot = document.createElement('section');
    stageRoot.id = 'wonderStageScene';
    stageRoot.className = 'wonder-i9-stage hidden';
    stageRoot.setAttribute('data-wp-logical-stage-canvas', '');
    stageRoot.setAttribute('data-wp-frame-play-fill', '');
    const stageHeader = document.createElement('header');
    const stageTitle = document.createElement('span');
    stageTitle.dataset.wpFrameTitle = '';
    stageTitle.textContent = mainTitle.textContent;
    const stageContent = document.createElement('div');
    stageContent.id = 'wonderStageContent';
    stageContent.className = 'wonder-stage-content';
    stageContent.setAttribute('data-wp-frame-play-fill', '');
    stageHeader.append(stageBack, stageTitle);
    stageContent.append(overlay, stageWallet);
    if (weaponModal) stageContent.append(weaponModal);
    stageRoot.append(stageHeader, stageContent);
    menuTabs.dataset.wpFrameNav = '';
    stageRoot.append(menuTabs);

    const battleRoot = document.createElement('section');
    battleRoot.id = 'wonderBattleScene';
    battleRoot.className = 'game-layout battle-canvas wonder-i9-battle hidden';
    battleRoot.setAttribute('data-wp-battle-canvas-root', '');
    battleRoot.setAttribute('data-wp-logical-battle-canvas', 'responsive');
    battleRoot.setAttribute('data-wp-battle-min-width', '390');
    battleRoot.setAttribute('data-wp-battle-min-height', '788');
    battleRoot.setAttribute('data-wp-battle-landscape-width', '760');
    battleRoot.setAttribute('data-wp-battle-landscape-height', '360');
    battleRoot.setAttribute('data-wp-frame-play-fill', '');
    const battleHeader = document.createElement('header');
    const battleTitle = document.createElement('span');
    battleTitle.dataset.wpFrameTitle = '';
    battleTitle.textContent = mainTitle.textContent;
    battleHeader.append(battleReturn, battleTitle);
    const battleContent = document.createElement('div');
    battleContent.id = 'wonderBattleContent';
    battleContent.className = 'wonder-battle-content';
    battleContent.setAttribute('data-wp-frame-play-fill', '');
    const board = document.createElement('div');
    board.id = 'wonderBattleBoard';
    board.className = 'wonder-battle-board';
    board.append(canvas);
    pauseButton.dataset.wpFrameAction = 'secondary';
    pauseButton.setAttribute('aria-label', options.pauseLabel || 'Settings');
    battleContent.append(board, pauseButton, battleHud);
    battleRoot.append(battleHeader, battleContent);

    // Give Stage and Wave their own shared HUD stats instead of stacking five
    // spans into one stat and clipping the live battle progress on phones.
    const stageWave = battleHud.querySelector('.battle-status:not(.wall-shield-status)');
    const stageLabel = stageWave?.querySelector('[data-i18n="hud_stage"]');
    const stageValue = stageWave?.querySelector('#levelText');
    const waveLabel = stageWave?.querySelector('[data-i18n="hud_wave"]');
    const waveValue = stageWave?.querySelector('#waveText');
    if (!stageLabel || !stageValue || !waveLabel || !waveValue) throw new Error('WONDER_CRASH_BATTLE_STATS_REQUIRED');
    const stageStat = document.createElement('div');
    const waveStat = document.createElement('div');
    stageStat.className = waveStat.className = 'battle-status';
    stageStat.append(stageLabel, stageValue);
    waveStat.append(waveLabel, waveValue);
    stageWave.replaceWith(stageStat, waveStat);

    const localeBridge = document.createElement('div');
    localeBridge.hidden = true;
    localeBridge.setAttribute('aria-hidden', 'true');
    localeBridge.dataset.wpLocaleCompatibility = '';
    for (const id of ['globalLocaleSelect', 'pauseLocaleSelect']) {
      const select = document.getElementById(id);
      const owner = select?.closest('label');
      if (owner) localeBridge.append(owner);
    }

    overlay.classList.add('hidden');
    overlay.removeAttribute('data-wp-result-screen');
    root.replaceChildren(main, stageRoot, battleRoot, localeBridge);
    if (loading) root.append(loading);

    const labels = options.labels || {};
    const tabs = [
      ['character', labels.hero || 'Hero', '/assets/weightplay-character-boom-mane-lion-block-v1.webp'],
      ['battle', labels.stages || 'Stages', '/assets/wonder-prop-damage-block-v1.png'],
      ['build', labels.build || 'Build', '/assets/wonder-prop-eraser-block-v1.png'],
    ].map(([id, label, icon]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.menuTab = id;
      button.dataset.wpFrameAction = 'tab';
      button.setAttribute('aria-label', label);
      const image = document.createElement('img');
      image.src = icon;
      image.alt = '';
      image.draggable = false;
      const text = document.createElement('span');
      text.textContent = label;
      button.append(image, text);
      return button;
    });

    const frame = core.mount({
      root,
      localeSelect: localeSource,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        stage: { root: stageRoot, header: stageHeader, content: stageContent, headerInfo: stageWallet },
        battle: { root: battleRoot, header: battleHeader, content: battleContent, headerInfo: battleHud },
      },
    });
    const page = document.getElementById('stagePlayPage');
    const rail = document.getElementById('levelGrid');
    if (!page || !rail) throw new Error('WONDER_CRASH_I9_STAGE_INPUTS_REQUIRED');
    // Keep the shared selector in the full-height Stage content rather than
    // the legacy overlay's collapsed menu grid. Other tabs still use overlay.
    stageContent.append(page);
    const stageSelector = playUI.mountStage({
      page,
      rail,
      config: options.stageConfig,
      selected: options.selectedStage?.() ?? 0,
      onSelect: options.onSelect,
      onStart: options.onStart,
      isActive: () => frame.active === 'stage' && Boolean(options.isStageActive?.()),
    });
    frame.commonDownButton.clear();
    tabs.forEach((button) => frame.commonDownButton.add(button));

    function updateMainProgress(data = options.mainProgress?.()) {
      if (!data) return;
      const total = Math.max(1, Number(data.total) || 1);
      const cleared = Math.max(0, Math.min(total, Number(data.cleared) || 0));
      progressText.textContent = data.label || `${cleared}/${total}`;
      progressBar.setAttribute('aria-valuemax', String(total));
      progressBar.setAttribute('aria-valuenow', String(cleared));
      progressBar.setAttribute('aria-label', data.title || options.progressTitle || 'Campaign progress');
      progressFill.style.width = `${Math.round((cleared / total) * 100)}%`;
    }

    let activeScene = null;
    function activate(name, settings = {}) {
      const roots = { main, stage: stageRoot, battle: battleRoot };
      if (!roots[name]) throw new Error(`WONDER_CRASH_UNKNOWN_SCENE:${name}`);
      for (const [sceneName, sceneRoot] of Object.entries(roots)) {
        sceneRoot.classList.toggle('hidden', sceneName !== name);
      }
      activeScene = name;
      frame.activate(name, settings);
      if (name === 'stage') stageSelector.refresh();
    }

    function moveOverlay(name) {
      const target = name === 'battle' ? battleContent : stageContent;
      target.append(overlay);
    }

    const api = Object.freeze({
      get active() { return activeScene; },
      frame,
      stageSelector,
      activate,
      moveOverlay,
      refreshStage(index) {
        if (index === undefined) stageSelector.refresh();
        else stageSelector.refresh(index);
      },
      selectStage(index) { stageSelector.select(index); },
      updateMainProgress,
      destroy() {
        stageSelector.destroy();
        frame.destroy();
        mounted = null;
        window.WonderCrashFrame = null;
      },
    });
    mounted = api;
    window.WonderCrashFrame = api;
    updateMainProgress();
    activate('main');
    window.addEventListener('pagehide', (event) => {
      if (!event.persisted) api.destroy();
    }, { once: true });
    return api;
  };
})();
