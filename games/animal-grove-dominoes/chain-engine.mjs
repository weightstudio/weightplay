// Deterministic directed-domino puzzle rules. No DOM, timers or storage.
export function createChain(puzzle) {
  if (!puzzle || !Array.isArray(puzzle.tiles) || puzzle.tiles.length > 20 || !puzzle.tiles.length) throw new Error('Invalid puzzle');
  if (!puzzle.start || !puzzle.goal) throw new Error('Missing route endpoints');
  const limit=(value)=>{if(value!==undefined&&(!Number.isInteger(value)||value<0))throw new Error('Invalid resource budget');return value??20;};
  const ids = new Set();
  const tiles = puzzle.tiles.map(tile => {
    if (!tile.id || ids.has(tile.id) || !tile.from || !tile.to) throw new Error('Invalid tile identity');
    if(tile.bridge!==undefined&&(!Number.isInteger(tile.bridge)||tile.bridge<0))throw new Error('Invalid bridge cost');
    ids.add(tile.id); return Object.freeze({...tile});
  });
  const visits=Object.freeze([...(puzzle.visits||[])]),deliveries=Object.freeze([...(puzzle.deliveries||[])]);
  if([...visits,...deliveries].some(x=>typeof x!=='string'||!x))throw new Error('Invalid habitat requirement');
  return Object.freeze({start:puzzle.start, goal:puzzle.goal, tiles:Object.freeze(tiles), path:Object.freeze([]), end:puzzle.start,
    visits,deliveries,visited:Object.freeze([puzzle.start]),deliveryIndex:0,
    bridgesLeft:limit(puzzle.bridges),flipsLeft:limit(puzzle.flips),previous:null});
}
export function available(state) {
  if(state.deliveryIndex<0)return [];
  const used = new Set(state.path);
  return state.tiles.filter(tile=>!used.has(tile.id)&&(tile.bridge||0)<=state.bridgesLeft).flatMap(tile=>{
    const moves=[];
    if(tile.from===state.end)moves.push({...tile,reversed:false});
    if(tile.reversible&&tile.to===state.end&&tile.from!==tile.to&&state.flipsLeft>0)moves.push({...tile,from:tile.to,to:tile.from,reversed:true});
    return moves;
  });
}
export function play(state, id, {reverse=false}={}) {
  if(outcome(state)==='complete')return {state,accepted:false};
  const tile = available(state).find(tile => tile.id === id&&tile.reversed===reverse);
  if (!tile) return {state, accepted:false};
  let deliveryIndex=state.deliveryIndex;
  if(state.deliveries[deliveryIndex]===tile.to)deliveryIndex++;
  else if(state.deliveries.slice(deliveryIndex+1).includes(tile.to))deliveryIndex=-1;
  return {accepted:true,state:Object.freeze({...state,path:Object.freeze([...state.path,id]),end:tile.to,
    visited:Object.freeze([...new Set([...state.visited,tile.to])]),deliveryIndex,
    bridgesLeft:state.bridgesLeft-(tile.bridge||0),flipsLeft:state.flipsLeft-Number(reverse),previous:state})};
}
export function undo(state) {
  return state.previous||state;
}
export function outcome(state) {
  if(state.deliveryIndex<0)return 'dead-end';
  const required=state.tiles.filter(tile=>tile.required!==false);
  if(required.every(tile=>state.path.includes(tile.id))&&state.end===state.goal&&
     state.visits.every(habitat=>state.visited.includes(habitat))&&state.deliveryIndex===state.deliveries.length)return 'complete';
  return available(state).length ? 'playing' : 'dead-end';
}
// A bounded, exact solver supports authored-puzzle checks and truthful hints.
// Exhausting the budget returns UNKNOWN, never an invented dead-end verdict.
export function solve(state, budget=50000) {
  let visited=0;const rejected=new Set();
  const search=current=>{
    if (++visited>budget) return undefined;
    if (outcome(current)==='complete') return [];
    const key=JSON.stringify([current.end,[...current.path].sort(),current.deliveryIndex,current.bridgesLeft,current.flipsLeft,[...current.visited].sort()]);
    if(rejected.has(key))return null;
    for(const tile of available(current)){
      const tail=search(play(current,tile.id,{reverse:tile.reversed}).state);
      if(tail===undefined)return undefined;
      if(tail!==null)return [{id:tile.id,reverse:tile.reversed},...tail];
    }
    rejected.add(key);return null;
  };
  const path=search(state);
  return {status:path===undefined?'unknown':path===null?'unsolvable':'solved',path:path?.map(move=>move.id)??null,moves:path??null,visited};
}

// Proof set: the similar-looking exit is safe only after its detour is used.
// Stable IDs are intentionally independent of rack/display order.
export const proofPuzzles=Object.freeze([
  {id:'creek-before-exit',start:'den',goal:'moon',tiles:[
    {id:'a',from:'den',to:'creek'},{id:'b',from:'creek',to:'moss'},
    {id:'c',from:'moss',to:'den'},{id:'d',from:'den',to:'nest'},
    {id:'e',from:'nest',to:'moon'}]},
  {id:'nest-before-creek',start:'den',goal:'moon',tiles:[
    {id:'a',from:'den',to:'creek'},{id:'b',from:'creek',to:'moss'},
    {id:'c',from:'moss',to:'moon'},{id:'d',from:'den',to:'nest'},
    {id:'e',from:'nest',to:'den'}]},
  {id:'two-detours',start:'den',goal:'moon',tiles:[
    {id:'a',from:'den',to:'creek'},{id:'b',from:'creek',to:'den'},
    {id:'c',from:'den',to:'nest'},{id:'d',from:'nest',to:'moss'},
    {id:'e',from:'moss',to:'nest'},{id:'f',from:'nest',to:'reef'},
    {id:'g',from:'reef',to:'moon'}]},
]);
