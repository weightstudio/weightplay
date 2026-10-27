// Cooperating Habitat tabs serialize the complete read/merge/write/readback.
// This is not a cross-key crash transaction and cannot lock an older writer.
export const HABITAT_PROGRESS_LOCK = 'weightplay-habitat-atlas-progress-v1';

export async function writeProgressLocked({locks,storage,value,writeProgress,timeoutMs=4000}) {
  const fallback={...value,journal:{...(value?.journal||{})},storageOK:false};
  if(!locks || typeof locks.request!=='function' || !storage || typeof writeProgress!=='function')return {progress:fallback,saved:false};
  const controller=new AbortController();
  let timer;
  try {
    const timeout=new Promise(resolve=>{timer=setTimeout(()=>{controller.abort();resolve({progress:fallback,saved:false});},Math.max(1,timeoutMs));});
    const request=locks.request(HABITAT_PROGRESS_LOCK,{mode:'exclusive',signal:controller.signal},()=>{
      if(controller.signal.aborted)return {progress:fallback,saved:false};
      const progress=writeProgress(storage,value);
      return {progress,saved:progress?.storageOK===true};
    });
    return await Promise.race([request,timeout]);
  } catch {
    return {progress:fallback,saved:false};
  } finally {
    clearTimeout(timer);
  }
}
