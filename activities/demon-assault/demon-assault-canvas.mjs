// Uses the same world coordinates, art and authoritative physics as WebGL.
// No gameplay state is created or spent by loading or drawing a scene.
export const RENDER_REVISION='canvas-recovery-1';
const names={boss:'demon-assault-boss-v2.png',sling:'demon-assault-sling-v2.png',scene:'demon-assault-sideview-v3.png'};
export async function loadBattleImages(){
 const images=await Promise.all(Object.entries(names).map(async([key,name])=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch(new URL(name,import.meta.url),{signal:controller.signal});
   if(!response.ok)throw new Error(`ASSET_HTTP_${response.status}:${name}`);
   const blob=await response.blob(),url=URL.createObjectURL(blob),image=new Image();
   try{await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error(`ASSET_DECODE:${name}`));controller.signal.addEventListener('abort',()=>reject(new Error(`ASSET_TIMEOUT:${name}`)),{once:true});image.src=url;});if(!image.naturalWidth||!image.naturalHeight)throw new Error(`ASSET_EMPTY:${name}`);return[key,image];}finally{URL.revokeObjectURL(url);}
  }catch(error){if(error.name==='AbortError')throw new Error(`ASSET_TIMEOUT:${name}`);if(error.message.startsWith('ASSET_'))throw error;throw new Error(`ASSET_NETWORK:${name}`);}finally{clearTimeout(timer);}
 }));
 return Object.fromEntries(images);
}
export class CanvasBattleRenderer{
 constructor(canvas,images){this.canvas=canvas;this.images=images;this.ctx=canvas.getContext('2d',{alpha:true});if(!this.ctx)throw new Error('CANVAS_UNAVAILABLE');this.info={render:{calls:0},memory:{geometries:0,textures:3}};}
 setSize(width,height){this.width=width;this.height=height;const d=Math.min(devicePixelRatio||1,1.6);this.canvas.width=Math.round(width*d);this.canvas.height=Math.round(height*d);this.ctx.setTransform(d,0,0,d,0,0);}
 render({project,scale,run,pull,shot,anchor,boss,time,spawnTime,hitTime,defeatTime,reduced}){
  const c=this.ctx;c.clearRect(0,0,this.width,this.height);this.info.render.calls++;
  const sprite=(image,x,y,w,h,alpha=1,rotation=0)=>{const p=project(x,y);c.save();c.translate(p.x,p.y);c.rotate(rotation);c.globalAlpha=Math.max(0,Math.min(1,alpha));c.drawImage(image,-w*scale/2,-h*scale/2,w*scale,h*scale);c.restore();};
  sprite(this.images.sling,anchor.x,136,80,120);
  const cleared=run?.status==='cleared',age=time-defeatTime,hit=Math.max(0,1-(time-hitTime)/.28),breath=reduced?0:Math.sin(time*1.8)*.006;
  if(!cleared||age<.75)sprite(this.images.boss,boss.x,boss.y+(reduced?0:hit*4),300*(1+breath),300*(1-breath),cleared?1-age/.75:Math.min(1,(time-spawnTime)/.35),reduced?0:hit*Math.sin(time*55)*.018);
  for(const guard of run?.defenders||[])if(guard.alive)sprite(this.images.boss,guard.x,guard.y,47,47);
  if(run?.status==='playing'){
   const p=project((shot||pull||anchor).x,(shot||pull||anchor).y),size=17*scale;c.save();c.translate(p.x,p.y);c.rotate(shot&&!reduced?time*4:.12);
   c.fillStyle='#b98a45';c.fillRect(-size*.65,-size*.65,size*1.3,size*1.3);c.fillStyle='#43bacb';c.fillRect(-size/2,-size/2,size,size);c.fillStyle='#d4ffff';c.fillRect(-size/2,-size/2,size,size*.28);c.strokeStyle='#ffe2a1';c.lineWidth=Math.max(1,2*scale);c.strokeRect(-size*.65,-size*.65,size*1.3,size*1.3);c.restore();
  }
 }
 dispose(){this.ctx.clearRect(0,0,this.width||0,this.height||0);}
}
