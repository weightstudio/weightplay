(() => {
  const base = document.currentScript.src;
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = new URL('style.css?v=20260908-mahjong-rules-v11', base).href;
  document.head.append(style);
  import(new URL('rules.mjs?v=20260908-mahjong-rules-v11', base).href).then(({ default: rules }) => {
    window.WPMahjong = rules;
    window.WPPopularArcade?.mount('mahjong-solitaire');
  }).catch(error => {
    console.error('Mahjong rules could not load', error);
    const button = document.querySelector('#startBtn');
    if (button) button.disabled = true;
  });
})();
