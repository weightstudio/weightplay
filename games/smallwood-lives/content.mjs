// Authored chapter topology. Text belongs to the selected locale, never the reducer.
export const GAME_ID = 'smallwood-lives';
export const VERSION = 1;
export const LOCALES = ['en','zh-Hant','zh-Hans','ja','ko','es','pt-BR','fr','de','it','ru','hi','ar'];
export const ROUTES = ['en','zh-tw','zh-cn','ja','ko','es','pt-br','fr','de','it','ru','hi','ar'];
export const SPECIES = ['squirrel','rabbit','fox','deer','otter','hedgehog'];
export const NAMES = ['Lumi','Sora','Miro','Tavi','Nela','Rumi','Fenn','Kiri'];
const topology = [
 ['gift:A','boundary:A','memory',4,3],['promise:A','repair:A','memory',4,3],
 ['invite:A:B','learn','memory',5,2],['learn','repair:A','boundary:A',3,4],
 ['invite:A:B','build:selected','memory',4,3],['gift:B','invite:A:B','memory',4,2],
 ['boundary:A','learn','memory',3,4],['allocate:A:B','repair:allocated','memory',4,4],
 ['promise:A','boundary:B','memory',2,3],['learn','promise:A:B','memory',4,3],
 ['learn','mentor:A','memory',4,3],['gift:A','move','contact',4,4],
 ['move','contact','memory',5,2],['learn','weather','memory',4,2],
 ['allocate:A:B','move','build:location',4,4],['gift:B','build:B','memory',3,5],
 ['learn','mentor:A','promise:A',5,2],['repair:A','invite:B:C','build:selected',4,4],
 ['build:A','boundary:A','memory',4,3],['learn','mentor:B','build:B',4,3],
 ['gift:A','weather','memory',4,3],['allocate:A:B','promise:C','memory',4,4],
 ['move','contact','build:B',3,4],['repair:A','mentor:B','memory',4,3],
 ['learn','weather','memory',4,3],['invite:A:B','mentor:selected','memory',4,3],
 ['move','contact','build:B',4,4],['allocate:A:B','mentor:allocated','boundary:A',3,5],
 ['boundary:A','invite:B:C','memory',4,3],['learn','mentor:choice','legacy',4,4],
];
export const STAGES = topology.map(([a,b,c,E,M],index)=>Object.freeze({
 id:`S${String(index+1).padStart(2,'0')}`,index,number:index+1,arc:Math.floor(index/5),
 events:[a,b,c].map((token,i)=>{const [family,target='A',second='B']=token.split(':');return {id:`S${String(index+1).padStart(2,'0')}-E${i+1}`,family,target,second,season:[2,6,10][i],echoSeason:[4,8,12][i],slot:i};}),
 initial:{E,M},poster:`/games/${GAME_ID}/assets/arc-${Math.floor(index/5)+1}.webp`,checkpoint:(index+1)%5===0,
 species:[[0,1],[4,1],[3,2],[0,4],[5,3],[0,2]][Math.floor(index/5)]
}));
export const COSMETICS = [
 {id:'warm-lamps',cost:3,unlock:1,model:30},
 {id:'moon-cabinet',cost:8,unlock:5,model:31},
 {id:'starlit-garden',cost:12,unlock:10,model:32}
];
export const LIMITS = {T:2,E:6,M:9,W:3,N:3,A:3,B:3,C:3};
export const DAILY_IDS = Array.from({length:12},(_,i)=>i+1);
export function seededRandom(seed){let x=seed>>>0;return ()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
export function chapter(index){if(!Number.isInteger(index)||index<0||index>=30)throw Error('invalidStage');return STAGES[index];}
