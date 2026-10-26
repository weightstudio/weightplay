export function normalizeProgress(rawBest,rawRecords,total){
 const value=Number(rawBest),best=Number.isFinite(value)?Math.max(0,Math.min(total,Math.floor(value))):0,records={};
 let parsed=rawRecords;try{if(typeof parsed==='string')parsed=JSON.parse(parsed);}catch{parsed={};}
 if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))for(const [key,raw]of Object.entries(parsed)){const n=Number(key),score=Number(raw);if(/^\d+$/.test(key)&&Number.isInteger(n)&&n>=1&&n<=total&&Number.isFinite(score)&&score>=1)records[n]=Math.floor(score);}
 return {best,records};
}
export function mergeProgress(a,b){const records={...a.records};for(const [n,value]of Object.entries(b.records))records[n]=records[n]===undefined?value:Math.min(records[n],value);return {best:Math.max(a.best,b.best),records};}
