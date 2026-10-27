// Chapter 2 authored source candidate. Not imported by the v22 runtime: art,
// localized cues, storage/reward integration and natural play remain gated.
const rows = [
  [31,'gate-lesson',[['L',0]],{}],
  [32,'crossing-choice',[['L',-2],['R',2]],{pads:[[0,0]]}],
  [33,'moving-approach',[['R',1]],{bumpers:[[0,0]]}],
  [34,'covered-corner',[['L',2]],{cover:[[-1,-2],[1,2]]}],
  [35,'switchback-captain',[['L',-2],['R',2]],{double:true,boss:35}],
  [36,'pulse-opening',[['L',0]],{pulse:true,predict:true}],
  [37,'blocked-echo',[['R',-2]],{pulse:true,predict:true,bumpers:[[0,0]]}],
  [38,'core-or-gate',[['L',2],['R',-2]],{pulse:true,predict:true,pads:[[0,0]]}],
  [39,'double-echo',[['L',-1]],{pulse:true,predict:true,pulseWaves:2,bumpers:[[-1.5,-1],[1.5,1]]}],
  [40,'echo-bell',[['R',1]],{pulse:true,predict:true,pulseWaves:2,boss:40}],
  [41,'field-escape',[['L',0]],{magnet:true}],
  [42,'covered-pull',[['R',-2]],{magnet:true,cover:[[-1,-2],[1,2]]}],
  [43,'core-after-pull',[['L',-2],['R',2]],{magnet:true,pads:[[0,0]]}],
  [44,'moving-field',[['L',2]],{magnet:true,bumpers:[[0,0]]}],
  [45,'polarity-ram',[['R',0]],{magnet:true,double:true,boss:45}],
  [46,'locked-reversal',[['L',-2]],{predict:true}],
  [47,'covered-forecast',[['R',2]],{predict:true,cover:[[-1,-2],[1,2]]}],
  [48,'two-reversals',[['L',0],['R',0]],{predict:true,pads:[[0,0]]}],
  [49,'ring-and-reversal',[['R',-1]],{predict:true,pulse:true,bumpers:[[0,0]]}],
  [50,'prism-pursuer',[['L',1]],{predict:true,double:true,boss:50}],
  [51,'shield-choice',[['L',0]],{chargedShield:true,pads:[[0,0]]}],
  [52,'ring-shield',[['R',-2]],{chargedShield:true,pulse:true,predict:true,pads:[[2.6,0]],cover:[[-1,-2],[1,2]]}],
  [53,'pull-shield',[['L',2]],{chargedShield:true,magnet:true,pads:[[-2,-1],[2,1]]}],
  [54,'moving-shield',[['L',-2],['R',2]],{chargedShield:true,pads:[[0,0]],bumpers:[[-1.5,-1],[1.5,1]]}],
  [55,'latchkeeper',[['R',0]],{chargedShield:true,pulse:true,predict:true,pulseWaves:2,pads:[[-2,0],[2,0]],boss:55}],
  [56,'relay-field',[['L',1]],{magnet:true,pulse:true}],
  [57,'armored-reversal',[['R',-1]],{predict:true,armored:true,pads:[[0,0]]}],
  [58,'shield-relay',[['L',-2],['R',2]],{chargedShield:true,pulse:true,predict:true,pads:[[-2,0],[2,0]],bumpers:[[0,0]]}],
  [59,'relay-rehearsal',[['L',0]],{predict:true,double:true,pads:[[0,0]],cover:[[-1,-2],[1,2]]}],
  [60,'relay-regent',[['L',-2],['R',2]],{predict:true,armored:true,relayFinal:true,pads:[[-2,0],[2,0]],boss:60}]
];
// hp, speed, windup, recovery, contact damage, arena color. These values are
// candidates requiring natural fresh/grown play and are not acceptance data.
const stats=[
  [125,1.3,1.25,1.8,10,0x6fb8b3],[135,1.35,1.2,1.8,10,0x7fc4b1],[145,1.4,1.15,1.8,11,0x7db8c2],[150,1.4,1.15,1.9,11,0x89a7c6],[180,1.45,1.2,2,11,0xda9ea6],
  [135,1.25,1.2,1.9,10,0x91b7dc],[145,1.3,1.15,1.9,11,0x84b2d1],[150,1.3,1.15,1.9,11,0x8ebccc],[160,1.3,1.2,2,11,0xa0b4d7],[195,1.3,1.25,2.1,11,0xd3addb],
  [140,1.4,1.2,1.9,11,0xbda0ca],[150,1.45,1.2,1.9,11,0xc39fc2],[160,1.45,1.2,2,12,0xb6a9d2],[165,1.45,1.2,2,12,0xa6aed2],[205,1.5,1.25,2.1,12,0xd1a2b4],
  [150,1.45,1.2,1.9,11,0xe2c182],[160,1.5,1.2,2,12,0xd5ba90],[165,1.5,1.2,2,12,0xcdbd9d],[175,1.5,1.2,2.1,12,0xc7afd2],[215,1.55,1.25,2.15,12,0xa6c0d0],
  [150,1.3,1.25,2,11,0x83c5c4],[160,1.3,1.25,2.05,11,0x94c0d2],[170,1.35,1.25,2.05,12,0x96b8c8],[175,1.35,1.25,2.1,12,0x99bdc2],[225,1.35,1.3,2.2,12,0x89cbbf],
  [175,1.45,1.25,2.1,12,0xb0a8cf],[180,1.5,1.25,2.1,12,0xb1bdc9],[185,1.4,1.3,2.15,12,0x97beca],[190,1.55,1.25,2.2,13,0xcabb94],[255,1.5,1.3,2.25,13,0xebc987]
];
const namesZh=['閘門初遇','交錯抉擇','流動進路','掩體轉角','折返隊長','脈衝空隙','阻道回聲','彈簧或閘門','雙重回響','回響鈴衛','磁場脫離','掩體牽引','牽引核心','流動磁場','極性衝鋒','鎖線折返','掩體預判','雙向折返','波紋折返','稜鏡追獵者','護盾抉擇','波環護盾','牽引護盾','流動盾道','閂鎖守衛','交替場域','裝甲折返','護盾接力','接力預演','接力王冠'];
const deepFreeze=x=>{if(x&&typeof x==='object'&&!Object.isFrozen(x)){Object.values(x).forEach(deepFreeze);Object.freeze(x)}return x};
export const RELAY_CHAPTER=deepFreeze(rows.map(([stage,name,gates,rules],index)=>{
  const [hp,speed,windup,recover,damage,color]=stats[index];
  const relayGates=gates.map(([side,z])=>({side,z}));
  return {stage,name,nameEn:name.split('-').map(word=>word[0].toUpperCase()+word.slice(1)).join(' '),nameZh:namesZh[index],gates:relayGates,encounter:{hp,speed,windup,recover,damage,color,...rules,relayGates}};
}));

