// Extract the actual synchronous Result/async completion functions from the
// frozen game source and exercise them against real progress rules and lock
// module with a minimal DOM. This is not a browser or rendered accessibility test.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {writeProgressLocked} from '../progress-lock.mjs';

const files=[new URL('../game.js',import.meta.url),new URL('../progress-lock.mjs',import.meta.url),new URL(import.meta.url)];
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const frozen=Object.fromEntries(files.map(file=>[file.pathname,hash(file)])),source=fs.readFileSync(files[0],'utf8');
const sandbox={};sandbox.globalThis=sandbox;vm.runInNewContext(source,sandbox);const base=sandbox.HabitatRescueRules;
const copyStart=source.indexOf('  const rows = {'),copyEnd=source.indexOf('  const habitats = ',copyStart);
assert(copyStart>0&&copyEnd>copyStart);
const allCopy=vm.runInNewContext(`(()=>{const locales=${JSON.stringify(['en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar'])};${source.slice(copyStart,copyEnd)};return copy;})()`);
assert.equal(Object.keys(allCopy).length,13);for(const lang of Object.keys(allCopy)){assert(allCopy[lang].saving?.trim());assert(allCopy[lang].unsaved?.trim());}
const begin=source.indexOf('    async function persistLocked(value) {'),end=source.indexOf('    $("rescue-supply").addEventListener',begin);
assert(begin>0&&end>begin);const functions=source.slice(begin,end);
const mkNode=()=>({disabled:false,hidden:false,textContent:'',tabIndex:0,attrs:{},setAttribute(k,v){this.attrs[k]=v},focus(){this.focusCount=(this.focusCount||0)+1}});
function fixture({locks,locale='en'}={}){
 const nodes=Object.fromEntries(['retry','to-stages','battle-back','next','result-title','result-copy'].map(k=>[k,mkNode()])),result=mkNode(),vignette=mkNode();result.hidden=true;
 const db=new Map(),storage={getItem:k=>db.get(k)??null,setItem:(k,v)=>db.set(k,v)};
 const R={...base,stars:()=>3,eco:()=>2},game={stage:1,saved:1,cells:[]},measurement={roundKey:{},stageId:1,ended:false},observations=[];
 const window={navigator:{locks},WeightPlayAudio:{play(){}}},document={body:{dataset:{}}};
 const make=new Function('R','game','measurement','window','document','storage','progressLockModule','result','vignette','copy','lang','nodes','observe',`
   let best=0,journal={},storageOK=true,resultWin=false,savePending=false,refreshResultStatus=null;
   const rescuePlans=[{animals:[1],goal:2},{animals:[1],goal:2}],board={inert:false};
   const $=id=>nodes[id]||({inert:false}),tx=id=>String(id),mainCopy=()=>{},terrain=()=>'',art=()=>'';
   ${functions}
   return {finish,state:()=>({best,journal,storageOK,resultWin,savePending})};`);
 const controller=make(R,game,measurement,window,document,storage,Promise.resolve({writeProgressLocked}),result,vignette,allCopy,()=>locale,nodes,()=>observations.push({...measurement}));
 return {controller,nodes,result,db,measurement,observations};
}
const settle=async()=>{for(let i=0;i<20;i++)await new Promise(queueMicrotask)};
{
 let enter;const locks={request(_name,_options,callback){return new Promise(resolve=>{enter=()=>resolve(callback());});}};
 const f=fixture({locks,locale:'zh-tw'});f.controller.finish();
 assert.equal(f.result.hidden,false);assert.equal(f.result.attrs['aria-busy'],'true');assert.equal(f.controller.state().savePending,true);
 for(const id of ['retry','to-stages','battle-back','next'])assert.equal(f.nodes[id].disabled,true,id);
 assert(f.nodes['result-copy'].textContent.includes(allCopy['zh-tw'].saving));assert.equal(f.observations.length,0);assert.equal(f.db.size,0);
 await settle();assert.equal(typeof enter,'function');enter();await settle();
 assert.equal(f.result.attrs['aria-busy'],'false');assert.equal(f.controller.state().savePending,false);assert.equal(f.controller.state().storageOK,true);
 assert.equal(f.nodes.retry.disabled,false);assert.equal(f.nodes['to-stages'].disabled,false);assert.equal(f.nodes.next.disabled,false);
 assert.equal(f.observations.length,1);assert.equal(f.observations[0].stageId,1);assert.equal(f.observations[0].saveSucceeded,true);assert.equal(f.observations[0].outcome,'win');
 assert.equal(JSON.parse(f.db.get('weightplay-habitat-atlas-rescue-v1'))['1'],3);
}
{
 const f=fixture({locale:'ar'});f.controller.finish();assert.equal(f.controller.state().savePending,true);await settle();
 assert.equal(f.controller.state().savePending,false);assert.equal(f.controller.state().storageOK,false);assert(f.nodes['result-copy'].textContent.includes(allCopy.ar.unsaved));
 assert.equal(f.db.size,0);assert.equal(f.observations.length,1);assert.equal(f.observations[0].saveSucceeded,false);assert.equal(f.observations[0].stageId,1);
}
// These entry guards are part of the real source; physical keyboard, pointer,
// focus handling and localization require subsequent browser verification.
assert.match(source,/function start\(stage, restart = false\)\s*\{\s*if \(savePending\) return;/);
assert.match(source,/function toStages\(\)\s*\{\s*if\(savePending\)return;/);
assert.deepEqual(Object.fromEntries(files.map(file=>[file.pathname,hash(file)])),frozen,'SOURCE_CHANGED');
console.log(JSON.stringify({status:'PASS_OFFLINE_ONLY',source:frozen,coverage:['actual result functions','pending aria and controls','cooperating lock completion','missing lock unsaved/no reward eligibility','13 locale nonempty strings','round identity'],limitations:['minimal DOM, no browser','no concurrent old-version tab safety','no cross-key crash atomicity']}));
