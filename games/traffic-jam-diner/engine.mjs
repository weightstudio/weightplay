const keyOf = ([x,y]) => `${x},${y}`;
const edgeKey = (a,b) => `${keyOf(a)}>${keyOf(b)}`;

export function normalizeStage(stage) {
  const nodes = [];
  for (let y=0; y<stage.rows.length; y++) {
    for (let x=0; x<stage.rows[y].length; x++) if (stage.rows[y][x] !== "#") nodes.push([x,y]);
  }
  const ids = new Map(nodes.map((p,i)=>[keyOf(p),i]));
  const has = p => ids.has(keyOf(p));
  const directed = new Set((stage.oneWay||[]).map(([ax,ay,bx,by])=>edgeKey([ax,ay],[bx,by])));
  const gates = (stage.gates||[]).map(g=>({a:g.edge[0],b:g.edge[1],alternate:g.alternate||null,open:g.open===true,charges:g.charges??1}));
  const gatePairs=gate=>[[gate.a,gate.b],...(gate.alternate?[gate.alternate]:[])];
  const gatedEdges = new Set(gates.flatMap(g=>gatePairs(g).flatMap(([a,b])=>[edgeKey(a,b),edgeKey(b,a)])));
  const edges = Array.from({length:nodes.length},()=>[]);
  const undirectedEdges = Array.from({length:nodes.length},()=>[]);
  for (const [i,[x,y]] of nodes.entries()) {
    for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const q=[x+dx,y+dy]; if (!has(q)) continue;
      const forward=edgeKey([x,y],q), reverse=edgeKey(q,[x,y]);
      if (gatedEdges.has(forward)) continue;
      undirectedEdges[i].push(ids.get(keyOf(q)));
      if (directed.has(reverse) && !directed.has(forward)) continue;
      edges[i].push(ids.get(keyOf(q)));
    }
  }
  const nodeId = p => ids.get(keyOf(p));
  const counter=nodeId(stage.counter);
  const guests=stage.guests.map(g=>({start:nodeId(g.at),animal:g.animal,order:[...g.order]}));
  if (counter === undefined || guests.some(g=>g.start===undefined)) throw new Error(`Stage ${stage.id} references a closed cell.`);
  const pockets=(stage.pockets||[]).map(p=>nodeId(p));
  if(pockets.some(p=>p===undefined)) throw new Error(`Stage ${stage.id} pocket is closed.`);
  for(const gate of gates){
    for(const [a,b] of gatePairs(gate))if(!has(a)||!has(b)||Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])!==1)throw new Error(`Stage ${stage.id} gate is not on an adjacent open edge.`);
    if(!Number.isInteger(gate.charges)||gate.charges<0)throw new Error(`Stage ${stage.id} gate has invalid charges.`);
    gate.nodeA=nodeId(gate.a);gate.nodeB=nodeId(gate.b);gate.alternateNodes=gate.alternate?.map(nodeId)||null;
  }
  const serviceOrder=[...(stage.serviceOrder||stage.guests.map((_,i)=>i))];
  if(serviceOrder.length!==guests.length||new Set(serviceOrder).size!==guests.length||serviceOrder.some(i=>!Number.isInteger(i)||i<0||i>=guests.length))throw new Error(`Stage ${stage.id} service order is not a guest permutation.`);
  return { ...stage, nodes, points:nodes, width:stage.rows[0].length, height:stage.rows.length, queue:serviceOrder, ids, edges, undirectedEdges, counter, pockets, stops:new Set([counter,...pockets]), gates, guests, serviceOrder, stock:{...stage.stock} };
}

// Both legal moves and animation paths consume this same selected-route graph.
function neighbors(stage,state,from,{undirected=false}={}){
  const out=[...(undirected?stage.undirectedEdges:stage.edges)[from]];
  stage.gates.forEach((gate,index)=>{
    const pairs=state.gates[index]?[[gate.nodeA,gate.nodeB]]:gate.alternateNodes?[gate.alternateNodes]:[];
    for(const [a,b] of pairs){if(from===a)out.push(b);if(from===b)out.push(a);}
  });
  return out;
}

function findRoute(stage,state,guest,to,{ignoreGuests=false,...options}={}){
  const start=state.positions[guest];if(start===undefined||start<0||to===start)return [];
  const blocked=new Set(ignoreGuests?[]:state.positions.filter((node,index)=>index!==guest&&node>=0));
  if(blocked.has(to))return [];
  const queue=[start],parents=new Map([[start,null]]);
  for(let cursor=0;cursor<queue.length;cursor++){
    const from=queue[cursor];
    if(from===to){const path=[];for(let at=to;at!==null;at=parents.get(at))path.push(at);return path.reverse();}
    for(const node of neighbors(stage,state,from,options))if(!parents.has(node)&&!blocked.has(node)){parents.set(node,from);queue.push(node);}
  }
  return [];
}

function bayIsFull(stage,state,guest){
  // Moving between two bays does not create an additional waiting guest.
  const otherGuests=state.positions.reduce((count,node,index)=>count+(index!==guest&&stage.pockets.includes(node)?1:0),0);
  return otherGuests>=(stage.pocketCapacity??0);
}

export function createInitialState(normalized) {
  return {positions:normalized.guests.map(g=>g.start), filled:normalized.guests.map(()=>0), servedCount:0, stock:{...normalized.stock}, gates:normalized.gates.map(g=>g.open), gateUses:normalized.gates.map(()=>0), moves:0, history:[]};
}

