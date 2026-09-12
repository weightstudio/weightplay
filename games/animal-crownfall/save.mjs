import {clone,newState,step} from './core.mjs';
import {LEVELS} from './levels.mjs';
export const SAVE_KEY='weightplay-crownfall-v1';
export function normalize(raw) {
 const result={schema:1,unlocked:1,badges:{},best:{},run:null,reduced:false};
 if(!raw||typeof raw!=='object')return result;
 result.unlocked=Number.isInteger(raw.unlocked)?Math.min(30,Math.max(1,raw.unlocked)):1;
 result.reduced=raw.reduced===true;
 for(let n=1;n<=30;n++){if(Array.isArray(raw.badges?.[n]))result.badges[n]=[0,1,2].map(i=>raw.badges[n][i]===true);if(Number.isInteger(raw.best?.[n])&&raw.best[n]>0&&raw.best[n]<1000)result.best[n]=raw.best[n];if(result.badges[n]?.[0])result.unlocked=Math.max(result.unlocked,Math.min(30,n+1));}
 // Resume is reconstructed from legal actions, never trusted arbitrary actor power.
 const r=raw.run;
 if(r&&Number.isInteger(r.level)&&r.level>=1&&r.level<=result.unlocked&&Array.isArray(r.actions)&&r.actions.length<=128){let state=newState(LEVELS[r.level-1]),valid=true;for(const a of r.actions){if(!Array.isArray(a)||a.length!==2||!a.every(Number.isInteger)){valid=false;break;}const next=step(state,...a,{trace:false});if(!next.valid){valid=false;break;}state=next.state;}if(valid&&state.status==='playing')result.run={level:r.level,actions:clone(r.actions),usedHint:r.usedHint===true};}
 return result;
}
export function award(save,level,moves,usedHint,par){save.unlocked=Math.max(save.unlocked,Math.min(30,level+1));const next=[true,!usedHint,moves<=par];save.badges[level]=next.map((v,i)=>v||!!save.badges[level]?.[i]);save.best[level]=Math.min(save.best[level]||Infinity,moves);save.run=null;return save;}
