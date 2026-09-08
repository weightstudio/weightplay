// Visual marks only; text, accessible labels, disabled states and click handlers stay native.
(function(){
 'use strict';
 const root=document.querySelector('#battleScreen .board');if(!root)return;
 document.body.classList.add('tic-royal-board');document.body.dataset.gameVersion='v20';
 let previous=[];
 function decorate(){
  const cells=[...root.querySelectorAll('.tic-cell')],current=cells.map(cell=>cell.textContent.trim());
  cells.forEach((cell,index)=>{const mark=current[index];if(mark!=='X'&&mark!=='O')return;cell.dataset.piece=mark;if(previous[index]!==mark)cell.classList.add('tic-piece-arrival');});
  previous=current;
 }
 const observer=new MutationObserver(decorate);
 function connect(){observer.observe(root,{childList:true});decorate();}
 window.addEventListener('pagehide',()=>observer.disconnect());window.addEventListener('pageshow',event=>{if(event.persisted)connect();});connect();
})();
