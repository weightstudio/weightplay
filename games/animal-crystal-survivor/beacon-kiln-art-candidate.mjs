// Unconnected local-practice cat-like boss draft. No rendered Art acceptance.
export function makeKilnPantherArt(THREE){
  if(!THREE?.Group||!THREE?.BoxGeometry||!THREE?.ConeGeometry||!THREE?.MeshStandardMaterial)throw new TypeError('Three.js required');
  const group=new THREE.Group(),rig=new THREE.Group(),box=new THREE.BoxGeometry(1,1,1),ear=new THREE.ConeGeometry(.34,.64,4);
  group.add(rig);
  const materials={coat:new THREE.MeshStandardMaterial({color:0x332b30,roughness:.85}),
    dark:new THREE.MeshStandardMaterial({color:0x181b24,roughness:.9}),
    ember:new THREE.MeshStandardMaterial({color:0xff8a32,emissive:0xa52d08,emissiveIntensity:.8}),
    eye:new THREE.MeshStandardMaterial({color:0xffdb6d,emissive:0xe84b0b,emissiveIntensity:.9}),
    muzzle:new THREE.MeshStandardMaterial({color:0xffc389,roughness:.75}),
    shield:new THREE.MeshStandardMaterial({color:0x78d7ef,emissive:0x1684a1,emissiveIntensity:.6,transparent:true,opacity:.85})};
  const part=(name,x,y,z,w,h,d)=>{const mesh=new THREE.Mesh(box,materials[name]);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);rig.add(mesh);return mesh};
  part('coat',0,.65,-.1,1.15,.68,1.3);
  for(const x of [-.4,.4])for(const z of [-.48,.32]){part('dark',x,.24,z,.25,.46,.28);part('ember',x,.09,z+.06,.27,.1,.29)}
  part('dark',0,1.18,.60,.8,.66,.62);
  for(const x of [-.39,.39]){const tip=new THREE.Mesh(ear,materials.dark);tip.position.set(x,1.72,.62);rig.add(tip);part('ember',x,1.66,.86,.16,.22,.07);part('eye',x*.65,1.33,.94,.18,.16,.08)}
  part('muzzle',0,1.02,.98,.54,.25,.22);part('dark',0,1.10,1.11,.14,.11,.06);
  for(const sign of [-1,1])for(const y of [1.01,1.10])part('muzzle',sign*.45,y,1.04,.34,.035,.055);
  for(const z of [-.48,-.1,.28])part('ember',0,1.02,z,.95,.055,.08);
  const tail=part('dark',.48,.78,-.85,.18,.18,.95);tail.rotation.y=-.48;
  part('ember',.72,.78,-1.22,.23,.22,.25);
  const shield=part('shield',0,1.23,-.18,.94,.12,.94);
  const markA=part('eye',0,1.31,-.18,.70,.07,.11),markB=part('eye',0,1.31,-.18,.11,.07,.70);
  let disposed=false;
  return Object.freeze({group,rig,setShielded(value){if(disposed)return;shield.visible=markA.visible=markB.visible=Boolean(value)},dispose(){if(disposed)return;disposed=true;box.dispose();ear.dispose();for(const m of Object.values(materials))m.dispose();group.clear()}});
}
