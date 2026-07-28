((root)=>{
  "use strict";
  const size=5;
  const directions=[[-1,0,0],[0,1,1],[1,0,2],[0,-1,3]];
  // Atlas orientation: the source pours downward; the flowering basin receives
  // from above. Keeping these bases aligned with the artwork is essential for
  // both the solved layout and every rotated scramble.
  const raw={source:[2],goal:[0],s:[0,2],e:[0,1],t:[0,1,3],x:[0,1,2,3]};
  const mod=value=>(value+4)%4;
  function routeConnections(route){
    const links=Array.from({length:25},()=>new Set());
    for(let i=1;i<route.length;i++){
      const a=route[i-1],b=route[i],ar=Math.floor(a/size),ac=a%size,br=Math.floor(b/size),bc=b%size;
      const direction=br<ar?0:bc>ac?1:br>ar?2:3;
      links[a].add(direction);links[b].add(mod(direction+2));
    }
    return links;
  }
  function snake(vertical=false){
    const route=[];
    for(let major=0;major<size;major++)for(let minor=0;minor<size;minor++){
      const step=major%2?size-1-minor:minor;
      route.push(vertical?step*size+major:major*size+step);
    }
    return routeConnections(route);
  }
  function spiral(){
    const route=[];let top=0,left=0,bottom=4,right=4;
    while(top<=bottom&&left<=right){
      for(let c=left;c<=right;c++)route.push(top*size+c);top++;
      for(let r=top;r<=bottom;r++)route.push(r*size+right);right--;
      if(top<=bottom){for(let c=right;c>=left;c--)route.push(bottom*size+c);bottom--}
      if(left<=right){for(let r=bottom;r>=top;r--)route.push(r*size+left);left++}
    }
    return routeConnections(route);
  }
  function random(seed){
    let value=seed>>>0;
    return()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296};
  }
  function tree(seed){
    const pick=random(seed),links=Array.from({length:25},()=>new Set()),seen=new Set();
    const start=Math.floor(pick()*25),stack=[start];seen.add(start);
    while(stack.length){
      const current=stack.at(-1),row=Math.floor(current/size),col=current%size;
      const options=directions.map(([dr,dc,dir])=>({row:row+dr,col:col+dc,dir})).filter(next=>next.row>=0&&next.row<size&&next.col>=0&&next.col<size&&!seen.has(next.row*size+next.col));
      if(!options.length){stack.pop();continue}
      const next=options[Math.floor(pick()*options.length)],index=next.row*size+next.col;
      links[current].add(next.dir);links[index].add(mod(next.dir+2));seen.add(index);stack.push(index);
    }
    return links;
  }
  function matchShape(dirs,isSource){
    if(dirs.length===1){
      const shape=isSource?"source":"goal",base=raw[shape][0];
      return{shape,solved:mod(dirs[0]-base)};
    }
    const shape=dirs.length===4?"x":dirs.length===3?"t":mod(dirs[0]-dirs[1])===2||mod(dirs[1]-dirs[0])===2?"s":"e";
    for(let rotation=0;rotation<4;rotation++){
      const rotated=raw[shape].map(port=>mod(port+rotation)).sort().join(",");
      if(rotated===dirs.slice().sort().join(","))return{shape,solved:rotation};
    }
    throw new Error("Unsupported bamboo connection");
  }
  function traceRequiredPath(links,source){
    const parent=Array(25).fill(-1),distance=Array(25).fill(-1),queue=[source];
    distance[source]=0;
    while(queue.length){
      const current=queue.shift();
      links[current].forEach(direction=>{
        const [dr,dc]=directions[direction],row=Math.floor(current/size)+dr,col=current%size+dc,next=row*size+col;
        if(distance[next]>=0)return;
        distance[next]=distance[current]+1;parent[next]=current;queue.push(next);
      });
    }
    const target=links.reduce((best,set,index)=>set.size===1&&index!==source&&distance[index]>distance[best]?index:best,source);
    const required=[];let current=target;
    while(current>=0){required.push(current);current=parent[current]}
    return{target,required};
  }
  function build(index){
    const links=index===0?snake(false):index===1?snake(true):index===2?spiral():tree(0x9e3779b9^(index*2654435761));
    const leaves=links.map((set,i)=>set.size===1?i:-1).filter(i=>i>=0);
    const source=leaves[(index*5)%leaves.length];
    const {target,required}=traceRequiredPath(links,source),requiredSet=new Set(required);
    const decoyShapes=["s","e","t"];
    const tiles=links.map((set,i)=>{
      let tile=matchShape([...set],i===source);
      if(!requiredSet.has(i)&&(tile.shape==="goal"||tile.shape==="x")){
        const shape=decoyShapes[(index+i)%decoyShapes.length];
        tile={shape,solved:mod(index*3+i)};
      }
      const blockedPort=requiredSet.has(i)?null:[...set].find(direction=>{
        const [dr,dc]=directions[direction],next=(Math.floor(i/size)+dr)*size+i%size+dc;
        return requiredSet.has(next);
      });
      return{...tile,required:requiredSet.has(i),blockedPort:blockedPort??null};
    });
    return{index,size,source,target,required,decoys:25-required.length,tiles};
  }
  function structureScore(level){
    return level.tiles.reduce((score,tile)=>score+(tile.shape==="t"?1:tile.shape==="x"?2:0),0);
  }
  const authored=Array.from({length:30},(_,index)=>build(index));
  const ordered=[
    ...authored.slice(0,3),
    ...authored.slice(3).sort((a,b)=>a.decoys-b.decoys||structureScore(a)-structureScore(b)||a.index-b.index)
  ];
  const budgets=Array(30),pieceBudgets=Array(30);let nextTurns=Infinity,nextPieces=Infinity;
  for(let index=29;index>=0;index--){
    const level=ordered[index],candidates=level.tiles.filter((tile,tileIndex)=>tile.required&&tileIndex!==level.target&&tile.shape!=="x");
    const turnCapacity=candidates.reduce((total,tile)=>total+(tile.shape==="s"?1:3),0);
    budgets[index]=Math.min(index+2,turnCapacity,nextTurns);
    pieceBudgets[index]=Math.min(2+Math.floor(index/2),candidates.length,nextPieces);
    nextTurns=budgets[index];nextPieces=pieceBudgets[index];
  }
  const levels=ordered.map((level,index)=>({...level,index,difficulty:{
    turns:budgets[index],
    pieces:pieceBudgets[index],
    structure:level.decoys,
    branches:structureScore(level)
  }}));
  function createStageTiles(level,index,target){
    const tiles=level.tiles.map((tile,tileIndex)=>({...tile,target:tileIndex===target,rot:tile.solved}));
    tiles.forEach((tile,tileIndex)=>{
      if(tile.required||tile.target)return;
      const rank=(((tileIndex+1)*1664525+(index+1)*1013904223)>>>0);
      const rotations=[0,1,2,3].filter(rotation=>tile.blockedPort===null||!raw[tile.shape].map(port=>mod(port+rotation)).includes(tile.blockedPort));
      const scrambled=rotations.filter(rotation=>rotation!==tile.solved);
      tile.rot=(scrambled.length?scrambled:rotations)[rank%(scrambled.length||rotations.length)];
    });
    const candidates=tiles
      .map((tile,tileIndex)=>({tile,tileIndex,rank:((tileIndex+1)*1103515245+(index+1)*12345)>>>0}))
      .filter(({tile})=>tile.required&&tile.shape!=="x"&&!tile.target)
      .sort((a,b)=>{
        const aCap=a.tile.shape==="s"?1:3,bCap=b.tile.shape==="s"?1:3;
        return bCap-aCap||a.rank-b.rank||a.tileIndex-b.tileIndex;
      })
      .slice(0,level.difficulty.pieces);
    const required=new Map(candidates.map(({tileIndex})=>[tileIndex,1]));
    let remaining=level.difficulty.turns-candidates.length;
    while(remaining>0){
      let advanced=false;
      for(const {tile,tileIndex} of candidates){
        const cap=tile.shape==="s"?1:3,current=required.get(tileIndex);
        if(current>=cap)continue;
        required.set(tileIndex,current+1);
        remaining--;
        advanced=true;
        if(!remaining)break;
      }
      if(!advanced)throw new Error(`Waterway ${index+1} cannot satisfy its difficulty budget`);
    }
    required.forEach((turns,tileIndex)=>{
      const period=tiles[tileIndex].shape==="s"?2:4;
      tiles[tileIndex].rot=mod(tiles[tileIndex].solved+period-(turns%period));
    });
    return tiles;
  }
  const api={levels,build,raw,createStageTiles,structureScore};
  root.BAMBOO_LEVELS=api;
  if(typeof module!=="undefined")module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
