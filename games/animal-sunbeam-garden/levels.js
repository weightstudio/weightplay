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
  // Authored small-flower targets and reachable orientation witnesses (v18).
  const campaignBlooms=[{"targets":[],"plan":[],"par":2},{"targets":[{"cell":9,"witnesses":[1,3,5,7]}],"plan":[7],"par":3},{"targets":[{"cell":32,"witnesses":[1,5]}],"plan":[1,7],"par":3},{"targets":[{"cell":5,"witnesses":[5,9,13]}],"plan":[5,15],"par":4},{"targets":[{"cell":7,"witnesses":[3,11]}],"plan":[3,15],"par":5},{"targets":[{"cell":12,"witnesses":[7,21,22,23,55]}],"plan":[7,31],"par":6},{"targets":[{"cell":12,"witnesses":[13,21,25,29,61]}],"plan":[13,31],"par":6},{"targets":[{"cell":2,"witnesses":[15,43,45,46,47,111]},{"cell":35,"witnesses":[27,29,30,31,95]}],"plan":[15,31,63],"par":7},{"targets":[{"cell":10,"witnesses":[15,47,111]},{"cell":24,"witnesses":[23,39,55,119]}],"plan":[39,47,63],"par":7},{"targets":[{"cell":2,"witnesses":[29,45,53,57,61,125]},{"cell":30,"witnesses":[27,43,51,59,123]}],"plan":[57,59,63],"par":8},{"targets":[{"cell":28,"witnesses":[29,45,53,57,61,125]},{"cell":2,"witnesses":[27,43,51,59,123,187]}],"plan":[57,59,63],"par":7},{"targets":[{"cell":28,"witnesses":[15,47,111,175,187]},{"cell":1,"witnesses":[23,39,55,119,183]}],"plan":[39,47,63],"par":7},{"targets":[{"cell":11,"witnesses":[175]},{"cell":0,"witnesses":[27,43,51,59,123,187]}],"plan":[43,175,63],"par":9},{"targets":[{"cell":25,"witnesses":[29,45,53,57,61,125]},{"cell":17,"witnesses":[27,43,51,59,123,187]}],"plan":[57,59,63],"par":7},{"targets":[{"cell":25,"witnesses":[15,47,111,175,187]},{"cell":11,"witnesses":[23,39,55,119,183]}],"plan":[39,47,63],"par":8},{"targets":[{"cell":34,"witnesses":[175]},{"cell":5,"witnesses":[27,43,51,59,123,187,315]}],"plan":[43,175,63],"par":10},{"targets":[{"cell":1,"witnesses":[303]},{"cell":33,"witnesses":[27,43,51,59,123,187,315]}],"plan":[43,303,63],"par":10},{"targets":[{"cell":7,"witnesses":[15,47,111,175,303]},{"cell":34,"witnesses":[23,39,55,119,183,311]},{"cell":8,"witnesses":[15,23,27,39,43,51,31,47,55,59]}],"plan":[39,47,63],"par":8},{"targets":[{"cell":24,"witnesses":[175]},{"cell":35,"witnesses":[27,43,51,59,123,187,315]},{"cell":26,"witnesses":[15,23,27,29,39,43,45,46,51,53]}],"plan":[43,175,63],"par":10},{"targets":[{"cell":4,"witnesses":[15,43,45,46,47,111,303]},{"cell":28,"witnesses":[175]},{"cell":16,"witnesses":[15,23,27,29,39,43,45,51,53,57]}],"plan":[15,175,63],"par":11},{"targets":[{"cell":6,"witnesses":[507,763,891,955,987,1003,1011,1019,2043,3067]},{"cell":4,"witnesses":[2943,3069]},{"cell":16,"witnesses":[255,383,479,495,503,507,509,510,639,735]}],"plan":[891,2943,1023],"par":14},{"targets":[{"cell":24,"witnesses":[507,763,891,955,987,1003,1011,1019,2043,3067]},{"cell":34,"witnesses":[2943,3069]},{"cell":22,"witnesses":[255,383,479,495,503,507,509,510,639,735]}],"plan":[891,2943,1023],"par":14},{"targets":[{"cell":11,"witnesses":[383,507,509,639,763,765,863,879,887,891]},{"cell":19,"witnesses":[1791,2031]},{"cell":9,"witnesses":[255,383,447,479,495,503,507,509,639,703]}],"plan":[639,1791,1023],"par":14},{"targets":[{"cell":4,"witnesses":[1019,1531,1787,1915,1979,2011,2027,2035,2043,4091]},{"cell":12,"witnesses":[991,1503,1759,1887,1951,2015,4063,6111,10207,18399]},{"cell":10,"witnesses":[511,767,895,959,991,1007,1015,1019,1021,1279]}],"plan":[2011,2015,2047],"par":13},{"targets":[{"cell":34,"witnesses":[507,763,891,955,987,1003,1011,1019,2043,3067]},{"cell":11,"witnesses":[2943,3069]},{"cell":9,"witnesses":[255,383,479,495,503,507,509,510,639,735]}],"plan":[891,2943,1023],"par":15},{"targets":[{"cell":1,"witnesses":[383,507,509,639,763,765,863,879,887,891]},{"cell":27,"witnesses":[1791,2031]},{"cell":13,"witnesses":[255,383,447,479,495,503,507,509,639,703]}],"plan":[639,1791,1023],"par":15},{"targets":[{"cell":29,"witnesses":[1019,1531,1787,1915,1979,2011,2027,2035,2043,4091]},{"cell":3,"witnesses":[991,1503,1759,1887,1951,2015,4063,6111,10207,18399]},{"cell":25,"witnesses":[511,767,895,991,1007,1015,1019,1021,1022,1279]}],"plan":[2011,2015,2047],"par":14},{"targets":[{"cell":31,"witnesses":[1019,1531,1787,1915,1979,2011,2027,2035,2043,4091]},{"cell":23,"witnesses":[991,1503,1759,1887,1951,2015,4063,6111,10207,18399]},{"cell":7,"witnesses":[511,767,895,991,1007,1015,1019,1021,1022,1279]}],"plan":[2011,2015,2047],"par":14},{"targets":[{"cell":11,"witnesses":[4091]},{"cell":25,"witnesses":[1015,1783,1911,1975,2007,2035,2039,4087,6135]},{"cell":7,"witnesses":[511,767,895,991,1007,1015,1019,1021,1022,1279]}],"plan":[2035,4091,2047],"par":16},{"targets":[{"cell":6,"witnesses":[4091]},{"cell":28,"witnesses":[1015,1783,1911,1975,2007,2035,2039,4087,6135]},{"cell":7,"witnesses":[511,767,895,959,991,1007,1015,1019,1021,1279]}],"plan":[2035,4091,2047],"par":17}];
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
    const bloomData=campaignBlooms[campaignIndex];
    const mirrors=[...mirrorMap.values()],used=new Set(routes.flat());
    decoyOrder
      .map(cell=>transform(cell,variant))
      .filter(cell=>!used.has(cell)&&!mirrorMap.has(cell))
      .slice(0,Math.floor(campaignIndex/5))
      .forEach((cell,i)=>{
        const solution=(campaignIndex+i)%2;
        mirrors.push({cell,solution,rot:solution,essential:false});
      });
    for(let i=mirrors.length-1;i>=0;i--)if(mirrors[i].essential===false&&bloomData.targets.some(target=>target.cell===mirrors[i].cell))mirrors.splice(i,1);
    const sources=routes.map(route=>({cell:route[0],startDir:dir(route[0],route[1])}));
    const gates=chooseGateCells(routes,campaignGateCounts[campaignIndex],mirrorMap,sources,goal).map(cell=>({cell,kind:"gate",open:false,essential:true}));
    return{
      index:campaignIndex,
      source:sources[0].cell,
      startDir:sources[0].startDir,
      sources,
      goal,
      routePar:campaignPar[campaignIndex]+gates.length,
      par:bloomData.par,
      blooms:bloomData.targets.map(target=>({...target,witnesses:[...target.witnesses]})),
      bloomPlan:[...bloomData.plan],
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
