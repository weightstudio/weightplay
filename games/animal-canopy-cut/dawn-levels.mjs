// Closed chapter-two candidate. Existing 1–30 definitions remain unchanged.
const rows=[
 [1,.30,2,'learn',0,0,0],[2,.30,2,'learn',0,0,0],[2,.45,2,'split',0,0,0],[2,.55,2,'learn',0,0,0],[2,.45,2,'checkpoint',0,0,0],
 [2,.35,2,'split',0,0,0],[3,.45,2,'split',0,0,0],[3,.55,2,'split',0,0,0],[3,.45,3,'split',0,0,0],[3,.50,2,'split',0,0,0],
 [2,.40,2,'wind',.34,0,0],[3,.45,2,'split',-.34,0,0],[3,.50,2,'windSwitch',.42,0,0],[3,.55,3,'gust',-.42,.6,0],[3,.50,2,'gust',.38,.6,0],
 [3,.45,2,'weave',0,1.1,0],[3,.55,2,'split',0,1.1,0],[3,.65,2,'weave',0,1.2,0],[4,.50,2,'rhythm',0,1.2,1],[4,.55,2,'weave',0,1.2,1],
 [3,.50,3,'shadow',0,0,0],[3,.60,2,'split',0,0,0],[4,.55,2,'windSwitch',.35,0,0],[4,.65,2,'gust',-.35,1,0],[4,.55,2,'gust',.35,.8,0],
 [4,.45,2,'split',.3,0,1],[4,.55,3,'weave',0,1.1,0],[4,.60,2,'gust',-.35,.8,1],[4,.65,2,'windSwitch',.35,0,0],[4,.60,2,'split',.35,1,1]
];
export const DAWN_LEVELS=Object.freeze(rows.map(([markedGoal,ripeAge,markEvery,mechanic,wind,weave,rhythm],i)=>Object.freeze({
  id:31+i,arc:7+Math.floor(i/5),mechanic,markedGoal,ripeAge,markEvery,wind,weave,rhythm:!!rhythm,
  hazard:i<5?.10:i<15?.16:.20,duration:18,checkpoint:(31+i)%5===0,
  shadow:i>=20&&i!==25&&i!==26&&i!==27
})));
