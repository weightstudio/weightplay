// One pending search, one owned worker. Reset/exit must call cancel().
export class ChessAI {
  constructor({createWorker=()=>new Worker(new URL('./chess-worker.mjs',import.meta.url),{type:'module'})}={}){this.createWorker=createWorker;this.pending=null;this.sequence=0;}
  cancel(){this.pending?.finish({cancelled:true});}
  request(fen,options={}){
    this.cancel();const id=++this.sequence;
    return new Promise(resolve=>{
      let worker,timer,finished=false;
      const finish=result=>{if(finished)return;finished=true;clearTimeout(timer);if(worker){worker.onmessage=null;worker.onerror=null;worker.terminate();}if(this.pending?.id===id)this.pending=null;resolve(result);};
      this.pending={id,finish};
      try{
        worker=this.createWorker();
        worker.onmessage=({data})=>{if(data.id!==id||data.fen!==fen)return;finish(data);};
        worker.onerror=()=>finish({error:'SEARCH_FAILED'});
        timer=setTimeout(()=>finish({error:'SEARCH_TIMEOUT'}),1500);
        worker.postMessage({id,fen,options});
      }catch{finish({error:'WORKER_UNAVAILABLE'});}
    });
  }
}
