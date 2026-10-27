// Session-only campaign confirmation. It does not track streaks or rewards.
export function createProgressConfirmation(total){
  const pending=new Map(),tickets=new WeakMap();let generation=0;
  const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
  const valid=n=>Number.isSafeInteger(n)&&n>=1;
  function win(stage,attempts){
    if(!valid(stage)||stage>total||!valid(attempts))throw new TypeError('invalid stage result');
    pending.set(stage,Math.min(pending.get(stage)??attempts,attempts));generation++;
  }
  function ticket(){const value=Object.freeze({});tickets.set(value,generation);return value;}
  function confirm(proof){
    if(!record(proof)||!record(proof.ticket)||!tickets.has(proof.ticket)||tickets.get(proof.ticket)!==generation)return false;
    tickets.delete(proof.ticket);
    if(proof.readbackCompleted!==true||typeof proof.expectedBytes!=='string'||proof.expectedBytes!==proof.readBytes)return false;
    try{
      const data=JSON.parse(proof.readBytes);
      if(!record(data)||data.version!==18||!record(data.cleared))return false;
      let unlocked=Math.min(6,total);
      while(unlocked<total&&data.cleared[String(unlocked)]?.win===true)unlocked++;
      for(const [stage,attempts] of pending){
        const row=data.cleared[String(stage)];
        if(stage>unlocked||!record(row)||row.win!==true||!valid(row.attempts)||row.attempts>attempts)return false;
      }
      pending.clear();generation++;return true;
    }catch{return false;}
  }
  function stages(){return [...pending.keys()].sort((a,b)=>a-b);}
  return Object.freeze({win,ticket,confirm,stages});
}
