/* Reproducible offline authoring. Production loads frozen stages.mjs only. */
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {SHAPES,PORTS,solve,createState,act,complete,key,poseKey} from './simulation.mjs';
const shapes=['I,I','I,D','D,I,I','D,D,I','D,L,I','I,D,D','D,D,I','D,L,I','L,D,D','L,D,L','D,I,I','D,L,D','L,L,I','O,L,D','L,O,L','I,D,L','D,L,D,I','L,L,D,I','O,D,L,D','L,O,L,D','I,D,I,D','D,L,D,I','L,D,L,D','O,L,D,L','L,O,L,L','D+I,L,D,I','L,D+I,O,D','O,L,L+I,D','L+I,O,D,L','L+I,O,L+I,O'];
const flow=[
 ['A28','','B28',''],['A28','','','B56'],['A56 B28','','C28',''],['A28 B56','','A28','C28'],['A56 B84 C28','','',''],
 ['A28','','C56','B56'],['A56','B56','C28',''],['A28 B42','','B42 A28','C28'],['A42','B56','C56','A42'],['A42 B28','C42','B28 A42','C42'],
 ['A56','','B28','C28'],['A56','','B84','C56'],['A42 B84','','C28','A42'],['B84','','C56','A112'],['C84','A84','','B112'],
 ['A28','','B56','C84'],['B84 A56','','C56','D28'],['A84','B84','C56','D28'],['B56 D56','','C84','A112'],['C42','B56 A84','D56 C42','B56'],
 ['A28','C28','B56','D56'],['A28 B84','C56','A28','D28'],['C84','A84','B56','D56'],['B84','C56','D84','A112'],['A42 C84','A42','D84','B112'],
 ['A28 B84','A56','C56','D28'],['B56','B28 C112','A84','D56'],['C84','C28 A112','B84','D56'],['A84','A28 B112','C56','D84'],['A84','A28 D112','C84','C28 B112']
];
const masks='O C O S C O C S P S O C S P C G G S P G O C S G P C G S G P'.split(' ');
const shutters=new Set([6,7,8,9,10,18,19,20,22,25,26,27,28,29,30]);
const rotations=new Set([11,12,13,14,15,16,17,18,19,20,23,24,25,26,27,28,29,30]);
const orders={21:['A1','B1'],22:['B1','A1'],23:['C1','A1','D1'],24:['B1','D1','A1'],25:['C1','A1','B1'],27:['B2','C1'],28:['C2','A1','C1'],29:['C1','B1','A1'],30:['A2','C2','D1','B1']};
const locks={16:{3:'A1'},17:{2:'A1'},18:{1:'A1',3:'C1'},19:{3:'B1'},20:{3:'A1',0:'D1'},24:{2:'B1'},27:{2:'B2'},29:{0:'A2',3:'C1'},30:{0:'A2',2:'C2'}};
function wallsFor(mask,rotate){let cells=[];if(mask==='C')for(const c of [2,3])for(const r of [0,1,6,7])cells.push([c,r]);if(mask==='S')cells=[[2,1],[3,6],[1,0],[4,7]];if(mask==='P')cells=[[1,0],[1,7],[4,0],[4,7],[2,1],[3,6]];if(mask==='G')cells=[[0,3],[1,3],[4,3],[5,3],[2,0],[3,7]];if(rotate)cells.push([0,1],[0,3],[5,1],[5,3]);return [...new Set(cells.map(key))].sort((a,b)=>a-b);}
function rng(seed){return ()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};}
function place(level,random){const used=new Set(level.walls);for(const p of level.pieces){let found=false;for(let n=0;n<600;n++){let cells=SHAPES[p.shape].map(v=>[...v]);const rotations=level.rotate?Math.floor(random()*4):0;for(let r=0;r<rotations;r++){cells=cells.map(([x,y])=>[-y,x]);const minX=Math.min(...cells.map(v=>v[0])),minY=Math.min(...cells.map(v=>v[1]));cells=cells.map(([x,y])=>[x-minX,y-minY]);}if(level.id===11&&p.id==='A1')cells=[[0,0],[0,1]];const c=Math.floor(random()*6),r=Math.floor(random()*8);cells=cells.map(([x,y])=>[x+c,y+r]);if(cells.every(([x,y])=>x<6&&y<8&&!used.has(key([x,y]))&&!PORTS.some(v=>v.c===x&&v.r===y))){p.cells=cells;cells.forEach(v=>used.add(key(v)));found=true;break;}}if(!found)return false;}return true;}
export function authorStages({limit=30}={}){const levels=[];for(let index=0;index<limit;index++){const id=index+1;const pieces=[];shapes[index].split(',').forEach((group,color)=>group.split('+').forEach((shape,i)=>pieces.push({id:String.fromCharCode(65+color)+(i+1),shape,color,cells:[]})));
 const base={id,chapter:Math.floor(index/5),checkpoint:id%5===0,shutters:shutters.has(id),rotate:rotations.has(id),mode:id===30?1:0,locks:locks[id]||{},order:orders[id]||[],supply:flow[index].map(v=>v?v.split(' ').map(s=>[s.charCodeAt(0)-65,Number(s.slice(1))]):[]),pieces};
 let accepted=null;
 for(let attempt=0;attempt<50&&!accepted;attempt++){const level=structuredClone(base);level.mask=masks[index];level.walls=wallsFor(level.mask,level.rotate);const random=rng(2026102500+id*1009+attempt*7919);if(!place(level,random))continue;const proof=solve(level,createState(level),{budget:300});if(!proof.actions)continue;let state=createState(level);for(const a of proof.actions){const r=act(level,state,a);if(!r.ok)throw Error('INVALID_WITNESS');state=r.state;}if(!complete(state))throw Error('INCOMPLETE_WITNESS');if([11,12,13,14,15].includes(id)&&!proof.actions.some(a=>a.type==='rotate'))continue;accepted={...level,seed:2026102500+id*1009+attempt*7919,par:proof.actions.length,witness:proof.actions};console.log(JSON.stringify({stage:id,attempt,par:accepted.par,states:proof.visited,rotates:proof.actions.filter(a=>a.type==='rotate').length}));}
 if(!accepted)throw Error('NO_PROOF_STAGE_'+id);levels.push(accepted);}
 return levels;}
