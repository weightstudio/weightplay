import {STAGES} from './demon-assault-v4-physics.mjs?v=20261014-ammo-exact-1';

// This campaign is stable across runtime revisions. A new build never reopens
// an already paid civil date / stage in the same anonymous local wallet.
export const REWARD_CAMPAIGN='demon-assault:daily-v1';
export const rewardKey=(day,stage)=>`${REWARD_CAMPAIGN}:${day}:stage:${stage}`;
export function validRewards(rewards){
 if(rewards===undefined)return true;
 if(!rewards||typeof rewards!=='object'||Array.isArray(rewards))return false;
 return Object.entries(rewards).every(([key,r])=>r&&r.campaign===REWARD_CAMPAIGN&&/^\d{4}-\d{2}-\d{2}$/.test(r.day)&&Number.isInteger(r.stage)&&!!STAGES[r.stage]&&r.amount===STAGES[r.stage].reward&&key===rewardKey(r.day,r.stage)&&typeof r.runId==='string'&&r.runId.length>0&&Number.isFinite(r.earnedAt));
}
export function rewardStatus(state,wallet){
 const rewards=Object.entries(state?.rewards||{}).filter(([,r])=>r.runId===state?.run.id);
 const ledger=wallet?.read?.(),confirmed=rewards.filter(([key,r])=>ledger?.rewards?.[key]?.amount===r.amount);
 return{earned:rewards.reduce((sum,[,r])=>sum+r.amount,0),paid:confirmed.reduce((sum,[,r])=>sum+r.amount,0),pending:rewards.length-confirmed.length,balance:ledger?.available?ledger.diamonds:null};
}
export async function payRewards(state,wallet){
 if(!validRewards(state?.rewards)||!wallet?.awardOnce)return false;
 for(const [key,r]of Object.entries(state?.rewards||{})){
  const result=await wallet.awardOnce(key,r.amount);
  if(!result.ok||result.receipt.amount!==r.amount)return false;
 }
 return true;
}

export {rewardCopy} from '../../src/activity-reward-copy.mjs?v=1';
