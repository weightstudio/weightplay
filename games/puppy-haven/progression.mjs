// Persisted individual identity and bounded collection progression.
export const TRAITS=['power','vitality','swift','guardian','gentle','focused'];
const integer=(v,lo,hi)=>Number.isFinite(v)?Math.max(lo,Math.min(hi,Math.floor(v))):lo;
export function individual(d){
 const id=Number.isSafeInteger(d.id)&&d.id>0?d.id:1,raw=d.individual||{};
 return {trait:TRAITS.includes(raw.trait)?raw.trait:TRAITS[(id-1)%6],
  vitality:Number.isFinite(raw.vitality)?integer(raw.vitality,0,10):id*7%11,
  power:Number.isFinite(raw.power)?integer(raw.power,0,12):id*5%13,
  pace:Number.isFinite(raw.pace)?integer(raw.pace,0,6):id*3%7};
}
export const trainingLevel=d=>integer(d.trainingLevel||1,1,10);
export const trainingCost=d=>trainingLevel(d)>=10?null:30+20*(trainingLevel(d)-1);
export function collectionCapacity(s){return Math.min(512,integer(s.collectionBase||16,16,512)+8*integer(s.collectionTier,0,6));}
export function expansionCost(s){return integer(s.collectionTier,0,6)>=6||collectionCapacity(s)>=512?null:5+3*integer(s.collectionTier,0,6);}
export function normalizePopulation(s,raw={}){
 const residents=s.dogs.concat(s.restDogs),reserved=residents.length+s.dogs.filter(d=>d.pregnancy).length;
 s.populationVersion=1;s.collectionBase=raw.populationVersion===1?integer(raw.collectionBase||16,16,512):Math.min(512,Math.max(16,Math.ceil(reserved/8)*8));
 s.collectionTier=integer(raw.collectionTier,0,Math.min(6,Math.floor((512-s.collectionBase)/8)));
 s.breedingPaused=raw.breedingPaused===true;s.lineage={};
 for(const [key,parents]of Object.entries(raw.lineage||{}).slice(0,20000)){
  const id=Number(key);if(Number.isSafeInteger(id)&&id>0&&Array.isArray(parents))s.lineage[id]=[...new Set(parents.filter(p=>Number.isSafeInteger(p)&&p>0&&p<id))].slice(0,2);
 }
 for(const d of residents)s.lineage[d.id]=d.parents.slice();
 pruneLineage(s);
}
export function pruneLineage(s){
 const keep={},pending=s.dogs.concat(s.restDogs).map(d=>d.id),seen=new Set();
 while(pending.length){const id=pending.pop();if(seen.has(id))continue;seen.add(id);const parents=s.lineage?.[id]||[];keep[id]=parents;pending.push(...parents);}
 s.lineage=keep;
}
