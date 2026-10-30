export {rewardCopy} from '../../src/activity-reward-copy.mjs?v=1';
export const REWARD_CAMPAIGN='meteor-barrage:daily-v1';
export const WAVE_REWARDS=Object.freeze([3,5,8]);
export const rewardKey=(day,wave)=>`${REWARD_CAMPAIGN}:${day}:wave:${wave}`;
export function validRewards(rewards){
 return !!rewards&&typeof rewards==='object'&&!Array.isArray(rewards)&&Object.entries(rewards).every(([key,r])=>r&&r.campaign===REWARD_CAMPAIGN&&/^\d{4}-\d{2}-\d{2}$/.test(r.day)&&Number.isInteger(r.wave)&&r.wave>=0&&r.wave<3&&r.amount===WAVE_REWARDS[r.wave]&&key===rewardKey(r.day,r.wave)&&typeof r.runId==='string'&&r.runId.length>0&&Number.isFinite(r.earnedAt));
}
export function rewardStatus(save,wallet,run=save?.challenge){
 const rewards=Object.entries(save?.rewards||{}).filter(([,r])=>r.runId===run?.id),ledger=wallet?.read?.();
 const confirmed=rewards.filter(([key,r])=>ledger?.rewards?.[key]?.amount===r.amount);
 return{earned:rewards.reduce((n,[,r])=>n+r.amount,0),paid:confirmed.reduce((n,[,r])=>n+r.amount,0),pending:rewards.length-confirmed.length,balance:ledger?.available?ledger.diamonds:null};
}
export async function payRewards(save,wallet){
 if(!validRewards(save?.rewards)||!wallet?.awardOnce)return false;
 for(const [key,r]of Object.entries(save.rewards)){
  const result=await wallet.awardOnce(key,r.amount);
  if(!result.ok||result.receipt.amount!==r.amount)return false;
 }
 return true;
}
