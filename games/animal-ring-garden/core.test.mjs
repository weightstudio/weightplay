import test from 'node:test';
import assert from 'node:assert/strict';
import {STAGES,SAVE_KEY,LEGACY_KEY,FINISH_COST,applyMove,aligned,solve,parFor,normalizeSave,settleSave,highestUnlocked} from './core.mjs';
import {readSave,purchaseMoonstone,recoverPurchase} from './economy.mjs';
import {NEW_COPY} from './copy.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

test('all 30 authored stages, phases, and possible ring states have valid terminating solutions',()=>{
  let states=0;
  for(const stage of STAGES){
    assert.ok(parFor(stage)>0);
    for(const phase of stage.phases)for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++)for(let mode=0;mode<(phase.kind==='clutch'?2:1);mode++){
      let current={rings:[a,b,c],mode},path=solve(phase,current);assert.ok(path,stage.id+': '+[a,b,c,mode]);
      for(const action of path){const before=current;current=applyMove(phase,current,action);assert.ok(current);assert.deepEqual(applyMove(phase,current,{...action,dir:-action.dir}),before);}
      assert.ok(aligned(phase,current.rings));states++;
    }
  }
  assert.ok(states>2500);console.log('Reachable state / phase cases:',states,'; stage ideal moves:',STAGES.map(parFor).join(','));
});
test('seal denies only the outer move; clutch changes links without rotating gems',()=>{
  const phase=STAGES[20].phases[0],state={rings:[0,1,2],mode:0};
  assert.equal(applyMove(phase,state,{ring:0,dir:1}),null);
  assert.ok(applyMove(phase,state,{ring:1,dir:1}));
  assert.deepEqual(applyMove(STAGES[15].phases[0],state,{ring:3,dir:1}),{rings:[0,1,2],mode:1});
});
test('old four gardens and bests migrate without modifying old keys; malformed saves normalize',()=>{
  const storage=memory({[LEGACY_KEY]:'[0,2,3]', 'weightplay:animal-ring-garden:v10:best:0':'4'});
  const original=storage.getItem(LEGACY_KEY),save=readSave(storage);
  assert.deepEqual(save.completed,[1,3,4]);assert.equal(save.best[1],4);assert.equal(highestUnlocked(save),5);assert.equal(storage.getItem(LEGACY_KEY),original);
  for(const value of [null,[],42,'bad',{owned:'moonstone',best:{'1.5':3,'2':-1},completed:[NaN,31,-1,'2']}])assert.deepEqual(normalizeSave(value),normalizeSave());
  const s=settleSave(settleSave(normalizeSave(),1,8),1,4);assert.equal(s.best[1],4);assert.deepEqual(s.completed,[1]);
  assert.ok(normalizeSave({completed:Array.from({length:10},(_,i)=>i+1)}).owned.includes('jade'));
});
function memory(initial={}){const map=new Map(Object.entries(initial));return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};}
function wallet(balance){return {read:()=>({diamonds:balance}),spendDiamonds:n=>balance>=n?(balance-=n,true):false,addDiamonds:n=>(balance+=n)};}
test('cosmetic purchase debits once, persists ownership, survives reload and never charges insufficient funds',()=>{
  const storage=memory(),w=wallet(20);assert.equal(purchaseMoonstone(storage,w).status,'purchased');assert.equal(w.read().diamonds,8);
  assert.equal(readSave(storage).finish,'moonstone');assert.equal(purchaseMoonstone(storage,w).status,'owned');assert.equal(w.read().diamonds,8);
  assert.equal(purchaseMoonstone(memory(),wallet(FINISH_COST-1)).status,'insufficient');
});
test('write failure refunds the debit; crash journal can complete interrupted ownership exactly once',()=>{
  const storage=memory(),set=storage.setItem,w=wallet(20);
  storage.setItem=(k,v)=>{if(k===SAVE_KEY)throw Error('QUOTA');set(k,v);};
  assert.equal(purchaseMoonstone(storage,w).status,'storage');assert.equal(w.read().diamonds,20);
  const pending=memory({[SAVE_KEY+':purchase']:JSON.stringify({version:1,before:20,after:8})}),paid=wallet(8);
  assert.equal(recoverPurchase(pending,paid),true);assert.ok(readSave(pending).owned.includes('moonstone'));
  assert.equal(recoverPurchase(pending,paid),true);assert.equal(paid.read().diamonds,8);
  const ambiguous=memory({[SAVE_KEY+':purchase']:JSON.stringify({version:1,before:20,after:8})});assert.equal(recoverPurchase(ambiguous,wallet(9)),false);
});
test('every locale supplies all new instructions, shop disclosures and six chapter names',()=>{
  assert.equal(Object.keys(NEW_COPY).length,13);for(const [locale,copy] of Object.entries(NEW_COPY))for(const [key,value] of Object.entries(copy))assert.ok(Array.isArray(value)?value.length===6:typeof value==='string'&&value.length>0,locale+': '+key);
});
test('canonical and 13 generated entries agree on identity, module loading, approved art and shared audio',()=>{
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
  for(const locale of ['', 'en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar']){
    const route=path.join(root,locale,'games/animal-ring-garden/index.html'),html=fs.readFileSync(route,'utf8');
    assert.match(html,/<meta name="weightplay-game-version" content="v24">/);
    assert.match(html,/<meta name="weightplay-interface-version" content="9">/);
    assert.match(html,/<script type="module" src="[^"]*game\.js\?v=20261022-animal-ring-garden-v24-conservatory"/);
    assert.equal((html.match(/src="[^"]*weightplay-audio\.js/g)||[]).length,1);
    assert.doesNotMatch(html,/src="[^"]*animal-ring-garden-(?:mimi|ring-atlas)\.png/);
    for(const m of html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)){
      const url=m[1];if(/^(?:https?:|data:|#)/.test(url)||url.endsWith('/'))continue;
      const base=html.match(/<base href="([^"]+)"/)?.[1];
      const resourceBase=base?path.resolve(root,'.'+base):path.dirname(route);
      const resource=url.startsWith('/')?path.join(root,url):path.resolve(resourceBase,url);assert.ok(fs.existsSync(resource),locale+': '+url);
    }
  }
  const engine=fs.readFileSync(path.join(root,'src/weightplay-audio.js'),'utf8');
  const embedded=JSON.parse(engine.match(/const PROFILES = (\{[^\n]+\});/)[1]);
  const profile=JSON.parse(fs.readFileSync(path.join(root,'config/audio-game-cues.json'))).games['animal-ring-garden'];
  assert.deepEqual(embedded['animal-ring-garden'],profile);
  const catalog=JSON.parse(fs.readFileSync(path.join(root,'assets/audio/manifest.json'))).sounds;
  for(const id of profile)assert.ok(catalog.some(s=>s.id===id));
});
