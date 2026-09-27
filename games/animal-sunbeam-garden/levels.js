((root)=>{
  "use strict";
  const archetypes=[
    [[0,2,20,23]],
    [[5,3,21,18,30]],
    [[35,23,20,2,0]],
    [[30,12,17,29,27,33]],
    [[0,18,20,8,11,35]],
    [[0,2,32,35],[5,3,15,17,29,35]],
    [[5,3,27,24,30],[0,12,14,32,30]],
    [[0,5,17,13,25,28,34,30]],
    [[0,1,13,15,27,29,35]],
    [[0,12,14,26,32,35],[5,3,9,11,29,35]],
    [[0,1,13,14,26,27,33,35],[5,4,16,15,21,23,29,35]],
    [[5,3,15,17,29,27,33,30],[0,12,14,26,24,30]]
  ];
  const campaign=[
    [0,0],[1,0],[2,0],[3,0],[4,0],
    [5,0],[8,0],[6,0],[7,0],[9,0],
    [6,1],[7,1],[9,1],[6,2],[7,2],
    [9,2],[6,3],[7,3],[9,3],[9,4],
    [11,4],[11,2],[11,0],[10,1],[11,1],
    [11,3],[10,2],[10,3],[10,4],[10,0]
  ];
  const campaignPar=[
    2,3,3,4,4,
    5,5,6,6,6,
    6,6,6,6,6,
    6,6,6,6,6,
    10,10,10,11,10,
    10,11,11,10,10
  ];
  const campaignGateCounts=[
    0,0,0,0,1,
    1,1,1,1,2,
    1,1,1,1,2,
    2,2,2,2,3,
    2,2,2,2,3,
    3,3,3,3,4
  ];
  const decoyOrder=[14,21,7,28,8,27,13,22,15,20,9,26,19,16,10,25,3,32,4,31];
  const rc=i=>[Math.floor(i/6),i%6];
  const dir=(a,b)=>{const[ar,ac]=rc(a),[br,bc]=rc(b);return br<ar?0:bc>ac?1:br>ar?2:3};
  function chooseGateCells(routes,count,mirrorMap,sources,goal){
    if(!count)return[];
    const occupied=new Set([...mirrorMap.keys(),...sources.map(source=>source.cell),goal]);
    const lanes=routes.map(route=>route.filter((cell,index)=>index>0&&index<route.length-1&&dir(route[index-1],cell)===dir(cell,route[index+1])&&!occupied.has(cell)));
    const selected=[];
    lanes.forEach((cells,laneIndex)=>{
      const quota=Math.floor(count/routes.length)+(laneIndex<count%routes.length?1:0);
      for(let slot=0;slot<quota;slot++){
        const ideal=Math.floor((slot+1)*cells.length/(quota+1));
        const candidates=cells.map((cell,index)=>({cell,index,distance:Math.abs(index-ideal)})).sort((a,b)=>a.distance-b.distance||a.index-b.index);
        const choice=candidates.find(candidate=>!occupied.has(candidate.cell));
        if(choice){occupied.add(choice.cell);selected.push(choice.cell)}
      }
    });
    if(selected.length!==count)throw new Error(`Garden ${routes[0][0]} has too few straight cells for ${count} Sun Gates`);
    return selected;
  }
  const reflect=(incoming,outgoing)=>incoming===0&&outgoing===1||incoming===1&&outgoing===0||incoming===2&&outgoing===3||incoming===3&&outgoing===2?0:1;
  function transform(cell,variant){
    const [row,col]=rc(cell);
    return [
      row*6+col,
      col*6+(5-row),
      (5-row)*6+(5-col),
      (5-col)*6+row,
      row*6+(5-col),
      (5-row)*6+col,
      col*6+row,
      (5-col)*6+(5-row)
    ][variant%8];
  }
  function expand(waypoints){
    const route=[waypoints[0]];
    for(let i=1;i<waypoints.length;i++){
      let cell=route.at(-1),direction=dir(cell,waypoints[i]);
      while(cell!==waypoints[i]){
        const [row,col]=rc(cell);
        cell=(row+[-1,0,1,0][direction])*6+col+[0,1,0,-1][direction];
        if(route.includes(cell))throw new Error("Sunbeam route crosses itself");
        route.push(cell);
      }
    }
    return route;
  }
  function build(index){
    const campaignIndex=((index%campaign.length)+campaign.length)%campaign.length;
    const [archetypeIndex,variant]=campaign[campaignIndex];
    const routes=archetypes[archetypeIndex].map(waypoints=>expand(waypoints.map(cell=>transform(cell,variant))));
    const goal=routes[0].at(-1);
    if(routes.some(route=>route.at(-1)!==goal))throw new Error("Sunbeam routes need one shared goal");
    const mirrorMap=new Map();
    routes.forEach(route=>{
      for(let i=1;i<route.length-1;i++){
        const incoming=dir(route[i-1],route[i]),outgoing=dir(route[i],route[i+1]);
        if(incoming===outgoing)continue;
        const solution=reflect(incoming,outgoing),existing=mirrorMap.get(route[i]);
        if(existing&&existing.solution!==solution)throw new Error("Sunbeam routes disagree at a mirror");
        mirrorMap.set(route[i],{cell:route[i],solution,rot:1-solution,essential:true});
      }
    });
    const mirrors=[...mirrorMap.values()],used=new Set(routes.flat());
    decoyOrder
      .map(cell=>transform(cell,variant))
      .filter(cell=>!used.has(cell)&&!mirrorMap.has(cell))
      .slice(0,Math.floor(campaignIndex/5))
      .forEach((cell,i)=>{
        const solution=(campaignIndex+i)%2;
        mirrors.push({cell,solution,rot:solution,essential:false});
      });
    const sources=routes.map(route=>({cell:route[0],startDir:dir(route[0],route[1])}));
    const gates=chooseGateCells(routes,campaignGateCounts[campaignIndex],mirrorMap,sources,goal).map(cell=>({cell,kind:"gate",open:false,essential:true}));
    return{
      index:campaignIndex,
      source:sources[0].cell,
      startDir:sources[0].startDir,
      sources,
      goal,
      par:campaignPar[campaignIndex]+gates.length,
      difficulty:Math.floor(campaignIndex/5)+1,
      topology:routes.map(route=>route.join("-")).join("|"),
      mirrors,
      gates
    };
  }
  const levels=Array.from({length:30},(_,i)=>build(i));
  root.SUNBEAM_LEVELS={levels,build,reflect,campaignTurns:levels.map(level=>level.par)};
  if(typeof module!=="undefined")module.exports=root.SUNBEAM_LEVELS;
})(typeof window!=="undefined"?window:globalThis);
