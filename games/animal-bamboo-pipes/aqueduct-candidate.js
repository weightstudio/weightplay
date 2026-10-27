(() => {
"use strict";
// Isolated 31–60 design. Not loaded by the game or an acceptance artifact.
// Player actions use a shared 5x5 board; source/destination remain old shapes.
const designs=[
 [31,'S',1,0,0],[32,'S',1,0,0],[33,'O',1,0,0],[34,'O',1,0,0],[35,'SO',1,0,0],
 [36,'SS',1,0,0],[37,'OO',1,0,0],[38,'SO',1,0,0],[39,'OS',1,0,0],[40,'SO',1,0,1],
 [41,'SS',1,0,1],[42,'OO',1,0,1],[43,'SO',1,0,1],[44,'OS',1,0,2],[45,'SOS',1,0,2],
 [46,'SO',1,1,0],[47,'OS',1,1,0],[48,'SO',1,1,1],[49,'OO',1,1,1],[50,'SOS',1,1,1],
 [51,'SSO',1,1,1],[52,'OSO',1,1,1],[53,'SOO',2,1,1],[54,'OSS',2,1,2],[55,'SOO',2,2,1],
 [56,'OSO',2,2,1],[57,'SOS',2,2,2],[58,'OOS',2,2,2],[59,'SSO',2,2,2],[60,'OSO',2,2,2]
];
const CHAPTER2=Object.freeze(designs.map(([id,modes,pins,receivers,sluices])=>Object.freeze({id,seed:id===55?90:id===56?92:id+29,modes,pins,receivers,sluices,checkpoint:id%5===0})));
const dirs=[[-1,0],[0,1],[1,0],[0,-1]],mod=x=>(x%4+4)%4;
function neighbor(i,d){const row=Math.floor(i/5)+dirs[d][0],col=i%5+dirs[d][1];return row<0||row>=5||col<0||col>=5?-1:row*5+col}
function ports(api,tile,solved=false){if(tile.shape==='blocked')return [];if(tile.target||tile.receiver)return [0,1,2,3];return api.raw[tile.shape].map(p=>mod(p+(solved?tile.solved:tile.rot)))}
function exitBetween(a,b){return dirs.findIndex((_,d)=>neighbor(a,d)===b)}
function createAqueduct(api,id,{researchSeed}={}){
 const cfg=CHAPTER2.find(x=>x.id===id);if(!cfg||!api?.build||!api?.createStageTiles)throw TypeError('invalid stage or source');
 const level=api.build(researchSeed??cfg.seed),route=[...level.required].reverse();
 const eligible=route.filter(i=>i!==level.source&&i!==level.target&&['s','e'].includes(level.tiles[i].shape));
 if(eligible.length<cfg.modes.length*2)throw Error(`INSUFFICIENT_SIMPLE_LINKS:${id}`);
 const pairs=[...cfg.modes].map((mode,i)=>({a:eligible[i],b:eligible[eligible.length-1-i],mode,offset:i<cfg.pins}));
 const junctions=route.filter(i=>i!==level.source&&i!==level.target&&level.tiles[i].shape!=='x');
 const sluiceIndexes=[...new Set([...pairs.map(p=>p.a),...junctions])].slice(0,cfg.sluices);
 if(sluiceIndexes.length!==cfg.sluices)throw Error(`INSUFFICIENT_SLUICES:${id}`);
 for(const index of sluiceIndexes){const direction=exitBetween(index,route[route.indexOf(index)+1]);if(direction<0)throw Error('NONADJACENT_ROUTE');level.tiles[index].sluice=true;level.tiles[index].sluiceBaseExit=mod(direction-level.tiles[index].solved);}
 const receiverIndexes=[],routeSet=new Set(route);
 if(cfg.receivers)for(const parent of route){
  if(sluiceIndexes.includes(parent)||level.tiles[parent].shape!=='t')continue;
  for(const d of ports(api,level.tiles[parent],true)){
   const n=neighbor(parent,d);if(n<0||routeSet.has(n)||receiverIndexes.includes(n))continue;
   receiverIndexes.push(n);if(receiverIndexes.length===cfg.receivers)break;
  }
  if(receiverIndexes.length===cfg.receivers)break;
 }
 if(receiverIndexes.length!==cfg.receivers)throw Error(`INSUFFICIENT_RECEIVERS:${id}`);
 level.difficulty={turns:Math.min(6,eligible.length),pieces:Math.min(6,eligible.length)};
 const tiles=api.createStageTiles(level,id-1,level.target);
 // New-chapter embankments block off-route bypasses. Receivers are terminal
 // and cannot become hidden bridges back into the required route.
 for(let i=0;i<tiles.length;i++)if(!routeSet.has(i)&&!receiverIndexes.includes(i)){tiles[i].shape='blocked';tiles[i].anchored=true;tiles[i].rot=0;}
 for(const i of receiverIndexes){tiles[i].receiver=true;tiles[i].anchored=true;}
 for(const pair of pairs){tiles[pair.a].rot=mod(tiles[pair.a].solved-1);tiles[pair.b].rot=pair.offset?tiles[pair.b].solved:mod(tiles[pair.b].solved+(pair.mode==='S'?-1:1));}
 return {cfg,tiles,pairs,source:level.source,target:level.target,receivers:receiverIndexes,route,pins:cfg.pins};
}
function turn(board,index,pin=false){
 const tile=board.tiles[index];if(!tile||tile.target||tile.anchored)throw Error('invalid turn');const pair=board.pairs.find(x=>x.a===index||x.b===index);
 if(pin&&(!pair||board.pins<1))throw Error('pin unavailable');tile.rot=mod(tile.rot+1);
 if(pair){if(pin)board.pins--;else{const other=board.tiles[pair.a===index?pair.b:pair.a];other.rot=mod(other.rot+(pair.mode==='S'?1:-1));}}
}
function wetTiles(api,board){
 const wet=new Set([board.source]),queue=[board.source];for(let cursor=0;cursor<queue.length;cursor++){
  const i=queue[cursor],tile=board.tiles[i],open=ports(api,tile),exits=tile.receiver||tile.target?[]:tile.sluice?[mod(tile.sluiceBaseExit+tile.rot)]:open;
  for(const d of exits){if(!open.includes(d))continue;const next=neighbor(i,d);if(next<0||wet.has(next)||!ports(api,board.tiles[next]).includes(mod(d+2)))continue;wet.add(next);queue.push(next);}
 }return wet;
}
function isWon(api,board){const wet=wetTiles(api,board);return wet.has(board.target)&&board.receivers.every(i=>wet.has(i));}
// Bounded search in each disjoint linked pair (4×4 orientations and at most
// two pin charges). It targets the authored route, not every possible route.
function pairPlans(board,pair){
 const a=board.tiles[pair.a],b=board.tiles[pair.b],queue=[{a:a.rot,b:b.rot,used:0,actions:[]}],seen=new Set(),goals=[];
 for(let at=0;at<queue.length;at++){
  const state=queue[at],key=`${state.a},${state.b},${state.used}`;if(seen.has(key))continue;seen.add(key);
  if(state.a===a.solved&&state.b===b.solved){goals.push(state);continue;}
  for(const first of [true,false])for(const pin of [false,true]){
   const used=state.used+Number(pin);if(used>board.pins)continue;
   let na=state.a,nb=state.b;if(first){na=mod(na+1);if(!pin)nb=mod(nb+(pair.mode==='S'?1:-1));}else{nb=mod(nb+1);if(!pin)na=mod(na+(pair.mode==='S'?1:-1));}
   queue.push({a:na,b:nb,used,actions:[...state.actions,{index:first?pair.a:pair.b,pin}]});
  }
 }
 return goals.sort((x,y)=>x.used-y.used||x.actions.length-y.actions.length);
}
function hint(api,board){
 if(isWon(api,board))return {kind:'complete'};
 const plans=board.pairs.map(pair=>pairPlans(board,pair)[0]);if(plans.some(p=>!p)||plans.reduce((sum,p)=>sum+p.used,0)>board.pins)return {kind:'undo-or-restart'};
 for(const plan of plans)if(plan.actions.length)return {kind:'turn',...plan.actions[0]};
 const linked=new Set(board.pairs.flatMap(p=>[p.a,p.b]));
 for(const index of board.route){const tile=board.tiles[index];if(tile.target||tile.anchored||linked.has(index))continue;if(tile.rot!==tile.solved)return {kind:'turn',index,pin:false};}
 return {kind:'undo-or-restart'};
}
function createAqueductSession(api,id){
 let board=createAqueduct(api,id),armed=false,history=[];
 const snapshot=()=>({rotations:board.tiles.map(t=>t.rot),pins:board.pins,armed});
 function arm(){if(board.pins<1)return false;armed=!armed;return armed;}
 function move(index){const before=snapshot();turn(board,index,armed);history.push(before);armed=false;return snapshot();}
 function undo(){const prior=history.pop();if(!prior)return false;prior.rotations.forEach((rot,i)=>{board.tiles[i].rot=rot});board.pins=prior.pins;armed=false;return true;}
 function restart(){board=createAqueduct(api,id);armed=false;history=[];return snapshot();}
 return Object.freeze({snapshot,arm,move,undo,restart,hint:()=>hint(api,board),won:()=>isWon(api,board)});
}
// Demonstration only: restore nonlinked pieces and use explicit pin decisions.
function authoredSolution(api,board){
 const linked=new Set(board.pairs.flatMap(p=>[p.a,p.b])),actions=[];
 for(let i=0;i<board.tiles.length;i++){const tile=board.tiles[i];if(tile.target||tile.anchored||linked.has(i))continue;while(tile.rot!==tile.solved){turn(board,i);actions.push({index:i,pin:false});}}
 for(const pair of board.pairs){turn(board,pair.a,pair.offset);actions.push({index:pair.a,pin:pair.offset});}
 return {actions,won:isWon(api,board)};
}
window.BambooAqueductCandidate=Object.freeze({CHAPTER2,createAqueduct,turn,wetTiles,isWon,hint,createAqueductSession});
})();
