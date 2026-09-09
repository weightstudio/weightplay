(() => {
  const base = document.currentScript.src;
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = new URL('style.css?v=20260909-mahjong-main-v13', base).href;
  document.head.append(style);
  Promise.all([import(new URL('rules.mjs?v=20260909-mahjong-main-v13', base).href),import(new URL('art.mjs?v=20260909-mahjong-main-v13', base).href)]).then(([{ default: rules },{installMahjongArt}]) => {
    window.WPMahjong = rules;
    installMahjongArt();
    window.WPPopularArcade?.mount('mahjong-solitaire');
  }).catch(error => {
    console.error('Mahjong rules could not load', error);
    const button = document.querySelector('#startBtn');
    if (button) button.disabled = true;
  });
})();
