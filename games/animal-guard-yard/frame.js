/* Scene bindings only. Shared frame owns navigation artwork and settings. */
(() => {
  const START_LABELS = Object.freeze({
    en: 'Start Game',
    'zh-Hant': '開始遊戲',
    'zh-Hans': '开始游戏',
    ja: 'ゲーム開始',
    ko: '게임 시작',
    es: 'Iniciar juego',
    'pt-BR': 'Iniciar jogo',
    fr: 'Démarrer le jeu',
    de: 'Spiel starten',
    it: 'Avvia gioco',
    ru: 'Начать игру',
    hi: 'खेल शुरू करें',
    ar: 'ابدأ اللعب',
  });
  const scriptUrl = document.currentScript?.src || location.href;
  let frame;

  function ensureInterfaceCleanupStyles() {
    if (document.querySelector('link[data-guard-yard-interface-cleanup]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('interface-7-cleanup.css?v=20260922-guard-yard-interface7-cleanup2', scriptUrl).href;
    link.dataset.guardYardInterfaceCleanup = '';
    document.head.append(link);
  }

  function currentLocale(localeSelect) {
    const locale = window.WonderI18n?.actualLocale?.()
      || window.WonderI18n?.locale?.()
      || document.documentElement.lang
      || localeSelect?.value
      || 'en';
    if (START_LABELS[locale]) return locale;
    if (/^zh-(tw|hk|hant)/i.test(locale)) return 'zh-Hant';
    if (/^zh/i.test(locale)) return 'zh-Hans';
    if (/^pt/i.test(locale)) return 'pt-BR';
    const short = String(locale).split('-')[0];
    return START_LABELS[short] ? short : 'en';
  }

  function bindTeamShopSubview({ stageContent, nav, localeSelect }) {
    const stagesTab = nav.querySelector('[data-menu-tab="stages"]');
    const animalsTab = nav.querySelector('[data-menu-tab="animals"]');
    const shopTab = nav.querySelector('[data-menu-tab="shop"]');
    const animalPanel = stageContent.querySelector('#animalTabPanel');
    const shopPanel = stageContent.querySelector('#shopTabPanel');

    animalsTab?.setAttribute('data-wp-frame-stage-slot', 'team');
    stagesTab?.setAttribute('data-wp-frame-stage-slot', 'stages');

    if (animalsTab && stagesTab) nav.append(animalsTab, stagesTab);
    if (!animalsTab || !shopTab || !animalPanel || !shopPanel) return;

    // Shop acquires animal guards, so it belongs to the Team/Animals workspace
    // rather than occupying the Stage bar's Equipment/build slot. Keep the
    // right Stage slot genuinely empty when this game has no equipment system.
    shopTab.classList.remove('active');
    shopTab.removeAttribute('data-menu-tab');
    shopTab.removeAttribute('role');
    shopTab.removeAttribute('aria-selected');
    shopTab.removeAttribute('data-wp-frame-stage-slot');
    shopTab.removeAttribute('data-wp-frame-action');
    shopTab.setAttribute('aria-controls', 'shopTabPanel');
    shopTab.setAttribute('data-wp-team-subview', 'shop');

    shopPanel.removeAttribute('data-tab-panel');
    shopPanel.classList.add('hidden');
    animalPanel.append(shopPanel);

    const teamNav = document.createElement('nav');
    teamNav.id = 'yardTeamNav';
    teamNav.setAttribute('aria-label', 'Animal preparation');

    const trainingButton = document.createElement('button');
    trainingButton.type = 'button';
    trainingButton.setAttribute('data-wp-team-subview', 'training');
    const sourceIcon = animalsTab.querySelector('img');
    if (sourceIcon) trainingButton.append(sourceIcon.cloneNode(true));
    const trainingLabel = document.createElement('span');
    trainingButton.append(trainingLabel);
    teamNav.append(trainingButton, shopTab);
    animalPanel.prepend(teamNav);

    let activeSubview = 'training';
    let restoreTalents = false;

    const refreshTeamCopy = () => {
      const locale = currentLocale(localeSelect);
      trainingLabel.textContent = window.GuardYardTalents?.text?.(locale, 'training') || 'Training';
    };

    const setTeamSubview = (next) => {
      const rosterNav = animalPanel.querySelector('#yardRosterNav');
      const talents = animalPanel.querySelector('#yardTalents');
      const kennel = animalPanel.querySelector('.kennel-panel');
      const shopping = next === 'shop';

      if (shopping && activeSubview !== 'shop') {
        restoreTalents = Boolean(talents && !talents.hidden);
      }

      if (rosterNav) rosterNav.hidden = shopping;
      if (shopping) {
        if (kennel) kennel.hidden = true;
        if (talents) talents.hidden = true;
        shopPanel.classList.remove('hidden');
      } else {
        shopPanel.classList.add('hidden');
        if (restoreTalents && talents) {
          talents.hidden = false;
          if (kennel) kennel.hidden = true;
        } else {
          if (talents) talents.hidden = true;
          if (kennel) kennel.hidden = false;
        }
      }

      activeSubview = next;
      trainingButton.classList.toggle('active', !shopping);
      shopTab.classList.toggle('active', shopping);
      trainingButton.setAttribute('aria-pressed', String(!shopping));
      shopTab.setAttribute('aria-pressed', String(shopping));
    };

    trainingButton.addEventListener('click', () => setTeamSubview('training'));
    shopTab.addEventListener('click', (event) => {
      event.preventDefault();
      setTeamSubview('shop');
    });
    window.addEventListener('wonder:locale-change', () => queueMicrotask(() => {
      refreshTeamCopy();
      setTeamSubview(activeSubview);
    }));
    localeSelect?.addEventListener('change', () => queueMicrotask(() => {
      refreshTeamCopy();
      setTeamSubview(activeSubview);
    }));

    refreshTeamCopy();
    setTeamSubview('training');
  }

  window.mountGuardYardFrame = () => {
    if (frame) return frame;
    ensureInterfaceCleanupStyles();
    const root = document.querySelector('.yard-game');
    const main = document.getElementById('mainPanel');
    const stage = document.getElementById('menuPanel');
    stage.dataset.wpStageLandscapeWidth = '760';
    stage.dataset.wpStageLandscapeHeight = '420';
    const battle = document.getElementById('playPanel');
    // Declare the content envelope to the shared scaler before its first fit.
    battle.dataset.wpBattleMinWidth = '390';
    battle.dataset.wpBattleMinHeight = '788';
    battle.dataset.wpBattleLandscapeWidth = '760';
    battle.dataset.wpBattleLandscapeHeight = '334';
    const localeSelect = document.getElementById('localeSelect');
    const mainHeader = root.querySelector('.topbar');
    const title = mainHeader.querySelector('h1');
    const retained = document.createElement('div'); retained.hidden = true;
    retained.append(localeSelect); root.append(retained);
    mainHeader.querySelector('.language-picker').remove();
    mainHeader.append(title); mainHeader.querySelector('.title-block').remove();
    title.setAttribute('data-wp-frame-title','');
    const mainContent = document.createElement('div');
    mainContent.append(...main.childNodes); main.append(mainHeader,mainContent);
    const copy = mainContent.querySelector('.main-entry-copy');
    copy.setAttribute('data-wp-frame-copy','');
    copy.querySelector('strong').hidden=true;
    copy.querySelector('[data-ui="menuHint"]').setAttribute('data-wp-frame-summary','');
    const progress = copy.querySelector('[data-ui="mainProgress"]');
    progress?.setAttribute('data-wp-frame-progress','');
    progress?.style.setProperty('min-height','40px','important');
    mainContent.querySelector('img').setAttribute('data-wp-frame-poster','');
    const start=document.getElementById('startGameBtn');
    start.removeAttribute('data-ui');
    start.setAttribute('data-wp-frame-action','primary');
    const refreshStartLabel=()=>{ start.textContent=START_LABELS[currentLocale(localeSelect)]; };
    refreshStartLabel();
    window.addEventListener('wonder:locale-change',()=>queueMicrotask(refreshStartLabel));
    localeSelect?.addEventListener('change',()=>queueMicrotask(refreshStartLabel));
    copy.append(start);
    const stageContent = stage.querySelector('.menu-shell');
    const stageHeader = stageContent.querySelector('.stage-screen-head');
    const stageTitle=stageHeader.querySelector('strong');
    stageTitle.setAttribute('data-wp-frame-title','');
    stageTitle.removeAttribute('data-ui');
    stageTitle.textContent='';
    stage.prepend(stageHeader);
    stageContent.querySelector('#stageTabPanel > .menu-copy')?.setAttribute('data-wp-retired-stage-title','');
    const wallet=stageContent.querySelector('.wallet-row');
    wallet.setAttribute('data-wp-frame-info','');
    wallet.style.setProperty('--wp-frame-stat-count', String(wallet.children.length));
    wallet.querySelectorAll(':scope > span').forEach(node=>node.setAttribute('data-wp-frame-stat',''));
    stageHeader.append(wallet);
    const nav=document.getElementById('menuTabs');
    nav.setAttribute('data-wp-frame-nav','');
    nav.setAttribute('data-wp-frame-stage-nav','');
    bindTeamShopSubview({ stageContent, nav, localeSelect });
    nav.querySelectorAll('button').forEach(n=>n.setAttribute('data-wp-frame-action','tab'));
    stage.append(nav);
    const battleContent=battle.querySelector('.fixed-game-shell');
    const battleHeader=battleContent.querySelector('.play-head');
    battleHeader.querySelector('[data-wp-return] .sr-only')?.remove();
    const battleTitle=document.createElement('strong'); battleTitle.setAttribute('data-wp-frame-title',''); battleHeader.append(battleTitle);
    // Keep the existing pause action distinct from shared sound preferences.
    const pause=document.getElementById('pauseBtn');
    pause.textContent='Ⅱ'; battleContent.querySelector('.yard-command-dock').append(pause);
    const info=battleHeader.querySelector('.resource-pill');
    const energy=document.createElement('span');
    energy.append(info.querySelector('.sun-icon'),document.getElementById('energyText'));
    const recovery=document.createElement('small'); recovery.id='energyRecovery';
    const energyValue=document.createElement('div'); energyValue.className='yard-energy-value';
    energyValue.append(energy.querySelector('#energyText'),recovery); energy.append(energyValue);
    info.style.setProperty('overflow','visible','important');
    energyValue.style.transform='translateY(-4px)';
    info.prepend(energy); battleContent.prepend(info);
    battle.prepend(battleHeader);
    frame=window.WeightPlayScreenFrame.mount({root,localeSelect,scenes:{
      main:{root:main,header:mainHeader,content:mainContent},
      stage:{root:stage,header:stageHeader,content:stageContent},
      battle:{root:battle,header:battleHeader,content:battleContent,headerInfo:info}
    }});
    return frame;
  };
})();
