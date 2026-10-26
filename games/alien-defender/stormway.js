// Chapter 2: authored storm routes. One row is one real encounter, not a seed.
// World X is 0..100; each lane has a 7-unit half-width and a full warning.
const row=(id,pattern,sequence,extra={})=>({id,pattern,sequence,mode:'sequence',cols:6,rows:3,speed:15,fireEvery:2.4,armor:0,warning:1.4,active:1.35,recovery:4.6,...extra});
export const BEACON_PATHS=Object.freeze([
 [20,80],[78,25],[18,62,36],[50,82,20],[24,76,40],
 [50,18],[18,50,82],[78,22],[82,18,50],[50,18,82],
 [20,80],[70,30],[50,18,82],[80,20,62],[50,20,80],
 [72,28],[50,80,20],[18,82,50],[68,32,80],[76,24,50],
 [20,80],[78,24,62],[50,18,82],[68,30,80],[50,18,82],
 [26,74,38],[80,20,60],[78,22,50],[76,24,50],[20,80,50,28],
]);
export const STORMWAY = Object.freeze([
 row(31,'split',[[50]],{cols:5,rows:2,warning:2.2,recovery:5.2}),
 row(32,'wedge',[[28],[62]],{cols:5,rows:3,warning:1.8}),
 row(33,'diamond',[[72],[38],[54]],{cols:6,warning:1.8}),
 row(34,'split',[[20],[80],[50]],{rows:3,warning:1.7}),
 row(35,'boss',[],{mode:'chase',bossKey:'stormBoss35',bossHp:180,warning:2,recovery:4.8}),
 row(36,'wedge',[[24,76],[50]],{warning:1.8}),
 row(37,'diamond',[[38,62],[20,80]],{warning:1.7,cols:7}),
 row(38,'split',[[22,52],[48,78]],{warning:1.8,rows:3}),
 row(39,'grid',[[18,48],[52,82],[32,68]],{cols:7,rows:3,warning:1.8}),
 row(40,'boss',[[22,78],[50]],{mode:'fork',bossKey:'stormBoss40',bossHp:200,warning:1.8}),
 row(41,'grid',[[50]],{prism:true,cols:5,warning:1.8,recovery:5.5}),
 row(42,'wedge',[[30],[70]],{prism:true,cols:6,warning:1.8}),
 row(43,'diamond',[[26,74],[50]],{prism:true,armor:1,cols:6,recovery:5}),
 row(44,'split',[[18],[50],[82]],{prism:true,cols:7,active:1.1,recovery:5.2}),
 row(45,'boss',[[26,74],[50]],{prism:true,mode:'prism',bossKey:'stormBoss45',bossHp:210,recovery:5}),
 row(46,'grid',[[50]],{mode:'relay',relays:[28],cols:5,warning:1.8}),
 row(47,'split',[[38],[62]],{mode:'relay',relays:[22,78],cols:6,warning:1.8}),
 row(48,'wedge',[[32],[68]],{mode:'relay',relays:[50],prism:true,armor:1,cols:6,rows:3}),
 row(49,'diamond',[[24],[72]],{mode:'relay',relays:[32,68],prism:true,cols:7,warning:1.7}),
 row(50,'boss',[[50]],{mode:'relay',relays:[24,76],bossKey:'stormBoss50',bossHp:230,warning:1.8}),
 row(51,'grid',[[50]],{anchors:[50],cols:5,rows:2,warning:2,recovery:5}),
 row(52,'split',[[26],[62]],{anchors:[78],cols:6,warning:1.9}),
 row(53,'wedge',[[24,76],[50]],{anchors:[24,76],armor:1,cols:6,warning:2}),
 row(54,'diamond',[[30],[70],[50]],{anchors:[32],prism:true,cols:7,warning:1.8}),
 row(55,'boss',[[22,78],[50]],{anchors:[30,70],mode:'anchor',bossKey:'stormBoss55',bossHp:220,warning:2}),
 row(56,'split',[[38],[62]],{mode:'relay',relays:[26],prism:true,cols:7,recovery:5}),
 row(57,'wedge',[[20,50],[50,80]],{anchors:[72],cols:6,warning:1.9}),
 row(58,'diamond',[[22],[50],[78]],{mode:'relay',relays:[50],prism:true,armor:1,cols:7,recovery:5}),
 row(59,'split',[[30],[70],[50]],{mode:'relay',relays:[24,76],anchors:[36,64],prism:true,cols:7,warning:1.9}),
 row(60,'boss',[[22,78],[50]],{mode:'core',relays:[24,76],anchors:[36,64],prism:true,bossKey:'stormBoss60',bossHp:260,warning:2,recovery:5}),
]);
export const STORM_RULES=['ruleStorm','rulePockets','rulePrism','ruleStormRelays','ruleAnchors','ruleAurora'];

