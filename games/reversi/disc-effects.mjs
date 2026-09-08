// Presentation only: the rules engine remains the sole board-state owner.
export function installDiscEffects(host) {
  if (!host) return () => {};
  const active = new Set();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let prior = [], priorBoard = null;
  const clear = () => { for (const a of active) a.cancel(); active.clear(); };
  const colors = {
    black: 'radial-gradient(circle at 32% 23%,#64737d 0%,#23343d 27%,#081216 68%)',
    white: 'radial-gradient(circle at 32% 23%,#fffefa 0%,#f7ecd3 40%,#b7ab91 95%)'
  };
  const read = () => {
    const board = host.querySelector('.logic-reversi-board');
    const cells = board ? [...board.children] : [];
    const next = cells.map(c => c.classList.contains('black') ? 'black' : c.classList.contains('white') ? 'white' : '');
    const count = values => values.filter(Boolean).length;
    // Reset, replay, initial mount and cosmetic rerender never become moves.
    if (board === priorBoard && count(next) === count(prior) + 1 && !reduced.matches && !document.hidden) {
      clear();
      let n = 0;
      cells.forEach((cell, i) => {
        const disc = cell.querySelector('.disc');
        if (!disc || !next[i] || next[i] === prior[i]) return;
        const frames = prior[i] ? [
          {transform:'perspective(180px) rotateY(0deg)', backgroundImage:colors[prior[i]]},
          {transform:'perspective(180px) rotateY(90deg)', backgroundImage:colors[prior[i]], offset:.49},
          {transform:'perspective(180px) rotateY(90deg)', backgroundImage:colors[next[i]], offset:.5},
          {transform:'perspective(180px) rotateY(0deg)', backgroundImage:colors[next[i]]}
        ] : [{transform:'scale(.65)',opacity:.6},{transform:'scale(1)',opacity:1}];
        const animation = disc.animate(frames, {duration:180,delay:Math.min(n++ * 12,48),easing:'ease-in-out'});
        active.add(animation); animation.finished.catch(() => {}).finally(() => active.delete(animation));
      });
    } else if (board !== priorBoard || count(next) < count(prior)) clear();
    prior = next; priorBoard = board;
  };
  const observer = new MutationObserver(read);
  observer.observe(host, {childList:true,subtree:true}); read();
  const visibility = () => { if(document.hidden) clear(); };
  document.addEventListener('visibilitychange',visibility);
  const dispose = () => { clear(); observer.disconnect(); document.removeEventListener('visibilitychange',visibility); window.removeEventListener('pagehide',dispose); };
  window.addEventListener('pagehide',dispose,{once:true});
  return dispose;
}
