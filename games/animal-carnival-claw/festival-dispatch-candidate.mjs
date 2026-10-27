// Closed chapter candidate; not loaded by the live campaign.
// Slot coordinates are logical 1000 × 620 units, shared with Carnival Claw.
const SLOT_POINTS=Object.freeze([[180,260],[500,260],[820,260],[180,450],[500,450],[820,450]].map(Object.freeze));
// Ordered target kinds and corresponding authored slots. Existing identity mapping:
// 0 Leo, 1 Nori, 2 Fox, 3 Turtle, 4 Owl, 5 Panda, 6 Rux, 7 Rabbit.
const PLANS=[
 [[0,1],[3,5]],[[2,3],[5,3]],[[4,5],[1,0]],[[6,7],[3,0]],[[1,2,0],[0,5,4]],
 [[3,4],[0,3]],[[5,6],[0,5]],[[7,0],[2,3]],[[2,5,4],[3,1,5]],[[3,1,6],[0,3,2]],
 [[0,5],[3,5]],[[4,7],[0,2]],[[1,6,2],[3,1,5]],[[3,0,5],[3,4,2]],[[7,4,1],[2,4,0]],
 [[6,3],[3,5]],[[5,2,7],[4,3,2]],[[4,0,3],[0,4,2]],[[1,7,5],[3,4,2]],[[2,6,4],[3,1,5]],
 [[0,3,7],[3,0,5]],[[5,1,4],[3,4,2]],[[6,2,3],[5,0,4]],[[7,5,0],[5,3,2]],[[4,1,2],[0,5,3]],
 [[3,6,5],[3,2,4]],[[2,7,1],[0,1,5]],[[0,4,6],[3,4,5]],[[5,3,2],[5,0,3]],[[7,1,0],[5,0,4]],
];
export const FESTIVAL_LEVELS=Object.freeze(PLANS.map(([order,slots],offset)=>{
  const index=30+offset, remaining=[0,1,2,3,4,5,6,7].filter(kind=>!order.includes(kind));
  // Distractors use the remaining slots; rotation varies surrounding identity, not goals.
  const prizes=Array(6);order.forEach((kind,i)=>{const [x,y]=SLOT_POINTS[slots[i]];prizes[slots[i]]={id:`f${index+1}-${slots[i]}`,kind,x,y,weight:1+(kind+offset)%3};});
  const fillers=remaining.slice(offset%remaining.length).concat(remaining.slice(0,offset%remaining.length));
  let next=0;for(let slot=0;slot<6;slot++)if(!prizes[slot]){const kind=fillers[next++],[x,y]=SLOT_POINTS[slot];prizes[slot]={id:`f${index+1}-${slot}`,kind,x,y,weight:1+(kind+offset)%3};}
  return Object.freeze({index,id:index+1,order:Object.freeze([...order]),checkpoint:(index+1)%5===0?order.at(-1):null,prizes:Object.freeze(prizes.map(Object.freeze)),drift:offset<10?0:.16,brakeUses:2,brakeSeconds:1.25});
}));
export function beginFestival(level){if(!FESTIVAL_LEVELS.includes(level))throw new TypeError('Unknown festival level');return {id:level.id,order:[...level.order],checkpoint:level.checkpoint,delivered:[],drops:3,brakes:level.brakeUses,brakeTime:0,heldSway:0,checkpointLocks:0};}
export function checkpointLock(run,kind){if(!run||run.drops<=0||run.checkpoint!==kind||run.order[run.delivered.length]!==kind||run.checkpointLocks>=2)return false;run.checkpointLocks++;return true;}
export function resetCheckpointLocks(run){if(run)run.checkpointLocks=0;}
export function deliverFestival(run,kind){if(!run||run.drops<=0||run.delivered.length>=run.order.length)return {accepted:false,reason:'settled'};if(kind===run.checkpoint&&kind===run.order[run.delivered.length]&&run.checkpointLocks!==2)return {accepted:false,reason:'checkpoint-needs-two-locks'};run.drops--;run.checkpointLocks=0;if(kind!==run.order[run.delivered.length])return {accepted:false,reason:'wrong-order'};run.delivered.push(kind);return {accepted:true,won:run.delivered.length===run.order.length};}
export function useBrake(run,phase,sway){if(!run||phase!=='aim'||run.brakes<=0||run.brakeTime>0||!Number.isFinite(sway))return false;run.brakes--;run.heldSway=sway;run.brakeTime=1.25;return true;}
export function tickBrake(run,dt){if(!run||!Number.isFinite(dt)||dt<0)throw new TypeError('invalid time');run.brakeTime=Math.max(0,run.brakeTime-dt);}
export function railSway(run,natural){if(!Number.isFinite(natural))throw new TypeError('invalid sway');return run.brakeTime>0?run.heldSway:natural;}
