import assert from 'node:assert/strict';
import {createWorld,step,usePulse,stageConfig} from './model.js';
import {loadProgress,saveProgress,buyUpgrade,buySkin,settle,SAVE_KEY} from './progress.js';
const memory=()=>{const values=new Map();return{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),values};};
const store=memory();store.setItem('wp-alien-defender-unlocked-stage','26');store.setItem('wp-alien-defender-firepower','8');store.setItem('wp-alien-defender-credits','560');store.setItem('wp-alien-defender-upgrade-shield','3');
const legacy=loadProgress(store);assert.equal(legacy.unlocked,26);assert.equal(legacy.firepower,8);assert.equal(legacy.credits,560);assert.equal(legacy.shield,3);assert.equal(legacy.hull,0);
assert(saveProgress(store,legacy));assert.deepEqual(loadProgress(store),legacy);assert.equal(store.getItem('wp-alien-defender-unlocked-stage'),'26');
let purchase=buyUpgrade(store,legacy,'hull');assert(purchase.ok);assert.equal(purchase.next.credits,410);assert.equal(loadProgress(store).hull,1);assert.equal(buyUpgrade(store,{...legacy,credits:0},'hull').ok,false);
const broken={getItem:()=>null,setItem:()=>{throw Error('quota');}};assert.equal(buyUpgrade(broken,legacy,'hull').reason,'save');assert.equal(saveProgress(broken,legacy),false);
let diamonds=20,debits=0;const wallet={read:()=>({diamonds}),spendDiamonds:c=>{if(diamonds<c)return false;diamonds-=c;debits++;return true;}};
assert.equal(buySkin(broken,legacy,wallet).ok,false);assert.equal(diamonds,20);
const skin=buySkin(store,legacy,wallet);assert(skin.ok);assert.equal(diamonds,5);assert.equal(loadProgress(store).skin,true);assert.equal(buySkin(store,skin.next,wallet).ok,false);assert.equal(debits,1);
assert.equal(buySkin(store,{...legacy,skin:false},wallet).reason,'funds');
const throwing={read:()=>({diamonds:50}),spendDiamonds:()=>{throw Error('wallet quota');}};assert.equal(buySkin(store,legacy,throwing).ok,false);assert.equal(loadProgress(store).skin,false);
store.setItem(SAVE_KEY,'{bad');assert.equal(loadProgress(store).unlocked,26);
const w=createWorld(1);w.status='won';w.score=123;w.credits=25;const settled=settle(store,loadProgress(memory()),w);assert(settled.ok);assert.equal(settled.next.unlocked,2);assert.equal(settled.earned,113);assert.equal(settle(store,settled.next,w).reason,'duplicate');
const loss=createWorld(7);loss.status='lost';loss.credits=15;assert.equal(settle(memory(),legacy,loss).next.unlocked,26);
const relay=createWorld(20);const boss=relay.enemies[0];const old=boss.hp;relay.pulse=6;assert(usePulse(relay));assert.equal(boss.hp,old);assert.equal(relay.pulse,0);assert.equal(usePulse(relay),false);
for(const e of relay.enemies)if(e.kind==='relay')e.hp=0;relay.pulse=6;usePulse(relay);assert.equal(boss.hp,old-5);
const damage=createWorld(1);damage.invulnerable=0;damage.hostile=[{x:50,y:.83,vx:0,vy:1}];step(damage,.03);assert.equal(damage.shield,0);assert.equal(damage.lives,4);damage.hostile=[{x:50,y:.83,vx:0,vy:1}];step(damage,.03);assert.equal(damage.lives,4);
const pulse=createWorld(1);pulse.pulse=6;pulse.hostile=[{x:50,y:.5,vx:0,vy:1}];pulse.warnings=[{x:10,y:.2,tx:50,remaining:1}];assert(usePulse(pulse));assert.equal(pulse.hostile.length,0);assert.equal(pulse.warnings.length,0);
const runs=[];
for(let stage=1;stage<=30;stage++){
 const chapter=Math.floor((stage-1)/5),upgrade={firepower:Math.min(8,1+chapter),shield:Math.min(3,chapter),hull:Math.min(2,chapter),rapid:Math.min(3,chapter)};
 const sim=createWorld(stage,upgrade,1.85);
 for(let tick=0;tick<60*180&&sim.status==='playing';tick++){
   const targets=sim.enemies.filter(e=>e.hp>0).sort((a,b)=>(a.kind==='relay'?-100:0)+(b.y-a.y)*50+Math.abs(a.x-sim.player.x)-Math.abs(b.x-sim.player.x));
   const enemy=targets[0];let target=enemy.x+(enemy.kind==='boss'?0:sim.dir*sim.config.speed*(sim.player.y-enemy.y)/.95);
   const danger=sim.hostile.find(b=>b.y>.68&&Math.abs(b.x-sim.player.x)<7);if(danger)target=sim.player.x+(sim.player.x>50?-15:15);
   step(sim,1/60,{left:sim.player.x>target+1,right:sim.player.x<target-1,fire:true,pulse:sim.pulse>=6});sim.events.length=0;
   assert(sim.hostile.length<=64&&sim.shots.length<=96);assert(Number.isFinite(sim.player.x));
 }
 runs.push({stage,status:sim.status,seconds:Math.round(sim.time),lives:sim.lives});
 assert.equal(sim.status,'won',`Stage ${stage} must be reachable with chapter-appropriate earned upgrades`);
}
assert.equal(Array.from({length:30},(_,i)=>stageConfig(i+1)).filter(s=>s.boss).length,6);
console.log(JSON.stringify({status:'PASS',checks:['legacy-save','atomic-result','credit-upgrades','diamond-cost-once','quota-failure','wallet-rollback','shield-invulnerability','relay-priority','pulse-projectiles','bounded-projectiles','30-stage-reachability'],runs}));