export function legalActions(stage,state) {
  const out=[]; const occupied=new Set(state.positions.filter(p=>p>=0));
  for(let guest=0;guest<state.positions.length;guest++){
    const pos=state.positions[guest]; if(pos<0)continue;
    const reachable=new Set(), visited=new Set([pos]), queue=[pos];
    for(let cursor=0;cursor<queue.length;cursor++){
      const from=queue[cursor];
      for(const to of neighbors(stage,state,from)){
        if(visited.has(to)||occupied.has(to))continue;
        visited.add(to);
        if(stage.stops.has(to))reachable.add(to);
        queue.push(to);
      }
    }
    for(const to of reachable){
      if(stage.pockets.includes(to)&&bayIsFull(stage,state,guest))continue;
      out.push({type:"move",guest,to});
    }
    if(pos===stage.counter&&stage.serviceOrder[state.servedCount]===guest){
      const needed=stage.guests[guest].order[state.filled[guest]];
      const choices=Array.isArray(needed)?needed:needed?[needed]:[];
      for(const snack of choices)if(state.stock[snack]>0)out.push({type:"snack",guest,snack});
      if(state.filled[guest]===stage.guests[guest].order.length)out.push({type:"serve",guest});
    }
  }
  for(let i=0;i<stage.gates.length;i++)if(state.gateUses[i]<stage.gates[i].charges)out.push({type:"gate",gate:i});
  return out;
}

export function applyAction(stage,state,action) {
  const next={positions:[...state.positions],filled:[...state.filled],servedCount:state.servedCount,stock:{...state.stock},gates:[...state.gates],gateUses:[...state.gateUses],moves:state.moves+1,history:state.history};
  if(action.type==="move")next.positions[action.guest]=action.to;
  else if(action.type==="snack"){next.stock[action.snack]--;next.filled[action.guest]++;}
  else if(action.type==="serve"){next.positions[action.guest]=-1;next.servedCount++;}
  else if(action.type==="gate"){next.gates[action.gate]=!next.gates[action.gate];next.gateUses[action.gate]++;}
  return next;
}

export function isWon(state){return state.positions.every(p=>p<0);}
export function stateKey(s){return `${s.positions.join(",")}|${s.filled.join(",")}|${s.servedCount}|${Object.keys(s.stock).sort().map(k=>`${k}:${s.stock[k]}`).join(",")}|${s.gates.map(Number).join("")}|${s.gateUses.join("")}`;}

// The renderer uses exactly the graph and occupied cells used by the rules.
export function routeForMove(stage,state,guest,to){
  if(!stage.stops.has(to)||(stage.pockets.includes(to)&&bayIsFull(stage,state,guest)))return [];
  return findRoute(stage,state,guest,to);
}

export function explainMove(stage,state,guest,to){
  if(!stage.stops.has(to))return {reason:'stopOnly'};
  const occupant=state.positions.findIndex((node,index)=>index!==guest&&node===to);
  if(occupant>=0)return {reason:'occupied',guest:occupant};
  if(stage.pockets.includes(to)&&bayIsFull(stage,state,guest))return {reason:'capacity'};
  if(findRoute(stage,state,guest,to).length)return null;
  const withoutGuests=findRoute(stage,state,guest,to,{ignoreGuests:true});
  if(withoutGuests.length){const blocker=withoutGuests.slice(1).map(node=>state.positions.findIndex((p,index)=>index!==guest&&p===node)).find(index=>index>=0);if(blocker!==undefined)return {reason:'occupied',guest:blocker};}
  for(let index=0;index<stage.gates.length;index++){
    const changed={...state,gates:state.gates.map((open,i)=>i===index?!open:open)};
    // A blocker explanation describes one real graph change, not a plan.
    // Never combine mutually exclusive A/B edges or ignore another guest to
    // manufacture a direct route through an airlock that needs intermediate stops.
    if(findRoute(stage,changed,guest,to).length)return {reason:'gate',gate:index,exhausted:state.gateUses[index]>=stage.gates[index].charges};
  }
  if(findRoute(stage,state,guest,to,{undirected:true,ignoreGuests:true}).length)return {reason:'oneWay'};
  return {reason:'unreachable'};
}

export function solveStage(stage,{maxStates=400000,startState=null}={}){
  const start=startState||createInitialState(stage), queue=[start], seen=new Map([[stateKey(start),null]]), parents=new Map(); let cursor=0, goalKey=null;
  while(cursor<queue.length){
    const current=queue[cursor++], currentKey=stateKey(current);
    if(isWon(current)){goalKey=currentKey;break;}
    for(const action of legalActions(stage,current)){
      const next=applyAction(stage,current,action), key=stateKey(next);
      if(seen.has(key))continue;
      seen.set(key,true); parents.set(key,{prior:currentKey,action}); queue.push(next);
      if(queue.length>maxStates)return {solvable:false,overflow:true,expanded:queue.length,minMoves:null,witness:[]};
    }
  }
  if(!goalKey)return {solvable:false,overflow:false,expanded:queue.length,minMoves:null,witness:[]};
  const witness=[]; let key=goalKey;
  while(key!==stateKey(start)){const item=parents.get(key);if(!item)break;witness.push(item.action);key=item.prior;}
  witness.reverse();
  return {solvable:true,overflow:false,expanded:queue.length,minMoves:witness.length,witness};
}

export function replayWitness(stage,witness){
  let state=createInitialState(stage);
  for(const action of witness){
    if(!legalActions(stage,state).some(candidate=>JSON.stringify(candidate)===JSON.stringify(action)))return {valid:false,state};
    state=applyAction(stage,state,action);
  }
  return {valid:isWon(state),state};
}
