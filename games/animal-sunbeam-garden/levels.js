((root)=>{
  "use strict";
  const campaignTurns=[
    2,2,2,3,3,
    3,3,4,4,4,
    4,5,5,5,6,
    6,6,7,7,7,
    8,8,8,9,9,
    9,9,10,10,10
  ];
  const snakeWaypoints=[0,5,11,6,12,17,23,18,24,29,35,30];
  const decoyOrder=[14,21,7,28,8,27,13,22,15,20,9,26,19,16,10,25];
  const rc=i=>[Math.floor(i/6),i%6],dir=(a,b)=>{const[ar,ac]=rc(a),[br,bc]=rc(b);return br<ar?0:bc>ac?1:br>ar?2:3};
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
        route.push(cell);
      }
    }
    return route;
  }
  function build(index){
    const campaignIndex=((index%campaignTurns.length)+campaignTurns.length)%campaignTurns.length;
    const par=campaignTurns[campaignIndex],variant=campaignIndex%8;
    const route=expand(snakeWaypoints.slice(0,par+2)).map(cell=>transform(cell,variant));
    const source=route[0],goal=route.at(-1),mirrors=[];
    for(let i=1;i<route.length-1;i++){
      const incoming=dir(route[i-1],route[i]),outgoing=dir(route[i],route[i+1]);
      if(incoming!==outgoing){
        const solution=reflect(incoming,outgoing);
        mirrors.push({cell:route[i],solution,rot:1-solution,essential:true});
      }
    }
    const used=new Set(route),decoyCount=Math.floor(campaignIndex/5);
    decoyOrder
      .map(cell=>transform(cell,variant))
      .filter(cell=>!used.has(cell))
      .slice(0,decoyCount)
      .forEach((cell,i)=>{
        const solution=(campaignIndex+i)%2;
        mirrors.push({cell,solution,rot:solution,essential:false});
      });
    return{index:campaignIndex,source,goal,startDir:dir(route[0],route[1]),par,difficulty:Math.floor(campaignIndex/5)+1,mirrors};
  }
  root.SUNBEAM_LEVELS={levels:Array.from({length:30},(_,i)=>build(i)),build,reflect,campaignTurns};if(typeof module!=="undefined")module.exports=root.SUNBEAM_LEVELS;
})(typeof window!=="undefined"?window:globalThis);
