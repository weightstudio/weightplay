// Isolated Stage 49 draft: a single charge chooses A (shield) or B (heat).
// The host must atomically apply the emitted effect; no damage or save here.
export function makeShelterChoice(){return {stage:49,charge:0,dwell:0,dwellStation:null,completed:0,pulses:0,lastPulse:null,chosen:null}}
export function makeShelterHeat(){return {kind:'lane',x:512,y:880,width:220,height:400,warn:2.8,life:16,damage:8,tick:0,color:'#ec7734',beaconShelterHeat:true}}
export function stepShelterChoice(previous,{dt=0,pickup=false,damaged=false,nearBeacon=null,shieldReady=false,heatReady=false}={}){
  if(!previous||previous.stage!==49||!Number.isFinite(dt)||dt<0||dt>.25||!Number.isFinite(previous.charge)||previous.charge<0||previous.charge>18||!Number.isFinite(previous.dwell)||previous.dwell<0||previous.dwell>=1.2||![0,1].includes(previous.completed)||previous.pulses!==previous.completed||![null,'A','B'].includes(previous.dwellStation)||![null,'A','B'].includes(previous.lastPulse)||![null,'shield','heat'].includes(previous.chosen)||typeof pickup!=='boolean'||typeof damaged!=='boolean'||typeof shieldReady!=='boolean'||typeof heatReady!=='boolean'||![null,'A','B'].includes(nearBeacon))throw new RangeError('invalid choice step');
  if(previous.completed===0&&(previous.lastPulse!==null||previous.chosen!==null)||previous.completed===1&&(previous.charge!==0||previous.dwell!==0||previous.dwellStation!==null||!((previous.lastPulse==='A'&&previous.chosen==='shield')||(previous.lastPulse==='B'&&previous.chosen==='heat'))))throw new RangeError('invalid choice history');
  if((!previous.charge&&(previous.dwell!==0||previous.dwellStation!==null))||(previous.dwell>0&&previous.dwellStation===null))throw new RangeError('invalid choice dwell');
  const next={...previous},events=[];
  if(damaged&&next.charge>0){next.charge=0;next.dwell=0;next.dwellStation=null;events.push('charge-lost')}
  if(next.charge>0){next.charge=Math.max(0,next.charge-dt);if(!next.charge){next.dwell=0;next.dwellStation=null;events.push('charge-expired')}}
  if(pickup&&!damaged&&!next.charge&&!next.completed){next.charge=18;events.push('charge-picked-up')}
  const ready=nearBeacon==='A'?shieldReady:nearBeacon==='B'?heatReady:false;
  if(next.charge&&!next.completed&&ready){if(next.dwellStation!==nearBeacon)next.dwell=0;next.dwellStation=nearBeacon;next.dwell+=dt;if(next.dwell+1e-9>=1.2){next.charge=0;next.dwell=0;next.dwellStation=null;next.completed=1;next.pulses++;next.lastPulse=nearBeacon;next.chosen=nearBeacon==='A'?'shield':'heat';events.push(next.chosen==='shield'?'shield-pulse':'heat-pulse')}}else{next.dwell=0;next.dwellStation=null}
  return {state:next,events};
}
