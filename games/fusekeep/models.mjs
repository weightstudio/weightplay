// Original box-built animals. Baked vertex colours batch each figure into one draw.
// Coordinates: x right, y up, z toward the player; faces look toward -z.
export function createModelKit(T) {
 const geometries=new Map(),material=new T.MeshStandardMaterial({vertexColors:true,roughness:.72,metalness:.08});
 const palettes={fox:0xe97835,bear:0xa87348,owl:0x81cce5,rabbit:0xd1a7f2,wolf:0x728db4,raccoon:0x87bb72,deer:0xe0b875,cat:0xf1cf65};
 function bake(boxes){
  const positions=[],normals=[],colors=[];
  for(const [x,y,z,w,h,d,color] of boxes){
   const g=new T.BoxGeometry(w,h,d).toNonIndexed();g.translate(x,y,z);
   const p=g.attributes.position.array,n=g.attributes.normal.array,c=new T.Color(color);
   positions.push(...p);normals.push(...n);for(let i=0;i<p.length/3;i++)colors.push(c.r,c.g,c.b);g.dispose();
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.computeBoundingSphere();return g;
 }
 function animal(type){
  const c=palettes[type],cream=0xffedc9,dark=0x213d55,gold=0xffca57;
  const b=[[0,.59,0,.57,.65,.42,c],[0,1.12,0,.77,.65,.65,c],[-.2,.16,0,.22,.28,.32,dark],[.2,.16,0,.22,.28,.32,dark],[-.41,.57,0,.19,.46,.23,c],[.41,.57,0,.19,.46,.23,c],[0,.5,-.22,.58,.32,.08,0x285579],[0,.39,-.27,.64,.1,.1,gold],[0,.97,-.36,.5,.27,.16,cream],[-.19,1.17,-.338,.12,.14,.04,dark],[.19,1.17,-.338,.12,.14,.04,dark],[-.17,1.21,-.365,.036,.04,.018,0xffffff],[.21,1.21,-.365,.036,.04,.018,0xffffff],[0,1.02,-.46,.13,.1,.05,dark]];
  if(type==='rabbit')for(const x of [-.21,.21])b.push([x,1.72,0,.17,.59,.2,c],[x,1.73,-.108,.07,.35,.025,0xed94b7]);
  else if(type==='owl')b.push([-.24,1.48,0,.22,.17,.24,c],[.24,1.48,0,.22,.17,.24,c],[0,1.1,-.44,.14,.21,.2,gold],[-.23,1.2,-.36,.25,.25,.025,cream],[.23,1.2,-.36,.25,.25,.025,cream],[-.23,1.2,-.38,.12,.13,.02,dark],[.23,1.2,-.38,.12,.13,.02,dark]);
  else for(const x of [-.27,.27])b.push([x,1.5,0,.22,type==='bear'?.2:.34,.25,c],[x,1.51,-.13,.105,.12,.015,cream]);
  if(type==='raccoon')b.push([0,1.18,-.346,.65,.19,.02,dark],[-.19,1.2,-.365,.075,.08,.02,cream],[.19,1.2,-.365,.075,.08,.02,cream]);
  if(type==='deer')for(const x of [-.27,.27])b.push([x,1.77,0,.08,.4,.09,0x715646],[x*1.5,1.83,0,.3,.08,.09,0x715646]);
  if(type==='fox'||type==='cat'||type==='wolf')b.push([0,.58,.39,.24,.25,.55,c],[0,.67,.62,.22,.31,.24,cream]);
  // Distinct role equipment is geometry, never emoji or flat icon substitutes.
  if(type==='fox')b.push([.57,.78,-.26,.09,.78,.09,0x785240],[.56,1.15,-.35,.11,.1,.32,gold],[.56,.4,-.35,.11,.1,.32,gold],[.54,.78,-.5,.05,.7,.03,cream]);
  if(type==='bear')b.push([.43,.78,-.55,.38,.38,.77,dark],[.43,.78,-.97,.27,.27,.06,0x101f32],[.43,.78,-1.01,.12,.12,.02,gold]);
  if(type==='owl'||type==='rabbit')b.push([.5,.76,-.08,.09,1.25,.09,0x655777],[.5,1.46,-.08,.3,.3,.3,type==='owl'?0x71f4ff:0xc695ff],[.5,1.68,-.08,.12,.15,.12,cream]);
  if(type==='wolf')b.push([.5,.91,-.1,.1,1.48,.1,0x586675],[.5,1.72,-.1,.21,.4,.16,0xc3eef3],[-.49,.7,-.24,.35,.54,.17,0x29476c]);
  if(type==='raccoon')b.push([.48,.67,-.3,.29,.34,.3,0x88ec74],[.48,.91,-.3,.12,.16,.13,0xfaffdf]);
  if(type==='deer')b.push([.57,1.05,0,.08,1.82,.09,0x866240],[.82,1.58,0,.5,.42,.075,0x44c7b6],[.82,1.58,-.05,.16,.16,.035,gold]);
  if(type==='cat')b.push([.48,.52,-.28,.39,.35,.31,0xad6941],[.48,.72,-.28,.32,.08,.28,gold],[0,1.5,0,.5,.12,.39,0x467550]);
  return b;
 }
 function enemy(type){
  const spider=['runner','splitter','small','brood'].includes(type),boss=['ram','mirror','brood','frost','thief','crown'].includes(type);
  const c=spider?(type==='splitter'?0x975ec5:0xda5258):type==='healer'?0x8bca86:type==='frost'?0x87cbea:0xcac6b2,dark=0x283c4d;
  const b=spider?[[0,.46,0,.64,.44,.86,c],[0,.37,-.44,.49,.35,.33,dark]]:[[0,.48,0,.48,.65,.33,dark],[0,1,0,.72,.62,.59,c],[-.22,.12,0,.18,.25,.25,c],[.22,.12,0,.18,.25,.25,c],[-.39,.49,0,.16,.52,.19,c],[.39,.49,0,.16,.52,.19,c],[0,.89,-.33,.35,.15,.12,0x8d8e86]];
  const ey=spider?.43:1.07,ez=spider?-.62:-.307;
  b.push([-.17,ey,ez,.14,.15,.04,0xff563b],[.17,ey,ez,.14,.15,.04,0xff563b]);
  if(spider)for(const x of [-1,1])for(let i=0;i<4;i++)b.push([x*.53,.22,(i-1.5)*.26,.6,.11,.12,dark],[x*.79,.09,(i-1.5)*.32,.11,.25,.12,c]);
  if(type==='shield'||type==='mirror')b.push([-.45,.65,-.38,.48,.87,.2,0x667fa7],[-.45,.65,-.5,.29,.6,.035,0x9ee7f3],[0,1.33,0,.83,.13,.64,0x506985]);
  if(type==='healer'||type==='frost')b.push([.51,.8,0,.09,1.55,.1,dark],[.51,1.54,0,.4,.38,.28,type==='frost'?0x9ef7ff:0x67e08a],[.51,1.55,-.16,.26,.09,.03,0xffffff],[.51,1.55,-.16,.09,.26,.03,0xffffff]);
  if(type==='ram')for(const x of [-.43,.43])b.push([x,1.36,-.04,.25,.2,.7,0xc5984e],[x,1.45,-.39,.24,.36,.22,0xffd179]);
  if(type==='thief')b.push([0,1.35,0,.8,.28,.64,0x713e87],[.5,.45,.03,.4,.7,.45,0xc69645]);
  if(type==='crown'||type==='brood')for(let i=0;i<3;i++)b.push([(i-1)*.2,spider?.9:1.45,0,.15,.3,.26,0xffc34d]);
  if(boss)b.push([0,.25,.32,.65,.34,.2,0x803e86]);
  return b;
 }
 return {
  figure(type,hostile=false){const key=(hostile?'enemy:':'troop:')+type;if(!geometries.has(key))geometries.set(key,bake(hostile?enemy(type):animal(type)));return new T.Mesh(geometries.get(key),material);},
  scenery(boxes){const g=bake(boxes);geometries.set('scene:'+geometries.size,g);return new T.Mesh(g,material);},
  dispose(){for(const g of geometries.values())g.dispose();material.dispose();}
 };
}
