import test from 'node:test';
import assert from 'node:assert/strict';
import {STAGES,TRACKS,GATE_COUNT} from '../data.mjs';
import {STEP,angle,buildTrack,sampleTrack,nearestTrack,createRace,stepRace,aiControl,pauseRace,resumeRace,recoverCar,settle,segmentDistance} from '../physics.mjs';
import {actionsFromKeys,steerFromActions} from '../input.mjs';
const running=id=>{const race=createRace(id,{}, {id:`test-${id}`});race.status='running';return race;};
const at=(race,s,offset=0,speed=20)=>{
  const p=sampleTrack(race.track,s,offset),car=race.player;
  Object.assign(car,{x:p.x,y:p.y,z:p.z,yaw:p.heading,motion:p.heading,speed,steer:0});car.near=nearestTrack(race.track,p.x,p.z);return car;
};

test('all fourteen directions have finite closed tracks, unit frames and 16 ordered gates',()=>{
  for(let i=0;i<TRACKS.length;i++)for(const reverse of [false,true]){
    const track=buildTrack(i,reverse);assert.ok(track.length>100);assert.equal(track.gates.length,GATE_COUNT);
    const first=sampleTrack(track,0),last=sampleTrack(track,track.length);
    assert.equal(first.x,last.x);assert.equal(first.z,last.z);assert.equal(first.y,last.y);
    for(let k=0;k<100;k++){
      const p=sampleTrack(track,track.length*k/100);assert.ok([p.x,p.y,p.z,p.heading,p.slope].every(Number.isFinite));
      assert.ok(Math.abs(Math.hypot(p.tx,p.tz)-1)<1e-10);assert.ok(Math.abs(p.tx*p.nx+p.tz*p.nz)<1e-10);
      assert.ok(Math.abs(nearestTrack(track,p.x,p.z).lateral)<1e-8);
    }
  }
});
test('all 30 race definitions instantiate and advance without non-finite state',()=>{
  for(const stage of STAGES){const race=running(stage.id);for(let i=0;i<120;i++)stepRace(race,aiControl(race,race.player));
    for(const car of race.cars)assert.ok([car.x,car.y,car.z,car.speed,car.progress,car.nitro].every(Number.isFinite));
    assert.equal(race.cars.length,stage.rivals+1);assert.ok(race.events.length<=48);
  }
});
test('countdown freezes position and racing time; pause has no catch-up',()=>{
  const race=createRace(1);const x=race.player.x,z=race.player.z;
  for(let i=0;i<100;i++)stepRace(race,{throttle:1});assert.equal(race.player.x,x);assert.equal(race.player.z,z);assert.equal(race.time,0);
  const count=race.countdown;pauseRace(race);for(let i=0;i<500;i++)stepRace(race,{throttle:1});assert.equal(race.countdown,count);
  resumeRace(race);assert.equal(race.status,'countdown');stepRace(race);assert.ok(race.countdown<count);
});
test('fixed-step contract rejects invalid and oversized time increments',()=>{
  const race=createRace(1);for(const dt of [0,-1,NaN,Infinity,1/30])assert.throws(()=>stepRace(race,{},dt),/FIXED_STEP_REQUIRED/);
});
test('left-labelled input turns the kart left and right-labelled input turns it right',()=>{
  const left=running(1),right=running(1);left.cars=[left.player];right.cars=[right.player];
  const leftCar=at(left,.01,0,18),rightCar=at(right,.01,0,18),startYaw=leftCar.yaw;
  const leftSteer=steerFromActions(actionsFromKeys(['ArrowLeft'])),rightSteer=steerFromActions(actionsFromKeys(['ArrowRight']));
  for(let i=0;i<30;i++){stepRace(left,{throttle:1,steer:leftSteer},STEP);stepRace(right,{throttle:1,steer:rightSteer},STEP);}
  assert.ok(angle(leftCar.yaw-startYaw)<0);assert.ok(angle(rightCar.yaw-startYaw)>0);
});
test('a real steering controller can drive the entire introductory circuit',()=>{
  const race=createRace(1);for(let n=0;n<11000&&race.status!=='result';n++)stepRace(race,aiControl(race,race.player));
  assert.equal(race.status,'result');assert.equal(race.player.completedLaps,1);assert.equal(race.result.success,true);
  assert.ok(race.player.gates>=GATE_COUNT);assert.ok(race.result.time<=race.stage.limit);
});
test('crossing the start without intervening gates cannot farm laps',()=>{
  const race=running(1);at(race,-.05);stepRace(race,{throttle:1});assert.equal(race.player.gates,0);assert.equal(race.player.nextGate,1);
  for(let i=0;i<20;i++){at(race,-.05);stepRace(race,{throttle:1});}
  assert.equal(race.player.gates,0);assert.equal(race.player.completedLaps,0);assert.equal(race.result,null);
});
test('backwards crossings never advance the expected checkpoint',()=>{
  const race=running(1),car=at(race,.05);car.yaw+=Math.PI;car.motion=car.yaw;
  stepRace(race,{throttle:1});assert.equal(car.gates,-1);assert.equal(car.nextGate,0);
});
test('recovery returns to last validated gate and charges time and nitro',()=>{
  const race=running(1);race.player.gates=5;race.player.nextGate=6;race.player.nitro=.8;
  assert.equal(recoverCar(race),true);assert.equal(race.player.gates,5);assert.equal(race.player.nextGate,6);
  assert.equal(race.penalty,3);assert.equal(race.player.nitro,0);assert.equal(race.player.resetCount,1);
  assert.ok(Math.abs(race.player.near.s-(5*race.track.interval+2.5))<.01);assert.equal(recoverCar(race),false);
});
test('pickups are collected once per lap, not once per frame',()=>{
  const race=running(11),p=race.rings[0];Object.assign(race.player,{x:p.x,y:p.y,z:p.z,speed:0});race.player.near=nearestTrack(race.track,p.x,p.z);
  stepRace(race);stepRace(race);assert.equal(race.player.ringCount,1);
  race.player.completedLaps=1;stepRace(race);assert.equal(race.player.ringCount,2);
});
test('limited nitro never refills through driving or drift',()=>{
  const race=running(22);race.player.nitro=.1;race.player.speed=20;
  for(let i=0;i<30;i++)stepRace(race,{throttle:1,steer:.4,drift:true});
  assert.equal(race.player.nitro,.1);assert.ok(race.player.driftSeconds>0);
});
test('releasing a charged drift awards one bounded mini boost',()=>{
  const race=running(1);race.player.speed=20;race.player.drifting=true;race.player.driftBank=1;
  stepRace(race,{throttle:1});assert.ok(race.player.miniBoost>0);assert.equal(race.player.driftBank,0);
  assert.equal(race.events.filter(e=>e.type==='driftBoost').length,1);
  stepRace(race,{throttle:1});assert.equal(race.events.filter(e=>e.type==='driftBoost').length,1);
});
test('crossing the finish is insufficient when a required objective fails',()=>{
  const race=running(3);race.time=30;race.player.finished=true;race.player.finishTime=30;
  const result=settle(race);assert.equal(result.success,false);assert.equal(result.goals.finish,true);assert.equal(result.goals.drift,false);
  assert.equal(settle(race),result);assert.equal(race.events.filter(e=>e.type==='lose').length,1);
});
test('three drift tiers give increasing immediate exit speed and duration',()=>{
  let previousSpeed=0,previousDuration=0;
  for(const bank of [.45,1.25,2.1]){
    const race=running(1);at(race,30,0,20);race.player.drifting=true;race.player.driftBank=bank;
    stepRace(race,{throttle:1});
    assert.ok(race.player.speed>previousSpeed);assert.ok(race.player.miniBoost>previousDuration);
    previousSpeed=race.player.speed;previousDuration=race.player.miniBoost;
  }
  const race=running(1);at(race,30,0,20);race.player.drifting=true;race.player.driftBank=.39;
  stepRace(race,{throttle:1});assert.equal(race.player.miniBoost,0);
});
test('contact breaks drift and slipstream charge without granting an exit boost',()=>{
  const race=running(1);at(race,30,race.track.width+1.4,20);
  Object.assign(race.player,{drifting:true,driftBank:2.2,driftLevel:3,draftCharge:1.4,draftBoost:.8});
  stepRace(race,{throttle:1});
  assert.equal(race.player.driftBank,0);assert.equal(race.player.draftCharge,0);assert.equal(race.player.miniBoost,0);assert.equal(race.player.draftBoost,0);
  assert.ok(race.player.impact>0);assert.ok(race.events.some(e=>e.type==='contact'));assert.ok(!race.events.some(e=>e.type==='driftBoost'));
});
test('a charged slipstream releases once, including fuel-conservation races',()=>{
  for(const id of [1,22]){
    const race=running(id);at(race,30,0,20);race.cars=[race.player];race.player.draftCharge=1.4;
    const fuel=race.player.nitro;stepRace(race,{throttle:1});
    assert.equal(race.player.draftBoost,.85);assert.equal(race.player.draftCharge,0);assert.ok(race.player.speed>22);
    stepRace(race,{throttle:1});assert.equal(race.events.filter(e=>e.type==='draftBoost').length,1);
    if(race.stage.noRefill)assert.equal(race.player.nitro,fuel);
  }
});
test('recovery clears all transient driving benefits and impact state',()=>{
  const race=running(1);Object.assign(race.player,{driftLevel:3,draftCharge:1.4,draftBoost:.8,impact:1,boostLevel:3});
  recoverCar(race);for(const key of ['driftLevel','draftCharge','draftBoost','impact','boostLevel'])assert.equal(race.player[key],0);
});
test('timeout settles once and freezes further movement',()=>{
  const race=running(1);race.time=race.stage.limit-STEP/2;stepRace(race,{throttle:1});assert.equal(race.result.success,false);
  const x=race.player.x,time=race.time;stepRace(race,{throttle:1});assert.equal(race.player.x,x);assert.equal(race.time,time);
});
test('swept obstacle distance catches a crossing between frames',()=>{
  assert.equal(segmentDistance(-5,0,5,0,0,0),0);assert.equal(segmentDistance(0,0,0,0,3,4),5);
});
test('every campaign circuit is driveable within its timeout using continuous steering',()=>{
  // Does not claim to earn every objective: this driver never deliberately drifts or collects rings.
  for(const stage of STAGES){
    const race=createRace(stage.id);for(let n=0;n<30000&&race.status!=='result';n++)stepRace(race,aiControl(race,race.player));
    assert.equal(race.player.finished,true,`Circuit did not finish: ${stage.id}`);
    assert.equal(race.player.completedLaps,stage.laps);assert.ok(race.time<=stage.limit);
  }
});
