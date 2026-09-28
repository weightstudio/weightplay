import test from 'node:test';
import assert from 'node:assert/strict';
import {actionsFromKeys,steerFromActions,steerFromGamepad} from '../input.mjs';

const gamepad=(axis=0,{left=false,right=false}={})=>{
  const buttons=Array.from({length:16},()=>({pressed:false,value:0}));
  buttons[14].pressed=left;buttons[15].pressed=right;
  return {axes:[axis],buttons};
};

test('keyboard left and right keys steer toward the same side of the follow-camera view',()=>{
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
