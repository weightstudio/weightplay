// Block-built 3D interpretation used by the authorized local practice only.
// Small-screen recognition and Art review remain open.
export function makeWardenArt(THREE){
  if(!THREE?.Group||!THREE?.BoxGeometry||!THREE?.MeshStandardMaterial)throw new TypeError('Three.js required');
  const group=new THREE.Group(),rig=new THREE.Group(),box=new THREE.BoxGeometry(1,1,1);group.add(rig);
  const materials={
    wood:new THREE.MeshStandardMaterial({color:0x654332,roughness:.78}),
    woodLight:new THREE.MeshStandardMaterial({color:0x956744,roughness:.72}),
    stone:new THREE.MeshStandardMaterial({color:0x435b74,roughness:.76}),
    ivory:new THREE.MeshStandardMaterial({color:0xe1cfa6,roughness:.65}),
    gold:new THREE.MeshStandardMaterial({color:0xd3a74d,roughness:.42,metalness:.35}),
    cyan:new THREE.MeshStandardMaterial({color:0x5addf0,emissive:0x0b6674,emissiveIntensity:.35,roughness:.3}),
    lamp:new THREE.MeshStandardMaterial({color:0xffd45d,emissive:0xc76d08,emissiveIntensity:.5,roughness:.35}),
  };
  const part=(material,x,y,z,w,h,d,parent=rig)=>{const mesh=new THREE.Mesh(box,materials[material]);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh};
  // Compact shell, four separated feet and a clearly separated raised head.
  part('wood',-.20,.73,-.14,.98,.70,1.08);part('woodLight',-.20,1.10,-.14,.90,.16,1.00);
  for(const x of [-.60,.20])for(const z of [-.55,.34]){part('stone',x,.30,z,.29,.48,.29);part('ivory',x,.09,z+.07,.36,.18,.40)}
  part('stone',-.51,1.30,.62,.66,.66,.54);part('woodLight',-.51,1.72,.60,.62,.16,.52);
  part('ivory',-.51,1.17,1.00,.48,.25,.24);part('cyan',-.70,1.43,.94,.14,.14,.07);part('cyan',-.32,1.43,.94,.14,.14,.07);
  for(const x of [-.76,-.26])part('stone',x,1.72,.50,.18,.26,.20);
  for(const z of [-.48,-.10,.28])part('woodLight',-.20,1.20,z,.85,.14,.15);
  for(const x of [-.54,.14])part('cyan',x,1.31,-.20,.18,.15,.18);
  // Lantern sits to the side with open space around the face, rather than
  // merging into the animal's head silhouette as in the source concept.
  const lantern=new THREE.Group();lantern.position.set(.84,.62,.46);rig.add(lantern);
  part('lamp',0,.20,0,.52,.92,.35,lantern);
  part('lamp',0,.20,.23,.40,.68,.08,lantern);
  for(const x of [-.29,.29])part('woodLight',x,.20,0,.10,1.08,.45,lantern);
  for(const y of [-.34,.74])part('gold',0,y,0,.68,.11,.46,lantern);
  part('cyan',0,.20,.24,.22,.22,.09,lantern);
  const shieldA=part('cyan',0,.20,.30,.72,.10,.07,lantern),shieldB=part('cyan',0,.20,.30,.10,.96,.07,lantern);
  // A raised cross remains visible from the overhead camera while shielded.
  const shieldC=part('cyan',-.20,1.48,-.14,1.05,.09,.14),shieldD=part('cyan',-.20,1.48,-.14,.14,.09,1.04);
  let disposed=false;
  return Object.freeze({group,rig,setShielded(value){if(disposed)return;shieldA.visible=shieldB.visible=shieldC.visible=shieldD.visible=Boolean(value);materials.lamp.emissiveIntensity=value ? .7 : .2},dispose(){if(disposed)return;disposed=true;box.dispose();for(const material of Object.values(materials))material.dispose();group.clear()}});
}
