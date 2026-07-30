((root)=>{
  "use strict";
  const colors=["cyan","magenta","amber","violet","lime","coral","blue","rose","gold"];
  function random(seed){
    return()=>{
      seed=Math.imul(seed^(seed>>>15),1|seed);
      seed^=seed+Math.imul(seed^(seed>>>7),61|seed);
      return((seed^(seed>>>14))>>>0)/4294967296;
    };
  }
  function neighbours(index,size){
    const row=Math.floor(index/size),column=index%size,out=[];
    if(row>0)out.push(index-size);
    if(row<size-1)out.push(index+size);
    if(column>0)out.push(index-1);
    if(column<size-1)out.push(index+1);
    return out;
  }
  function hamiltonian(size,seed){
    const rng=random(seed),total=size*size,visited=new Uint8Array(total),path=[];
    const graph=Array.from({length:total},(_,index)=>neighbours(index,size));
    function visit(cell){
      visited[cell]=1;path.push(cell);
      if(path.length===total)return true;
      const candidates=graph[cell]
        .filter(next=>!visited[next])
        .map(next=>({next,onward:graph[next].filter(peer=>!visited[peer]).length,tie:rng()}))
        .sort((a,b)=>a.onward-b.onward||a.tie-b.tie);
      for(const candidate of candidates)if(visit(candidate.next))return true;
      visited[cell]=0;path.pop();return false;
    }
    const corners=[0,size-1,total-size,total-1]
      .map(cell=>({cell,tie:rng()}))
      .sort((a,b)=>a.tie-b.tie);
    for(const {cell} of corners){
      if(visit(cell))return path.slice();
      visited.fill(0);path.length=0;
    }
    throw new Error(`Unable to build ${size}x${size} route`);
  }
  function allocate(total,count,index){
    const lengths=Array(count).fill(Math.floor(total/count));
    for(let i=0;i<total%count;i++)lengths[(i*3+index)%count]++;
    for(let i=0;i<count;i++){
      if(lengths[i]<3){const donor=lengths.findIndex(value=>value>4);if(donor>=0){lengths[donor]--;lengths[i]++}}
    }
    return lengths;
  }
  function turns(path,size){
    let total=0;
    for(let index=1;index<path.length-1;index++){
      const previous=path[index-1],current=path[index],next=path[index+1];
      const first=[Math.floor(current/size)-Math.floor(previous/size),current%size-previous%size];
      const second=[Math.floor(next/size)-Math.floor(current/size),next%size-current%size];
      if(first[0]!==second[0]||first[1]!==second[1])total++;
    }
    return total;
  }
  function difficultyScore(path,size,count,index){
    const lengths=allocate(path.length,count,index);let cursor=0,score=turns(path,size)*5;
    for(const length of lengths){
      const start=path[cursor],end=path[cursor+length-1];
      const distance=Math.abs(Math.floor(start/size)-Math.floor(end/size))+Math.abs(start%size-end%size);
      score+=distance*3+(distance>=Math.ceil(size/2)?6:0);
      cursor+=length;
    }
    return score;
  }
  function hardPath(size,count,index){
    let best=null,bestScore=-Infinity;
    for(let variant=0;variant<40;variant++){
      const candidate=hamiltonian(size,0x6d2b79f5^(index+1)*0x9e3779b1^variant*0x85ebca6b);
      const score=difficultyScore(candidate,size,count,index);
      if(score>bestScore){best=candidate;bestScore=score}
    }
    return best;
  }
  function buildLevel(index){
    const size=index<8?7:index<17?8:index<25?9:10;
    const count=index<5?5:index<12?6:index<20?7:index<26?8:9;
    const route=hardPath(size,count,index);
    const lengths=allocate(route.length,count,index);
    const solution={},ends={},gates={};let cursor=0;
    lengths.forEach((length,color)=>{
      const part=route.slice(cursor,cursor+length);
      solution[color]=part;
      ends[color]=[part[0],part.at(-1)];
      cursor+=length;
    });
    const gateTotal=index<4?0:Math.min(3,1+Math.floor((index-4)/9));
    const gateColors=Object.keys(solution)
      .map(Number)
      .sort((a,b)=>solution[b].length-solution[a].length||a-b);
    for(let gateIndex=0;gateIndex<gateTotal;gateIndex++){
      const color=gateColors[(index+gateIndex*3)%gateColors.length],part=solution[color];
      const offset=Math.max(2,Math.min(part.length-3,Math.floor(part.length*(gateIndex+2)/(gateTotal+3))));
      gates[part[offset]]=color;
    }
    return{index,size,count,colors:colors.slice(0,count),solution,ends,gates,chapter:Math.floor(index/5)+1};
  }
  root.PRISM_GARDEN_LEVELS={levels:Array.from({length:30},(_,index)=>buildLevel(index)),buildLevel,colors};
  if(typeof module!=="undefined")module.exports=root.PRISM_GARDEN_LEVELS;
})(typeof window!=="undefined"?window:globalThis);
