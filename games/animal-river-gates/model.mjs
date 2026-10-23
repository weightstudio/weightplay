export const NODES = ['source', 'cistern', 'gardenA', 'gardenB', 'waste', 'lowerPond'];
export const initialState = plan => ({water:[plan.start,0,0,0,0,0],beat:0,used:[],closed:[],flags:[],delivered:[],deliveries:[],history:[]});
export const clone = value => JSON.parse(JSON.stringify(value));
export const capacity = (plan,node) => plan.capacities?.[node] ?? (node==='gardenA' ? plan.demands[0] : node==='gardenB' ? plan.demands[1] : node==='waste' ? plan.wasteMax ?? 0 : plan.start);
export function reasonFor(plan,state,edge) {
  if (state.beat>=plan.beats) return 'cutoff';
  if (!edge) return 'noTarget';
  if (edge.id==='wait') return '';
  if (state.closed.includes(edge.id)) return 'bridge';
  if (edge.once && state.used.includes(edge.id)) return 'once';
  if (edge.phase && edge.phase!==(state.beat%2 ? 'odd':'even')) return 'phase';
  if (edge.beforeBeat!==undefined && state.beat>=edge.beforeBeat) return 'cutoff';
  if (edge.requiresFlag && !state.flags.includes(edge.requiresFlag)) return 'prerequisite';
  if (edge.requires?.delivered && !state.history.includes(edge.requires.delivered)) return 'order';
  if (edge.repair) return state.water[1]<(edge.repairCost||1) ? 'noRepair':'';
  const from=NODES.indexOf(edge.from), to=NODES.indexOf(edge.to);
  if (from<0 || to<0) return 'noTarget';
  if (state.water[from]<1) return 'dry';
  if (state.water[to]>=capacity(plan,edge.to)) return edge.to==='waste' ? 'capacity':'full';
  return '';
}
export function transition(plan,state,id) {
  const edge=id==='wait'?{id}:plan.edges.find(edge=>edge.id===id);
  const reason=reasonFor(plan,state,edge);
  if (reason) return {state,reason};
  const next=clone(state);
  next.beat++;
  next.history.push(id);
  if(id==='wait') return {state:next,reason:''};
  if(edge.repair) next.water[1]-=edge.repairCost||1;
  else {
    next.water[NODES.indexOf(edge.from)]--;
    next.water[NODES.indexOf(edge.to)]++;
    if(['gardenA','gardenB'].includes(edge.to)) {
      next.delivered.push(edge.to);
      next.deliveries.push({node:edge.to,beat:next.beat});
    }
  }
  if(edge.once) next.used.push(edge.id);
  if(edge.closes) next.closed.push(...edge.closes);
  if(edge.setsFlag && !next.flags.includes(edge.setsFlag)) next.flags.push(edge.setsFlag);
  return {state:next,reason:''};
}
export function outcome(plan,state) {
  const ordered=!plan.order || plan.order.every((node,i)=>state.delivered.indexOf(node)>=0 && (!i || state.delivered.indexOf(node)>state.delivered.indexOf(plan.order[i-1])));
  const delivery=plan.window && state.deliveries.find(d=>d.node===plan.window.node);
  const windowOk=!plan.window || Boolean(delivery && delivery.beat>=plan.window.from && delivery.beat<=plan.window.to);
  if(state.water[2]>=plan.demands[0] && state.water[3]>=plan.demands[1] && state.water[1]>=plan.reserve && state.water[4]<=(plan.wasteMax??0) && ordered && windowOk && (!plan.protected || !state.water[4])) return {kind:'win',reason:''};
  if(plan.order && plan.order.some((node,i)=>i && state.delivered.includes(node) && (state.delivered.indexOf(plan.order[i-1])<0 || state.delivered.indexOf(plan.order[i-1])>state.delivered.indexOf(node)))) return {kind:'loss',reason:'settlementOrder'};
  if(plan.window && ((delivery && !windowOk) || (!delivery && state.beat>=plan.window.to))) return {kind:'loss',reason:'settlementWindow'};
  if(state.beat>=plan.beats) return {kind:'loss',reason:'outOfBeats'};
  if(state.water.reduce((sum,n,i)=>sum+(i===4?0:n),0)<plan.demands[0]+plan.demands[1]+plan.reserve) return {kind:'loss',reason:'shortWater'};
  return {kind:'playing',reason:''};
}
// Bounded breadth-first search is used by authoring tests, never by UI input.
export function shortestSolution(plan) {
  const queue=[{state:initialState(plan),path:[]}],seen=new Set();
  for(let head=0;head<queue.length;head++) {
    const {state,path}=queue[head],result=outcome(plan,state);
    if(result.kind==='win') return path;
    if(result.kind==='loss') continue;
    for(const id of [...plan.edges.map(e=>e.id),'wait']) {
      const next=transition(plan,state,id);if(next.reason) continue;
      const s=next.state;
      const needed=plan.edges.map(e=>e.requires?.delivered).filter(Boolean);
      const key=JSON.stringify([s.water,s.beat,[...s.used].sort(),[...s.closed].sort(),[...s.flags].sort(),needed.filter(id=>s.history.includes(id)),[...new Set(s.delivered)],plan.window?s.deliveries.find(d=>d.node===plan.window.node):null]);
      if(!seen.has(key)){seen.add(key);queue.push({state:s,path:[...path,id]});}
    }
    if(queue.length>200000) throw Error(`Stage ${plan.id} exceeds authoring search budget`);
  }
  return null;
}
