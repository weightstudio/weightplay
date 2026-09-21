import * as THREE from './vendor/three/three.module.min.js';
const TAU=Math.PI*2;
const colors=Object.fromEntries(Object.entries({amber:0xffd681,danger:0xff896f,root:0xd5a2e8,heal:0x9ef1c9}).map(([k,v])=>[k,new THREE.Color(v)]));
// One reusable, unlit, shadow-free batch. Outlines leave the forest floor visible.
export class GroundCues {
 constructor(scene){
  this.positions=new Float32Array(16384*3);this.colors=new Float32Array(this.positions.length);this.count=0;
  this.geometry=new THREE.BufferGeometry();
  this.geometry.setAttribute('position',new THREE.BufferAttribute(this.positions,3).setUsage(THREE.DynamicDrawUsage));
  this.geometry.setAttribute('color',new THREE.BufferAttribute(this.colors,3).setUsage(THREE.DynamicDrawUsage));
  this.material=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.8,depthWrite:false,side:THREE.DoubleSide});
  this.mesh=new THREE.Mesh(this.geometry,this.material);this.mesh.frustumCulled=false;this.mesh.renderOrder=1;scene.add(this.mesh);
 }
 triangle(a,b,c,color){
  if(this.count+3>this.positions.length/3)return;
  const tint=colors[color];for(const [x,z] of [a,b,c]){const i=this.count++*3;this.positions.set([x,.105,z],i);this.colors.set([tint.r,tint.g,tint.b],i);}
 }
 line(x1,z1,x2,z2,color,width=.045){
  const length=Math.hypot(x2-x1,z2-z1);if(length<.001)return;
  const dx=(z2-z1)/length*width/2,dz=-(x2-x1)/length*width/2;
  const a=[x1+dx,z1+dz],b=[x1-dx,z1-dz],c=[x2+dx,z2+dz],d=[x2-dx,z2-dz];this.triangle(a,b,c,color);this.triangle(c,b,d,color);
 }
 ring(x,z,r,color,start=0,sweep=TAU,width=.045){
  const steps=Math.max(1,Math.ceil(Math.abs(sweep)*10));
  for(let i=0;i<steps;i++){const a=start+sweep*i/steps,b=start+sweep*(i+1)/steps;this.line(x+Math.sin(a)*r,z+Math.cos(a)*r,x+Math.sin(b)*r,z+Math.cos(b)*r,color,width);}
 }
 arrow(x,z,angle,length,color,width=.045){
  const point=(side,forward)=>[x+Math.sin(angle)*forward+Math.cos(angle)*side,z+Math.cos(angle)*forward-Math.sin(angle)*side];
  this.line(...point(0,.3),...point(0,length),color,width);
  this.line(...point(-.22,length-.3),...point(0,length),color,width);this.line(...point(.22,length-.3),...point(0,length),color,width);
 }
 render(sim){
  this.count=0;this.kinds=[];
  for(const e of sim.alive())if(e.wind){
   const w=e.wind,p=Math.max(0,Math.min(1,1-w.left/w.total)),color=p>.75?'danger':'amber',angle=Math.atan2(w.dx,w.dz);this.kinds.push(w.kind);
   if(w.kind==='charge'){
    // The committed 5.04-unit run has a 1.1-unit contact radius.
    for(const side of [-1,1])this.line(e.x+Math.cos(angle)*side*1.1,e.z-Math.sin(angle)*side*1.1,e.x+Math.sin(angle)*5.04+Math.cos(angle)*side*1.1,e.z+Math.cos(angle)*5.04-Math.sin(angle)*side*1.1,color);
    for(const distance of [1.3,2.7,4.1])this.arrow(e.x+Math.sin(angle)*distance,e.z+Math.cos(angle)*distance,angle,.65,color,.065);
    this.ring(e.x+Math.sin(angle)*5.04,e.z+Math.cos(angle)*5.04,1.1,color,angle-Math.PI/2,Math.PI);
   }else if(w.kind==='shot')this.arrow(e.x,e.z,angle,4,color,.065);
   else if(w.kind==='burst'){
    const count=e.phase>=2?12:8,offset=e.phase===3?.25:0;
    this.ring(e.x,e.z,1.25,color);for(let i=0;i<count;i++)this.arrow(e.x,e.z,i*TAU/count+offset,2.5,color);
   }else if(w.kind==='roots'||w.kind==='summon'||w.kind==='heal'){
    const tint=w.kind==='heal'?'heal':'root';this.ring(e.x,e.z,1.05,tint);this.ring(e.x,e.z,.87,tint,-Math.PI,p*TAU,.08);
   }else{
    // Melee checks radial distance, so show its complete boundary, not a false cone.
    const r=w.kind==='sweep'?2.5:1.65;this.ring(e.x,e.z,r,color);
    this.ring(e.x,e.z,r-.11,color,angle-Math.PI,p*TAU,.085);
   }
  }
  for(const h of sim.hazards||[]){const color=h.delay>0?'amber':'root';this.ring(h.x,h.z,h.r,color);if(h.delay>0)this.ring(h.x,h.z,h.r-.12,color,0,TAU*(1-h.delay/.9),.08);}
  this.geometry.setDrawRange(0,this.count);this.geometry.attributes.position.needsUpdate=true;this.geometry.attributes.color.needsUpdate=true;this.mesh.visible=this.count>0;
 }
 dispose(){this.mesh.removeFromParent();this.geometry.dispose();this.material.dispose();}
}
