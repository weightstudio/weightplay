// Stable mission IDs and troop identities. Save migration preserves version-1 progress.
export const VERSION=4;
export const STEP=1/30;
export const MAX_RANK=6;
export const WAVES=15;
export const TYPES=Object.freeze(['fox','bear','owl','rabbit','wolf','raccoon','deer','cat']);
export const DEFAULT_DECK=Object.freeze(['fox','bear','owl','rabbit','wolf']);
export const TROOPS=Object.freeze({
 fox:{damage:19,interval:.5,color:0xe97835},
 bear:{damage:33,interval:1.2,splash:1.65,color:0xa87348},
 owl:{damage:13,interval:.85,slow:.5,color:0x81cce5},
 rabbit:{damage:22,interval:.9,chain:3,color:0xd1a7f2},
 wolf:{damage:49,interval:1.15,pierce:true,color:0x728db4},
 raccoon:{damage:14,interval:.7,poison:15,color:0x87bb72},
 deer:{damage:15,interval:.85,support:.3,color:0xe0b875},
 cat:{damage:13,interval:.8,income:20,color:0xf1cf65},
});
export const PADS=Object.freeze(Array.from({length:9},(_,i)=>Object.freeze({x:(i%3-1)*2.55,z:5+Math.floor(i/3)*1.75})));
const rows=[
 ['first','basic','steady',null],['split','basic','sides',null],
 ['runners','rush','burst',null],['cluster','swarm','cluster',null],['ram','rush','sides','ram'],
 ['armor','armor','steady',null],['convoy','guard','column',null],['ranks','armor','cluster',null],['reinforce','guard','sides',null],['mirror','armor','column','mirror'],
 ['splitters','split','steady',null],['healers','heal','column',null],['living','ward','cluster',null],['nest','brood','sides',null],['mother','brood','cluster','brood'],
 ['cold','basic','steady',null],['signal','rush','sides',null],['iceiron','armor','column',null],['thaw','split','cluster',null],['regent','guard','sides','frost'],
 ['lean','rush','steady',null],['bounty','heal','burst',null],['toll','armor','column',null],['provision','ward','sides',null],['reaver','guard','burst','thief'],
 ['front','all','sides',null],['convoyice','ward','column',null],['debt','brood','cluster',null],['night','all','burst',null],['crown','all','sides','crown'],
];
export const STAGES=Object.freeze(rows.map(([name,recipe,pattern,boss],i)=>Object.freeze({
 id:i+1,name,recipe,pattern,boss,arc:Math.floor(i/5),
 freeze:(i>=15&&i<=19)||i===26||i===29,lean:(i>=20&&i<=24)||i===27,
 bounty:i===21,initialGold:i===0?390:330,
})));
export const RECIPES=Object.freeze({
 basic:['grunt','grunt','grunt'],rush:['grunt','runner','runner'],swarm:['runner','grunt','grunt','runner'],
 armor:['shield','grunt','shield'],guard:['shield','runner','runner','grunt'],split:['splitter','grunt','splitter'],
 heal:['grunt','healer','runner'],ward:['shield','healer','grunt'],brood:['splitter','runner','grunt','splitter'],
 all:['shield','runner','healer','splitter','grunt'],
});
export const ENEMIES=Object.freeze({
 grunt:{hp:1,speed:.53,damage:140,reward:14},runner:{hp:.63,speed:.96,damage:110,reward:12},
 shield:{hp:1.65,speed:.42,damage:210,reward:22,armor:.58},healer:{hp:1.3,speed:.43,damage:160,reward:24},
 splitter:{hp:1.55,speed:.49,damage:150,reward:18},small:{hp:.32,speed:.83,damage:60,reward:3},
});
export const BOSSES=Object.freeze(['ram','mirror','brood','frost','thief','crown']);
export const LIMITS=Object.freeze({enemies:80,shots:96,effects:96,events:512,rank:6,upgrades:5});
export function normalizeDeck(deck){
 const valid=[...new Set(Array.isArray(deck)?deck:[])].filter(type=>TYPES.includes(type));
 return valid.length===5?valid:[...DEFAULT_DECK];
}
