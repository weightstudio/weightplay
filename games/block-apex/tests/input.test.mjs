import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three/three.module.min.js';
import {actionsFromKeys,steerFromActions,steerFromGamepad} from '../input.mjs';
import {createRace,stepRace,STEP,angle,clamp,sampleTrack} from '../physics.mjs';

const gamepad=(axis=0,{left=false,right=false}={})=>{
  const buttons=Array.from({length:16},()=>({pressed:false,value:0}));
  buttons[14].pressed=left;buttons[15].pressed=right;
  return {axes:[axis],buttons};
};

test('keyboard left and right keys turn toward their visible directions',()=>{
  for(const key of ['ArrowLeft','KeyA'])assert.equal(steerFromActions(actionsFromKeys([key])),1);
  for(const key of ['ArrowRight','KeyD'])assert.equal(steerFromActions(actionsFromKeys([key])),-1);
  assert.equal(steerFromActions(actionsFromKeys(['ArrowLeft','ArrowRight'])),0);
});

test('touch steering actions match the visible left and right controls',()=>{
  assert.equal(steerFromActions(new Set(['left'])),1);
  assert.equal(steerFromActions(new Set(['right'])),-1);
  assert.equal(steerFromActions(new Set(['left','right'])),0);
  assert.equal(steerFromActions(new Set()),0);
});

test('standard gamepad axes and d-pad follow visible steering direction',()=>{
  assert.equal(steerFromGamepad(gamepad(-1)),1);
  assert.equal(steerFromGamepad(gamepad(1)),-1);
  assert.equal(steerFromGamepad(gamepad(-.1)),0);
  assert.equal(steerFromGamepad(gamepad(0,{left:true})),1);
  assert.equal(steerFromGamepad(gamepad(0,{right:true})),-1);
});

test('left and right inputs move to the same side of the track in screen projection',()=>{
  const screenOffsetAfter=(steer)=>{
    const race=createRace(1);
    for(let i=0;i<360;i++)stepRace(race,{},STEP);
    for(let i=0;i<156;i++)stepRace(race,{steer:0,throttle:1},STEP);
    for(let i=0;i<36;i++)stepRace(race,{steer,throttle:1},STEP);
    const car=race.player,road=sampleTrack(race.track,car.near.s);
    const heading=sampleTrack(race.track,car.near.s+12).heading;
    const followYaw=car.yaw+angle(heading-car.yaw)*.15;
    const pull=clamp(car.speed/40,0,1)*1.1;
    const width=370,camera=new THREE.PerspectiveCamera(82,width/700,.1,400);
    camera.position.set(car.x-Math.sin(followYaw)*(9+pull),car.y+6.4,car.z-Math.cos(followYaw)*(9+pull));
    camera.lookAt(car.x+Math.sin(followYaw)*10,car.y+.8,car.z+Math.cos(followYaw)*10);
    camera.updateMatrixWorld(true);
    const screenX=(x,y,z)=>{
      const point=new THREE.Vector3(x,y,z).project(camera);
      return (point.x+1)*width/2;
    };
    return screenX(car.x,car.y+.7,car.z)-screenX(road.x,road.y+.02,road.z);
  };
  const left=screenOffsetAfter(steerFromActions(new Set(['left'])));
  const neutral=screenOffsetAfter(0);
  const right=screenOffsetAfter(steerFromActions(new Set(['right'])));
  assert.ok(left<neutral,`left=${left} should project left of neutral=${neutral}`);
  assert.ok(right>neutral,`right=${right} should project right of neutral=${neutral}`);
});
