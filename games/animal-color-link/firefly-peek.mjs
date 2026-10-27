// Bounded, read-only suggestion. Exhaustion is unknown, never a claim of impossibility.
export function fireflyPeek(level,fixedPaths={},active=null,maxNodes=150000){
 const n=level?.size,total=n*n,count=level?.count;if(!Number.isInteger(n)||n<2||n>7||!Number.isInteger(count)||count<1||count>6||!Number.isSafeInteger(maxNodes)||maxNodes<1)return {status:'invalid'};
 const bit=x=>1n<<BigInt(x),adj=(a,b)=>Math.abs(Math.floor(a/n)-Math.floor(b/n))+Math.abs(a%n-b%n)===1,all=(1n<<BigInt(total))-1n;
 const ends=Array.from({length:count},(_,c)=>level.ends?.[c]);if(ends.some(p=>!Array.isArray(p)||p.length!==2||p.some(x=>!Number.isInteger(x)||x<0||x>=total)))return {status:'invalid'};
 const endOwners=new Map();for(let c=0;c<count;c++)for(const x of ends[c]){if(endOwners.has(x))return {status:'invalid'};endOwners.set(x,c)}
 const gates=level.gates||[],gateOwners=new Map();for(const g of gates){if(!Number.isInteger(g.color)||g.color<0||g.color>=count||!Number.isInteger(g.cell)||g.cell<0||g.cell>=total||gateOwners.has(g.cell)||endOwners.has(g.cell))return {status:'invalid'};gateOwners.set(g.cell,g.color)}
 const cellsValid=(p,c,complete)=>Array.isArray(p)&&p.length>0&&p.every((x,i)=>Number.isInteger(x)&&x>=0&&x<total&&(i===0||adj(p[i-1],x))&&(endOwners.get(x)===undefined||endOwners.get(x)===c)&&(gateOwners.get(x)===undefined||gateOwners.get(x)===c))&&new Set(p).size===p.length&&ends[c].includes(p[0])&&(!complete||p.at(-1)===ends[c].find(x=>x!==p[0])&&gates.filter(g=>g.color===c).every(g=>p.includes(g.cell)));
 let used=0n;const paths={};for(const [key,p] of Object.entries(fixedPaths)){const c=Number(key);if(!Number.isInteger(c)||c<0||c>=count||!cellsValid(p,c,true))return {status:'invalid'};for(const x of p){if(used&bit(x))return {status:'invalid'};used|=bit(x)}paths[c]=[...p]}
 let activeColor=null,activePrefix=null;if(active){activeColor=Number(active.color);activePrefix=active.cells;if(!Number.isInteger(activeColor)||activeColor<0||activeColor>=count||paths[activeColor]||!cellsValid(activePrefix,activeColor,false)||activePrefix.slice(1,-1).some(x=>endOwners.has(x)))return {status:'invalid'};for(const x of activePrefix){if(used&bit(x))return {status:'invalid'};used|=bit(x)}}
 const remaining=Array.from({length:count},(_,i)=>i).filter(c=>!paths[c]);if(activeColor!==null){remaining.splice(remaining.indexOf(activeColor),1);remaining.unshift(activeColor)}
 // Fast path is valid only if the entire authored solution is independently
 // checked and every current line matches it in either orientation.
 const canonical=Array.from({length:count},(_,c)=>level.solution?.[c]);let canonicalMask=0n,canonicalValid=true;
 for(let c=0;c<count;c++){const p=canonical[c];if(!cellsValid(p,c,true)){canonicalValid=false;break}for(const x of p){if(canonicalMask&bit(x))canonicalValid=false;canonicalMask|=bit(x)}}
 canonicalValid=canonicalValid&&canonicalMask===all;
 const orientation=(p,c)=>{const a=canonical[c],b=[...a].reverse();return p.every((x,i)=>a[i]===x)?a:p.every((x,i)=>b[i]===x)?b:null};
 if(canonicalValid&&Object.entries(paths).every(([c,p])=>orientation(p,Number(c))!==null)&&(!active||orientation(activePrefix,activeColor)!==null)){
  if(active){const p=orientation(activePrefix,activeColor),next=p[activePrefix.length];if(next!==undefined)return {status:'step',color:activeColor,cell:next,nodes:0};}
  const next=remaining.find(c=>c!==activeColor);return next===undefined?{status:'complete',nodes:0}:{status:'start',color:next,cell:canonical[next][0],nodes:0};
 }
 let nodes=0,solution=null,exhausted=false;
 function explore(which,occupied){if(solution||exhausted)return;if(++nodes>maxNodes){exhausted=true;return}if(which===remaining.length){if(occupied===all)solution=Object.fromEntries(Object.entries(paths).map(([c,p])=>[c,[...p]]));return}
  const c=remaining[which],prefix=c===activeColor?[...activePrefix]:[ends[c][0]],target=ends[c].find(x=>x!==prefix[0]);let pathMask=0n;for(const x of prefix)pathMask|=bit(x);let base=c===activeColor?occupied:occupied|pathMask;if(c!==activeColor&&(occupied&pathMask))return;
  function walk(at,mask){if(solution||exhausted)return;if(++nodes>maxNodes){exhausted=true;return}if(at===target){if(gates.filter(g=>g.color===c).every(g=>prefix.includes(g.cell))){paths[c]=[...prefix];explore(which+1,base|mask);delete paths[c]}return}
   const row=Math.floor(at/n),col=at%n,ns=[col?at-1:-1,col<n-1?at+1:-1,row?at-n:-1,row<n-1?at+n:-1];for(const x of ns){if(x<0||((base|mask)&bit(x))||endOwners.has(x)&&endOwners.get(x)!==c||gateOwners.has(x)&&gateOwners.get(x)!==c)continue;prefix.push(x);walk(x,mask|bit(x));prefix.pop();if(solution||exhausted)return}}
  walk(prefix.at(-1),0n);
 }
 explore(0,used);if(!solution)return {status:exhausted?'unknown':'no-completion',nodes};
 if(activeColor!==null){const next=solution[activeColor][activePrefix.length];if(next!==undefined)return {status:'step',color:activeColor,cell:next,nodes};}
 const next=remaining.find(c=>c!==activeColor);return next===undefined?{status:'complete',nodes}:{status:'start',color:next,cell:solution[next][0],nodes};
}
