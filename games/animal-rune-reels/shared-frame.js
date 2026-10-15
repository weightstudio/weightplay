/* Presentation adapter: native game data, actions and schedulers stay game-owned. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const root = $('#app'), main = $('.main-canvas'), stage = $('.stage-canvas'), battle = $('.battle-canvas');
  if (!root || !main || !stage || !battle || !window.WeightPlayScreenFrame) throw Error('RUNE_FRAME_SLOTS_REQUIRED');
  const locale = $('#localeSelect');
  const mainHeader = main.querySelector('header'), stageHeader = stage.querySelector('header'), battleHeader = battle.querySelector('header');
  const title = mainHeader.querySelector('h1'); title.dataset.wpFrameTitle = '';
  stageHeader.querySelector('h2').dataset.wpFrameTitle = '';
  const battleTitle = document.createElement('strong'); battleTitle.dataset.wpFrameTitle = ''; battleHeader.append(battleTitle);
  const legacy = document.createElement('div'); legacy.hidden = true; legacy.append($('.main-utilities')); main.append(legacy);
  const mainContent = document.createElement('div'); mainContent.className = 'rune-main-content';
  const poster = main.querySelector('.poster'), copy = main.querySelector('.main-copy');
  poster.dataset.wpFramePoster = ''; copy.dataset.wpFrameCopy = ''; copy.querySelector('.lead').dataset.wpFrameSummary = '';
  $('#mainProgress').dataset.wpFrameProgress = ''; $('#runeStartBtn').dataset.wpFrameAction = 'primary';
  mainContent.append(poster, copy); main.append(mainContent);
  const stageContent = $('.stage-workspace'), nav = $('.stage-tabs'); nav.dataset.wpFrameStageNav = '';
  for (const button of nav.querySelectorAll('button')) { button.dataset.wpFrameStageSlot = button.dataset.tab; button.dataset.wpFrameAction = 'tab'; }
  stageContent.dataset.wpScrollOwner = ''; stage.dataset.wpStageWorkspace = '';
  const retiredStage = document.createElement('div'); retiredStage.hidden = true; retiredStage.append($('#enterBattle')); stage.append(retiredStage);
  // Preserve native controls and listeners; their content belongs in the workspace.
  const progress = $('#stagesPanel > .progress-card') || stageHeader.querySelector('.progress-card');
  if (progress) $('#stagesPanel').prepend(progress);
  $('#equipmentWorkspace .workspace-subtabs').append($('#helpBtn'));
  const battleContent = document.createElement('div'); battleContent.className = 'rune-battle-content';
  const battleInfo = document.createElement('div'), stageInfo = document.createElement('div');
  for (const node of [$('#battleStage'), $('#waveText')]) { const stat = document.createElement('div'); stat.append(node); battleInfo.append(stat); }
  stageInfo.append(progress); stageContent.append(stageInfo); battleContent.append(battleInfo);
  const retiredBattle = document.createElement('div'); retiredBattle.hidden = true; retiredBattle.append(battleHeader.querySelector('.stage-name')); battle.append(retiredBattle);
  const decisions = document.createElement('div'); decisions.className = 'rune-decision-track'; decisions.dataset.wpFrameLogicalActions = 'battle';
  decisions.append($('#tacticsPanel'), $('.battle-actions'), $('#speedBtn')); $('.reel-console').append(decisions);
  $('#speedBtn').dataset.wpFrameAction = 'secondary';
  battleContent.append($('#arena'), $('.reel-console')); battle.append(battleContent);
  // Stage details stay in the Stage Canvas; only its covered content becomes inert.
  stage.append($('#characterModal'), $('#summonResult'));
  const guide = $('section.game-page-info-static');
  const nativeGuide = $('#mainPage > .guide');
  if (guide && nativeGuide) { nativeGuide.classList.remove('game-page-info','guide'); nativeGuide.classList.add('game-info-section'); guide.querySelector('.game-info-sections').prepend(nativeGuide); }
  if (guide) { guide.id = 'runeGuideDocument'; root.after(guide); }
  for (const canvas of [stage, battle]) { canvas.dataset.wpFramePlayFill = ''; canvas.dataset.wpFrameLogicalHeader = canvas === stage ? 'stage' : 'battle'; }
  battle.dataset.wpBattleCanvasRoot = '';
  for (const container of battle.querySelectorAll('.battle-actions,.tactics-actions,.result-actions')) {
    container.dataset.wpFrameLogicalActions = 'battle';
    for (const button of container.querySelectorAll('button')) button.dataset.wpFrameAction = button.id === 'spinBtn' ? 'primary' : 'secondary';
  }
  for (const modal of battle.querySelectorAll('.modal')) {
    modal.dataset.wpBattleSubstate = modal.id;
    const card = modal.querySelector('.modal-card');
    const actions = card.querySelector('.result-actions') || document.createElement('div');
    actions.classList.add('rune-modal-actions'); actions.dataset.wpFrameLogicalActions = 'battle';
    if (!actions.isConnected) { for (const button of [...card.children].filter(n => n.tagName === 'BUTTON')) actions.append(button); card.append(actions); }
    for (const button of actions.querySelectorAll('button')) button.dataset.wpFrameAction = button.classList.contains('primary') ? 'primary' : 'secondary';
    const prose = document.createElement('div'); prose.className = 'rune-modal-copy';
    for (const node of [...card.children].filter(n => n !== actions)) prose.append(node);
    card.prepend(prose);
  }
  $('#tutorialClose').dataset.wpTutorialNext = '';
  const frame = window.WeightPlayScreenFrame.mount({root,localeSelect:locale,scenes:{
    main:{root:main,header:mainHeader,content:mainContent},
    stage:{root:stage,header:stageHeader,content:stageContent,headerInfo:stageInfo},
    battle:{root:battle,header:battleHeader,content:battleContent,headerInfo:battleInfo},
  }});
  const sync = () => {
    const scene = document.body.dataset.screen || 'main';
    if (!['main','stage','battle'].includes(scene)) return;
    const modal = (scene === 'battle' ? battle : stage).querySelector('.modal:not([hidden]),.global-modal:not([hidden])');
    frame.activate(scene,{covered:!!modal});
    if (guide) { guide.hidden = scene !== 'main'; guide.inert = scene !== 'main'; }
    battleContent.inert = scene !== 'battle' || !!modal;
    battle.dataset.wpBattleSubstate = scene === 'battle' ? modal?.id || 'live' : 'inactive';
    window.WeightPlayBattleCanvas?.sync();
  };
  window.addEventListener('weightplay:shell-sync',sync);
  const observer = new MutationObserver(sync);
  for (const modal of root.querySelectorAll('.modal,.global-modal')) observer.observe(modal,{attributes:true,attributeFilter:['hidden']});
  // The native capture handler persists its locale and owns route navigation.
  main.querySelector('#wp-frame-main-locale')?.addEventListener('change',event=>event.stopPropagation());
  window.WeightPlayRuneFrame = Object.freeze({sync,frame});
  sync();
})();
