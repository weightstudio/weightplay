// Preserve start/result ordering even when several game actions share a task.
// observeState itself coalesces calls and reads the latest callback in a microtask.
export function createMeasurementQueue(getAnalytics){
  const pending=[];
  let draining=false;
  const drain=()=>{
    if(!pending.length){draining=false;return;}
    const snapshot=pending.shift(),api=getAnalytics()?.game;
    if(api?.observeState){
      // Old analytics implementations do not know the save gate. They may
      // measure an abandon, but must never award an unverified completion.
      const safe={...snapshot};
      if(api.supportsSavedCompletionGate!==true&&safe.ended&&safe.outcome==='win')safe.outcome='abandon';
      try{api.observeState(()=>safe);}catch{/* Optional analytics. */}
    }
    queueMicrotask(drain);
  };
  return snapshot=>{pending.push({...snapshot});if(!draining){draining=true;drain();}};
}
