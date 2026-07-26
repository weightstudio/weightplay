((root)=>{
  "use strict";
  const size=5;
  const directions=[[-1,0,0],[0,1,1],[1,0,2],[0,-1,3]];
  const raw={source:[0],goal:[2],s:[0,2],e:[0,1],t:[0,1,3],x:[0,1,2,3]};
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
  function build(index){
    const links=index===0?snake(false):index===1?snake(true):index===2?spiral():tree(0x9e3779b9^(index*2654435761));
    const leaves=links.map((set,i)=>set.size===1?i:-1).filter(i=>i>=0);
    const source=leaves[(index*5)%leaves.length];
    const tiles=links.map((set,i)=>matchShape([...set],i===source));
    return{index,size,source,tiles};
  }
  const api={levels:Array.from({length:30},(_,index)=>build(index)),build,raw};
  root.BAMBOO_LEVELS=api;
  if(typeof module!=="undefined")module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
