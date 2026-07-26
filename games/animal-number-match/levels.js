((root)=>{
  "use strict";
  function rng(seed){let v=seed>>>0;return()=>{v=(v*1664525+1013904223)>>>0;return v/4294967296}}
  function build(index){
    const rows=index<10?4:index<20?5:6,cols=6,roll=rng(0x45d9f3b^(index*2654435761)),cells=[];
    for(let row=0;row<rows;row++){
      const half=[];
      for(let pair=0;pair<3;pair++){
        const a=1+Math.floor(roll()*9),same=roll()<(index<8?.65:.42),b=same?a:10-a;
        half.push([a,b]);
      }
      const rowValues=[];
      half.forEach(pair=>rowValues.push(pair[0]));
      half.slice().reverse().forEach(pair=>rowValues.push(pair[1]));
      if((row+index)%2)rowValues.reverse();
      cells.push(...rowValues);
    }
    return{index,rows,cols,cells};
  }
  const api={levels:Array.from({length:30},(_,i)=>build(i)),build};
  root.NUMBER_MATCH_LEVELS=api;if(typeof module!=="undefined")module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