export const driveBlocked=w=>!!w.drive&&w.enemies.some(e=>e.hp>0&&e.kind==='anchor');
export function useDrive(w,direction=0){
 if(!w.drive||w.status!=='playing')return false;
 const reason=driveBlocked(w)?'driveJammed':w.drive.cells<1?'driveCharging':w.drive.cooldown>0?'driveRecovering':null;
 if(reason){w.events.push({type:'driveReject',reason,x:w.player.x,y:w.player.y});return false;}
 const sign=Math.sign(direction)||(w.player.x>=50?-1:1),from=w.player.x,to=Math.max(8,Math.min(92,from+sign*28));
 if(Math.abs(to-from)<4){w.events.push({type:'driveReject',reason:'driveEdge',x:from,y:w.player.y});return false;}
 w.player.x=to;w.drive.cells--;w.drive.cooldown=2;w.invulnerable=Math.max(w.invulnerable,.45);
 w.events.push({type:'drive',x:to,from,y:w.player.y});return true;
}
export function advanceStorm(w,dt){
 if(!w.drive)return;
 const s=w.config.storm;
 w.drive.cooldown=Math.max(0,w.drive.cooldown-dt);
 if(w.drive.cells<2){w.drive.recharge+=dt;if(w.drive.recharge>=8){w.drive.recharge-=8;w.drive.cells++;w.events.push({type:'driveCharge',x:w.player.x,y:w.player.y});}}
 else w.drive.recharge=0;
 const period=s.warning+s.active+s.recovery,cycle=Math.floor(w.time/period),within=w.time-cycle*period;
 let mode=s.mode;
 if(mode==='core')mode=w.phase===0?'chase':w.phase===1?'relay':'prism';
 if(w.storm.cycle!==cycle){w.storm.cycle=cycle;w.storm.aim=w.player.x;w.events.push({type:'stormWarning',x:w.player.x,y:.84});}
 const seq=s.sequence.length?s.sequence:[[50]];
 let centers=seq[(cycle+(mode==='fork'?w.phase:0))%seq.length];
 if(mode==='chase')centers=[Math.max(16,Math.min(84,w.storm.aim))];
 if(mode==='relay'){
  const relayCenters=w.enemies.filter(e=>e.hp>0&&e.kind==='relay').map(e=>e.x);
  // Destroying a projector removes its lane for the rest of this encounter.
  centers=relayCenters;
 }
 const phase=within<s.warning?'warning':within<s.warning+s.active?'active':'recovery';
 w.storm.phase=phase;w.storm.mode=mode;
 w.storm.lanes=phase==='recovery'?[]:centers.map(x=>({x,halfWidth:7,phase,progress:phase==='warning'?within/s.warning:1}));
}
export const prismClosed=w=>w.storm?.phase==='active';
export function currentBeacon(w){
 if(!w.beacons||w.beacons.collected>=w.beacons.path.length)return null;
 const s=w.config.storm,n=w.beacons.collected;
 const readyAt=n===0?0:(n-1)*(s.warning+s.active+s.recovery)+s.warning+s.active;
 return {x:w.beacons.path[n],y:w.player.y,ready:w.time>=readyAt,index:n+1};
}
export function collectBeacon(w){
 const beacon=currentBeacon(w);if(!beacon?.ready||Math.abs(w.player.x-beacon.x)>5)return;
 if(w.storm.lanes.some(l=>l.phase==='active'&&Math.abs(beacon.x-l.x)<l.halfWidth))return;
 w.beacons.collected++;w.events.push({type:'beacon',x:beacon.x,y:beacon.y});
}