const gateHints={en:'Lure the rival’s charge into the glowing gate.', 'zh-Hant':'引誘對手衝撞發光的閘門。','zh-Hans':'引诱对手冲撞发光的闸门。',ja:'相手の突進を光るゲートに誘導しよう。',ko:'상대의 돌진을 빛나는 문으로 유도하세요.',es:'Atrae la carga rival hacia la puerta brillante.','pt-BR':'Atraia a investida rival para o portão brilhante.',fr:'Attirez la charge adverse vers la porte lumineuse.',de:'Locke den Ansturm des Gegners ins leuchtende Tor.',it:'Attira la carica rivale verso il varco luminoso.',ru:'Заманите рывок соперника в светящиеся ворота.',hi:'प्रतिद्वंद्वी की टक्कर चमकते द्वार की ओर मोड़ें।',ar:'استدرج اندفاع الخصم إلى البوابة المضيئة.'};
export const relayGateHint=locale=>gateHints[locale]||gateHints.en;

// Detect the first actual charged wall crossing; runtime must apply the result
// before its ordinary wall bounce, and mark the charge as consumed itself.
export function relayGateContact({gates,phase,used,oldX,oldZ,newX,newZ,wall=3.9}={}){
  if(!Array.isArray(gates)||phase!=='charge'||used||![oldX,oldZ,newX,newZ,wall].every(Number.isFinite)||wall<=0)return null;
  const dx=newX-oldX;if(!dx)return null;
  const candidates=[];
  for(let index=0;index<gates.length;index++){
    const gate=gates[index],side=gate?.side==='L'?-1:gate?.side==='R'?1:0;
    if(!side||!Number.isFinite(gate.z)||side*dx<=0)continue;
    const t=(side*wall-oldX)/dx;if(t<0||t>1)continue;
    const z=oldZ+(newZ-oldZ)*t;
    if(Math.abs(z-gate.z)<=.9)candidates.push({index,t,side:gate.side,z});
  }
  candidates.sort((a,b)=>a.t-b.t||a.index-b.index);
  return candidates.length?{...candidates[0],damage:8,recovery:1.5,shieldBreak:2.5}:null;
}
