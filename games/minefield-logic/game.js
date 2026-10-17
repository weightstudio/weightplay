/* Minefield v19: authored campaign data in the shared I9 Stage and screen frame. */
(() => {
  'use strict';
  const root = document.querySelector('#logicApp');
  if (!root || root.dataset.mfBooting) return;
  root.dataset.mfBooting = '19';
  // Claim declared slots synchronously: the shared bootstrap must not start its
  // legacy DOM-discovery controller while the module graph is loading.
  root.setAttribute('data-wp-frame-root', '');
  const base = new URL('.', document.currentScript.src);
  const version = '20261017-minefield-v19-i9-shared-stage1';
  const asset = name => new URL(`/src/${name}`, location.origin).href;
  document.querySelectorAll('link[rel="stylesheet"][href*="classic-logic-lab.css"]').forEach(link => link.remove());
  function style(url) {
    const existing = [...document.querySelectorAll('link[rel="stylesheet"]')].find(link => link.href.split('?')[0] === url.split('?')[0]);
    if (existing?.sheet) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const link = existing || document.createElement('link'); link.rel = 'stylesheet';
      link.addEventListener('load', resolve, { once: true }); link.addEventListener('error', reject, { once: true });
      link.href = url; if (!existing) document.head.append(link);
    });
  }
  function script(name, ready) {
    if (ready()) return Promise.resolve();
    const url = asset(name);
    const existing = [...document.scripts].find(node => node.src.split('?')[0] === url);
    return new Promise((resolve, reject) => {
      const node = existing || document.createElement('script');
      node.addEventListener('load', () => ready() ? resolve() : reject(new Error(`Shared service unavailable: ${name}`)), { once: true });
      node.addEventListener('error', reject, { once: true });
      if (!existing) { node.src = `${url}?v=${version}`; node.async = true; document.head.append(node); }
    });
  }
  const domReady = document.readyState === 'loading' ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true })) : Promise.resolve();
  window.__weightPlayScreenFrameRequested = true;
  Promise.all([
    domReady,
    style(`${asset('game-ui-theme.css')}?v=${version}`),
    style(`${asset('game-screen-frame.css')}?v=${version}`),
    style(`${asset('interface9-shared-screens.css')}?v=${version}`),
    style(`${asset('game-play-ui.css')}?v=${version}`),
    style(new URL(`game.css?v=${version}`, base).href),
  ])
    .then(() => script('game-screen-frame.js', () => window.WeightPlayScreenFrame?.version === 7))
    .then(() => script('stage-rail-i9.js', () => typeof window.WeightPlayStageRailI9?.attachLogical === 'function'))
    .then(() => script('game-play-ui.js', () => window.WeightPlayPlayUI?.version === 1))
    .then(() => import(new URL(`interface.mjs?v=${version}`, base).href))
    .then(module => {
      module.mountMinefield();
      // Cosmetic failure must not replace an otherwise playable game.
      return import(new URL(`presentation.mjs?v=${version}`, base).href)
        .then(presentation => presentation.mountMinefieldPresentation(root))
        .catch(error => console.warn('Minefield presentation unavailable', error))
        .finally(() => window.WeightPlayGameEntryLoader?.ready?.());
    })
    .catch(error => {
      console.error('Minefield startup failed', error);
      window.WeightPlayGameEntryLoader?.fail?.(error.message);
      const errors = {
        en: 'The game could not load. Please reload the page.',
        'zh-Hant': '遊戲未能載入，請重新整理頁面。', 'zh-Hans': '游戏未能载入，请刷新页面。',
        ja: 'ゲームを読み込めませんでした。ページを再読み込みしてください。', ko: '게임을 불러오지 못했습니다. 페이지를 새로 고침하세요.',
        es: 'No se pudo cargar el juego. Recarga la página.', 'pt-BR': 'Não foi possível carregar o jogo. Recarregue a página.',
        fr: 'Le jeu n’a pas pu se charger. Rechargez la page.', de: 'Das Spiel konnte nicht geladen werden. Lade die Seite neu.',
        it: 'Impossibile caricare il gioco. Ricarica la pagina.', ru: 'Не удалось загрузить игру. Обновите страницу.',
        hi: 'खेल लोड नहीं हुआ। पृष्ठ फिर से लोड करें।', ar: 'تعذر تحميل اللعبة. أعد تحميل الصفحة.'
      };
      const message = document.createElement('p'); message.setAttribute('role', 'alert');
      message.setAttribute('data-runtime-localize', 'off'); message.textContent = errors[document.documentElement.lang] || errors.en;
      root.replaceChildren(message);
    });
})();
