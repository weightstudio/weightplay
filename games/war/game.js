(function () {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const loader = window.WeightPlayGameEntryLoader;
  const start = $('#startBtn');
  start.disabled = true;
  const tableStylesReady = [...document.styleSheets].some(sheet => {
    if (!sheet.href?.includes('/games/war/royal-table.css')) return false;
    try {return sheet.cssRules.length > 0;} catch {return false;}
  });
  if (!loader?.begin || !window.WeightPlayScreenFrame?.mount || !window.WPCardGamesNext?.mount
      || !window.WeightPlayBattleCanvas || !window.WPCardTablePresentation
      || !document.body.classList.contains('war-royal-table')
      || !tableStylesReady) {
    loader?.fail(undefined, () => location.reload());
    return;
  }
  // Required artwork, including the deck's court texture, gates first entry.
  const assets = ['/assets/card-games-war-cover.webp', '/assets/card-table/emerald-table-v1.webp',
    '/assets/klondike-solitaire-cards.webp', '/assets/klondike-solitaire-card-back.webp',
    '/assets/card-table/royal-courts-v1.webp'];
  loader.begin(assets.length);
  document.body.dataset.wpGameOwnedGuide = 'true';
  document.body.dataset.wpMainStartOnly = 'true';
  const main = $('#mainScreen'), battle = $('#battleScreen'), canvas = $('.card-game-battle');
  const guide = document.querySelector('.game-page-info');
  if (guide) {
    const heading = guide.querySelector('h2');
    if (heading) {heading.id = 'war-guide-title';guide.setAttribute('aria-labelledby', heading.id);}
  }
  const app = $('#warApp');
  $('#restartBtn')?.remove(); $('#newGameBtn')?.remove();
  window.WPCardGamesNext.mount({ id: 'war' });

  const header = main.querySelector('.main-header');
  const back = header.querySelector('a'); back.dataset.wpReturn = 'main';
  const title = document.createElement('h1');
  title.dataset.wpFrameTitle = ''; title.dataset.wpGameTitle = '';
  title.textContent = main.querySelector('[data-card-title]').textContent;
  header.querySelector('.header-utilities')?.remove();
  header.replaceChildren(back, title);
  const hero = main.querySelector('.main-hero'), copy = main.querySelector('.main-copy');
  const poster = hero.querySelector('img.cover'); poster.dataset.wpFramePoster = '';
  hero.querySelector('.poster-frame').replaceWith(poster);
  copy.dataset.wpFrameCopy = '';
  copy.querySelector('.main-actions').replaceWith(start);
  start.dataset.wpMainStart = ''; start.dataset.wpFrameAction = 'primary';
  copy.querySelector('[data-card-summary]').dataset.wpFrameSummary = '';
  const progress = $('[data-wp-main-progress]');
  if (progress) {progress.dataset.wpFrameProgress = '';progress.className = 'war-main-progress';}

  const battleHeader = $('.card-game-topbar');
  const table = $('.card-table-ui');
  canvas.prepend(battleHeader);
  const info = battleHeader.querySelector('.card-game-topbar-group');
  const battleTitle = document.createElement('h1'); battleTitle.dataset.wpFrameTitle = '';
  battleHeader.replaceChildren($('#battleBackBtn'), battleTitle);
  table.append(info);
  document.querySelector('.war-action-slot')?.remove();
  table.append(document.querySelector('#cardGameActions'));
  const frame = window.WeightPlayScreenFrame.mount({root: app, playUI: true,
    scenes: {main: {root:main, header, content:hero},
      battle: {root:canvas, header:battleHeader, content:table}}});
  const group = window.WeightPlayScreenFrame.createGroup();
  // Reuse the live score/status nodes as optional content in the common bar.
  for (const node of [...info.querySelector('.card-game-stats').children]) group.add(node);
  table.prepend($('#cardGameStatus'));
  info.remove(); frame.battleTopUI.add(group);
  $('#battleUtilityBtn')?.remove();
  const result = $('#resultOverlay'); canvas.append(result);
  let wasPlaying = false;
  const sync = () => {
    const playing = document.body.dataset.screen === 'battle' && !battle.hidden;
    const covered = playing && !result.hidden;
    frame.activate(playing ? 'battle' : 'main', {covered});
    window.WeightPlayBattleCanvas.sync();
    table.inert = covered || Boolean(battle.querySelector('[data-card-game-return-confirm]'));
    if (wasPlaying && !playing) requestAnimationFrame(() => start.focus({preventScroll:true}));
    wasPlaying = playing;
  };
  window.addEventListener('weightplay:shell-sync', sync);
  const resultObserver = new MutationObserver(sync);
  resultObserver.observe(result, {attributes:true, attributeFilter:['hidden']});
  sync();
  let settled = false, loaded = 0;
  const abort = new AbortController();
  const fail = () => {if (settled || abort.signal.aborted) return; settled = true; clearTimeout(timeout); abort.abort(); loader.fail(undefined, () => location.reload());};
  const timeout = setTimeout(fail, 20000);
  const pending = assets.map(src => new Promise((resolve,reject) => {
    const image = new Image();
    image.onload = () => {image.onload = image.onerror = null; if (!settled && !abort.signal.aborted) loader.assetProgress(++loaded, assets.length); resolve();};
    image.onerror = () => {image.onload = image.onerror = null; reject(new Error('WAR_ENTRY_ASSET'));};
    abort.signal.addEventListener('abort', () => {image.onload = image.onerror = null;}, {once:true});
    image.src = src;
  }));
  Promise.all(pending).then(() => requestAnimationFrame(() => {
    if (settled || abort.signal.aborted) return;
    settled = true; clearTimeout(timeout); abort.abort(); start.disabled = false; loader.ready();
  })).catch(fail);
  window.addEventListener('pagehide', event => {
    clearTimeout(timeout); abort.abort(); resultObserver.disconnect();
    if (!event.persisted) frame.destroy();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      if (!settled) {location.reload();return;}
      resultObserver.observe(result,{attributes:true,attributeFilter:['hidden']});sync();
    }
  });

  // Result is real game content inside the common Battle surface.
  const resultButtons = () => [...result.querySelectorAll('button:not([disabled])')].filter(n => n.getClientRects().length);
  let wasCovered = false;
  const focusResult = new MutationObserver(() => {
    if (!result.hidden && !wasCovered) requestAnimationFrame(() => resultButtons()[0]?.focus({preventScroll:true}));
    if (result.hidden && wasCovered) requestAnimationFrame(() => ($('#cardGameActions button:not([disabled])') || $('#battleBackBtn'))?.focus({preventScroll:true}));
    wasCovered = !result.hidden;
  });
  focusResult.observe(result,{attributes:true,attributeFilter:['hidden']});
  result.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = resultButtons(), first = controls[0], last = controls.at(-1);
    if (event.shiftKey && (document.activeElement === first || !result.contains(document.activeElement))) {event.preventDefault();last?.focus();}
    else if (!event.shiftKey && (document.activeElement === last || !result.contains(document.activeElement))) {event.preventDefault();first?.focus();}
  });
  window.addEventListener('pagehide', () => focusResult.disconnect());
  window.addEventListener('pageshow', event => {if(event.persisted)focusResult.observe(result,{attributes:true,attributeFilter:['hidden']});});
})();
