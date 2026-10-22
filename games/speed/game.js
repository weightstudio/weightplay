(function () {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const loader = window.WeightPlayGameEntryLoader;
  const start = $('#startBtn');
  start.disabled = true;
  if (!loader?.begin || !window.WeightPlayScreenFrame?.mount || !window.WPCardGamesNext?.mount
      || !window.WeightPlayBattleCanvas || !window.WPCardTablePresentation) {
    loader?.fail(undefined, () => location.reload());
    return;
  }
  // Required artwork, including the deck's court texture, gates first entry.
  const assets = ['/assets/card-games-speed-cover.webp', '/assets/card-table/emerald-table-v1.webp',
    '/assets/klondike-solitaire-cards.webp', '/assets/klondike-solitaire-card-back.webp',
    '/assets/card-table/royal-courts-v1.webp'];
  loader.begin(assets.length);
  document.body.dataset.wpGameOwnedGuide = 'true';
  document.body.dataset.wpMainStartOnly = 'true';
  const main = $('#mainScreen'), battle = $('#battleScreen'), canvas = $('.card-game-battle');
  const guide = main.querySelector('.game-page-info');
  if (guide) main.after(guide);
  $('#restartBtn')?.remove(); $('#newGameBtn')?.remove();
  window.WPCardGamesNext.mount({ id: 'speed' });

  const header = main.querySelector('.main-header');
  const back = header.querySelector('a'); back.dataset.wpReturn = 'main';
  const title = document.createElement('h1');
  title.dataset.wpFrameTitle = ''; title.textContent = main.querySelector('[data-card-title]').textContent;
  // Keep obsolete source controls out of the visible tree. Shared Settings
  // owns locale navigation; the old engine's reload listener stays unused.
  const sources = document.createElement('div'); sources.hidden = true;
  const utilities = header.querySelector('.header-utilities');
  if (utilities) sources.append(utilities);
  document.body.append(sources);
  header.replaceChildren(back, title);
  const hero = main.querySelector('.main-hero'), copy = main.querySelector('.main-copy');
  const poster = hero.querySelector('img.cover'); poster.dataset.wpFramePoster = '';
  hero.querySelector('.poster-frame').replaceWith(poster);
  copy.dataset.wpFrameCopy = '';
  copy.querySelector('.main-actions').replaceWith(start);
  start.dataset.wpMainStart = ''; start.dataset.wpPrimaryAction = '';
  copy.querySelector('[data-card-summary]').dataset.wpFrameSummary = '';
  const progress = $('[data-wp-main-progress]');
  if (progress) progress.dataset.wpFrameProgress = '';

  const battleHeader = $('.card-game-topbar');
  const table = $('.card-table-ui');
  canvas.prepend(battleHeader);
  const info = battleHeader.querySelector('.card-game-topbar-group');
  const battleTitle = document.createElement('h1'); battleTitle.dataset.wpFrameTitle = '';
  battleHeader.replaceChildren($('#battleBackBtn'), battleTitle);
  table.append(info);
  const frame = window.WeightPlayScreenFrame.mount({root: document.body, playUI: true,
    scenes: {main: {root:main, header, content:hero},
      battle: {root:canvas, header:battleHeader, content:table}}});
  const group = window.WeightPlayScreenFrame.createGroup();
  // Reuse the live score/status nodes as optional content in the common bar.
  for (const node of [...info.querySelector('.card-game-stats').children, $('#cardGameStatus')]) group.add(node);
  info.remove(); frame.battleTopUI.add(group);
  $('#battleUtilityBtn')?.remove();
  const result = $('#resultOverlay'); canvas.append(result);
  const sync = () => {
    const playing = document.body.dataset.screen === 'battle' && !battle.hidden;
    const covered = playing && !result.hidden;
    frame.activate(playing ? 'battle' : 'main', {covered});
    table.inert = covered || Boolean(battle.querySelector('[data-card-game-return-confirm]'));
  };
  window.addEventListener('weightplay:shell-sync', sync);
  const resultObserver = new MutationObserver(sync);
  resultObserver.observe(result, {attributes:true, attributeFilter:['hidden']});
  sync();
  let settled = false, loaded = 0;
  const abort = new AbortController();
  const fail = () => {if (settled || abort.signal.aborted) return; settled = true; clearTimeout(timeout); loader.fail(undefined, () => location.reload());};
  const timeout = setTimeout(fail, 20000);
  const pending = assets.map(src => new Promise((resolve,reject) => {
    const image = new Image();
    image.onload = () => {image.onload = image.onerror = null; if (!settled && !abort.signal.aborted) loader.assetProgress(++loaded, assets.length); resolve();};
    image.onerror = () => {image.onload = image.onerror = null; reject(new Error('SPEED_ENTRY_ASSET'));};
    abort.signal.addEventListener('abort', () => {image.onload = image.onerror = null;}, {once:true});
    image.src = src;
  }));
  Promise.all(pending).then(() => requestAnimationFrame(() => {
    if (settled || abort.signal.aborted) return;
    settled = true; clearTimeout(timeout); start.disabled = false; loader.ready();
  })).catch(fail);
  window.addEventListener('pagehide', event => {
    clearTimeout(timeout); abort.abort(); resultObserver.disconnect();
    if (!event.persisted) frame.destroy();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) {resultObserver.observe(result,{attributes:true,attributeFilter:['hidden']});sync();}
  });

  const shellCopy = {
    en: { start: "Start Game", restart: "Restart", newGame: "New Game", close: "Close", howTo: "How to play" },
    "zh-Hant": { start: "開始遊戲", restart: "重新開始", newGame: "新遊戲", close: "關閉", howTo: "玩法說明" },
    "zh-Hans": { start: "开始游戏", restart: "重新开始", newGame: "新游戏", close: "关闭", howTo: "玩法说明" },
    ja: { start: "ゲーム開始", restart: "再スタート", newGame: "新しいゲーム", close: "閉じる", howTo: "遊び方" },
    ko: { start: "게임 시작", restart: "다시 시작", newGame: "새 게임", close: "닫기", howTo: "플레이 방법" },
    es: { start: "Empezar", restart: "Reiniciar", newGame: "Nueva partida", close: "Cerrar", howTo: "Cómo jugar" },
    "pt-BR": { start: "Começar jogo", restart: "Reiniciar", newGame: "Novo jogo", close: "Fechar", howTo: "Como jogar" },
    fr: { start: "Commencer", restart: "Recommencer", newGame: "Nouvelle partie", close: "Fermer", howTo: "Comment jouer" },
    de: { start: "Spiel starten", restart: "Neu starten", newGame: "Neues Spiel", close: "Schließen", howTo: "Spielanleitung" },
    it: { start: "Inizia", restart: "Ricomincia", newGame: "Nuova partita", close: "Chiudi", howTo: "Come giocare" },
    ru: { start: "Начать игру", restart: "Заново", newGame: "Новая игра", close: "Закрыть", howTo: "Как играть" },
    hi: { start: "खेल शुरू करें", restart: "फिर शुरू करें", newGame: "नया खेल", close: "बंद करें", howTo: "कैसे खेलें" },
    ar: { start: "ابدأ اللعبة", restart: "إعادة البدء", newGame: "لعبة جديدة", close: "إغلاق", howTo: "طريقة اللعب" },
  };

  const applyShellCopy = () => {
    const locale = document.documentElement.lang || "en";
    const copy = shellCopy[locale] || shellCopy.en;
    const controls = document.querySelectorAll("#startBtn, #restartBtn, #newGameBtn, #resultNewGame, #resultRestart, #resultClose, [data-card-main-controls] button");
    controls.forEach((control) => control.setAttribute("data-runtime-localize", "off"));
    const start = document.querySelector("#startBtn");
    const restart = document.querySelector("#restartBtn");
    const newGame = document.querySelector("#newGameBtn");
    if (start) start.textContent = copy.start;
    if (restart) restart.textContent = copy.restart;
    if (newGame) newGame.textContent = copy.newGame;
    const resultNewGame = document.querySelector("#resultNewGame");
    const resultRestart = document.querySelector("#resultRestart");
    const resultClose = document.querySelector("#resultClose");
    if (resultNewGame) resultNewGame.textContent = copy.newGame;
    if (resultRestart) resultRestart.textContent = copy.restart;
    if (resultClose) {
      resultClose.textContent = copy.close;
      resultClose.setAttribute("aria-label", copy.close);
    }
    const guideHeading = document.querySelector(".card-game-quick-guide strong");
    if (guideHeading) {
      guideHeading.textContent = copy.howTo;
      guideHeading.setAttribute("data-runtime-localize", "off");
    }
  };

  applyShellCopy();
  window.setTimeout(applyShellCopy, 0);
  window.setTimeout(applyShellCopy, 350);
  window.setTimeout(applyShellCopy, 1000);
  window.setTimeout(applyShellCopy, 1800);
})();
