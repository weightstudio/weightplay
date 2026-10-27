// Local-practice chapter slice only; the normal campaign remains at 30.
export const LATCH_CHAPTER_CANDIDATES=[{
  id:31,name:'The paired landing',
  decision:'Release the marked key support first; then remove the matching lock and direct the sword to Fia before facing the guard.',
  board:['.......','AA..CCC','.......','BBBAACC','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'guard',x:4,y:4,power:20}],required:['guard'],
  items:[{id:'blade',kind:'sword',x:5,y:0,amount:14},{id:'crown',kind:'crown',x:6,y:4}],
  latches:[{id:'sun',key:[4,1],lock:[0,1]}]
},{
  id:32,name:'Two rival guards',
  decision:'Remove the side support to keep the weaker guard reachable, then release the marked key before the center lock and recover the sword before the stronger guard.',
  board:['.......','AA.BCCC','.......','BBB.CCC','.......','CCCAAAA','.......','#######'],
  hero:{x:3,y:0,power:10},enemies:[{id:'weak',x:1,y:0,power:6},{id:'strong',x:5,y:0,power:20}],required:['weak','strong'],
  items:[{id:'sword',kind:'sword',x:1,y:2,amount:8},{id:'crown',kind:'crown',x:6,y:6}],
  latches:[{id:'sun',key:[0,1],lock:[3,1]}]
},{
  id:33,name:'Rune behind the latch',
  decision:'Prepare the lower support, release the marked key, then bring the sword and sun rune to Fia before the shielded guard.',
  board:['.......','AAAB.CC','.......','BBB.CCC','.......','AAAABBB','.......','#######'],
  hero:{x:3,y:0,power:10},enemies:[{id:'weak',x:1,y:0,power:6},{id:'strong',x:5,y:0,power:20,shield:'sun'}],required:['weak','strong'],
  items:[{id:'sword',kind:'sword',x:1,y:2,amount:8},{id:'rune',kind:'rune',x:1,y:2,link:'sun'},{id:'crown',kind:'crown',x:6,y:6}],
  latches:[{id:'sun',key:[0,1],lock:[5,1]}]
},{
  id:34,name:'Two marked pairs',
  decision:'Use the single-dot key to open its lock, then prepare the lower two-dot key before releasing its paired support; keep the rune for the shielded guard.',
  board:['.......','AAA.BCC','.......','BBB.CCC','.......','AAAAAAA','.......','#######'],
  hero:{x:3,y:0,power:10},enemies:[{id:'weak',x:1,y:0,power:6},{id:'strong',x:5,y:0,power:20,shield:'sun'}],required:['weak','strong'],
  items:[{id:'sword',kind:'sword',x:1,y:2,amount:8},{id:'rune',kind:'rune',x:1,y:2,link:'sun'},{id:'crown',kind:'crown',x:6,y:6}],
  latches:[{id:'sun',key:[4,1],lock:[0,1]},{id:'moon',key:[0,3],lock:[5,1]}]
},{
  id:35,name:'The returning guardian',
  decision:'Open both numbered pairs, collect the rune for the shielded guardian and recover the lower supply before its stronger second form.',
  board:['.......','AAA.BCC','.......','BBB.CCC','.......','AAAAAAA','.......','BBBBBBB','.......','#######'],
  hero:{x:3,y:0,power:10},enemies:[{id:'weak',x:1,y:0,power:6},{id:'boss',x:5,y:0,power:20,shield:'sun',boss:true,next:{x:4,y:8,power:65}}],required:['weak','boss'],
  items:[{id:'sword',kind:'sword',x:1,y:2,amount:8},{id:'rune',kind:'rune',x:1,y:2,link:'sun'},{id:'boost',kind:'power',x:3,y:4,amount:24},{id:'crown',kind:'crown',x:6,y:8}],
  latches:[{id:'sun',key:[4,1],lock:[0,1]},{id:'moon',key:[0,3],lock:[5,1]}]
},{
  id:36,name:'The timed multiplier',
  decision:'Release the marked key before the lock and arrange the addition before the multiplier to defeat the final guard.',
  board:['.......','.AAA...','.......','BBC.CCC','.......','AAABBBB','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6}],
  latches:[{id:'sun',lock:[1,1],key:[4,3]}]
}];
