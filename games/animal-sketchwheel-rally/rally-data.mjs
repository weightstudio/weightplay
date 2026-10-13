const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const terrainSequence=[
 ["flat","ice"],["flat","stairs"],["flat","stairs","flat"],["ice","flat","stairs"],["stairs","flat","ice"],
 ["boost","stairs","flat"],["stairs","boost","ice"],["boost","wind","flat"],["mud","boost","stairs"],["boost","stairs","ice","wind"],
 ["boost","mud","boost"],["mud","stairs","boost","mud"],["ice","boost","mud","flat"],["wind","mud","boost","stairs"],["boost","mud","ice","boost","wind"],
 ["flat","gate","flat"],["tunnel","gate","stairs"],["boost","gate","ice","wind"],["stairs","gate","tunnel","gate"],["gate","mud","boost","gate","stairs"],
 ["boost","gap","flat"],["gate","gap","mud","boost"],["wind","boost","gap","gate"],["gap","ice","gate","gap"],["boost","gate","gap","wind","stairs"],
 ["boost","stairs","mud","gate","gap"],["ice","gate","boost","gap","mud"],["tunnel","boost","stairs","gate","gap","ice"],["mud","gap","gate","tunnel","boost","wind","stairs"],["boost","ice","stairs","gate","mud","tunnel","gap","wind","flat"]
];
const courseShapes=[
 {hill:0,phase:0,stairs:3,step:10},{hill:8,phase:.4,stairs:4,step:9},{hill:-7,phase:1.1,stairs:5,step:8},{hill:12,phase:2,stairs:4,step:11},{hill:-10,phase:2.7,stairs:6,step:8},
 {hill:6,phase:.7,stairs:5,step:10},{hill:14,phase:1.5,stairs:4,step:12},{hill:-12,phase:2.4,stairs:6,step:9},{hill:9,phase:3.1,stairs:3,step:14},{hill:-6,phase:4,stairs:5,step:11},
 {hill:16,phase:.2,stairs:4,step:10},{hill:-14,phase:1,stairs:6,step:8},{hill:11,phase:1.8,stairs:5,step:10},{hill:-9,phase:2.6,stairs:4,step:13},{hill:18,phase:3.4,stairs:6,step:9},
 {hill:-16,phase:.5,stairs:5,step:10},{hill:13,phase:1.3,stairs:3,step:14},{hill:-11,phase:2.1,stairs:6,step:9},{hill:17,phase:2.9,stairs:5,step:11},{hill:-15,phase:3.7,stairs:4,step:13},
 {hill:10,phase:.8,stairs:6,step:9},{hill:-18,phase:1.6,stairs:4,step:13},{hill:15,phase:2.4,stairs:5,step:11},{hill:-13,phase:3.2,stairs:6,step:9},{hill:20,phase:4,stairs:4,step:14},
 {hill:-17,phase:.3,stairs:6,step:10},{hill:19,phase:1.1,stairs:5,step:12},{hill:-20,phase:1.9,stairs:4,step:14},{hill:16,phase:2.7,stairs:6,step:11},{hill:-19,phase:3.5,stairs:5,step:13}
];
function obstaclePositions(count,index){if(count>6)return Array.from({length:count},(_,i)=>Math.round(100+i*800/(count-1)));const base={2:[260,650],3:[205,485,760],4:[165,375,600,820],5:[135,300,480,665,840],6:[115,260,410,560,710,855]}[count]||Array.from({length:count},(_,i)=>150+i*700/Math.max(1,count-1)),shift=((index%5)-2)*9,chapter=Math.floor(index/5),spread=1+(chapter-2.5)*.025,bend=(chapter%3-1)*15;return base.map((value,i)=>Math.round(500+(value-500)*spread+shift*(i%2?1:-1)+Math.sin((i+1)*1.3)*bend))}
const challengeKinds=['clean','sprint','combo','clean','combo','sprint','clean','combo','sprint','combo','sprint','clean','combo','clean','combo','clean','combo','sprint','clean','combo','sprint','clean','combo','sprint','combo','clean','sprint','combo','clean','combo'];
const levels=terrainSequence.map((terrain,i)=>({id:i+1,chapter:Math.floor(i/5),terrain,time:54+terrain.length*6,positions:obstaclePositions(terrain.length,i),rival:18.5+i*.18,shape:courseShapes[i],challenge:challengeKinds[i],par:34+Math.ceil(terrain.length*1.4),comboTarget:Math.min(terrain.length,i<15?2:3),checkpoint:(i+1)%5===0}));
const presets={circle:{speed:.92,height:.56,grip:.38,width:.62,roundness:.92,kind:"circle"},tall:{speed:.54,height:.92,grip:.48,width:.38,roundness:.48,kind:"tall"},spike:{speed:.48,height:.63,grip:.95,width:.64,roundness:.28,kind:"spike"},wide:{speed:.64,height:.46,grip:.52,width:.94,roundness:.58,kind:"wide"}};
const required={flat:"circle",boost:"circle",gate:"tall",stairs:"tall",mud:"spike",tunnel:"wide",gap:"wide",ice:"spike",wind:"tall"};
function terrainPerformance(type,p){if(type==="flat"||type==="boost")return clamp(p.roundness*.72+p.speed*.28);if(type==="stairs")return clamp(p.height*.82+p.grip*.18);if(type==="mud")return clamp(p.grip*.86+(1-p.roundness)*.14);if(type==="tunnel")return clamp((1-p.height)*.58+p.width*.42);if(type==="gap")return clamp(p.width*.74+p.speed*.26);if(type==="ice")return clamp(p.grip*.8+(1-p.speed)*.2);if(type==="wind")return clamp((1-p.width)*.78+p.grip*.22);return 1}
function profilePass(type,p,tolerance=0){const tol=tolerance*.035,score=terrainPerformance(type,p);if(type==="flat"||type==="boost")return p.roundness>=.70-tol;if(type==="stairs")return p.height>=.76-tol;if(type==="mud")return p.grip>=.72-tol;if(type==="tunnel")return p.height<=.54+tol&&p.width>=.68-tol;if(type==="gap")return p.width>=.80-tol;if(type==="ice")return p.grip>=.68-tol;if(type==="wind")return p.width<=.48+tol;return score>=.66-tol}

export {levels,presets,required,profilePass,terrainPerformance,courseShapes};
