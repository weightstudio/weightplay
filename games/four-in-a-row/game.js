window.WPClassicLogic?.mount("four-in-a-row");
(() => {
  document.body.dataset.gameVersion = 'v9';
  const skin = document.createElement('link');
  skin.rel = 'stylesheet';
  skin.href = '/games/four-in-a-row/royal-board.css?v=20260909-v9';
  document.head.append(skin);
  const host = document.querySelector('#logicBoard');
  if (!host) return;
  let board = null;
  let previous = [];
  const decorate = () => {
    const current = host.querySelector('.logic-connect-board');
    if (!current) { board = null; previous = []; return; }
    if (current !== board) { board = current; previous = []; }
    const cells = [...board.children];
    if (cells.length !== 42) return;
    const values = cells.map(c => c.classList.contains('red') ? 1 : c.classList.contains('yellow') ? 2 : 0);
    cells.forEach((cell, i) => {
      if (previous.length && values[i] && !previous[i]) {
        cell.classList.add('disc-arrived');
        cell.style.setProperty('--drop-distance', `${-(Math.floor(i / 7) + 1) * cell.getBoundingClientRect().height}px`);
      }
    });
    for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
      if (!values[r * 7 + c]) continue;
      for (const [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
        const line = Array.from({length:4}, (_,k) => [r + dr*k, c + dc*k]);
        if (line.every(([y,x]) => y>=0&&y<6&&x>=0&&x<7&&values[y*7+x]===values[r*7+c]))
          line.forEach(([y,x]) => cells[y*7+x].classList.add('winning-disc'));
      }
    }
    previous = values;
  };
  // Start/return can replace the board itself; observe only its stable host.
  // Decoration changes attributes, never children, so it cannot retrigger us.
  // No whole-page watcher,
  // polling, game-state mutation, or animation of unchanged pieces.
  const observer = new MutationObserver(decorate);
  observer.observe(host, {childList:true, subtree:true});
  decorate();
  addEventListener('pagehide', () => observer.disconnect());
  addEventListener('pageshow', () => { observer.observe(host,{childList:true,subtree:true}); decorate(); });
})();
