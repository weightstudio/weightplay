(() => {
 const base=document.currentScript.src;
 const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('royal-board.css?v=20260909-checkers-royal-v19',base).href;document.head.append(style);
 window.WPPopularArcade?.mount('checkers');
 import(new URL('board-effects.mjs?v=20260909-checkers-royal-v19',base).href).then(({installBoardEffects})=>installBoardEffects(document.getElementById('board'))).catch(error=>console.warn('Checkers cosmetic feedback unavailable',error));
})();
