// Render-only joint pose. Contact time comes from the fixed-step battle;
// no animation callback can hit a target or change a saved dog.
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function bitePose(unit,clock,reduced=false){
 const pose={phase:'idle',jaw:0,reach:0,crouch:0,pitch:0,head:0,front:0,hind:0,tail:0};
 if(unit.hp<=0)return pose;
 if(unit.windup>0){
  const t=Math.max(0,Math.min(1,1-unit.windup/.18));
  pose.phase=t<.56?'open':'snap';
  const load=ease(t/.42),snap=ease((t-.56)/.44);
  pose.jaw=.78*load*(1-snap);pose.reach=-.11*load+.35*snap;
  pose.crouch=-.075*load+.12*snap;pose.pitch=.13*load-.24*snap;
  pose.head=-.12*load+.22*snap;pose.front=.3*load-.94*snap;
  pose.hind=-.25*load+.68*snap;pose.tail=.15*load;
 }else if(Number.isFinite(unit.biteAt)&&clock-unit.biteAt>=0&&clock-unit.biteAt<.32){
  const t=(clock-unit.biteAt)/.32,settle=1-ease(t);
  pose.phase=t<.2?'contact':'recover';pose.reach=.24*settle;
  pose.crouch=.045*settle;pose.pitch=-.11*settle;pose.head=.1*settle;
  pose.front=-.64*settle;pose.hind=.43*settle;pose.tail=.15*settle;
 }
 if(reduced){pose.reach=0;pose.crouch=0;pose.pitch=0;pose.head=0;pose.front=0;pose.hind=0;pose.tail=0;pose.jaw*=.45;}
 return pose;
}
