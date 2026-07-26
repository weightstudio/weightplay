((root)=>{
  "use strict";
  const colors=3;
  function rng(seed){let v=seed>>>0;return()=>{v=(v*1664525+1013904223)>>>0;return v/4294967296}}
  function build(index){const roll=rng(0x71a5e31^(index*2654435761)),capacity=index<10?3:index<20?4:5,bag=[];for(let color=0;color<colors;color++)for(let n=0;n<capacity;n++)bag.push(color);for(let i=bag.length-1;i>0;i--){const j=Math.floor(roll()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}const queues=[[],[],[]];bag.forEach((color,i)=>queues[i%3].push(color));return{index,capacity,queues}}
  root.BUS_JAM_LEVELS={colors,levels:Array.from({length:30},(_,i)=>build(i)),build};if(typeof module!=="undefined")module.exports=root.BUS_JAM_LEVELS;
})(typeof window!=="undefined"?window:globalThis);
