// Local-practice 3D ram candidate. Small-screen identity and Art review remain open.
export function makeRamArt(THREE){
  if(!THREE?.Group||!THREE?.BoxGeometry||!THREE?.TorusGeometry||!THREE?.MeshStandardMaterial)throw new TypeError('Three.js required');
  const group=new THREE.Group(),rig=new THREE.Group(),box=new THREE.BoxGeometry(1,1,1),hornLoop=new THREE.TorusGeometry(.30,.115,5,16,Math.PI*1.7);group.add(rig);
  const materials={
    coat:new THREE.MeshStandardMaterial({color:0x49634a,roughness:.85}),
    fleece:new THREE.MeshStandardMaterial({color:0xa7c38b,roughness:.82}),
    dark:new THREE.MeshStandardMaterial({color:0x253c39,roughness:.8}),
    horn:new THREE.MeshStandardMaterial({color:0xe7c981,roughness:.55,metalness:.12}),
    eye:new THREE.MeshStandardMaterial({color:0x73efff,emissive:0x168d9f,emissiveIntensity:.8,roughness:.3}),
    shield:new THREE.MeshStandardMaterial({color:0x67d9ef,emissive:0x177b8d,emissiveIntensity:.5,roughness:.35}),
    gold:new THREE.MeshStandardMaterial({color:0xe2b850,metalness:.32,roughness:.5}),
  };
  const part=(name,x,y,z,w,h,d)=>{const mesh=new THREE.Mesh(box,materials[name]);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);rig.add(mesh);return mesh};
  part('coat',0,.68,-.12,1.25,.75,1.24);part('fleece',0,1.10,-.12,1.15,.22,1.12);
  for(const x of [-.46,.46])for(const z of [-.48,.30]){part('dark',x,.25,z,.30,.48,.32);part('horn',x,.08,z+.04,.34,.15,.37)}
  part('dark',0,1.25,.70,.72,.70,.58);part('fleece',0,1.65,.67,.70,.15,.54);
  part('horn',0,1.09,1.04,.55,.25,.22);for(const x of [-.22,.22])part('eye',x,1.40,1.02,.12,.14,.08);
  // Partial curls meet thick roots on the head so they read as horns, not rings.
  for(const sign of [-1,1]){part('horn',sign*.49,1.68,.87,.36,.32,.30);const loop=new THREE.Mesh(hornLoop,materials.horn);loop.position.set(sign*.72,1.76,.98);if(sign<0)loop.rotation.y=Math.PI;rig.add(loop);part('horn',sign*.57,1.99,.99,.18,.18,.20)}
  for(const z of [-.46,-.08,.28])part('gold',0,1.24,z,.88,.09,.10);
  // A raised shield diamond and cross persist above the back while invulnerable.
  const plate=part('shield',0,1.37,-.25,.30,.16,.30);plate.rotation.y=Math.PI/4;
  const crossA=part('eye',0,1.44,-.25,.96,.08,.12),crossB=part('eye',0,1.44,-.25,.12,.08,.96);
  let disposed=false;
  return Object.freeze({group,rig,setShielded(value){if(disposed)return;plate.visible=crossA.visible=crossB.visible=Boolean(value)},dispose(){if(disposed)return;disposed=true;box.dispose();hornLoop.dispose();for(const material of Object.values(materials))material.dispose();group.clear()}});
}
