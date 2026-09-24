/* Pure discrete rules shared by pointer, touch, keyboard and the solver. */
(function(root){
  'use strict';
  const key=p=>`${p.x},${p.y},${p.w},${p.h}`;
  const legal=p=>p && ['x','y','w','h'].every(k=>Number.isInteger(p[k])) && p.w>0 && p.h>0 && p.x>=0 && p.y>=0 && p.x+p.w<=4 && p.y+p.h<=3;
  function crop(card,p){
    if(!legal(p))return [];
    const result=[];
    for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)result.push(card.cells[y*4+x]);
    return result;
  }
  function evaluate(card,p){
    const inside=crop(card,p);
    const missing=card.targets.filter(v=>!inside.includes(v));
    const unwanted=card.avoid.filter(v=>inside.includes(v));
    const corner=legal(p) && (card.corner===null || [p.y*4+p.x,p.y*4+p.x+p.w-1,(p.y+p.h-1)*4+p.x,(p.y+p.h-1)*4+p.x+p.w-1].some(i=>card.cells[i]===card.corner));
    const shape=(p?.w===card.start.w && p?.h===card.start.h)||(card.rotate && p?.w===card.start.h && p?.h===card.start.w);
    return {ok:legal(p)&&shape&&!missing.length&&!unwanted.length&&corner,missing,unwanted,corner,inside};
  }
  function step(card,p,action){
    if(!legal(p))return null;
    const n={...p};
    if(action==='left')n.x--;else if(action==='right')n.x++;else if(action==='up')n.y--;else if(action==='down')n.y++;
    else if(action==='rotate' && card.rotate && p.w!==p.h){n.w=p.h;n.h=p.w;n.x=Math.min(n.x,4-n.w);n.y=Math.min(n.y,3-n.h);}
    else return null;
    return legal(n)?n:null;
  }
  function solve(card,start=card.start){
    if(!legal(start))return null;
    const queue=[{p:{...start},path:[]}],seen=new Set([key(start)]);
    for(let i=0;i<queue.length;i++){
      const {p,path}=queue[i];
      if(evaluate(card,p).ok)return path;
      for(const action of ['up','right','down','left','rotate']){
        const next=step(card,p,action);
        if(next&&!seen.has(key(next))){seen.add(key(next));queue.push({p:next,path:[...path,action]});}
      }
    }
    return null;
  }
  function stars(moves,par,errors,hinted){
    if(!hinted&&errors===0&&moves<=par)return 3;
    return errors<=1&&moves<=par+3?2:1;
  }
  function sanitizeSave(raw,count){
    const empty={version:5,medals:Array(count).fill(0)};
    if(!raw||raw.version!==5||!Array.isArray(raw.medals))return empty;
    return {version:5,medals:empty.medals.map((_,i)=>Number.isInteger(raw.medals[i])&&raw.medals[i]>=0&&raw.medals[i]<=3?raw.medals[i]:0)};
  }
  const api=Object.freeze({legal,crop,evaluate,step,solve,stars,sanitizeSave});
  root.PostcardCropEngine=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
