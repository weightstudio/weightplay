/* Animal Auto Squad content adapter for the shared Interface 9 frame. */
(() => {
  'use strict';

  let mounted = null;

  window.mountAnimalAutoSquadFrame = function mountAnimalAutoSquadFrame(options) {
    if (mounted) return mounted;

    const root = document.querySelector('.squad-app[data-wp-frame-root]');
    const main = document.getElementById('menuPanel');
    const mainHeader = document.querySelector('.squad-app > .topbar');
    const cover = main?.querySelector('.cover');
    const menuCopy = main?.querySelector('.menu-copy');
    const mainTitle = mainHeader?.querySelector('#mainGameTitle');
    const mainStart = document.getElementById('showStageBtn');
    const profile = main?.querySelector('.profile-grid');
    const guide = document.querySelector('.game-page-info-static');
    const stage = document.getElementById('stagePanel');
    const stageBack = document.getElementById('stageBackBtn');
    const stageTitle = document.getElementById('stageSelectTitle');
    const stageProgress = document.getElementById('stageProgressText');
    const stageTabs = document.getElementById('stageTabs');
    const stageWorkspace = stage?.querySelector('.stage-workspace');
    const stagePage = document.getElementById('stageSelectPane');
    const teamPage = document.getElementById('trainingPane');
    const growthPage = document.getElementById('growthPane');
    const growthDetails = document.getElementById('teamGrowthDetails');
    const stageRail = document.getElementById('stageRail');
    const battle = document.getElementById('gamePanel');
    const battleReturn = document.getElementById('quitRunBtn');
    const battleHud = battle?.querySelector(':scope > .hud-row');
    const localeSelect = document.getElementById('localeSelect');
    const core = window.WeightPlayScreenFrame;
    const playUI = window.WeightPlayPlayUI;

    if (!root || !main || !mainHeader || !cover || !menuCopy || !mainTitle || !mainStart || !profile
      || !stage || !stageBack || !stageTitle || !stageProgress || !stageTabs || !stageWorkspace || !stagePage
      || !teamPage || !growthPage || !growthDetails || !stageRail || !battle || !battleReturn || !battleHud
      || !localeSelect || !core || !playUI || !window.WeightPlayStageRailI9 || !options?.stageConfig) {
      throw new Error('ANIMAL_AUTO_SQUAD_I9_FRAME_INPUTS_REQUIRED');
    }

    const mainContent = document.createElement('div');
    mainContent.className = 'aas-main-content wp-standard-main-flow-node';
    const composition = document.createElement('div');
    composition.className = 'wp-standard-main-composition';
    const posterPane = document.createElement('div');
    posterPane.className = 'wp-standard-main-poster';
    cover.classList.add('wp-standard-main-poster-media');
    cover.dataset.wpFramePoster = '';
    posterPane.append(cover);
    menuCopy.classList.add('wp-standard-main-copy');
    menuCopy.dataset.wpFrameCopy = '';
    const summary = document.getElementById('menuSubText');
    if (summary) {
      summary.classList.add('wp-standard-main-summary');
      summary.dataset.wpFrameSummary = '';
    }
    mainTitle.dataset.wpFrameTitle = '';
    mainStart.dataset.wpFrameAction = 'primary';
    mainStart.dataset.wpMainStart = '';

    const progressCell = document.getElementById('bestRoundsText')?.closest('div');
    if (progressCell) {
      progressCell.classList.add('aas-main-progress-cell');
      const progressBar = document.createElement('span');
      progressBar.id = 'aasMainProgressBar';
      progressBar.className = 'aas-main-progress-bar';
      progressBar.setAttribute('role', 'progressbar');
      progressBar.setAttribute('aria-valuemin', '0');
      progressBar.setAttribute('aria-valuemax', String(options.mainProgress?.().total || 30));
      const progressFill = document.createElement('i');
      progressFill.className = 'aas-main-progress-fill';
      progressBar.append(progressFill);
      progressCell.append(progressBar);
      profile.dataset.wpFrameProgress = '';
    }
    composition.append(posterPane, menuCopy);
    mainContent.append(composition);
    if (guide) {
      guide.classList.add('wp-standard-main-flow-node');
      mainContent.append(guide);
    }
    mainHeader.remove();
    main.replaceChildren(mainHeader, mainContent);
    main.classList.add('wp-standard-main-screen', 'wp-standard-main-flow-node');
    main.removeAttribute('data-wp-shell-slot');

    const stageHeader = document.createElement('header');
    const stageInfo = document.createElement('div');
    stageInfo.className = 'aas-stage-info';
    stageTitle.dataset.wpFrameTitle = '';
    stageHeader.append(stageBack, stageTitle);
    stageInfo.append(stageProgress);
    const stageContent = document.createElement('div');
    stageContent.id = 'animalAutoSquadStageContent';
    stageContent.className = 'aas-stage-content';
    stageContent.dataset.wpFramePlayFill = '';
    stageContent.append(stageInfo, stageWorkspace);
    stagePanelCleanup();

    function stagePanelCleanup() {
      stage.classList.add('wp-standard-stage-screen');
      stage.setAttribute('data-wp-logical-stage-canvas', '');
      stage.setAttribute('data-wp-frame-play-fill', '');
      for (const attribute of ['data-wp-shell-slot', 'data-wp-standard-stage-screen', 'data-wp-stage-workspace', 'data-wp-canvas-max-width', 'data-wp-stage-landscape-width', 'data-wp-stage-landscape-height']) {
        stage.removeAttribute(attribute);
      }
      stageRail.className = 'wp-stage-i9-rail';
      stageTabs.dataset.wpFrameNav = '';
      stageTabs.removeAttribute('role');
      const teamEmptyState = document.getElementById('teamEmptyState');
      const teamPrepHost = document.getElementById('teamPrepHost');
      if (teamEmptyState) teamPage.prepend(teamEmptyState);
      if (teamPrepHost) teamPage.append(teamPrepHost);
      growthPage.append(growthDetails);
      growthDetails.open = true;
      stage.replaceChildren(stageHeader, stageContent, stageTabs);
    }

    const battleHeader = document.createElement('header');
    const battleTitle = document.createElement('span');
    battleTitle.dataset.wpFrameTitle = '';
    battleTitle.textContent = mainTitle.textContent;
    battleHeader.append(battleReturn, battleTitle);
    const battleContent = document.createElement('div');
    battleContent.id = 'animalAutoSquadBattleContent';
    battleContent.className = 'aas-battle-content wp-frame-play-content';
    battleContent.dataset.wpFramePlayFill = '';
    battleHud.querySelector('.hud-return-slot')?.remove();
    const battleChildren = [...battle.children].filter((node) => node !== battleHud);
    battleContent.append(battleHud, ...battleChildren);
    battle.replaceChildren(battleHeader, battleContent);
    battle.removeAttribute('data-wp-shell-slot');
    battle.removeAttribute('data-wp-canvas-max-width');
    battle.setAttribute('data-wp-frame-play-fill', '');
    battle.setAttribute('data-wp-battle-canvas-root', '');
    battle.setAttribute('data-wp-logical-battle-canvas', 'responsive');
    battle.setAttribute('data-wp-battle-min-width', '390');
    battle.setAttribute('data-wp-battle-min-height', '788');
    battle.setAttribute('data-wp-battle-landscape-width', '760');
    battle.setAttribute('data-wp-battle-landscape-height', '360');

    const frame = core.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: mainContent },
        stage: { root: stage, header: stageHeader, content: stageContent, headerInfo: stageInfo },
        battle: { root: battle, header: battleHeader, content: battleContent, headerInfo: battleHud },
      },
    });
    const stageSelector = playUI.mountStage({
      page: stagePage,
      rail: stageRail,
      config: options.stageConfig,
      selected: options.selectedStage?.() ?? 0,
      onSelect: options.onSelect,
      onStart: options.onStart,
      isActive: () => frame.active === 'stage' && stagePage.classList.contains('is-active'),
    });
    const stageButtons = [...stageTabs.querySelectorAll('button[data-stage-view]')];
    frame.commonDownButton.clear();
    stageButtons.forEach((button) => frame.commonDownButton.add(button));

    function updateMainProgress(data = options.mainProgress?.()) {
      if (!data) return;
      const total = Math.max(1, Number(data.total) || 1);
      const unlocked = Math.max(0, Math.min(total, Number(data.unlocked) || 0));
      const progressBar = document.getElementById('aasMainProgressBar');
      const progressFill = progressBar?.querySelector('.aas-main-progress-fill');
      if (!progressBar || !progressFill) return;
      progressBar.setAttribute('aria-valuemax', String(total));
      progressBar.setAttribute('aria-valuenow', String(unlocked));
      progressBar.setAttribute('aria-valuetext', data.valueText || `${unlocked}/${total}`);
      progressBar.setAttribute('aria-label', data.title || data.label || 'Stages unlocked');
      progressFill.style.width = `${Math.round((unlocked / total) * 100)}%`;
    }

    function currentScene() {
      if (!main.classList.contains('is-hidden')) return 'main';
      if (!stage.classList.contains('is-hidden')) return 'stage';
      return 'battle';
    }

    function battleCovered() {
      return ['resultPanel', 'defeatRevivePanel', 'combatStallPanel', 'quitRunPanel']
        .some((id) => {
          const node = document.getElementById(id);
          return Boolean(node && !node.classList.contains('is-hidden'));
        });
    }

    let activeScene = null;
    let activeCovered = false;
    function activate(name, settings = {}) {
      if (!['main', 'stage', 'battle'].includes(name)) throw new Error(`ANIMAL_AUTO_SQUAD_UNKNOWN_SCENE:${name}`);
      const covered = Boolean(settings.covered);
      if (activeScene !== name || activeCovered !== covered) {
        frame.activate(name, { covered });
        activeScene = name;
        activeCovered = covered;
        if (name === 'stage' && stagePage.classList.contains('is-active')) {
          stageSelector.refresh(options.selectedStage?.() ?? 0);
        }
      }
      updateMainProgress();
    }

    const api = Object.freeze({
      frame,
      stageSelector,
      get active() { return activeScene; },
      activate,
      sync() { activate(currentScene(), { covered: currentScene() === 'battle' && battleCovered() }); },
      refreshStage(stageNumber) {
        if (stageNumber === undefined) stageSelector.refresh();
        else stageSelector.refresh(Math.max(0, Math.min(options.stageConfig.count - 1, Number(stageNumber) - 1)));
      },
      selectStage(stageNumber) { stageSelector.select(Math.max(0, Math.min(options.stageConfig.count - 1, Number(stageNumber) - 1))); },
      updateMainProgress,
      destroy() {
        stageSelector.destroy();
        frame.destroy();
        mounted = null;
        window.AnimalAutoSquadFrame = null;
      },
    });
    mounted = api;
    window.AnimalAutoSquadFrame = api;
    updateMainProgress();
    activate('main');
    window.addEventListener('pagehide', (event) => {
      if (!event.persisted) api.destroy();
    }, { once: true });
    return api;
  };
})();
