// One pending search, one owned worker. Reset/exit must call cancel().
export class ChessAI {
  constructor({createWorker=()=>new Worker(new URL('./chess-worker.mjs',import.meta.url),{type:'module'}),setTimer=(...args)=>globalThis.setTimeout(...args),clearTimer=id=>globalThis.clearTimeout(id)}={}){this.createWorker=createWorker;this.setTimer=setTimer;this.clearTimer=clearTimer;this.pending=null;this.sequence=0;}
  cancel(){this.pending?.finish({cancelled:true});}
  request(fen,options={}){
    this.cancel();const id=++this.sequence;
    return new Promise(resolve=>{
      let worker,timer,finished=false,phase='STARTING';
      const finish=result=>{if(finished)return;finished=true;this.clearTimer(timer);if(worker){worker.onmessage=null;worker.onerror=null;worker.onmessageerror=null;worker.terminate();}if(this.pending?.id===id)this.pending=null;resolve(result);};
      this.pending={id,finish};
      try{
        worker=this.createWorker();
        worker.onmessage=({data})=>{
          if(finished||!data)return;
          if(data.type==='READY'&&phase==='STARTING'){
            phase='SEARCHING';this.clearTimer(timer);
            timer=this.setTimer(()=>finish({error:'SEARCH_TIMEOUT'}),1500);
            try{worker.postMessage({id,fen,options});}catch{finish({error:'WORKER_UNAVAILABLE'});}
            return;
          }
          if(phase!=='SEARCHING'||data.id!==id||data.fen!==fen)return;finish(data);
        };
        worker.onerror=()=>finish({error:'SEARCH_FAILED'});
        worker.onmessageerror=()=>finish({error:'INVALID_WORKER_MESSAGE'});
        timer=this.setTimer(()=>finish({error:'WORKER_START_TIMEOUT'}),8000);
      }catch{finish({error:'WORKER_UNAVAILABLE'});}
    });
  }
}
