((root)=>{
  "use strict";
  const reflect=(direction,rotation)=>rotation===0?[1,0,3,2][direction]:[3,2,1,0][direction];
  function trace(level,mirrors=level.mirrors,gates=level.gates||[]){
    const mirrorMap=new Map(mirrors.map(item=>[item.cell,item]));
    const closed=new Set(gates.filter(item=>!item.open).map(item=>item.cell));
    const paths=level.sources.map(source=>{
      const beam=[],seen=new Set();let cell=source.cell,direction=source.startDir,hit=false,stop="edge";
      for(let step=0;step<144;step++){
        const marker=cell+":"+direction;
        if(seen.has(marker)){stop="loop";break}
        seen.add(marker);beam.push(cell);
        if(cell===level.goal){hit=true;stop="lotus";break}
        if(closed.has(cell)){stop="gate";break}
        const mirror=mirrorMap.get(cell);if(mirror)direction=reflect(direction,mirror.rot);
        const row=Math.floor(cell/6),col=cell%6,nr=row+[-1,0,1,0][direction],nc=col+[0,1,0,-1][direction];
        if(nr<0||nr>5||nc<0||nc>5)break;
        cell=nr*6+nc;
      }
      return{beam,hit,stop,direction,end:beam.at(-1)};
    });
    return{paths,beam:[...new Set(paths.flatMap(path=>path.beam))],hit:paths.every(path=>path.hit)&&gates.every(gate=>gate.open)};
  }
  function edges(path){
    return path.beam.slice(1).map((to,index)=>({key:path.beam[index]+":"+to,from:path.beam[index],to}));
  }
  function delta(previous,next){
    const before=new Map(edges(previous||{beam:[]}).map(edge=>[edge.key,edge]));
    const after=new Map(edges(next).map(edge=>[edge.key,edge]));
    return{kept:[...after.values()].filter(edge=>before.has(edge.key)),added:[...after.values()].filter(edge=>!before.has(edge.key)),removed:[...before.values()].filter(edge=>!after.has(edge.key))};
  }
  const bits=value=>{let count=0;for(let n=value;n;n>>>=1)count+=n&1;return count};
  function hintMirror(level,mirrors,blooms){
    const mask=mirrors.reduce((value,mirror,index)=>value|((mirror.rot^level.mirrors[index].rot)<<index),0);
    const sleeping=blooms.filter(bloom=>!bloom.awake);
    const candidates=sleeping.flatMap(bloom=>bloom.witnesses.map(target=>({target,cell:bloom.cell,cost:bits(mask^target)})));
    const solved=mirrors.reduce((value,mirror,index)=>value|((level.mirrors[index].rot^mirror.solution)<<index),0);
    const choice=candidates.sort((a,b)=>a.cost-b.cost||a.cell-b.cell)[0]||{target:solved};
    const index=mirrors.findIndex((mirror,i)=>((mask^choice.target)>>i)&1);
    return index<0?null:{mirror:mirrors[index],bloomCell:choice.cell};
  }
  const api={reflect,trace,edges,delta,hintMirror};root.SUNBEAM_OPTICS=api;
  if(typeof module!=="undefined")module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
