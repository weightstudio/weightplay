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
},{
  id:37,name:'Two paths to multiplication',
  decision:'Match each numbered key and lock, then collect the addition before the multiplier.',
  board:['.......','AA...CC','.......','BBB.CCC','.......','AAABBBB','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6}],
  latches:[{id:'sun',lock:[0,1],key:[5,1]},{id:'moon',lock:[0,3],key:[4,3]}]
},{
  id:38,name:'The shielded multiplier',
  decision:'Release the key support before its lock; collect the addition before the multiplier and bring the rune to the shielded guard.',
  board:['.......','..AA...','.......','BBBAACC','.......','CCCAAAA','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48,shield:'sun'}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'rune',kind:'rune',x:4,y:4,link:'sun'}],
  latches:[{id:'sun',lock:[0,3],key:[3,1]}]
},{
  id:39,name:'Two locks and the shield',
  decision:'Open each numbered pair in order, add before multiplying, and collect the rune to break the guard’s shield.',
  board:['.......','AA.BCCC','.......','BBBA.CC','.......','CCCCAAA','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48,shield:'sun'}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'rune',kind:'rune',x:4,y:4,link:'sun'}],
  latches:[{id:'sun',lock:[0,1],key:[3,1]},{id:'moon',lock:[4,1],key:[0,3]}]
},{
  id:40,name:'The shielded return',
  decision:'Open both numbered pairs, collect the rune and prepare enough power for the guardian’s second form.',
  board:['.......','AA.BCCC','.......','BBBA.CC','.......','CCCCAAA','.......','BBBBBBB','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48,shield:'sun',boss:true,next:{x:0,y:8,power:120}}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:8},{id:'rune',kind:'rune',x:4,y:4,link:'sun'},{id:'boost',kind:'power',x:0,y:4,amount:24}],
  latches:[{id:'sun',lock:[0,1],key:[3,1]},{id:'moon',lock:[4,1],key:[0,3]}]
},{
  id:41,name:'The ordered seals',
  decision:'Remove the key support before its lock and collect seal 1 before seal 2 while preparing the arithmetic route.',
  board:['.......','.AA.BCC','.......','BBB.CCC','.......','CCCAAAA','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'seal1',kind:'seal',x:0,y:0,link:'1'},{id:'seal2',kind:'seal',x:3,y:0,link:'2'}],sealOrder:['1','2'],
  latches:[{id:'sun',lock:[1,1],key:[4,3]}]
},{
  id:42,name:'Pairs and ordered seals',
  decision:'Keep the seal route safe while opening both numbered key and lock pairs, then take seals 1 and 2 in order.',
  board:['.......','AAA..CC','.......','BBBA.CC','.......','CCCAAAA','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'seal1',kind:'seal',x:0,y:0,link:'1'},{id:'seal2',kind:'seal',x:3,y:0,link:'2'}],sealOrder:['1','2'],
  latches:[{id:'sun',lock:[5,1],key:[0,1]},{id:'moon',lock:[0,3],key:[3,3]}]
}];
