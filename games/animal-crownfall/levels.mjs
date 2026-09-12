// Hand-authored topology, encounters and rule combinations, not random seeds.
const H=(x=1,power=10)=>({x,y:0,power});
const E=(id,x,y,power,extra={})=>({id,x,y,power,...extra});
const I=(id,kind,x,y,link)=>({id,kind,x,y,link});
const C=(x=5,y=10)=>I('crown','crown',x,y);
const B=(rows)=>rows.split('/');
function L(id,name,decision,rows,enemies,items=[C()],extra={}) {return {id,name,decision,board:B(rows),hero:H(),enemies,items,...extra};}
export const LEVELS=[
L(1,'First foothold','Remove the support to meet a weaker guard.','......./.AA..../......./#######',[E('guard',4,2,6)],[C(5,2)]),
L(2,'Weak before strong','Absorb the upper guard before descending again.','......./.AA..../......./BBBBBBB/......./#######',[E('first',4,2,6),E('last',2,4,12)],[C(5,4)]),
L(3,'A whole group','The linked middle floor must survive until the first fight.','......./.AA..../......./BBBAAAA/......./#######',[E('first',3,2,7),E('last',1,4,15)],[C(5,4)]),
L(4,'Keep a foothold','Do not drop the lower enemy into the final encounter too early.','......./.AA..../......./BBB.CCC/......./CCCCCCC/......./#######',[E('first',2,2,6),E('second',5,4,13),E('last',1,6,25)],[C(6,6)]),
L(5,'Gate captain','Defeat both banner guards to remove the captain bonus.','......./.AA..../......./BBBBBBB/......./CCCCCCC/......./#######',[E('flag1',3,2,4,{buff:{targets:['boss'],amount:20}}),E('flag2',5,4,6,{buff:{targets:['boss'],amount:20}}),E('boss',2,6,18,{boss:true})],[C(6,6)]),
L(6,'A fork below','One side contains a safe power step; preserve the bridge.','......./.AA..../......./BBB.CCC/......./AAAAAAA/......./#######',[E('first',2,2,7),E('second',5,4,12),E('last',2,6,24)],[C(6,6)]),
L(7,'Stone detour','A stone island keeps a dangerous enemy apart.','......./.AA..../......./BBB.###/......./AAAAAAA/......./#######',[E('first',2,2,8),E('watch',5,2,99),E('last',3,4,14)],[C(6,6)]),
L(8,'Sharp shortcut','The side ledge is a trap; fall through the safe middle.','......./.AA..../......./BBBBBBB/......./^CCCC^^/......./#######',[E('first',3,2,6),E('last',2,4,12)],[C(5,6)]),
L(9,'Nearest first','Land left of the pair so the weak guard is nearest.','......./.AA..../......./BBBAAAA/......./#######',[E('first',2,2,6),E('second',5,2,12)],[C(6,4)]),
L(10,'Twin banners','Both named deputies must be defeated before the chief.','......./.AA..../......./BBBBBBB/......./CCCCCCC/......./#######',[E('west',3,2,5),E('east',5,4,8),E('boss',2,6,20,{boss:true,requires:['west','east']})],[C(6,6)],{required:['west','east']}),
L(11,'The first key','Collect the key to open the lower gate.','......./.AA..../......./BBBBBBB/......./1111111/......./#######',[E('guard',3,4,7)],[I('key','key',2,2,'1'),C(5,6)]),
L(12,'A door is a floor','The key removes support and starts another descent.','......./.AA..../......./1111111/......./BBBBBBB/......./#######',[E('guard',4,4,7)],[I('key','key',1,2,'1'),C(5,6)]),
L(13,'Fight then unlock','Collect power before the key drops both actors.','......./.AA..../......./BBBBBBB/......./1111111/......./#######',[E('first',3,2,6),E('last',4,6,12)],[I('key','key',3,4,'1'),C(6,6)]),
L(14,'Two keys','Plan two sequential door collapses.','......./.AA..../......./1111111/......./BBBBBBB/......./2222222/......./#######',[E('first',3,4,5),E('last',4,8,12)],[I('key1','key',1,2,'1'),I('key2','key',3,6,'2'),C(6,8)]),
L(15,'Lockcrown lion','Two seals keep the crown beyond the boss.','......./.AA..../......./BBBBBBB/......./1111111/......./2222222/......./#######',[E('guard',3,2,8),E('boss',4,4,16,{boss:true})],[I('key1','key',5,4,'1'),I('key2','key',4,6,'2'),C(6,8)]),
L(16,'The shield rune','Pick up the matching rune before reaching the shield.','......./.AA..../......./BBBBBBB/......./#######',[E('shield',3,4,7,{shield:'sun'})],[I('rune','rune',2,2,'sun'),C(6,4)]),
L(17,'Power is not enough','A detour is compulsory even against a weaker shield guard.','......./.AA..../......./BBB.CCC/......./AAAAAAA/......./#######',[E('first',2,2,7),E('shield',5,6,12,{shield:'sun'})],[I('rune','rune',4,4,'sun'),C(6,6)]),
L(18,'Falling sentry','Removing an enemy support changes encounter order.','......./.AA..../......./BBB.CCC/......./AAAAAAA/......./#######',[E('weak',2,2,6),E('high',5,2,12),E('last',2,6,24)],[C(6,6)]),
L(19,'Rune and key','Break a shield before unlocking its supporting door.','......./.AA..../......./BBBBBBB/......./1111111/......./#######',[E('shield',3,4,8,{shield:'sun'}),E('last',4,6,14)],[I('rune','rune',2,2,'sun'),I('key','key',4,4,'1'),C(6,6)]),
L(20,'Mirror marshal','Approach the marked left flank after acquiring power.','......./.AA..../......./BBBBBBB/......./CCCCCCC/......./#######',[E('first',3,2,7),E('second',1,4,12),E('boss',5,6,25,{boss:true,direction:'left'})],[C(6,6)]),
L(21,'Banner above','Remove the upper banner before the shielded target.','......./.AA..../......./BBBBBBB/......./CCCCCCC/......./#######',[E('flag',3,2,6,{buff:{targets:['shield'],amount:40}}),E('shield',4,6,12,{shield:'sun'})],[I('rune','rune',2,4,'sun'),C(6,6)]),
L(22,'Leave a stepping stone','Every intermediate enemy matters to the final power budget.','......./.AA..../......./BBBAAAA/......./CCC.BBB/......./AAAAAAA/......./#######',[E('one',2,2,5),E('two',1,4,12),E('three',4,6,24),E('last',2,8,48)],[C(6,8)]),
L(23,'Crown over danger','Move the hero to collect the crown before removing its ledge.','......./.AA..../......./BBBBBBB/......./CCC.CCC/......./####^^^',[E('first',2,2,7),E('second',1,4,12)],[C(2,4)]),
L(24,'A single cascade','A key collapses two doors, merging previously separate foes.','......./.AA..../......./BBBBBBB/......./1111111/......./1111111/......./#######',[E('first',3,2,6),E('weak',2,6,12),E('last',5,8,24)],[I('key','key',3,4,'1'),C(6,8)]),
L(25,'Two-phase castellan','The first victory opens a gate; gather power before the next form.','......./.AA..../......./BBBBBBB/......./1111111/......./CCCCCCC/......./#######',[E('first',3,2,8),E('boss',4,4,12,{boss:true,open:'1',next:{x:5,y:8,power:50}}),E('supply',2,6,24)],[C(6,8)]),
L(26,'Two valid routes','Either upper supply is sufficient; the shorter route earns a badge.','......./.AA..../......./BBB.CCC/......./AAAAAAA/......./#######',[E('left',2,2,6),E('right',5,2,7),E('last',3,6,14)],[C(6,6)]),
L(27,'Linked gates','Opening two linked supports changes where the rune lands.','......./.AA..../......./BBBBBBB/......./1111111/......./1111111/......./#######',[E('first',3,2,6),E('shield',5,8,12,{shield:'sun'})],[I('key','key',3,4,'1'),I('rune','rune',3,6,'sun'),C(6,8)]),
L(28,'Break the line','Rune, banner and key must be handled in sequence.','......./.AA..../......./BBBBBBB/......./CCCCCCC/......./1111111/......./#######',[E('flag',3,2,6,{buff:{targets:['shield'],amount:40}}),E('shield',3,6,12,{shield:'sun'}),E('last',4,8,24)],[I('rune','rune',2,4,'sun'),I('key','key',4,6,'1'),C(6,8)]),
L(29,'The final foothold','Preserve the safe bridge while joining shield and banner routes.','......./.AA..../......./BBB.CCC/......./AAAAAAA/......./1111111/......./^CCC^^^/......./#######',[E('flag',2,2,6,{buff:{targets:['shield'],amount:30}}),E('shield',3,6,12,{shield:'sun'}),E('last',2,8,24)],[I('rune','rune',2,4,'sun'),I('key','key',3,6,'1'),C(6,10)]),
L(30,'Guardian of the crown','Three ordered seals, a rune and flag support guard the finale.','......./.AA..../......./BBBBBBB/......./CCCCCCC/......./AAAAAAA/......./BBBBBBB/......./#######',[E('flag',3,2,6,{buff:{targets:['boss'],amount:100}}),E('shield',4,6,12,{shield:'sun'}),E('boss',4,10,24,{boss:true,ordered:true})],[I('s1','seal',4,2,'1'),I('rune','rune',3,4,'sun'),I('s2','seal',4,4,'2'),I('s3','seal',4,8,'3'),C(6,10)],{sealOrder:['1','2','3']})
];
