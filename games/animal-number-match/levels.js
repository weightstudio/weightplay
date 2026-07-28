((root)=>{
  "use strict";
  function rng(seed){let v=seed>>>0;return()=>{v=(v*1664525+1013904223)>>>0;return v/4294967296}}
  const layouts=[
    [[0,1],[2,3],[4,5]],
    [[0,1],[2,5],[3,4]],
    [[0,5],[1,4],[2,3]],
  ];
  function build(index){
    const rows=index<10?4:index<20?5:6,cols=6,roll=rng(0x45d9f3b^(index*2654435761)),cells=[],solution=[];
    const tier=Math.min(5,Math.floor(index/6)+1);
    const layoutDepth=index<5?1:2;
    const paletteSize=Math.min(4,2+Math.floor(index/7));
    for(let row=0;row<rows;row++){
      const rowValues=Array(cols).fill(0);
      const patternRank=index<5
        ? Math.min(1,Math.floor((index+row)/3))
        : index<10
          ? Math.min(2,1+Math.floor((index-5+row)/4))
          : 2;
      const pattern=layouts[patternRank];
      pattern.forEach(([left,right])=>{
        const a=1+Math.floor(roll()*paletteSize);
        rowValues[left]=a;
        rowValues[right]=10-a;
      });
      const reversed=(row+index)%2===1;
      if(reversed)rowValues.reverse();
      pattern.slice().reverse().forEach(([left,right])=>{
        const map=position=>row*cols+(reversed?cols-1-position:position);
        solution.push([map(left),map(right)]);
      });
      cells.push(...rowValues);
    }
    return{index,rows,cols,cells,solution,tier,layoutDepth,difficulty:index+1};
  }
  const api={levels:Array.from({length:30},(_,i)=>build(i)),build};
  root.NUMBER_MATCH_LEVELS=api;if(typeof module!=="undefined")module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