async function renderAssets(){
 const {loadTestBrowserRuntime}=await import('../../scripts/lib/test-browser-runtime.mjs');
 const {installLocalTestNetworkPolicy,localTestBrowserArgs,validateLocalTestUrl}=await import('../../scripts/local-test-network-policy.mjs');
 const {closeBrowserSessionResources}=await import('../../scripts/lib/playwright-headed-window.mjs');
 const origin=validateLocalTestUrl(process.env.WEIGHTPLAY_TEST_ORIGIN||'http://127.0.0.1:8876');
 const {playwright,executablePath}=await loadTestBrowserRuntime();let browser,context;
 try{browser=await playwright.chromium.launch({executablePath,headless:true,args:localTestBrowserArgs});context=await browser.newContext({viewport:{width:600,height:760},deviceScaleFactor:1});await installLocalTestNetworkPolicy(context);const url=new URL('/__nori-art',origin).href;await context.route(url,r=>r.fulfill({contentType:'text/html',body:'<!doctype html><title>Offline asset rendering</title>'}));const page=await context.newPage();await page.goto(url);await page.setContent('<style>body{margin:0}canvas{width:480px;height:640px}</style><canvas></canvas>');
  await page.evaluate(async()=>{const {SandView}=await import('/games/nori-sandworks/renderer.mjs');window.artView=new SandView(document.querySelector('canvas'));});
  const jobs=[...Array.from({length:30},(_,i)=>['stage',i]),...Array.from({length:6},(_,i)=>['collection',i]),['skin','sunset'],['skin','reef']];
  for(const [kind,index]of jobs){const data=await page.evaluate(async({kind,index})=>{const {LEVELS}=await import('/games/nori-sandworks/stages.mjs'),{createState}=await import('/games/nori-sandworks/simulation.mjs'),v=window.artView;v.canvas.style.width=kind==='stage'?'480px':'512px';v.canvas.style.height=kind==='stage'?'640px':'512px';v.resize();if(kind==='stage'){v.skin='classic';v.collection=LEVELS[index].chapter;v.fragments=0;v.load(LEVELS[index],createState(LEVELS[index]));}else if(kind==='collection')v.renderCollection(index,5);else v.renderFinish(index);return v.canvas.toDataURL('image/webp',.9).split(',')[1];},{kind,index});const name=`${kind}-${typeof index==='number'?String(index+1).padStart(2,'0'):index}.webp`;writeFileSync(new URL('./assets/'+name,import.meta.url),Buffer.from(data,'base64'));console.log(name);}
  await page.evaluate(()=>window.artView.dispose());
 }finally{const cleanup=await closeBrowserSessionResources({context,browser});console.log(JSON.stringify({assetAuthoringOnly:true,cleanup}));if(!cleanup.ok)throw Error('ART_BROWSER_CLEANUP_FAILED');}
}
if(process.argv[1]===fileURLToPath(import.meta.url)&&process.argv.includes('--art'))await renderAssets();
else if(process.argv[1]===fileURLToPath(import.meta.url)){
 const levels=authorStages({limit:Number(process.env.NORI_STAGE_LIMIT||30)});
 writeFileSync(new URL('./stages.mjs',import.meta.url),'/* Frozen authored boards and reproducible action witnesses; generated by generate-content.mjs. */\nexport const LEVELS='+JSON.stringify(levels,null,2)+';\n');
 console.log(JSON.stringify({written:levels.length,totalWitnessMoves:levels.reduce((n,l)=>n+l.par,0)}));
}
