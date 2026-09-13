// Split the authored cuboids at anatomical joints; geometry is shared by species.
export function rigParts(kind, parts) {
 const guard=['cat','dog','owl','fox'].includes(kind), eagle=kind==='bossEagle';
 const deer=['healer','bossElk'].includes(kind), low=['burrow','bossBadger','bossTortoise'].includes(kind);
 const pivots=guard?{body:[0,0,0],head:[0,.86,0],leftArm:[-.4,.77,0],rightArm:[.4,.77,0],leftLeg:[-.19,.3,0],rightLeg:[.19,.3,0]}:
 {body:[0,0,0],head:[0,deer?.84:low?.45:.58,.25],leftFront:[-.24,deer?.48:low?.23:.29,.19],rightFront:[.24,deer?.48:low?.23:.29,.19],leftBack:[-.24,deer?.48:low?.23:.29,-.39],rightBack:[.24,deer?.48:low?.23:.29,-.39],leftWing:[-.28,.9,0],rightWing:[.28,.9,0]};
 const groups=Object.fromEntries(Object.entries(pivots).map(([name,pivot])=>[name,{name,pivot,parts:[]}]));
 for(const part of parts){
  const [x,y,z]=part;let name='body';
  if(guard){
   if(y<=.22)name=x<0?'leftLeg':'rightLeg';
   else if((Math.abs(x)>=.4 && y<.8) || (['cat','fox'].includes(kind)&&x===-.5) || (kind==='owl'&&x===-.48))name=x<0?'leftArm':'rightArm';
   else if(y>=.8)name='head';
  }else if(eagle){
   if(Math.abs(x)>=.3)name=x<0?'leftWing':'rightWing';
   else if(y>=.94)name='head';
  }else{
   if(y<=(deer?.4:.23)&&Math.abs(x)>.1)name=(x<0?'left':'right')+(z>-.1?'Front':'Back');
   else if(z>=.24&&y>(deer?.7:low?.35:.45))name='head';
  }
  const group=groups[name];const local=[...part];for(let i=0;i<3;i++)local[i]-=group.pivot[i];group.parts.push(local);
 }
 return Object.values(groups).filter(group=>group.parts.length);
}

export function animateRig(actor, entity, state) {
 const data=actor.userData, joints=data.joints, guard=entity.kind==='guard';
 const count=entity.attackCount||0;
 if(data.attackCount===undefined)data.attackCount=count;
 if(count!==data.attackCount){data.attackCount=count;data.attackTime=state.time;}
 const elapsed=state.time-(data.attackTime??-10000), strike=Math.max(0,1-elapsed/360);
 const moved=!guard&&Math.abs((data.previousX??entity.x)-entity.x)>.000001;
 data.previousX=entity.x;
 data.stride=(data.stride||0)+(moved?Math.min(50,state.time-(data.lastTime||state.time))*.014:0);
 data.lastTime=state.time;
 const step=state.reduced?0:Math.sin(data.stride)*.48;
 for(const joint of Object.values(joints)){joint.rotation.set(0,0,0);joint.position.copy(joint.userData.rest);}
 if(guard){
  // Arms carry the bow/staff/shield. The torso remains upright and faces the lane.
  const draw=entity.aiming?Math.max(0,1-entity.cooldown/320):0;
  if(joints.rightArm){joints.rightArm.rotation.x=-(entity.id==='owl'?.35:.65)-draw*.55+strike*.65;joints.rightArm.position.z-=draw*.16;}
  if(joints.leftArm){joints.leftArm.rotation.x=entity.id==='dog'?-.3-strike*.8:entity.id==='owl'?-.25-draw*.6+strike*.5:-.5-draw*.18;joints.leftArm.position.z+=strike*(entity.id==='dog'?.28:.08);}
  if(joints.head)joints.head.rotation.x=-strike*.09;
 }else{
  for(const [name,sign] of [['leftFront',1],['rightBack',1],['rightFront',-1],['leftBack',-1]])if(joints[name])joints[name].rotation.x=moved?step*sign:0;
  if(joints.head){joints.head.rotation.x=-strike*.45;joints.head.position.z+=strike*.16;}
  if(joints.leftWing)joints.leftWing.rotation.z=state.reduced?0:Math.sin(state.time*.009)*.32;
  if(joints.rightWing)joints.rightWing.rotation.z=state.reduced?0:-Math.sin(state.time*.009)*.32;
 }
 data.striking=strike>0;data.walking=moved;
}
