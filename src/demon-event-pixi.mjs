import {bones,parts,channels,duration,interpolate} from './demon-event-rig.mjs';

// Pinned local MIT runtime, requested only after the entrance becomes visible.
let runtimePromise;
function loadRuntime(){
  if(window.PIXI){if(window.PIXI.VERSION!=='8.22.0')return Promise.reject(Error('Incompatible Pixi runtime'));return Promise.resolve(window.PIXI);}
  if(!runtimePromise)runtimePromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='/assets/demon-event-pixi/pixi-8.22.0.min.js';script.async=true;
    const timer=setTimeout(()=>finish(Error('Pixi load timeout')),12000);
    function finish(error){clearTimeout(timer);script.onload=script.onerror=null;script.remove();error?reject(error):resolve(window.PIXI);}
    script.onload=()=>finish(window.PIXI?.VERSION==='8.22.0'?null:Error('Pixi unavailable'));script.onerror=()=>finish(Error('Pixi failed'));document.head.append(script);
  });
  return runtimePromise;
}

export async function mountDemonEventArt(element,{isCurrent,signal}){
  const PIXI=await loadRuntime();if(!isCurrent())return null;
  const app=new PIXI.Application(),textures=[],bitmaps=[];let destroyed=false,resizeObserver;
  const resolution=()=>Math.min(1,Math.max(.25,element.getBoundingClientRect().width*Math.min(devicePixelRatio||1,2)/768));
  function destroy(){if(destroyed)return;destroyed=true;resizeObserver?.disconnect();element.removeAttribute('data-pixi-ready');try{app.destroy(true,{children:true});}catch{}for(const t of textures)t.destroy(true);for(const b of bitmaps)b.close();}
  try{
    await app.init({width:768,height:768,resolution:resolution(),autoDensity:false,preference:'webgl',antialias:true,backgroundAlpha:0,autoStart:false});
    if(!isCurrent()){destroy();return null;}
    async function loadTexture(name){const response=await fetch('/assets/demon-event-pixi/'+name,{signal});if(!response.ok)throw Error('Art failed');const bitmap=await createImageBitmap(await response.blob());bitmaps.push(bitmap);if(!isCurrent())throw Error('Art no longer visible');const texture=new PIXI.Texture({source:new PIXI.ImageSource({resource:bitmap})});textures.push(texture);return texture;}
    const loaded=await Promise.allSettled([loadTexture('demon-layers.webp'),loadTexture('portal.webp')]);
    const failed=loaded.find(x=>x.status==='rejected');if(failed)throw failed.reason;
    if(!isCurrent()){destroy();return null;}
    const layerTexture=loaded[0].value,background=new PIXI.Sprite(loaded[1].value);background.width=background.height=768;app.stage.addChild(background);
const joints=new Map();for(const [name,parent,x,y]of bones){const c=new PIXI.Container();c.label=name;c.position.set(x,y);const record={name,parent,container:c,x,y,r:0};joints.set(name,record);(parent?joints.get(parent).container:app.stage).addChild(c);}
const artLayer=new PIXI.Container();app.stage.addChild(artLayer);const edges=[0,313,627,940,1254],meshes=[];for(const spec of parts){const positions=[],uvs=[],indices=[];const col=spec.cell%4,row=Math.floor(spec.cell/4),inset=row===1?30:row>0?12:0;const rx=edges[col],ry=edges[row]+inset,rw=edges[col+1]-rx,rh=edges[row+1]-ry;for(let y=0;y<spec.ny;y++)for(let x=0;x<spec.nx;x++){const u=x/(spec.nx-1),v=y/(spec.ny-1);positions.push((u-.5)*spec.w,(v-.5)*spec.h);uvs.push((rx+u*rw)/1254,(ry+v*rh)/1254);}for(let y=0;y<spec.ny-1;y++)for(let x=0;x<spec.nx-1;x++){const a=y*spec.nx+x,b=a+spec.nx;indices.push(a,b,a+1,a+1,b,b+1);}const mesh=new PIXI.MeshSimple({texture:layerTexture,vertices:new Float32Array(positions),uvs:new Float32Array(uvs),indices:new Uint32Array(indices)});mesh.position.set(0,0);mesh.alpha=spec.alpha??1;if(spec.add)mesh.blendMode='add';mesh.label=spec.name;mesh.autoUpdate=true;artLayer.addChild(mesh);meshes.push({spec,mesh,rest:new Float32Array(positions),triangles:indices.length/3});}
const eyeMesh=meshes.find(x=>x.spec.kind==='eyes').mesh,eyeMask=new PIXI.Graphics();artLayer.addChild(eyeMask);eyeMesh.mask=eyeMask;
let time=0,frames=0,blinkOpen=1;const reduced={matches:false};
function blink(t){let v=1;for(const start of [2.15,6.65]){const d=t-start;if(d>=0&&d<.34){const x=d/.34;v=Math.min(v,1-.97*Math.pow(Math.sin(Math.PI*x),1.2));}}return v;}
function update(dt){if(!reduced.matches)time+=Math.min(dt,.05);const t=time%duration;for(const j of joints.values()){j.container.position.set(j.x,j.y);j.container.rotation=0;j.container.scale.set(1,1);j.r=0;}for(const channel of channels){const j=joints.get(channel.bone),v=interpolate(channel.keys,reduced.matches?0:t);if(channel.property==='r'){j.r=v;j.container.rotation=v;}else if(channel.property==='y')j.container.y=j.y+v;else if(channel.property==='sx')j.container.scale.x=v;else if(channel.property==='sy')j.container.scale.y=v;}
 for(const j of joints.values()){const o=j.container.toGlobal(new PIXI.Point()),x=j.container.toGlobal(new PIXI.Point(1,0)),y=j.container.toGlobal(new PIXI.Point(0,1));j.world={a:x.x-o.x,b:x.y-o.y,c:y.x-o.x,d:y.y-o.y,tx:o.x,ty:o.y};}
 const breath=(joints.get('chest').container.scale.y-1)/.035;
 for(const {spec,mesh,rest}of meshes){const out=mesh.vertices;for(let i=0;i<rest.length;i+=2){let x=rest[i],y=rest[i+1],u=x/spec.w+.5,v=y/spec.h+.5;const joint=spec.joint?joints.get(spec.joint).r:0;if(spec.kind==='chest'){const weight=1-v;x*=1+.022*breath*weight;y-=3.8*breath*Math.sin(v*Math.PI);}else if(spec.kind==='arm'){const w=Math.max(0,(v-.22)/.78);x+=Math.sin(joint)*spec.h*.85*w*w;y-=(1-Math.cos(joint))*spec.h*w;}else if(spec.kind==='claw'){const w=Math.pow(Math.max(0,(v-.25)/.75),2),a=joint*w,dx=x,dy=y+spec.h*.12;x=Math.cos(a)*dx-Math.sin(a)*dy;y=Math.sin(a)*dx+Math.cos(a)*dy-spec.h*.12;}else if(spec.kind==='horn'){const w=Math.pow(1-v,2);x+=joint*spec.h*.8*w;}else if(spec.kind==='head'){const jaw=Math.max(0,(v-.55)/.45);y+=1.9*breath*jaw*jaw;}else if(spec.kind==='body'){x*=1+.009*breath*Math.sin(v*Math.PI);}const m=joints.get(spec.bone).world,px=x+(spec.x||0),py=y+(spec.y||0);out[i]=m.a*px+m.c*py+m.tx;out[i+1]=m.b*px+m.d*py+m.ty;}mesh.geometry.getBuffer('aPosition').update();}
 const em=joints.get('eyes').world;eyeMask.setFromMatrix(new PIXI.Matrix(em.a,em.b,em.c,em.d,em.tx,em.ty));blinkOpen=reduced.matches?1:blink(t);eyeMask.clear();eyeMask.ellipse(-41,-22,36,Math.max(.8,18*blinkOpen)).ellipse(41,-22,36,Math.max(.8,18*blinkOpen)).fill(0xffffff);
 frames++;
}

    app.ticker.maxFPS=30;app.ticker.add(t=>update(t.deltaMS/1000));update(0);app.render();
    if(!isCurrent()){destroy();return null;}
    app.canvas.setAttribute('aria-hidden','true');app.canvas.dataset.demonPixi=PIXI.VERSION;app.canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';app.canvas.addEventListener('webglcontextlost',destroy,{once:true});element.append(app.canvas);element.setAttribute('data-pixi-ready','');
    if('ResizeObserver' in window){resizeObserver=new ResizeObserver(()=>{if(!destroyed)app.renderer.resize(768,768,resolution());});resizeObserver.observe(element);}
    app.start();
    return {destroy};
  }catch(error){destroy();throw error;}
}
