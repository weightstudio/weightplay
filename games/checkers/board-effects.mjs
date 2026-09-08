// Watches only the existing board host. No game-state mutation or polling.
export function installBoardEffects(host){
 if(!host)return ()=>{};
 let previous=null,disposed=false;const running=new Set();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clear=()=>{for(const animation of running)animation.cancel();running.clear();};
 const read=()=>{
  clear();const board=host.querySelector('.checkers-board');
  if(!board){previous=null;return;}
  const next={human:board.dataset.lastHuman,ai:board.dataset.lastAi};
  if(previous&&!reduced.matches&&!document.hidden){
   for(const [actor,css] of [['human','human'],['ai','ai']]){
    if(!next[actor]||next[actor]===previous[actor])continue;
    const piece=board.querySelector(`.last-${css}-to .checker-piece`);
    if(!piece?.animate)continue;
    const animation=piece.animate([{transform:'scale(.91)',filter:'brightness(1.35)'},{transform:'scale(1.06)',offset:.4,filter:'brightness(1.14)'},{transform:'scale(1)',filter:'brightness(1)'}],{duration:260,easing:'ease-out'});
    running.add(animation);animation.finished.catch(()=>{}).finally(()=>running.delete(animation));
   }
  }
  previous=next;
 };
 const observer=new MutationObserver(read);observer.observe(host,{childList:true});read();
 const visibility=()=>{if(document.hidden)clear();};
 document.addEventListener('visibilitychange',visibility);
 const dispose=()=>{if(disposed)return;disposed=true;clear();observer.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',dispose);};
 window.addEventListener('pagehide',dispose,{once:true});return dispose;
}
