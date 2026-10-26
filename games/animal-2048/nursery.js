/* Nursery Crossings, missions 31–60. Each board and request route is authored.
 * Pure delivery rules are shared by normal play, hints and deterministic checks. */
(() => {
  'use strict';
  const row = text => text.split('|').flatMap(r => r.trim().split(/\s+/).map(Number));
  const home = (cell, needs, opens = []) => ({cell, needs, opens});
  const definitions = [
    [8,3107,[], '4 4 0 0|0 2 0 0|0 0 2 0|0 0 0 0', [home(0,[8])]],
    [10,3217,[], '0 4 2 2|0 0 4 0|0 2 0 0|0 0 0 0', [home(3,[8])]],
    [10,3301,[], '8 0 0 0|4 0 2 0|4 0 0 0|0 0 2 0', [home(12,[16])]],
    [12,3461,[5], '0 0 0 2|2 0 0 4|0 0 0 2|0 4 0 0', [home(15,[8])]],
    [12,3527,[], '2 2 0 4|4 0 0 0|0 0 2 2|0 0 4 4', [home(0,[8]),home(15,[8])],{kind:'space',target:4}],
    [12,3631,[5,9,12,14], '4 4 4 0|0 0 2 0|0 0 0 0|0 4 0 0', [home(0,[8],[5,9]),home(13,[8])]],
    [12,3701,[6,10,13,15], '0 4 8 8|2 0 0 0|0 0 0 0|0 0 4 0', [home(3,[16],[6,10]),home(14,[8])]],
    [14,3823,[9,10], '0 2 0 2|4 0 0 4|2 0 0 2|2 0 0 2', [home(12,[8],[9]),home(15,[8],[10])]],
    [16,3911,[5,6], '2 2 0 4|4 0 0 4|0 2 0 8|0 0 0 0', [home(0,[8],[5]),home(3,[16],[6])]],
    [18,4007,[5,10], '8 8 0 0|4 0 0 4|4 0 0 0|0 0 8 8', [home(0,[16],[5]),home(15,[16],[10])],{kind:'pairs',target:2}],
    [18,4111,[], '4 4 2 2|8 0 0 0|2 0 4 0|0 0 0 0', [home(0,[8,16])]],
    [16,4217,[6], '0 4 2 2|0 4 0 0|2 0 0 2|0 0 0 0', [home(3,[8,8],[6])]],
    [22,4327,[5], '8 0 4 4|4 0 0 2|4 2 0 0|0 0 0 0', [home(12,[8,16],[5]),home(3,[8])]],
    [18,4409,[4,7], '4 4 0 0|0 2 2 0|0 0 4 8|0 0 0 8', [home(15,[16,8],[7])]],
    [22,4513,[5,10], '4 4 8 0|2 0 0 2|4 0 0 4|0 0 4 4', [home(0,[8,16],[5]),home(15,[8],[10])],{kind:'space',target:3}],
    [22,4637,[9], '8 4 4 0|0 2 2 8|0 0 0 4|0 0 0 4', [home(0,[16]),home(3,[8,16],[9])]],
    [20,4703,[5,6], '2 4 4 2|4 0 0 8|4 0 0 4|0 0 0 4', [home(12,[8,8],[5]),home(15,[16],[6])]],
    [22,4817,[6,9], '8 8 2 2|0 4 0 0|0 0 4 8|0 0 0 8', [home(0,[16,8],[9]),home(15,[16],[6])]],
    [24,4919,[5,10], '4 4 0 8|8 0 2 0|4 0 0 4|4 0 2 0', [home(3,[8,16],[5]),home(12,[16,8],[10])]],
    [26,5003,[5,10], '4 4 8 8|2 0 0 2|4 0 0 4|0 0 8 8', [home(0,[8,16],[5]),home(15,[16,8],[10])],{kind:'pairs',target:2}],
    [20,5113,[6], '4 4 0 4|0 2 0 4|8 0 2 0|8 0 0 0', [home(0,[8]),home(3,[8],[6]),home(12,[16])]],
    [22,5227,[5,9], '2 2 8 8|4 0 0 0|4 0 2 0|0 0 2 0', [home(0,[8,8],[5]),home(3,[16]),home(12,[8],[9])]],
    [24,5303,[6,10], '8 8 4 4|4 0 0 8|4 2 0 0|0 2 0 0', [home(0,[16],[6]),home(3,[8,16],[10]),home(12,[8])]],
    [24,5407,[5,10], '2 2 4 0|8 0 0 8|8 0 0 4|0 4 4 4', [home(0,[8]),home(12,[16,8],[5]),home(15,[16],[10])]],
    [24,5519,[5,6], '4 4 0 4|8 0 0 4|2 0 0 8|2 0 0 8', [home(0,[8,16],[5]),home(3,[8],[6]),home(15,[16])],{kind:'space',target:4}],
    [26,5623,[5,10], '8 8 16 0|8 0 4 4|8 0 0 2|0 0 4 2', [home(0,[16,32],[5]),home(15,[8,16],[10])]],
    [26,5711,[6,9], '4 4 8 8|2 0 0 0|4 0 0 4|4 2 0 0', [home(0,[8,16],[6]),home(3,[16]),home(12,[8],[9])]],
    [28,5839,[5,10], '8 8 4 4|2 0 0 8|4 0 0 8|4 2 2 0', [home(0,[16,8],[10]),home(3,[8,16],[5]),home(15,[16])]],
    [30,5903,[5,6], '4 4 8 8|4 0 0 8|4 0 0 8|8 0 2 2', [home(0,[8]),home(3,[16],[6]),home(12,[8,16],[5]),home(15,[16])]],
    [34,6011,[5,10], '4 4 8 8|4 0 0 4|4 0 0 4|8 8 2 2', [home(0,[8,16],[5]),home(3,[16]),home(12,[8]),home(15,[16,8],[10])],{kind:'pairs',target:3}]
  ];
  const levels=definitions.map(([limit,seed,blocked,start,nests,checkpoint],i)=>({type:'homes',target:nests.reduce((n,h)=>n+h.needs.length,0),limit,seed,blocked,start:row(start),nests,...(checkpoint?{checkpoint}:{})}));
  function opened(nests,counts){return nests.flatMap((h,i)=>(counts[i]||0)>=h.needs.length?h.opens:[]);}
  function resolve(values,mergedIndices,nests,previous){
    const board=[...values],counts=[...previous],delivered=[];
    for(const [i,h] of nests.entries()){
      const step=counts[i]||0,required=h.needs[step];
      if(required===undefined||!mergedIndices.includes(h.cell)||board[h.cell]<required)continue;
      delivered.push({cell:h.cell,value:board[h.cell],home:i,step,required,opens:step+1===h.needs.length?[...h.opens]:[]});
      board[h.cell]=0;counts[i]=step+1;
    }
    return {board,counts,delivered,opened:opened(nests,counts)};
  }
  window.ForestNursery=Object.freeze({levels,opened,resolve});
})();
