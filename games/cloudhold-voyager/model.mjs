import {STAGES,HULLS,ROOM_KEYS,SKINS} from './stages.mjs?wp-media=b5f048e8dfd1feb0';
export const clone=v=>structuredClone(v);
const cap=(v,min,max)=>Math.min(max,Math.max(min,Number.isFinite(v)?v:min));
const validRoom=i=>Number.isInteger(i)&&i>=0&&i<6;
const living=r=>r.crew.filter(c=>c.hp>0);
const crewAt=(r,i)=>living(r).filter(c=>c.room===i);
export function normaliseSave(raw){
 const v=raw&&typeof raw==='object'?raw:{};
 const cleared=Object.fromEntries(Object.entries(v.cleared||{}).filter(([id,n])=>/^\d+$/.test(id)&&+id>=1&&+id<=60&&Number.isInteger(n)&&n>0).map(([k,n])=>[k,Math.min(n,9999)]));
 const unlocked=Math.max(1,Math.min(60,Math.max(Math.floor(Number(v.unlocked)||1),...Object.keys(cleared).map(n=>+n+1))));
 const ownedHulls=['survey',...(cleared[3]?['rescue']:[]),...(cleared[8]?['swift']:[])];
 const ownedSkins=['base',...['ceramic','sunrise'].filter(k=>Array.isArray(v.ownedSkins)&&v.ownedSkins.includes(k))];
 const out={schema:1,unlocked,cleared,tutorialDone:v.tutorialDone===true,ownedHulls,selectedHull:ownedHulls.includes(v.selectedHull)?v.selectedHull:'survey',ownedSkins,skin:ownedSkins.includes(v.skin)?v.skin:'base',active:null};
 if(validRun(v.active)&&v.active.stage<=unlocked)out.active=clone(v.active);
 return out;
}
export function validRun(r){
 if(!r||r.schema!==1||!Number.isInteger(r.stage)||r.stage<1||r.stage>60||!HULLS[r.hullType]||!['route','combat','dock'].includes(r.status))return false;
 if(!Array.isArray(r.rooms)||r.rooms.length!==6||!Array.isArray(r.crew)||r.crew.length!==3)return false;
 if(!r.rooms.every(x=>x&&Number.isInteger(x.hp)&&x.hp>=0&&x.hp<=3&&['fire','breach','board','lock','bridge'].every(k=>Number.isInteger(x[k])&&x[k]>=0&&x[k]<=9)))return false;
 if(!r.crew.every((c,i)=>c.id===i&&validRoom(c.room)&&validRoom(c.order)&&Number.isInteger(c.hp)&&c.hp>=0&&c.hp<=4))return false;
 if(!Array.isArray(r.power)||r.power.length!==6||!r.power.every((n,i)=>Number.isInteger(n)&&n>=0&&n<=2&&(![0,5].includes(i)||n===0)))return false;
 if(!Number.isInteger(r.leg)||r.leg<0||r.leg>2||!Number.isInteger(r.tick)||r.tick<0||r.tick>9999)return false;
 if(!['hull','oxygen','shield','cargo','jump','scrap','patches','bridges','powerMax','hullMax','oxygenMax','shieldMax','target'].every(k=>Number.isInteger(r[k])&&r[k]>=0&&r[k]<100))return false;
 if(r.powerMax<4||r.powerMax>8||r.power.reduce((a,b)=>a+b,0)>r.powerMax||r.hull<=0||r.hull>r.hullMax||r.oxygen>r.oxygenMax||r.shield>r.shieldMax||r.cargo>6||r.jump>4||r.target>2)return false;
 if(r.status==='combat'&&(!r.enemy||!Array.isArray(r.enemy.rooms)||r.enemy.rooms.length!==3||!r.enemy.rooms.every(x=>Number.isInteger(x)&&x>=0&&x<=3)||!Number.isInteger(r.enemy.hull)||r.enemy.hull<0||r.enemy.hull>r.enemy.max||!Number.isInteger(r.enemy.turn)||r.enemy.turn<0))return false;
 return true;
}
export function createRun(stage=1,hullType='survey'){
 const s=STAGES[stage-1];if(!s||!HULLS[hullType])throw Error('INVALID_VOYAGE');
 const h=HULLS[hullType],a=s.initial;
 const r={schema:1,stage,hullType,status:'route',leg:0,tick:0,hullMax:h.hull,hull:Math.min(a.hull??h.hull,h.hull),oxygenMax:h.oxygen,oxygen:Math.min(a.oxygen??h.oxygen,h.oxygen),shieldMax:h.shield,shield:0,powerMax:a.power??(s.tow?Math.max(h.power,6):h.power),power:[0,2,1,0,1,0],rooms:ROOM_KEYS.map(()=>({hp:3,fire:0,breach:0,board:0,lock:0,bridge:0})),crew:[{id:0,room:0,order:0,hp:4},{id:1,room:5,order:5,hp:4},{id:2,room:4,order:4,hp:4}],target:0,jump:0,scrap:a.scrap??6,cargo:a.cargo??6,patches:s.patches,bridges:s.bridges,repairOrder:false,enemy:null,events:[],reason:null,detour:false,nonce:globalThis.crypto?.randomUUID?.()??String(Date.now())};
 for(const i of a.damage??[])r.rooms[i].hp=Math.max(0,r.rooms[i].hp-1);
 if(a.fire!==undefined)r.rooms[a.fire].fire=1;
 if(a.board!==undefined)r.rooms[a.board].board=2;
 if(a.lock!==undefined)r.rooms[a.lock].lock=2;
 return r;
}
export function routeOptions(r){
 const s=STAGES[r.stage-1],type=s.route[r.leg];
 return [{id:'direct',type,scrap:0,shelter:false},{id:'shelter',type:['F','L','D','I'].includes(type)?'P':type,scrap:1,shelter:true}];
}
export function chooseRoute(r,id){
 if(r.status!=='route')return rejected('notReady');const option=routeOptions(r).find(x=>x.id===id);
 if(!option)return rejected('notReady');if(r.scrap<option.scrap)return rejected('noScrap');
 const s=STAGES[r.stage-1],boss=r.leg===2?s.boss:0;
 r.scrap-=option.scrap;r.detour=option.shelter;r.status='combat';r.jump=0;r.repairOrder=false;r.target=0;
 r.bridges=s.bridges;
 const max=boss?18:({P:10,W:12,B:11,F:12,L:11,D:12,I:12,T:13}[option.type]);
 r.enemy={type:option.type,boss,max,hull:max,shield:['W'].includes(option.type)||boss===1||boss===6?3:0,shieldMax:4,rooms:[3,3,3],turn:0,repairClock:0};
 r.events=[{type:'encounter',enemy:option.type,boss}];return accepted(r.events);
}
function rejected(reason){return {ok:false,reason,events:[]};}
function accepted(events=[]){return {ok:true,events};}
export function assign(r,crew,room){
 if(r.status!=='combat')return rejected('notReady');if(!Number.isInteger(crew)||!r.crew[crew]||!validRoom(room))return rejected('notReady');
 if(r.crew[crew].hp<=0)return rejected('crewDown');r.crew[crew].order=room;return accepted([{type:'order',crew,room}]);
}
export function setPower(r,room,value){
 if(r.status!=='combat'||![1,2,3,4].includes(room)||!Number.isInteger(value)||value<0||value>2)return rejected('notReady');
 if(r.power.reduce((a,b)=>a+b,0)-r.power[room]+value>r.powerMax)return rejected('noPower');
 r.power[room]=value;return accepted([{type:'power',room,value}]);
}
export function target(r,room){if(r.status!=='combat'||!Number.isInteger(room)||room<0||room>2)return rejected('notReady');r.target=room;return accepted();}
export function activePower(r,i){const room=r.rooms[i];return room.board||room.fire||(!room.bridge&&(room.hp===0||room.lock))?0:r.power[i];}
export function forecast(r){
 const e=r.enemy;if(!e)return null;const t=e.turn,b=e.boss;
 let kind='shot',room=[1,2,4,3,5,0][(t+r.stage+r.leg)%6],damage=e.type==='B'?4:3,guarded=-1,reflect=false,immune=false,cargo=false,extraRoom=-1;
 if(e.type==='F'&&t%2===0)kind='fire';if(e.type==='L'&&t%2===0)kind='breach';if(e.type==='D'&&t%3===0)kind='board';if(e.type==='I'&&t%2===0)kind='ion';if(e.type==='T'&&STAGES[r.stage-1].tow&&t%2===0)cargo=true;
 if(b===1)guarded=t%2;
 if(b===2){kind='fire';room=[1,4,2,5][t%4];}
 if(b===3){kind=t%2===0?'breach':'shot';room=4;}
 if(b===4){kind='board';room=[0,1,5][t%3];}
 if(b===5){kind=t%3===0?'ion':'shot';extraRoom=kind==='ion'?(room+3)%6:-1;}
 if(b===6){let phase=Math.min(2,Math.floor((1-e.hull/e.max)*3));if(phase===0)guarded=1;if(phase===1)kind='fire';if(phase===2)kind='ion';}
 if(b===7){cargo=t%2===0;kind=cargo?'hook':'shot';}
 if(b===8){reflect=t%3===2;kind=t%2===0?'ion':'shot';}
 if(b===9){cargo=t%2===1;kind=cargo?'hook':'breach';}
 if(b===10){cargo=t%2===0;kind=cargo?'hook':'ion';}
 if(b===11){immune=t%3===0;kind=immune?'ion':'shot';cargo=!immune&&t%2===0;}
 if(b===12){let phase=Math.min(2,Math.floor((1-e.hull/e.max)*3));kind=['board','ion','hook'][phase];cargo=phase===2;}
 if(e.rooms[0]===0||e.hull===0)kind='disabled';
 if(['board','hook'].includes(kind)&&e.rooms[2]===0){kind='disabled';cargo=false;}
 return {kind,room,damage,guarded,reflect,immune,cargo,extraRoom,pierce:e.type==='B'?1:0};
}
export function useTool(r,tool,room){
 if(r.status!=='combat')return rejected('notReady');if(!validRoom(room))return rejected('notReady');const x=r.rooms[room];
 if(tool==='vent'){
  if(!x.fire)return rejected('noFire');if(crewAt(r,room).length)return rejected('occupied');if(r.oxygen<2)return rejected('noOxygen');
  r.oxygen-=2;x.fire=0;r.events=[{type:'vent',room}];
 }else if(tool==='patch'){
  if(!r.patches)return rejected('noCharge');if(!x.breach&&x.hp===3)return rejected('noDamage');r.patches--;x.breach=0;x.hp=Math.min(3,x.hp+2);r.events=[{type:'patch',room}];
 }else if(tool==='bridge'){
  if(!r.bridges)return rejected('noCharge');if(x.hp>0&&!x.lock)return rejected('noDamage');if(x.board||x.fire)return rejected('clearHazard');r.bridges--;x.bridge=2;r.events=[{type:'bridge',room}];
 }else if(tool==='repair'){
  if(r.hull===r.hullMax)return rejected('noDamage');if(r.scrap<2)return rejected('noScrap');if(!crewAt(r,5).length||r.rooms[5].hp===0||r.rooms[5].fire||r.rooms[5].board||r.rooms[5].lock)return rejected('needEngineer');
  r.repairOrder=!r.repairOrder;r.events=[{type:'repairOrder',room:5}];
 }else if(tool==='escape'){
  if(r.jump<4)return rejected('notCharged');if(r.leg===2)return rejected('finalRequired');r.events=[{type:'escape'}];endLeg(r,true);
 }else return rejected('notReady');
 return accepted(r.events);
}
function hitHull(r,n,pierce,room,events){
 const bypass=Math.min(n,pierce),blocked=Math.min(r.shield,n-bypass);r.shield-=blocked;
 const damage=n-blocked;r.hull=Math.max(0,r.hull-damage);
 if(damage&&validRoom(room))r.rooms[room].hp=Math.max(0,r.rooms[room].hp-1);
 events.push({type:blocked?'shieldHit':'hullHit',blocked,damage,room});
}
function endLeg(r,escaped=false){
 if(!escaped)r.scrap=Math.min(30,r.scrap+3);r.status=r.leg===2?'won':'dock';
 if(r.status==='won')r.events.push({type:'victory'});else r.events.push({type:'dock',escaped});
}
export function pulse(r){
 if(r.status!=='combat')return rejected('notReady');
 const events=[],s=STAGES[r.stage-1],e=r.enemy,warning=forecast(r),operators=new Set();
 r.tick++;e.turn++;
 for(const c of living(r)){
  if(c.room!==c.order){events.push({type:'move',crew:c.id,from:c.room,room:c.order});c.room=c.order;}
  const x=r.rooms[c.room];
  if(x.board){x.board=Math.max(0,x.board-(c.id===1?2:1));events.push({type:'clearBoard',room:c.room,crew:c.id});}
  else if(x.fire){x.fire=0;events.push({type:'extinguish',room:c.room,crew:c.id});}
  else if(x.breach||x.hp<3){x.breach=0;x.hp=Math.min(3,x.hp+(c.id===1?2:1));events.push({type:'repairRoom',room:c.room,crew:c.id});}
  else if(!x.lock||x.bridge)operators.add(c.room);
 }
 const garden=activePower(r,4),ward=activePower(r,2),lens=activePower(r,1),engine=activePower(r,3);
 r.oxygen=cap(r.oxygen-1+(garden?garden+1+(operators.has(4)?1:0):0),0,r.oxygenMax);
 r.shield=cap(r.shield+ward+(ward&&operators.has(2)?1:0),0,r.shieldMax);
 if(engine)r.jump=cap(r.jump+engine+(operators.has(3)?1:0)+HULLS[r.hullType].engine,0,4);
 if(garden){for(const c of r.crew)if(c.room===4&&(operators.has(4)||r.crew[2].room===4)){const before=c.hp;c.hp=Math.min(4,c.hp+1);if(c.hp>before)events.push({type:'healCrew',crew:c.id,room:4});}}
 if(r.repairOrder&&operators.has(5)&&r.scrap>=2&&r.hull<r.hullMax){r.scrap-=2;const n=Math.min(r.hullMax-r.hull,HULLS[r.hullType].repair);r.hull+=n;events.push({type:'healHull',n,room:5});}
 if(lens&&e.hull>0){
  let amount=lens+HULLS[r.hullType].damage+(operators.has(1)?1:0)+(operators.has(0)?1:0),blocked=0;
  if(warning.immune||warning.guarded===r.target){blocked=amount;amount=0;}
  else{blocked=Math.min(e.shield,amount);e.shield-=blocked;amount-=blocked;e.hull=Math.max(0,e.hull-amount);if(amount>0)e.rooms[r.target]=Math.max(0,e.rooms[r.target]-1);}
  events.push({type:'shot',target:r.target,damage:amount,blocked,strong:amount>=4});
  if(warning.reflect&&r.target===1&&amount>0)hitHull(r,2,1,1,events);
 }
 // A disabling shot counters the already visible threat before its contact.
 const countered=e.hull===0||e.rooms[0]===0||(['board','hook'].includes(warning.kind)&&e.rooms[2]===0);
 if(!countered&&warning.kind!=='disabled'){
  if(warning.cargo&&s.tow){
   const stable=operators.has(0)&&engine>0;
   const damage=stable?0:1;r.cargo=Math.max(0,r.cargo-damage);events.push({type:'towHit',damage,room:warning.room});
  }else{
   const reduction=operators.has(0)?1:0;
   hitHull(r,Math.max(1,warning.damage-reduction),warning.pierce,warning.room,events);
  }
  const x=r.rooms[warning.room];
  if(warning.kind==='fire')x.fire=1;
  if(warning.kind==='breach')x.breach=1;
  if(warning.kind==='board')x.board=Math.max(x.board,2);
  if(warning.kind==='ion'){x.lock=3;if(warning.extraRoom>=0)r.rooms[warning.extraRoom].lock=3;}
  if(warning.kind!=='shot')events.push({type:'hazard',kind:warning.kind,room:warning.room});
 }
 for(let i=0;i<6;i++){
  const x=r.rooms[i];
  if(x.fire){x.hp=Math.max(0,x.hp-1);for(const c of crewAt(r,i))c.hp=Math.max(0,c.hp-1);events.push({type:'burn',room:i});}
  if(x.breach)r.oxygen=Math.max(0,r.oxygen-1);
  if(x.board)r.hull=Math.max(0,r.hull-1);
  if(x.lock)x.lock--;if(x.bridge)x.bridge--;
 }
 if(!r.oxygen){for(const c of living(r))c.hp=Math.max(0,c.hp-1);events.push({type:'lowOxygen'});}
 // Enemy repairs are announced by the next forecast; each disabled weapon
 // gets a full safe pulse before a later repair can restore it.
 if(e.turn%3===0){for(let i=0;i<3;i++)e.rooms[i]=Math.min(3,e.rooms[i]+1);}
 if((e.type==='W'||e.boss===1||e.boss===6)&&e.rooms[1]>0&&e.hull>0)e.shield=Math.min(e.shieldMax,e.shield+1);
 r.events=events;
 if(r.hull<=0||!living(r).length||(s.tow&&r.cargo<=0)){
  r.status='lost';r.reason=r.hull<=0?'hullLost':!living(r).length?'crewLost':'towLost';events.push({type:'defeat',reason:r.reason});
 }else{
  const specialGoal=r.leg===2&&s.goal==='dock';
  const ready=specialGoal?r.jump===4&&operators.has(0)&&(e.rooms[s.id===50?2:0]===0||e.hull===0):e.hull===0;
  if(ready)endLeg(r);
 }
 return accepted(events);
}
export function chooseDock(r,kind){
 if(r.status!=='dock'||!['materials','repair','oxygen','power'].includes(kind))return rejected('notReady');
 if(kind==='materials')r.scrap=Math.min(30,r.scrap+4);
 if(kind==='repair')r.hull=Math.min(r.hullMax,r.hull+6);
 if(kind==='oxygen'){r.oxygen=r.oxygenMax;for(const c of r.crew)c.hp=Math.min(4,c.hp+2);}
 if(kind==='power'){if(r.powerMax>=8)return rejected('maxPower');r.powerMax++;}
 r.leg++;r.status='route';r.events=[{type:'supply',kind}];return accepted(r.events);
}
export function applyClear(save,r){
 if(r.status!=='won')return false;const old=save.cleared[r.stage];
 save.cleared[r.stage]=Math.min(old||Infinity,r.tick);save.unlocked=Math.max(save.unlocked,Math.min(60,r.stage+1));
 if(save.cleared[3]&&!save.ownedHulls.includes('rescue'))save.ownedHulls.push('rescue');
 if(save.cleared[8]&&!save.ownedHulls.includes('swift'))save.ownedHulls.push('swift');save.active=null;return !old;
}
export function grantSkin(save,skin){if(!SKINS[skin]||save.ownedSkins.includes(skin))return false;save.ownedSkins.push(skin);save.skin=skin;return true;}
