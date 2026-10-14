// Visual marks only; text, accessible labels, disabled states and click handlers stay native.
(function(){
 'use strict';
 const root=document.querySelector('#battleScreen .board');if(!root)return;
 document.body.classList.add('tic-royal-board');document.body.dataset.gameVersion='v37';
 let previous=[];
 function decorate(){
  const cells=[...root.querySelectorAll('.tic-cell')],current=cells.map(cell=>cell.textContent.trim());
  cells.forEach((cell,index)=>{const mark=current[index];if(mark!=='X'&&mark!=='O')return;cell.dataset.piece=mark;if(previous[index]!==mark)cell.classList.add('tic-piece-arrival');});
  previous=current;
 }
 let connected=false,pageHidden=false;
 const active=()=>!pageHidden&&document.body.dataset.screen==='battle'&&window.WeightPlayTicUiClock?.active===true;
 const observer=new MutationObserver(records=>{if(records.length&&connected&&active())decorate();});
 function sync(){const enabled=active();if(enabled===connected)return;connected=enabled;if(enabled){observer.observe(root,{childList:true});decorate();}else observer.disconnect();}
 window.WeightPlayTicBoardPresentation=Object.freeze({sync});
 window.addEventListener('weightplay:shell-sync',sync);window.addEventListener('weightplay:interaction-state',sync);document.addEventListener('visibilitychange',sync);window.addEventListener('blur',sync);window.addEventListener('focus',sync);
 window.addEventListener('pagehide',()=>{pageHidden=true;sync();});window.addEventListener('pageshow',()=>{pageHidden=false;sync();});sync();
})();
