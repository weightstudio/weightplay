// One short voice at a time, one lazily-created context, no idle context.
// Uses the established platform preference keys without loading a second UI.
export function createCampaignAudio({storage,AudioContext=globalThis.AudioContext||globalThis.webkitAudioContext}={}) {
 let muted=false,volume=.8,voice=null,disposed=false,generation=0;
 try{const raw=storage.getItem('weightPlayEffectsVolume'),saved=Number(raw);if(raw!==null&&Number.isFinite(saved))volume=Math.max(0,Math.min(1,saved/100));muted=storage.getItem('wonderSoundMuted')==='1'||volume===0;}catch{}
 const pending=new Set();
 function stop(){
  generation++;const old=voice;voice=null;if(!old)return;
  for(const node of old.nodes){try{node.stop()}catch{}try{node.disconnect()}catch{}}
  try{old.gain.disconnect()}catch{}
  try{const closing=Promise.resolve(old.context.close()).catch(()=>{});pending.add(closing);closing.finally(()=>pending.delete(closing));}catch{}
 }
 async function play(kind='select'){
  if(disposed||muted||!AudioContext)return;
  // Do not stack replacement contexts while a previous context is closing.
  stop();const token=generation;await Promise.all([...pending]);if(disposed||muted||token!==generation)return;
  let context;
  try{
   context=new AudioContext();const gain=context.createGain();gain.connect(context.destination);voice={context,gain,nodes:[]};
   await context.resume();if(disposed||muted||token!==generation||voice?.context!==context)return;
   const frequencies=kind==='win'?[523.25,659.25,783.99]:kind==='pair'?[659.25,880]:kind==='undo'?[440]:[740];
   const duration=kind==='win'?.38:.13,now=context.currentTime;
   gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.035*(volume||.8),now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
   let ended=0;for(const [i,frequency] of frequencies.entries()){
    const node=context.createOscillator();node.type='sine';node.frequency.setValueAtTime(frequency,now);node.connect(gain);voice.nodes.push(node);
    node.onended=()=>{try{node.disconnect()}catch{}if(++ended===frequencies.length&&voice?.context===context)stop();};
    node.start(now+i*.022);node.stop(now+duration);
   }
  }catch{if(voice?.context===context)stop();else try{await context?.close()}catch{}}
 }
 function setMuted(value){muted=Boolean(value);if(muted)stop();try{storage.setItem('wonderSoundMuted',muted?'1':'0');storage.setItem('weightPlayEffectsVolume',muted?'0':String((volume||.8)*100));}catch{}}
 async function dispose(){disposed=true;stop();await Promise.all([...pending]);}
 return Object.freeze({play,stop,setMuted,isMuted:()=>muted,dispose,stats:()=>({disposed,contexts:voice?1:0,closing:pending.size,nodes:voice?.nodes.length||0})});
}
