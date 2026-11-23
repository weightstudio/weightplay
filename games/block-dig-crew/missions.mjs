// Positions are stable authored indices into the 5×4 island grid, not random drops.
const patches=[
  [7,12,8],[7,12],[8,12,6],[6,8,13,11],[7,12,8,11,13],
  [0,1],[0,2,0],[0,1,2],[1,0,1,0],[2,0,1,2,1],
  [11,8],[6,13,7],[12,6,13,8],[13,7,11,8],[8,12,6,13,7],
  [0,0,1],[1,0,1],[1,0,0,1],[3,1,0,2],[0,2,1,3,2,0],
  [7,7],[6,6,13,13],[8,8,12,12,11,11],[8,8,8,11,11],[6,6,8,8,13,13,11,11],
  [0,1],[1,2],[2,0,1],[0,2,1,2],[0,1,2,1,0,2],
  [7],[7,12],[6,8],[12,7,13],[8,13,11,6],
  [7,12],[12,7,13],[6,8,13],[12,8,11,13],[7,8,12,7],
  [7],[7,13],[6,13,8],[6,12,8,13],[6,11,7,13,8],
  [6,7],[8,7],[6,12,8],[6,8,13,11],[6,8,13,11,6],
  [11,13],[6,6,8,8],[0,1,2,7],[12,8,13],[7,13,6,6,12],
  [0,1,0],[1,2,1],[2,3,2],[3,4,3],[0,1,2,3,4],
];
const kinds=['sample','alternate','seam','alternate','cap','route','chill','chill','anchor','anchor','mixed','grand'];
const lands=[0,0,1,1,2,2,3,3,4,4,4,4];
export const MISSIONS=patches.map((targets,index)=>{
  const group=Math.floor(index/5), kind=kinds[group];
  const step=(target,i)=>{
    if(kind==='alternate')return {tool:target};
    if(kind==='route')return {land:target,slot:7+(i%2)*5};
    if(kind==='grand')return {land:target,slot:[7,11,8,12,13][target],device:target===3?'chill':target===4?'anchor':null};
    if(kind==='mixed'){
      const variant=index%5;
      if(variant===2&&i<3)return {tool:target};
      const devices=[['seam','anchor'],['seam','seam','chill','chill'],['','','','anchor'],['chill','seam','anchor'],['chill','anchor','seam','seam','anchor']];
      const device=devices[variant][i];
      return {slot:target,device:['chill','anchor'].includes(device)?device:null};
    }
    return {slot:target,device:kind==='chill'&&(group===6||i%2===0)?'chill':kind==='anchor'?'anchor':null};
  };
  const steps=targets.map(step);
  return {id:index+1,land:steps[0].land??lands[group],kind:kind==='mixed'?'seam':kind==='grand'?'route':kind,
    steps,tools:Math.max(1,...steps.map(x=>x.tool===undefined?1:x.tool+1)),checkpoint:index%5===4};
});
