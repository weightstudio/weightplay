// Local-practice 3D draft. Dense combat and Art review are still required.
export function makeFerrymanArt(THREE){
  if(!THREE?.Group||!THREE?.BoxGeometry||!THREE?.MeshStandardMaterial)throw new TypeError('Three.js required');
  const group=new THREE.Group(),rig=new THREE.Group(),box=new THREE.BoxGeometry(1,1,1);group.add(rig);
  const materials={hull:new THREE.MeshStandardMaterial({color:0x374e62,roughness:.7}),trim:new THREE.MeshStandardMaterial({color:0xe0b35d,metalness:.3,roughness:.45}),
    fur:new THREE.MeshStandardMaterial({color:0x8c6e59,roughness:.78}),face:new THREE.MeshStandardMaterial({color:0xf0d6ac,roughness:.7}),
    dark:new THREE.MeshStandardMaterial({color:0x162b38,roughness:.65}),blue:new THREE.MeshStandardMaterial({color:0x48cfe8,emissive:0x0b6276,emissiveIntensity:.45,roughness:.35}),
    purple:new THREE.MeshStandardMaterial({color:0xc18aff,emissive:0x66358b,emissiveIntensity:.45,roughness:.35})};
  const part=(material,x,y,z,w,h,d)=>{const m=new THREE.Mesh(box,materials[material]);m.position.set(x,y,z);m.scale.set(w,h,d);rig.add(m);return m};
  // Low boat hull, raised animal face and offset oar make a distinct silhouette.
  part('hull',0,.35,0,1.75,.40,1.08);part('trim',0,.60,0,1.72,.10,1.02);
  part('hull',0,.26,.68,1.15,.28,.40);part('fur',0,1.06,.10,.64,.68,.60);
  part('face',0,.91,.49,.44,.22,.20);for(const x of [-.21,.21]){part('fur',x,1.48,.02,.18,.30,.20);part('dark',x,1.20,.44,.10,.11,.08)}
  part('trim',.98,.84,-.10,.12,1.28,.12);part('trim',.98,.22,-.10,.42,.30,.16);
  part('blue',-.50,.72,-.30,.25,.18,.28);part('purple',.50,.72,-.30,.25,.18,.28);
  const left=part('blue',-.68,1.04,.60,.48,.82,.12),right=part('purple',.68,1.04,.60,.48,.82,.12);
  const leftMark=part('face',-.68,1.47,.62,.36,.10,.16),rightMark=part('face',.68,1.47,.62,.36,.10,.16);
  let disposed=false;return Object.freeze({group,rig,setFacet(phase,shielded){if(disposed)return;left.visible=leftMark.visible=Boolean(shielded)&&phase===0;right.visible=rightMark.visible=Boolean(shielded)&&phase===1},dispose(){if(disposed)return;disposed=true;box.dispose();for(const m of Object.values(materials))m.dispose();group.clear()}});
}
