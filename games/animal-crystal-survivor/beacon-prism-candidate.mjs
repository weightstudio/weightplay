// Isolated Stage 36 design experiment. This file is not integrated into play.
const sides = Object.freeze(['A','B']);

export function prismWaveStart() {
  return {elapsed:0, chosen:null, laneA:{warn:6,life:8.4,cancelled:false}, laneB:{warn:8,life:10.4,cancelled:false}};
}

export function prismWaveStep(previous, {dt=0,pulse=null}={}) {
  if(!Number.isFinite(dt)||dt<0||dt>.25)throw new RangeError('Invalid prism step');
  if(pulse!==null&&!sides.includes(pulse))throw new RangeError('Unknown beacon');
  const next={...previous,elapsed:previous.elapsed+dt,laneA:{...previous.laneA},laneB:{...previous.laneB}},events=[];
  if(pulse!==null&&next.chosen===null){
    const lane=next[`lane${pulse}`];
    if(lane.cancelled||lane.life<=0)throw new Error('Selected lane is no longer active');
    next.chosen=pulse;lane.cancelled=true;events.push(`lane-cancelled:${pulse}`);
  }
  for(const id of sides){const lane=next[`lane${id}`];if(lane.cancelled)continue;lane.warn=Math.max(0,lane.warn-dt);lane.life=Math.max(0,lane.life-dt)}
  return {state:next,events};
}

export function prismLaneDanger(state, side){
  if(!sides.includes(side))throw new RangeError('Unknown lane');
  const lane=state[`lane${side}`];return !lane.cancelled&&lane.warn<=0&&lane.life>0;
}

export function prismWaveObjective({pulses,chosen,waveCleared,waveGoal}){
  if(!Number.isInteger(pulses)||pulses<0||!Number.isInteger(waveCleared)||waveCleared<0||!Number.isInteger(waveGoal)||waveGoal<1)throw new RangeError('Invalid objective');
  return pulses>=1&&sides.includes(chosen)&&waveCleared>=waveGoal;
}
