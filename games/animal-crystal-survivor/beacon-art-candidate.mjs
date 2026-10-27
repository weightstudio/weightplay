// Unconnected procedural real-3D art candidate, based on the authored beacon
// asset. Not imported by v50; play-size Art acceptance remains unverified.
export function makeBeaconArt(THREE) {
  if(!THREE?.Group||!THREE?.BoxGeometry||!THREE?.MeshStandardMaterial)throw new TypeError('Three.js required');
  const group=new THREE.Group(),box=new THREE.BoxGeometry(1,1,1);
  const materials={
    base:new THREE.MeshStandardMaterial({color:0x173e50,roughness:.64,metalness:.15}),
    edge:new THREE.MeshStandardMaterial({color:0xd9a84e,roughness:.4,metalness:.48}),
    crystal:new THREE.MeshStandardMaterial({color:0x55dff1,emissive:0x075366,emissiveIntensity:.22,roughness:.3,metalness:.08}),
    pale:new THREE.MeshStandardMaterial({color:0xc6ffff,emissive:0x09505d,emissiveIntensity:.18,roughness:.32}),
  };
  const part=(material,x,y,z,w,h,d)=>{const mesh=new THREE.Mesh(box,materials[material]);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);group.add(mesh);return mesh};
  part('base',0,.09,0,1.32,.18,1.32);part('base',0,.24,0,1.08,.14,1.08);
  part('base',0,.36,0,.8,.12,.8);
  for(const x of [-.51,.51])for(const z of [-.51,.51]){
    part('edge',x,.26,z,.20,.30,.20);part('edge',x,.45,z,.13,.13,.13);
  }
  part('edge',0,.43,0,.58,.10,.58);part('crystal',0,.75,0,.48,.58,.48);
  part('pale',0,1.08,0,.31,.16,.31);part('crystal',0,1.20,0,.17,.10,.17);
  // An offset mast remains visible while the player stands on the beacon.
  // The raised cross is a persistent shape cue as well as an emissive change.
  part('edge',.94,1.02,0,.10,2.04,.10);
  part('crystal',.94,2.13,0,.43,.43,.22);
  const activeHorizontal=part('pale',.94,2.13,.14,.57,.10,.08);
  const activeVertical=part('pale',.94,2.13,.14,.10,.57,.08);
  activeHorizontal.visible=false;activeVertical.visible=false;
  let disposed=false;
  return Object.freeze({group,setCharged(value){if(disposed)return;materials.crystal.emissiveIntensity=value ? .65 : .22;materials.pale.emissiveIntensity=value ? .5 : .18;activeHorizontal.visible=Boolean(value);activeVertical.visible=Boolean(value)},dispose(){if(disposed)return;disposed=true;box.dispose();for(const material of Object.values(materials))material.dispose();group.clear()}});
}

export function makeBeaconFragmentArt(THREE) {
  if(!THREE?.Group||!THREE?.BoxGeometry||!THREE?.OctahedronGeometry)throw new TypeError('Three.js required');
  const group=new THREE.Group(),prism=new THREE.OctahedronGeometry(.32,0),box=new THREE.BoxGeometry(1,1,1);
  const crystal=new THREE.MeshStandardMaterial({color:0x58e8ff,emissive:0x075366,emissiveIntensity:.3,roughness:.32});
  const gold=new THREE.MeshStandardMaterial({color:0xf0bd59,metalness:.45,roughness:.42});
  const shard=new THREE.Mesh(prism,crystal);shard.position.y=.39;shard.scale.set(.76,1.25,.76);group.add(shard);
  const band=new THREE.Mesh(box,gold);band.position.y=.35;band.scale.set(.55,.12,.55);group.add(band);
  let disposed=false;return Object.freeze({group,dispose(){if(disposed)return;disposed=true;prism.dispose();box.dispose();crystal.dispose();gold.dispose();group.clear()}});
}
