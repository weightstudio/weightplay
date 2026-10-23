import assert from 'node:assert/strict';
import {createProfile,normalize,startRun,care,harvest,sunset,buyEquipment,buyGoldenCrates,clone,CONTRACTS} from './model.mjs';

assert.equal(normalize('{bad',3).legacyBest,3);
assert.equal(normalize(null,2).legacyBest,2);
const p=createProfile(3);startRun(p);
assert.equal(care(p,'missing'),false);
assert.equal(care(p,'water'),true);assert.equal(care(p,'compost'),true);
assert.equal(care(p,'canopy'),false);
assert.deepEqual(normalize(JSON.stringify(p)),p);
p.run.resources=[NaN,999,-9];p.run.actions=999;
const repaired=normalize(p);
assert.deepEqual(repaired.run.resources,[4,8,0]);assert.equal(repaired.run.actions,2);
const upgrade=createProfile();upgrade.coins=29;
assert.equal(buyEquipment(upgrade,'crates'),false);upgrade.coins=50;
assert.equal(buyEquipment(upgrade,'crates'),true);
assert.equal(buyEquipment(upgrade,'crates'),false);assert.equal(upgrade.coins,20);
assert.equal(buyEquipment(upgrade,'compost'),true);assert.equal(upgrade.coins,0);
startRun(upgrade);upgrade.run.growth[0]=2;
assert.equal(harvest(upgrade,0),3);assert.equal(harvest(upgrade,0),0);
care(upgrade,'compost');assert.equal(upgrade.run.resources[2],8);
const cosmetic=createProfile();let diamonds=10,debits=0;
const wallet={read:()=>({diamonds}),spendDiamonds(n){debits++;diamonds-=n;return true;}};
assert.equal(buyGoldenCrates(cosmetic,wallet,()=>{throw Error('storage blocked');}),'storage');
assert.equal(diamonds,10);assert.equal(debits,0);assert.equal(cosmetic.gold,false);
assert.equal(buyGoldenCrates(cosmetic,wallet,()=>{}),'bought');assert.equal(diamonds,2);
assert.equal(buyGoldenCrates(cosmetic,wallet,()=>{}),'owned');assert.equal(debits,1);
assert.equal(buyGoldenCrates(createProfile(),wallet,()=>{}),'funds');
const failedWallet={read:()=>({diamonds:10}),spendDiamonds(){throw Error('wallet blocked');}};
const rollback=createProfile();assert.equal(buyGoldenCrates(rollback,failedWallet,()=>{}),'storage');assert.equal(rollback.gold,false);

// Explore actual legal care choices to prove every seasonal target is reachable
// from a fresh profile without permanent upgrades or paid cosmetics.
const choices=[[],...['water','compost','canopy'].flatMap(a=>[[a],...['water','compost','canopy'].map(b=>[a,b])])];
const plans=[];
for(let index=0;index<CONTRACTS.length;index++){
 const fresh=createProfile();startRun(fresh,index);let states=[{p:fresh,plan:[]}];
 for(let day=1;day<=8;day++){
  const candidates=new Map();
  for(const state of states)for(const actions of choices){
   const next=clone(state.p);[0,1,2].forEach(i=>harvest(next,i));
   actions.forEach(a=>assert.equal(care(next,a),true));sunset(next);
   const r=next.run,key=JSON.stringify([r.resources,r.growth,r.harvest]);
   const value={p:next,plan:[...state.plan,actions]};
   if(!candidates.has(key))candidates.set(key,value);
  }
  const score=state=>{
   const r=state.p.run,c=CONTRACTS[index];
   const fruitBonus=c.fruit==='all'?Math.min(...r.harvest)*2:c.fruit===null?0:Math.min(c.quota,r.harvest[c.fruit])*2;
   return r.harvest.reduce((a,b)=>a+b,0)*8+r.growth.reduce((a,b)=>a+b,0)*4+fruitBonus-r.resources.reduce((a,b)=>a+Math.abs(b-4),0)*.2;
  };
  states=[...candidates.values()].sort((a,b)=>score(b)-score(a)).slice(0,300);
 }
 const finals=states.map(s=>{sunset(s.p);return s;}).filter(s=>s.p.run.won);
 assert.ok(finals.length,`Contract ${index} is reachable without upgrades`);
 const best=finals[0],before=clone(best.p);
 assert.equal(sunset(best.p),null);assert.equal(harvest(best.p,0),0);
 assert.deepEqual(best.p,before);assert.equal(best.p.completed,1);
 assert.deepEqual(normalize(JSON.stringify(best.p)),best.p);
 plans.push({contract:CONTRACTS[index].id,harvest:best.p.run.harvest,actions:best.plan});
}
const neglected=createProfile();startRun(neglected);
for(let i=0;i<9;i++)sunset(neglected);
assert.equal(neglected.run.won,false);assert.equal(neglected.completed,0);
console.log(JSON.stringify({status:'PASS',checks:'save migration, corruption bounds, care cap, upgrades, duplicate rewards, success/failure, four fresh-profile seasons',plans},null,2));
