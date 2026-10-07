const clamp=t=>Math.max(0,Math.min(1,t));
export const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
function hermite(t,a,b,va=0,vb=0,duration=1){
 t=clamp(t);const t2=t*t,t3=t2*t;
 return (2*t3-3*t2+1)*a+(t3-2*t2+t)*va*duration+(-2*t3+3*t2)*b+(t3-t2)*vb*duration;
}
// Shoulder pitch: the haft hangs below the hand, lifts overhead, then chops
// forward/down in the sagittal plane. Contact stays at simulation time 0.30s.
export function axePose(seconds,start=0,rest=0){
 const keys=[[0,start,0],[.18,-2.38,0],[.22,-1.8,0],[.30,-.90,8],[.39,-.32,2],[.49,-.08,0],[.52,-.08,0],[.66,rest,0]];
 for(let i=1;i<keys.length;i++)if(seconds<keys[i][0]){const [a,x,v]=keys[i-1],[b,y,w]=keys[i];return hermite((seconds-a)/(b-a),x,y,v,w,b-a);}
 return rest;
}
export function chopBody(seconds){
 const lift=ease(seconds/.18)*(1-ease((seconds-.22)/.07));
 const drive=ease((seconds-.22)/.08)*(1-ease((seconds-.49)/.17));
 return {elbow:-.18*lift+.30*drive,lean:-.08*lift+.18*drive,drop:-.03*lift-.25*drive,brace:.72*lift+.34*drive};
}
export function enemyWind(progress){return progress<.72?hermite(progress/.72,0,-2):hermite((progress-.72)/.28,-2,1.1);}
export function enemyStroke(seconds){return seconds<.08?hermite(seconds/.08,1.1,1.35):hermite((seconds-.08)/.28,1.35,0);}
