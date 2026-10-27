// Local-practice chapter slice only; the normal campaign remains at 30.
export const LATCH_CHAPTER_CANDIDATES=[{
  id:31,name:'The paired landing',
  decision:'Release the marked key support first; then remove the matching lock and direct the sword to Fia before facing the guard.',
  board:['.......','AA..CCC','.......','BBBAACC','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'guard',x:4,y:4,power:20}],required:['guard'],
  items:[{id:'blade',kind:'sword',x:5,y:0,amount:14},{id:'crown',kind:'crown',x:6,y:4}],
  latches:[{id:'sun',key:[4,1],lock:[0,1]}]
}];
