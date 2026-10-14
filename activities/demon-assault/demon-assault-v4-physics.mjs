// Side elevation: x right, y up, gravity down. One authoritative fixed-step model.
export const VERSION='demon-assault-sideview-camera-candidate-4';
export const WORLD=Object.freeze({width:1600,height:560,ground:80});
export const STAGES=Object.freeze([{hp:20,reward:3},{hp:30,reward:5},{hp:40,reward:8}]);
export const ANCHOR=Object.freeze({x:170,y:165});
export const BOSS=Object.freeze({x:1345,y:230});
export const MAX_PULL=88,GRAVITY=370,SPEED=13.5,RADIUS=9,STEP=1/180;
export const AMMO_POLICY='collection-exact-1';
export const ammoLimit=n=>Math.min(Number.MAX_SAFE_INTEGER,Math.max(0,Math.floor(Number(n)||0)));
export function formation(stage){return(stage===0?[]:stage===1?[[640,115],[640,205],[720,155],[720,290]]:[[605,115],[605,235],[690,170],[690,320],[755,115]]).map(([x,y],i)=>({id:`${stage}:${i}`,x:x+500,y,r:22,alive:true}));}
export function pullPoint(p){let x=Math.min(0,p.x-ANCHOR.x),y=p.y-ANCHOR.y,len=Math.hypot(x,y);if(len>MAX_PULL){x*=MAX_PULL/len;y*=MAX_PULL/len;}return{x:ANCHOR.x+x,y:ANCHOR.y+y};}
export function makeShot(p,power,id){return{id,power,x:p.x,y:p.y,vx:(ANCHOR.x-p.x)*SPEED,vy:(ANCHOR.y-p.y)*SPEED,age:0,bounces:0,done:false,trail:[]};}
const rectangles=[[800,120,885,310],[757,150,802,245],[883,150,930,245],[818,310,868,355]].map(([l,b,r,t])=>[l+500,b,r+500,t]);
const nearRect=(x,y,r,b)=>Math.hypot(x-Math.max(b[0],Math.min(b[2],x)),y-Math.max(b[1],Math.min(b[3],y)))<=r;
export function tickShot(s,minions,dt=STEP){
 if(s.done)return null;s.age+=dt;s.vy-=GRAVITY*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;
 for(const m of minions)if(m.alive&&Math.hypot(s.x-m.x,s.y-m.y)<m.r+RADIUS){s.done=true;return{kind:'minion',id:m.id,x:s.x,y:s.y};}
 if(rectangles.some(b=>nearRect(s.x,s.y,RADIUS,b))){s.done=true;return{kind:'boss',damage:s.power,x:s.x,y:s.y};}
 if(s.y<WORLD.ground+RADIUS&&s.vy<0){s.y=WORLD.ground+RADIUS;s.vy*=-.7;s.vx*=.86;s.bounces++;if(s.bounces>3||Math.abs(s.vx)<65){s.done=true;return{kind:'miss',x:s.x,y:s.y};}return{kind:'bounce',x:s.x,y:s.y};}
 if(s.x>WORLD.width-25&&s.vx>0){s.x=WORLD.width-25;s.vx*=-.78;s.bounces++;return{kind:'bounce',x:s.x,y:s.y};}
 if(s.x<0||s.y>650||s.age>6){s.done=true;return{kind:'miss',x:s.x,y:s.y};}return null;
}
export function trace(p,power,minions){const s=makeShot(p,power,'prediction'),points=[],events=[];for(let i=0;i<1080&&!s.done;i++){const e=tickShot(s,minions);if(i%12===0)points.push({x:s.x,y:s.y});if(e)events.push(e);}return{points,events};}
