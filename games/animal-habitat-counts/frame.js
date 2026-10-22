/* Adapt Habitat Counts content to the shared Interface 9 frame and Stage rail. */
(() => {
  'use strict';
  window.mountHabitatCountsFrame = function mountHabitatCountsFrame() {
    const game = window.AnimalHabitatCountsI9;
    const root = document.getElementById('app');
    const main = document.getElementById('mainScreen');
    const stage = document.getElementById('stageScreen');
    const battle = document.getElementById('battleScreen');
    const mainHeader = main.querySelector(':scope > .main-canvas > header');
    const stageHeader = stage.querySelector(':scope > header');
    const battleHeader = battle.querySelector(':scope > header');
    const workspace = document.getElementById('stageWorkspace');
    const battleCanvas = battle.querySelector('.battle-canvas');
    const localeSelect = document.getElementById('languageSelect');

    root.querySelectorAll('button.primary-btn, button.secondary-btn').forEach((button) => {
      button.dataset.wpFrameAction = button.classList.contains('primary-btn') ? 'primary' : 'secondary';
    });

    const frame = window.WeightPlayScreenFrame.mount({
      root,
      localeSelect,
      playUI: true,
      scenes: {
        main: { root: main, header: mainHeader, content: main.querySelector('.hero-card') },
        stage: { root: stage, header: stageHeader, content: workspace },
        battle: { root: battle, header: battleHeader, content: battleCanvas },
      },
    });

    const stageSummary = document.createElement('span');
    stageSummary.id = 'stageSummary';
    stageSummary.setAttribute('aria-live', 'polite');
    frame.stageTopUI.add(window.WeightPlayScreenFrame.createGroup().add(stageSummary));

    const progressBadge = document.getElementById('progressBadge');
    const battleHeading = document.getElementById('battleHeading');
    battleHeading.hidden = false;
    battleHeading.removeAttribute('hidden');
    frame.battleTopUI.add(window.WeightPlayScreenFrame.createGroup().add(progressBadge));

    const selector = window.WeightPlayPlayUI.mountStage({
      page: workspace,
      rail: document.getElementById('stageList'),
      config: window.HabitatCountsStageConfig(game),
      selected: game.selectedStage,
      onSelect: (index) => game.selectStage(index),
      onStart: (index) => game.startStage(index),
      isActive: () => game.screen === 'stage',
    });
    game.setStageSelector(selector);
    const stagesTab = document.createElement('button');
    stagesTab.type = 'button';
    stagesTab.setAttribute('role', 'tab');
    stagesTab.setAttribute('aria-selected', 'true');
    stagesTab.setAttribute('aria-controls', 'stageWorkspace');
    stagesTab.dataset.copy = 'stages';
    stagesTab.textContent = game.stageTabLabel();
    stagesTab.addEventListener('click', () => selector.select(game.selectedStage, { focus: true, notify: false }));
    frame.commonDownButton.add(stagesTab);
    const themesButton = document.createElement('button');
    themesButton.id = 'themesBtn';
    themesButton.type = 'button';
    themesButton.dataset.experience = 'theme';
    themesButton.textContent = game.experienceCopy('theme');
    themesButton.addEventListener('click', game.openThemes);
    frame.commonDownButton.add(themesButton);
    game.setFrame(frame);
    frame.activate(game.screen);
    window.addEventListener('pagehide', (event) => {
      if (event.persisted) return;
      selector.destroy();
      frame.destroy();
    }, { once: true });
    return frame;
  };
})();
