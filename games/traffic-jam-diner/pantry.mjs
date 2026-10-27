// Order feasibility is tiny and deterministic (at most nine remaining slots).
// It explains a consequence after an accepted choice; it does not choose food.
export function pantryWarning(stage,state){
 const slots=[];
 stage.queue.forEach(guest=>{if(state.positions[guest]<0)return;stage.guests[guest].order.slice(state.filled[guest]).forEach(slot=>slots.push({guest,choices:Array.isArray(slot)?slot:[slot]}));});
 const ordered=[...slots].sort((a,b)=>a.choices.length-b.choices.length),stock={...state.stock},failed=new Set();
 function cover(index){
  if(index===ordered.length)return true;
  const key=index+'|'+Object.keys(stock).sort().map(key=>stock[key]).join(',');if(failed.has(key))return false;
  for(const snack of ordered[index].choices)if(stock[snack]>0){stock[snack]--;const possible=cover(index+1);stock[snack]++;if(possible)return true;}
  failed.add(key);return false;
 }
 if(cover(0))return null;
 const counts={};for(const slot of slots)if(slot.choices.length===1){const snack=slot.choices[0];counts[snack]=(counts[snack]||0)+1;if(counts[snack]>(state.stock[snack]||0))return {guest:slot.guest,snack};}
 return {};
}
