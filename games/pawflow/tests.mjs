import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RULES,createState,dispatch,finishLap,actions,tick,rewind,assertState,capture,clone,stars,sideOpen,hint} from './engine.mjs';
import {getLevel,dailyLevel,dailyKey,authoredLevel} from './levels.mjs';
import {createStore,restoreState,normalize,SAVE_KEY} from './save.mjs';
import {COPY,LOCALES,ROUTES,translator} from './locales.mjs';
function solve(level,checkRestore=false){let s=createState(level);assertState(s);for(const [i,step] of level.witness.entries()){
 for(let t=0;t<step.wait;t++)tick(s);
 const action=actions(s).find(a=>a.unit.id===step.id);assert.ok(action,`Missing witness head ${level.id}:${i}`);assert.equal(dispatch(s,action.source,action.index).ok,true);
 if(checkRestore&&i%3===0){for(let t=0;t<17&&s.status==='running';t++)tick(s);if(s.status==='running'){const restored=restoreState({...capture(s),previous:s.previous},level);assert.ok(restored,`Cannot resume ${level.id}:${i}`);s=restored;}}
 finishLap(s);assertState(s);
 }assert.equal(s.status,'won');assert.equal(s.leftHP,0);assert.equal(stars(s,level.par),3);return s;
}
for(let id=1;id<=30;id++)test(`campaign ${id}: native simulation witness, conservation and checkpoint recovery`,()=>solve(getLevel(id),true));
for(let n=0;n<90;n++)test(`daily ${n}: deterministic solvable variant`,()=>{const date=new Date(Date.UTC(2026,8,1+n)),key=dailyKey(date),a=dailyLevel(key),b=dailyLevel(key);assert.deepEqual(a,b);solve(a);});
const fixture=(cells,units)=>({id:6,signature:'fixture-v1',board:Array.from({length:100},(_,i)=>clone(cells[i]||[])),supply:units,requiredKeys:0,shutters:false,gateTicks:150,phaseOffset:0,reverse:false,par:99});
const voxel=(color,hp=1,extra={})=>({color,hp,key:false,lock:false,...extra});
const unit=(id,color,ammo)=>({id,color,ammo});
test('first occupied cell occludes a different color without wasting ammunition',()=>{const l=fixture({50:[voxel(0)],51:[voxel(1)]},[unit('a',1,1),unit('b',0,1)]),s=createState(l);dispatch(s,'queue',0);for(let i=0;i<25;i++)tick(s);assert.equal(s.active[0].ammo,1);assert.equal(s.leftHP,2);assertState(s);});
test('reinforced pixel takes two successful hits, one charge per hit',()=>{const s=createState(fixture({55:[voxel(0,2)]},[unit('a',0,2)]));dispatch(s,'queue',0);for(let i=0;i<100&&s.leftHP===2;i++)tick(s);assert.equal(s.leftHP,1);assert.equal(s.board[55][0].hp,1);assert.equal(s.active[0].ammo,1);finishLap(s);assert.equal(s.status,'won');assertState(s);});
test('key is reachable, sealed core stays blocked until key removed',()=>{const l=fixture({51:[voxel(0,1,{key:true})],55:[voxel(1,1,{lock:true})]},[unit('inside',1,1),unit('key',0,1)]);l.requiredKeys=1;const s=createState(l);dispatch(s,'queue',0);finishLap(s);assert.equal(s.leftHP,2);assert.equal(s.reserve[0].ammo,1);dispatch(s,'queue',1);finishLap(s);assert.equal(s.keys,1);dispatch(s,'reserve',0);finishLap(s);assert.equal(s.status,'won');assertState(s);});
test('reserve overflow retains the returning courier and conserves all charges',()=>{const units=Array.from({length:6},(_,i)=>unit(`c${i}`,1,1));units.push(unit('key',0,1));const l=fixture({55:[voxel(0),...Array.from({length:6},()=>voxel(1))]},units),s=createState(l);s.queues=[[],[],[]];s.reserve=units.slice(0,5).map(clone);s.queues[0]=[clone(units[5]),clone(units[6])];dispatch(s,'queue',0);finishLap(s);assert.equal(s.status,'lost');assert.equal(s.reason,'overflow');assertState(s);});
test('belt full and launch spacing reject without consuming source couriers',()=>{const board={};for(let i=0;i<100;i++)board[i]=[voxel(i%5)];const s=createState(fixture(board,Array.from({length:5},(_,i)=>unit(`x${i}`,i,20))));for(let i=0;i<4;i++){assert.equal(dispatch(s,'queue',i%3).ok,true);if(i<3)for(let j=0;j<12;j++)tick(s);}const before=capture(s);assert.equal(dispatch(s,'queue',1).reason,'beltFull');assert.deepEqual(capture(s),before);assertState(s);const fresh=createState(getLevel(5));dispatch(fresh,'queue',0);const q=clone(fresh.queues);assert.equal(dispatch(fresh,'queue',1).reason,'spacing');assert.deepEqual(fresh.queues,q);});
test('rewind is single-use and cannot erase assistance or multiply charges',()=>{const l=getLevel(13),s=createState(l),before=capture(s);dispatch(s,'queue',0);for(let i=0;i<20;i++)tick(s);hint(s);assert.equal(rewind(s),true);assert.deepEqual(s.board,before.board);assert.deepEqual(s.queues,before.queues);assert.equal(s.rewindUsed,true);assert.equal(s.hintUsed,true);assert.equal(rewind(s),false);assertState(s);});
test('shutters alternate sides; future open sides are not false deadlocks',()=>{const s=createState(getLevel(21));assert.equal(sideOpen(s,0),true);assert.equal(sideOpen(s,1),false);for(let i=0;i<s.gateTicks;i++)tick(s);assert.equal(s.status,'running');assert.equal(sideOpen(s,0),false);assert.equal(sideOpen(s,1),true);});
test('corrupt or changed checkpoints are rejected rather than partially applied',()=>{const l=getLevel(18),s=createState(l);dispatch(s,'queue',0);for(let i=0;i<17;i++)tick(s);const raw={...capture(s),previous:s.previous};assert.ok(restoreState(raw,l));for(const mutate of [x=>x.signature='old',x=>x.levelId=1,x=>x.active[0].ammo=999,x=>x.active[0].id='unknown',x=>x.ticks=NaN,x=>x.keys=100,x=>x.board=[],x=>x.active[0].age=-1,x=>x.queues.push([])]){const bad=clone(raw);mutate(bad);assert.equal(restoreState(bad,l),null);}});
test('storage exceptions use session memory, and malformed JSON cannot crash boot',()=>{const fail={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};const s=createStore(fail);assert.equal(s.available,false);s.write({...s.value,unlocked:12});assert.equal(s.value.unlocked,12);const corrupt=createStore({getItem(){return '{broken';},setItem(){}});assert.equal(corrupt.value.unlocked,1);});
test('settlement is monotonic, daily records cannot unlock campaign, attempts clear',()=>{const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},store=createStore(storage);const l=getLevel(1),s=solve(l);store.settle(s,l);assert.equal(store.value.unlocked,2);assert.equal(store.value.stars[0],3);const best=store.value.best[0];s.launches+=10;s.hintUsed=true;store.settle(s,l);assert.equal(store.value.best[0],best);assert.equal(store.value.stars[0],3);const daily=dailyLevel('2026-09-22');store.settle(solve(daily),daily);assert.equal(store.value.unlocked,2);assert.equal(store.value.daily.length,1);assert.ok(memory.get(SAVE_KEY));assert.equal(createStore(storage).value.unlocked,2);});
test('normalization restores completed unlocks and bounds malformed records',()=>{const p=normalize({version:1,unlocked:NaN,stars:Array.from({length:30},(_,i)=>i===12?3:0),best:[-4]});assert.equal(p.unlocked,14);assert.equal(p.best[0],0);assert.equal(p.stars.length,30);});
test('all 13 locales own every string, 30 names, seven rules and four static FAQs',()=>{
 const expected=Object.keys(COPY.en).sort();assert.equal(LOCALES.length,13);
 for(const locale of LOCALES){
  const d=COPY[locale];assert.deepEqual(Object.keys(d).sort(),expected);assert.equal(d.names.length,30);assert.equal(d.rules.length,7);assert.equal(d.colors.length,5);
  for(const [key,value] of Object.entries(d))if(typeof value==='string'){assert.ok(value.trim(),`${locale}:${key}`);assert.ok(!/undefined|\?\?\?|�/.test(value));}
  assert.ok(translator(locale)('unit',{color:'A',ammo:12,n:1}).includes('12'));
  const html=readFileSync(new URL(`../../${ROUTES[locale]}/games/pawflow/index.html`,import.meta.url),'utf8');
  assert.ok(html.includes(`lang="${locale}"`));assert.ok(html.includes('content="noindex,nofollow"'));assert.ok(html.includes(`/${ROUTES[locale]}/games/pawflow/`));assert.ok(html.includes(d.title));assert.ok(html.includes('data-wp-guide-complete="true"'));
  const match=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);assert.ok(match,`${locale}: structured data`);
  const graph=JSON.parse(match[1])['@graph'];assert.equal(graph[0].inLanguage,locale);assert.equal(graph[0].name,d.title);
  const faq=graph.find(node=>node['@type']==='FAQPage').mainEntity;assert.equal(faq.length,4);
  const unescape=text=>text.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&#39;',"'").replaceAll('&quot;','"');
  for(const item of faq){assert.ok(unescape(html).includes(item.name));assert.ok(unescape(html).includes(item.acceptedAnswer.text));}
  if(locale==='ar')assert.ok(html.includes('dir="rtl"'));
 }
});
test('two tabs merge permanent records without losing the newer unlock',()=>{
 const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
 const a=createStore(storage),b=createStore(storage);a.write({...a.value,unlocked:9,stars:[3,...Array(29).fill(0)]});
 b.write({...b.value,unlocked:2,best:[7,...Array(29).fill(0)]});assert.equal(b.value.unlocked,9);assert.equal(b.value.stars[0],3);
 a.refresh();assert.equal(a.value.best[0],7);assert.equal(a.value.unlocked,9);
});
test('daily rejects nonexistent calendar dates and authored ids outside campaign',()=>{for(const key of ['bad','2026-02-30','2026-13-01'])assert.throws(()=>dailyLevel(key));assert.throws(()=>getLevel(0));assert.throws(()=>authoredLevel(31));});
test('all boards differ as complete authored layered puzzles',()=>{const hashes=new Set();for(let id=1;id<=30;id++)hashes.add(JSON.stringify(authoredLevel(id)));assert.equal(hashes.size,30);});
test('fixed authored witnesses do not use hint or rewind and are not autoplay UI',()=>{const source=readFileSync(new URL('./game.js',import.meta.url),'utf8');assert.ok(!source.includes('.witness'));assert.ok(!source.includes('setInterval'));assert.ok(source.includes('data-wp-return'));const css=readFileSync(new URL('./style.css',import.meta.url),'utf8');assert.ok(css.includes('#stageRail [data-wp-item-content]{'));assert.ok(!css.includes('[data-wp-item-content] [data-wp-item-content]'));});
