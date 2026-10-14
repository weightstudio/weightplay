import {VERSION,STAGES,ANCHOR,MAX_PULL,formation,ammoLimit,AMMO_POLICY} from './demon-assault-v4-physics.mjs?v=20261014-ammo-exact-1';
export const SAVE_KEY='weightplayDemonAssaultCandidateV4';
const LOCK=SAVE_KEY+':transaction';
export function freshRun(blocks){const cap=ammoLimit(blocks);return{id:crypto.randomUUID(),stage:0,hp:STAGES[0].hp,ammo:cap,cap,blocks:cap,ammoPolicy:AMMO_POLICY,defenders:[],pending:null,status:cap?'playing':'empty',shots:0};}
export function validSave(d,{allowLegacyCapacity=false}={}){
 const r=d?.run,finite=n=>typeof n==='number'&&Number.isFinite(n);
 if(d?.version!==VERSION||!Number.isSafeInteger(d.revision)||d.revision<1||!r||typeof r.id!=='string'||!r.id||!Number.isInteger(r.stage)||r.stage<0||r.stage>=STAGES.length)return false;
 if(!Number.isInteger(r.hp)||r.hp<0||r.hp>STAGES[r.stage].hp||!Number.isSafeInteger(r.cap)||r.cap<0||!Number.isSafeInteger(r.ammo)||r.ammo<0||r.ammo>r.cap||!Number.isSafeInteger(r.blocks)||r.blocks<0||!Number.isSafeInteger(r.shots)||r.shots<0)return false;
 if(r.ammoPolicy===AMMO_POLICY){if(r.cap!==ammoLimit(r.blocks))return false;}else if(r.ammoPolicy!=null||!allowLegacyCapacity||r.cap!==60+Math.min(60,5*Math.floor(Math.log2(r.blocks+1))))return false;
 if(!['playing','cleared','empty'].includes(r.status)||(r.status==='cleared')!==(r.hp===0)||!Array.isArray(r.defenders)||r.defenders.length>5)return false;
 if(r.defenders.some(m=>!m||typeof m.id!=='string'||!finite(m.x)||m.x<0||m.x>1600||!finite(m.y)||m.y<0||m.y>670||!finite(m.r)||m.r<1||m.r>30||typeof m.alive!=='boolean'))return false;
 if(r.pending!==null){const p=r.pending;if(!p||typeof p.id!=='string'||!p.id||!Number.isSafeInteger(p.power)||p.power<1||(r.ammoPolicy===AMMO_POLICY?p.power>r.cap:![1,5,10].includes(p.power))||!finite(p.point?.x)||!finite(p.point?.y)||Math.hypot(p.point.x-ANCHOR.x,p.point.y-ANCHOR.y)>MAX_PULL+.01||p.point.x>ANCHOR.x)return false;}
 if(!d.milestones||Array.isArray(d.milestones)||typeof d.milestones!=='object'||Object.entries(d.milestones).some(([k,m])=>!m||!Number.isInteger(m.stage)||!STAGES[m.stage]||k!==VERSION+':stage:'+m.stage||m.kind!=='preview-only'||m.paid!==false||m.rewardPlanned!==STAGES[m.stage].reward||!finite(m.recordedAt)))return false;
 return true;
}
export function readSave(){try{const d=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(validSave(d))return d;}catch{}return null;}
export async function transaction(change){
 // No localStorage lease fallback: without Web Locks this preview is read-only.
 if(!navigator.locks)throw new Error('WEB_LOCKS_REQUIRED');
 return navigator.locks.request(LOCK,async()=>{const old=readSave(),next=change(old);if(!next)return{state:old,changed:false};next.version=VERSION;next.revision=(old?.revision||0)+1;localStorage.setItem(SAVE_KEY,JSON.stringify(next));return{state:next,changed:true};});
}
export function nextStage(d){const n=d.run.stage+1;if(n>=STAGES.length)return null;d.run.stage=n;d.run.hp=STAGES[n].hp;d.run.defenders=formation(n);d.run.pending=null;d.run.status=d.run.ammo<1?'empty':'playing';return d;}
export function launchShot(d,{revision,runId,id,point,power}){const r=d?.run;if(!r||d.revision!==revision||r.id!==runId||r.pending||r.status!=='playing'||!Number.isSafeInteger(power)||power<1||power>r.ammo||typeof id!=='string'||!id||!Number.isFinite(point?.x)||!Number.isFinite(point?.y)||point.x>ANCHOR.x||Math.hypot(point.x-ANCHOR.x,point.y-ANCHOR.y)>MAX_PULL+.01||Math.hypot(point.x-ANCHOR.x,point.y-ANCHOR.y)<12)return null;r.ammo-=power;r.shots++;r.pending={id,point:{...point},power};return d;}
export function settle(d,id,event){if(!d||d.run.pending?.id!==id)return null;const r=d.run,committedPower=r.pending.power;r.pending=null;if(event.kind==='boss'){const damage=Math.min(r.hp,committedPower);r.hp-=damage;if(r.hp===0){r.status='cleared';const key=VERSION+':stage:'+r.stage;if(!d.milestones[key])d.milestones[key]={stage:r.stage,rewardPlanned:STAGES[r.stage].reward,recordedAt:Date.now(),kind:'preview-only',paid:false};}}else if(event.kind==='minion'){const m=r.defenders.find(m=>m.id===event.id);if(m)m.alive=false;}if(r.ammo<1&&r.status==='playing')r.status='empty';return d;}
