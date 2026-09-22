const clamp=t=>Math.max(0,Math.min(1,t));
export const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
function hermite(t,a,b,va=0,vb=0,duration=1){
 t=clamp(t);const t2=t*t,t3=t2*t;
 return (2*t3-3*t2+1)*a+(t3-2*t2+t)*va*duration+(-2*t3+3*t2)*b+(t3-t2)*vb*duration;
}
// Shoulder pitch: the haft hangs below the hand, lifts overhead, then chops
// forward/down in the sagittal plane. Contact stays at simulation time 0.30s.
export function axePose(seconds,start=0,rest=0){
 const keys=[[0,start,0],[.18,-2.28,0],[.22,-2.30,0],[.30,-1.20,16],[.355,-.48,0],[.40,-.48,0],[.62,rest,0]];
 for(let i=1;i<keys.length;i++)if(seconds<keys[i][0]){const [a,x,v]=keys[i-1],[b,y,w]=keys[i];return hermite((seconds-a)/(b-a),x,y,v,w,b-a);}
 return rest;
}
export function chopBody(seconds){
 const lift=ease(seconds/.18)*(1-ease((seconds-.22)/.08));
 const drive=ease((seconds-.22)/.08)*(1-ease((seconds-.4)/.22));
 return {elbow:-.12*lift+.06*drive,lean:-.065*lift+.16*drive,drop:-.045*drive,brace:.6*lift+.3*drive};
}
export function enemyWind(progress){return progress<.72?hermite(progress/.72,0,-2):hermite((progress-.72)/.28,-2,1.1);}
export function enemyStroke(seconds){return seconds<.08?hermite(seconds/.08,1.1,1.35):hermite((seconds-.08)/.28,1.35,0);}
