((root)=>{
  "use strict";
  const routes=[
    [[0,1,2,3,4,10,16,22,28,29,30,31,32,33,34,35],0,35],
    [[0,6,12,18,24,25,26,27,28,29,35],0,35],
    [[5,4,3,2,1,0,6,12,18,24,30,31,32,33,34,35],5,35],
    [[30,24,18,12,6,0,1,2,3,4,5,11,17,23,29,35],30,35],
    [[0,1,2,8,14,20,26,27,28,29,35],0,35],
    [[5,11,17,23,29,28,27,26,25,24,30,31,32,33,34,35],5,35]
  ];
  const rc=i=>[Math.floor(i/6),i%6],dir=(a,b)=>{const[ar,ac]=rc(a),[br,bc]=rc(b);return br<ar?0:bc>ac?1:br>ar?2:3};
  const reflect=(incoming,outgoing)=>incoming===0&&outgoing===1||incoming===1&&outgoing===0||incoming===2&&outgoing===3||incoming===3&&outgoing===2?0:1;
  function build(index){
    const [route,source,goal]=routes[index%routes.length],mirrors=[];for(let i=1;i<route.length-1;i++){const incoming=dir(route[i-1],route[i]),outgoing=dir(route[i],route[i+1]);if(incoming!==outgoing)mirrors.push({cell:route[i],solution:reflect(incoming,outgoing)})}
    const used=new Set([source,goal,...route]),distractors=[7,9,13,15,19,21,36-1,8,14,20,26,32].filter(cell=>!used.has(cell));
    distractors.slice(0,index%5).forEach((cell,i)=>mirrors.push({cell,solution:(index+i)%2}));
    return{index,source,goal,startDir:dir(route[0],route[1]),mirrors:mirrors.map((mirror,i)=>({...mirror,rot:(mirror.solution+(index+i)%2+1)%2}))};
  }
  root.SUNBEAM_LEVELS={levels:Array.from({length:30},(_,i)=>build(i)),build,reflect};if(typeof module!=="undefined")module.exports=root.SUNBEAM_LEVELS;
})(typeof window!=="undefined"?window:globalThis);
