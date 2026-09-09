// Deterministic directed-domino puzzle rules. No DOM, timers or storage.
export function createChain(puzzle) {
  if (!puzzle || !Array.isArray(puzzle.tiles) || puzzle.tiles.length > 20 || !puzzle.tiles.length) throw new Error('Invalid puzzle');
  const ids = new Set();
  const tiles = puzzle.tiles.map(tile => {
    if (!tile.id || ids.has(tile.id) || !tile.from || !tile.to) throw new Error('Invalid tile identity');
    ids.add(tile.id); return Object.freeze({...tile});
  });
  return Object.freeze({start:puzzle.start, goal:puzzle.goal, tiles:Object.freeze(tiles), path:Object.freeze([]), end:puzzle.start});
}
export function available(state) {
  const used = new Set(state.path);
  return state.tiles.filter(tile => !used.has(tile.id) && tile.from === state.end);
}
export function play(state, id) {
  const tile = available(state).find(tile => tile.id === id);
  if (!tile) return {state, accepted:false};
  return {accepted:true,state:Object.freeze({...state,path:Object.freeze([...state.path,id]),end:tile.to})};
}
export function undo(state) {
  if (!state.path.length) return state;
  const path = state.path.slice(0,-1);
  const previous = state.tiles.find(tile => tile.id === path.at(-1));
  return Object.freeze({...state,path:Object.freeze(path),end:previous?.to || state.start});
}
export function outcome(state) {
  if (state.path.length === state.tiles.length) return state.end === state.goal ? 'complete' : 'dead-end';
  return available(state).length ? 'playing' : 'dead-end';
}
// A bounded, exact solver supports authored-puzzle checks and truthful hints.
// Exhausting the budget returns UNKNOWN, never an invented dead-end verdict.
export function solve(state, budget=50000) {
  let visited=0;const rejected=new Set();
  const search=current=>{
    if (++visited>budget) return undefined;
    if (outcome(current)==='complete') return [];
    const key=current.end+'|'+[...current.path].sort().join(',');
    if(rejected.has(key))return null;
    for(const tile of available(current)){
      const tail=search(play(current,tile.id).state);
      if(tail===undefined)return undefined;
      if(tail!==null)return [tile.id,...tail];
    }
    rejected.add(key);return null;
  };
  const path=search(state);
  return {status:path===undefined?'unknown':path===null?'unsolvable':'solved',path:path??null,visited};
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
