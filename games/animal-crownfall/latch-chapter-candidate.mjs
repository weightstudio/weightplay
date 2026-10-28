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
},{
  id:43,name:'The shielded seals',
  decision:'Open the marked latch, collect seals 1 and 2 in order, and bring the separate rune to the shielded guard.',
  board:['.......','AA.BCCC','.......','BBB.CCC','.......','AAACCCC','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48,shield:'sun'}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'rune',kind:'rune',x:4,y:4,link:'sun'},{id:'seal1',kind:'seal',x:3,y:0,link:'1'},{id:'seal2',kind:'seal',x:5,y:0,link:'2'}],sealOrder:['1','2'],
  latches:[{id:'sun',lock:[0,1],key:[4,1]}]
},{
  id:44,name:'Pairs, seals and shield',
  decision:'Match both key/lock pairs, collect seals 1 and 2 in order, and bring the rune to the shielded guard.',
  board:['.......','AA...CC','.......','BBBA.CC','.......','AAABBBB','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48,shield:'sun'}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'rune',kind:'rune',x:4,y:4,link:'sun'},{id:'seal1',kind:'seal',x:3,y:0,link:'1'},{id:'seal2',kind:'seal',x:5,y:0,link:'2'}],sealOrder:['1','2'],
  latches:[{id:'sun',lock:[0,1],key:[5,1]},{id:'moon',lock:[0,3],key:[5,3]}]
},{
  id:45,name:'The two-rune guardian',
  decision:'Match both latch pairs, take the seals in order, and find the sun then moon rune for the two shield phases.',
  board:['.......','AA...CC','.......','BBBA.CC','.......','AAABBBB','.......','BBBBBBB','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48,shield:'sun',boss:true,next:{x:0,y:8,power:120,shield:'moon'}}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:8},{id:'rune',kind:'rune',x:4,y:4,link:'sun'},{id:'seal1',kind:'seal',x:3,y:0,link:'1'},{id:'seal2',kind:'seal',x:5,y:0,link:'2'},{id:'boost',kind:'power',x:0,y:4,amount:24},{id:'moonRune',kind:'rune',x:4,y:8,link:'moon'}],sealOrder:['1','2'],
  latches:[{id:'sun',lock:[0,1],key:[5,1]},{id:'moon',lock:[0,3],key:[5,3]}]
},{
  id:46,name:'Three seals in order',
  decision:'Open the key support before the lock and collect all three seals in order while planning the arithmetic route.',
  board:['.......','AAA.BCC','.......','BB.CCCA','.......','CCCAAAA','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'seal1',kind:'seal',x:0,y:0,link:'1'},{id:'seal2',kind:'seal',x:3,y:0,link:'2'},{id:'seal3',kind:'seal',x:3,y:4,link:'3'}],sealOrder:['1','2','3'],
  latches:[{id:'sun',lock:[0,1],key:[0,3]}]
},{
  id:47,name:'Three seals, two pairs',
  decision:'Release both matched support pairs while preserving the three-seal order and the arithmetic route.',
  board:['.......','AA.BCCC','.......','BB.CCCA','.......','CCCAAAA','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'seal1',kind:'seal',x:0,y:0,link:'1'},{id:'seal2',kind:'seal',x:3,y:0,link:'2'},{id:'seal3',kind:'seal',x:3,y:4,link:'3'}],sealOrder:['1','2','3'],
  latches:[{id:'sun',lock:[0,1],key:[3,1]},{id:'moon',lock:[4,1],key:[0,3]}]
},{
  id:48,name:'Three seals and the shield',
  decision:'Release the key before its lock, collect the three seals in order, and bring the sun rune to the shielded guard.',
  board:['.......','AA.BCCC','.......','BBB.CCC','.......','AAACCCC','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48,shield:'sun'}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'seal1',kind:'seal',x:0,y:0,link:'1'},{id:'seal2',kind:'seal',x:3,y:0,link:'2'},{id:'seal3',kind:'seal',x:3,y:4,link:'3'},{id:'rune',kind:'rune',x:2,y:0,link:'sun'}],sealOrder:['1','2','3'],
  latches:[{id:'sun',lock:[0,1],key:[3,1]}]
},{
  id:49,name:'Paired locks and sun shield',
  decision:'Match both pairs, take the three seals in order, and bring the sun rune to the shielded guard.',
  board:['.......','AAA.BCC','.......','BB.CCCA','.......','CCCAAAA','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48,shield:'sun'}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'seal1',kind:'seal',x:0,y:0,link:'1'},{id:'seal2',kind:'seal',x:3,y:0,link:'2'},{id:'seal3',kind:'seal',x:3,y:4,link:'3'},{id:'rune',kind:'rune',x:2,y:0,link:'sun'}],sealOrder:['1','2','3'],
  latches:[{id:'sun',lock:[0,1],key:[4,1]},{id:'moon',lock:[3,3],key:[5,1]}]
},{
  id:50,name:'The three-seal guardian',
  decision:'Open both pairs, take all three seals in order, and bring the sun then moon rune for the two shield phases.',
  board:['.......','AAA.BCC','.......','BB.CCCA','.......','CCCAAAA','.......','BBBBBBB','.......','#######'],
  hero:{x:1,y:0,power:10},enemies:[{id:'weak',x:2,y:2,power:6},{id:'last',x:4,y:6,power:48,shield:'sun',boss:true,next:{x:0,y:8,power:120,shield:'moon'}}],required:['weak','last'],
  items:[{id:'charge',kind:'multiply',x:5,y:2,amount:2},{id:'fruit',kind:'power',x:2,y:4,amount:10},{id:'seal1',kind:'seal',x:0,y:0,link:'1'},{id:'seal2',kind:'seal',x:3,y:0,link:'2'},{id:'seal3',kind:'seal',x:3,y:4,link:'3'},{id:'rune',kind:'rune',x:2,y:0,link:'sun'},{id:'boost',kind:'power',x:0,y:4,amount:24},{id:'moonRune',kind:'rune',x:4,y:8,link:'moon'},{id:'crown',kind:'crown',x:6,y:8}],sealOrder:['1','2','3'],
  latches:[{id:'sun',lock:[0,1],key:[4,1]},{id:'moon',lock:[3,3],key:[5,1]}]
},{
  id:51,name:'The spike bridge',
  decision:'Keep the left support while moving Fia to the safe side; open the marked latch only after the key support.',
  board:['.......','AAABCCC','.......','^BB.CCC','.......','AAABBBB','.......','#######'],
  hero:{x:0,y:0,power:10},enemies:[{id:'weak',x:4,y:0,power:6},{id:'last',x:1,y:4,power:20}],required:['weak','last'],
  items:[{id:'fruit',kind:'power',x:4,y:2,amount:10},{id:'crown',kind:'crown',x:6,y:6}],sealOrder:[],
  latches:[{id:'sun',lock:[4,3],key:[0,1]}]
},{
  id:52,name:'Two pairs above the spikes',
  decision:'Move Fia to safety before removing the left key, then open both matched pairs without falling onto spikes.',
  board:['.......','AAABBCC','.......','^BB.CCA','.......','AAABBBB','.......','#######'],
  hero:{x:0,y:0,power:10},enemies:[{id:'weak',x:4,y:0,power:6},{id:'last',x:1,y:4,power:20}],required:['weak','last'],
  items:[{id:'fruit',kind:'power',x:4,y:2,amount:10},{id:'crown',kind:'crown',x:6,y:6}],sealOrder:[],
  latches:[{id:'sun',lock:[3,1],key:[0,1]},{id:'moon',lock:[4,3],key:[5,1]}]
},{
  id:53,name:'The shield beyond the spikes',
  decision:'Reach safety before removing the left key support, then collect the sun rune before the shielded guard.',
  board:['.......','AABBBCC','.......','^BB.CCC','.......','AABBBBB','.......','#######'],
  hero:{x:0,y:0,power:10},enemies:[{id:'weak',x:4,y:0,power:6},{id:'last',x:1,y:4,power:20,shield:'sun'}],required:['weak','last'],
  items:[{id:'fruit',kind:'power',x:4,y:2,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'rune',kind:'rune',x:2,y:0,link:'sun'}],sealOrder:[],
  latches:[{id:'sun',lock:[2,1],key:[0,1]}]
},{
  id:54,name:'Paired locks and the spike shield',
  decision:'Move Fia to safety before the left key falls; open both matched pairs and take the sun rune for the shield.',
  board:['.......','AAABBCC','.......','^BBB.CC','.......','AABBBBB','.......','#######'],
  hero:{x:0,y:0,power:10},enemies:[{id:'weak',x:4,y:0,power:6},{id:'last',x:1,y:4,power:20,shield:'sun'}],required:['weak','last'],
  items:[{id:'fruit',kind:'power',x:4,y:2,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'rune',kind:'rune',x:2,y:0,link:'sun'}],sealOrder:[],
  latches:[{id:'sun',lock:[1,3],key:[0,1]},{id:'moon',lock:[0,5],key:[3,1]}]
},{
  id:55,name:'The spike-bridge guardian',
  decision:'Move safely past the spikes, match both pairs, and use the sun then moon rune for the guardian’s two shields.',
  board:['.......','AAABBCC','.......','^BBB.CC','.......','AABBBBB','.......','1111111','.......','#######'],
  hero:{x:0,y:0,power:10},enemies:[{id:'weak',x:4,y:0,power:6},{id:'last',x:1,y:4,power:20,shield:'sun',boss:true,open:'1',next:{x:0,y:8,power:65,shield:'moon'}}],required:['weak','last'],
  items:[{id:'fruit',kind:'power',x:4,y:2,amount:10},{id:'rune',kind:'rune',x:2,y:0,link:'sun'},{id:'boost',kind:'power',x:2,y:4,amount:24},{id:'moonRune',kind:'rune',x:4,y:8,link:'moon'},{id:'crown',kind:'crown',x:6,y:8}],sealOrder:[],
  latches:[{id:'sun',lock:[1,3],key:[0,1]},{id:'moon',lock:[2,5],key:[3,1]}]
},{
  id:56,name:'Seals over the spikes',
  decision:'Reach safety before removing the left key, then collect the three seals in order without falling onto spikes.',
  board:['.......','AABBBCC','.......','^BB.CCA','.......','AAABBBB','.......','#######'],
  hero:{x:0,y:0,power:10},enemies:[{id:'weak',x:4,y:0,power:6},{id:'last',x:1,y:4,power:20}],required:['weak','last'],
  items:[{id:'fruit',kind:'power',x:4,y:2,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'seal1',kind:'seal',x:2,y:0,link:'1'},{id:'seal2',kind:'seal',x:6,y:0,link:'2'},{id:'seal3',kind:'seal',x:1,y:2,link:'3'}],sealOrder:['1','2','3'],
  latches:[{id:'sun',lock:[1,3],key:[0,1]}]
},{
  id:57,name:'Two pairs, three seals and spikes',
  decision:'Reach safety before the left key, open both matched pairs, and collect the three seals in order.',
  board:['.......','AAABBCC','.......','^BBB.CC','.......','AABBBBB','.......','#######'],
  hero:{x:0,y:0,power:10},enemies:[{id:'weak',x:4,y:0,power:6},{id:'last',x:1,y:4,power:20}],required:['weak','last'],
  items:[{id:'fruit',kind:'power',x:4,y:2,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'seal1',kind:'seal',x:2,y:0,link:'1'},{id:'seal2',kind:'seal',x:6,y:0,link:'2'},{id:'seal3',kind:'seal',x:1,y:2,link:'3'}],sealOrder:['1','2','3'],
  latches:[{id:'sun',lock:[5,1],key:[0,1]},{id:'moon',lock:[1,3],key:[3,1]}]
},{
  id:58,name:'The rune and the three seals',
  decision:'Reach safety before the left key, match both pairs, collect seals in order and bring the sun rune to the shield.',
  board:['.......','AABBBCC','.......','^BB.CCA','.......','AABBBBB','.......','#######'],
  hero:{x:0,y:0,power:10},enemies:[{id:'weak',x:4,y:0,power:6},{id:'last',x:1,y:4,power:20,shield:'sun'}],required:['weak','last'],
  items:[{id:'fruit',kind:'power',x:4,y:2,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'seal1',kind:'seal',x:2,y:0,link:'1'},{id:'seal2',kind:'seal',x:6,y:0,link:'2'},{id:'seal3',kind:'seal',x:1,y:2,link:'3'},{id:'rune',kind:'rune',x:1,y:0,link:'sun'}],sealOrder:['1','2','3'],
  latches:[{id:'sun',lock:[5,1],key:[0,1]},{id:'moon',lock:[1,3],key:[2,1]}]
},{
  id:59,name:'The guardian facing right',
  decision:'Reach safety before the left key, match both pairs, collect three seals in order, and approach the shielded guardian from the right.',
  board:['.......','AABBBCC','.......','^BB.CCA','.......','BBBAAAA','.......','#######'],
  hero:{x:0,y:0,power:10},enemies:[{id:'weak',x:4,y:0,power:6},{id:'last',x:1,y:4,power:20,shield:'sun',direction:'right'}],required:['weak','last'],
  items:[{id:'fruit',kind:'power',x:4,y:2,amount:10},{id:'crown',kind:'crown',x:6,y:6},{id:'seal1',kind:'seal',x:2,y:0,link:'1'},{id:'seal2',kind:'seal',x:6,y:0,link:'2'},{id:'seal3',kind:'seal',x:1,y:2,link:'3'},{id:'rune',kind:'rune',x:1,y:0,link:'sun'}],sealOrder:['1','2','3'],
  latches:[{id:'sun',lock:[5,1],key:[0,1]},{id:'moon',lock:[1,3],key:[2,1]}]
},{
  id:60,name:'The guardian of sun and moon',
  decision:'Avoid spikes, match the two pairs, collect the three seals in order and approach the sun shield from the right before meeting its moon form.',
  board:['.......','AABBBCC','.......','^BB.CCA','.......','BBBAAAA','.......','1111111','.......','#######'],
  hero:{x:0,y:0,power:10},enemies:[{id:'weak',x:4,y:0,power:6},{id:'last',x:1,y:4,power:20,shield:'sun',direction:'right',boss:true,open:'1',next:{x:0,y:8,power:65,shield:'moon',direction:null}}],required:['weak','last'],
  items:[{id:'fruit',kind:'power',x:4,y:2,amount:10},{id:'seal1',kind:'seal',x:2,y:0,link:'1'},{id:'seal2',kind:'seal',x:6,y:0,link:'2'},{id:'seal3',kind:'seal',x:1,y:2,link:'3'},{id:'rune',kind:'rune',x:1,y:0,link:'sun'},{id:'boost',kind:'power',x:6,y:4,amount:24},{id:'moonRune',kind:'rune',x:4,y:8,link:'moon'},{id:'crown',kind:'crown',x:6,y:8}],sealOrder:['1','2','3'],
  latches:[{id:'sun',lock:[5,1],key:[0,1]},{id:'moon',lock:[1,3],key:[2,1]}]
}];
