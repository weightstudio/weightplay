export const SAVE_KEY = 'weightplay-acorn-auction-market-v2';
export const LEGACY_KEY = 'weightplay-acorn-auction-best-v1';
export const POSTER = '/assets/interface7-redrawn/animal-acorn-auction.webp';
export const RUX = '/assets/weightplay-character-gear-horn-rhino-block-v1.webp';
export const ACORN = '/assets/animal-block-grove-icon-acorn.webp';
export const COIN = '/assets/animal-rune-reels/block-v1/ui-coin-block-v1.webp';
// lot: count, price, gold, discount per bell, rival takes it at this bell (0=never).
const lot = ([count, price, gold=0, discount=0, rival=0]) => ({count,price,gold,discount,rival});
const stage = (id,name,zh,goal,budget,slots,lots,extra={}) => Object.freeze({
  id,name,zh,goal,budget,slots,arc:Math.floor((id-1)/5),gold:0,bells:0,
  checkpoint:id%5===0,lots:lots.map(lot),...extra,
});
export const STAGES = [
  stage(1,'First basket','第一籃橡果',3,5,1,[[2,4],[3,5],[4,6]]),
  stage(2,'Lantern supper','燈下晚餐',4,6,1,[[4,8],[3,4],[4,6]]),
  stage(3,'The small picnic','小小野餐',2,7,1,[[2,7],[3,5],[4,8]]),
  stage(4,'A fair price','公平的價格',5,8,1,[[5,8],[5,6],[6,5]]),
  stage(5,'Rux’s inspection','魯克斯的檢查',6,9,1,[[7,8],[6,10],[6,9]]),
  stage(6,'Two little crates','兩只小木箱',5,8,2,[[2,3],[3,4],[5,10]]),
  stage(7,'Leave the big lot','放下大木箱',6,9,2,[[6,12],[4,5],[2,3]]),
  stage(8,'Three-way delivery','三份合送',6,9,3,[[1,2],[2,3],[3,4]]),
  stage(9,'Exact change','剛好的零錢',7,10,2,[[3,4],[7,11],[4,6]]),
  stage(10,'Warehouse keeper','倉庫管理員',8,11,2,[[3,4],[5,7],[8,13]]),
  stage(11,'Golden harvest','金色的收成',4,8,1,[[4,6,0],[4,8,2],[5,7,3]],{gold:2}),
  stage(12,'Quality counts','品質也重要',5,10,2,[[3,5,2],[2,4,0],[5,8,1]],{gold:2}),
  stage(13,'Split the gold','分裝金橡果',6,11,2,[[3,5,1],[3,5,2],[6,8,2]],{gold:3}),
  stage(14,'A simple filler','樸實的搭配',7,12,2,[[5,7,3],[2,2,0],[2,5,2]],{gold:3}),
  stage(15,'The quality seal','品質封印',8,13,2,[[4,6,2],[4,6,2],[8,10,3]],{gold:4}),
  stage(16,'Wait for the bell','等待鐘聲',4,7,1,[[4,9,0,2],[3,5],[5,6]],{bells:2}),
  stage(17,'One bell bargain','一響好買賣',6,8,2,[[2,4,0,1],[4,7,0,2],[6,12,0,1]],{bells:2}),
  stage(18,'The rival’s eye','對手看中了',5,8,1,[[5,7,0,1,1],[5,12,0,1],[4,5,0,1]],{bells:2}),
  stage(19,'Now or together','現在或合購',7,11,2,[[7,10,0,1,1],[3,7,0,2],[4,8,0,2]],{bells:2}),
  stage(20,'Closing bell','閉市鐘聲',8,10,2,[[3,8,1,2],[5,10,1,3],[8,9,0,0,1]],{gold:2,bells:2}),
  stage(21,'One basket only','只能帶一籃',6,9,1,[[3,3,1],[3,3,1],[6,9,1]],{gold:1}),
  stage(22,'Room for quality','留給好橡果',5,9,1,[[2,3,2],[5,9,2],[3,4,0]],{gold:2}),
  stage(23,'Pack light','輕裝採買',9,13,2,[[4,5],[5,7],[3,2]]),
  stage(24,'Golden cargo','金色貨物',7,12,2,[[2,4,2],[5,7,1],[7,9,2]],{gold:3}),
  stage(25,'Express delivery','特快委託',8,12,1,[[8,12,3],[4,4,2],[4,5,2]],{gold:3}),
  stage(26,'The patient buyer','有耐心的買家',9,12,2,[[4,8,2,2],[5,9,1,2],[9,11,2,1,1]],{gold:3,bells:2}),
  stage(27,'Take it early','先下手為強',7,11,1,[[7,10,3,1,1],[7,14,3,1],[6,8,3,2]],{gold:3,bells:2}),
  stage(28,'A different route','換個採購法',10,13,2,[[4,7,2,1,2],[6,10,2,2],[10,16,4,2]],{gold:4,bells:2}),
  stage(29,'Last lantern','最後一盞燈',9,11,2,[[3,7,2,2],[6,10,2,3],[9,10,3,0,1]],{gold:4,bells:2}),
  stage(30,'Harvest festival','豐收慶典',10,12,2,[[4,9,2,2],[6,11,3,3],[10,11,4,0,1]],{gold:5,bells:2}),
];
export function priceAt(lot,bell) { return Math.max(1,lot.price-lot.discount*bell); }
export function available(lot,bell) { return !lot.rival || bell<lot.rival; }
export function totals(stage,selected,bell) {
  return [...new Set(selected)].reduce((a,i)=>{const l=stage.lots[i];if(!l)return a;
    a.count+=l.count;a.gold+=l.gold;a.cost+=priceAt(l,bell);a.crates++;return a;
  },{count:0,gold:0,cost:0,crates:0});
}
export function checkBid(stage,selected,bell) {
  const t=totals(stage,selected,bell);
  let reason = !t.crates?'empty':selected.some(i=>!stage.lots[i]||!available(stage.lots[i],bell))?'sold':
    t.crates>stage.slots?'capacity':t.count!==stage.goal?'quantity':t.gold<stage.gold?'quality':t.cost>stage.budget?'budget':null;
  return {ok:reason===null,reason,...t};
}
export function solutions(stage) {
  const out=[];
  for(let bell=0;bell<=stage.bells;bell++) for(let mask=1;mask<8;mask++) {
    const selected=[0,1,2].filter(i=>mask&(1<<i)), bid=checkBid(stage,selected,bell);
    if(bid.ok)out.push({selected,bell,...bid});
  }
  return out.sort((a,b)=>a.cost-b.cost||a.bell-b.bell);
}
export function starsFor(stage,bid,mistakes) {
  return bid.ok?1+(mistakes===0?1:0)+(bid.cost===solutions(stage)[0]?.cost?1:0):0;
}
const natural = (n,max=999) => Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
export function normalizeSave(raw,legacyBest=0) {
  const v = raw && typeof raw==='object' ? raw : {};
  const cleared={}, best={};
  for(const s of STAGES) {
    const n=natural(v.cleared?.[s.id],3);if(n)cleared[s.id]=n;
    const cost=v.best?.[s.id];if(n&&Number.isFinite(cost)&&cost>0)best[s.id]=natural(cost);
  }
  if(!v.schema&&Number.isFinite(legacyBest)&&legacyBest>=3)for(let i=1;i<=3;i++)cleared[i]=Math.max(cleared[i]||0,1);
  const skins=['oak','amber',...(v.skins?.includes?.('moon')?['moon']:[])];
  const theme=skins.includes(v.theme)&& (v.theme!=='amber'||Object.keys(cleared).length>=10)?v.theme:'oak';
  return {schema:2,cleared,best,skins,theme,legacyBest:natural(v.legacyBest||legacyBest)};
}
export function unlocked(save) {
  let id=1;while(id<STAGES.length&&save.cleared[id])id++;return id;
}
export function settle(save,stage,bid,mistakes) {
  if(!bid.ok)return save;
  return {...save,cleared:{...save.cleared,[stage.id]:Math.max(save.cleared[stage.id]||0,starsFor(stage,bid,mistakes))},
    best:{...save.best,[stage.id]:Math.min(save.best[stage.id]??Infinity,bid.cost)}};
}
export function purchaseMoon(save,storage,wallet) {
  if(save.skins.includes('moon'))return {save,reason:'owned',purchased:false};
  if(!wallet||wallet.read().diamonds<8)return {save,reason:'insufficient',purchased:false};
  const next={...save,theme:'moon',skins:[...save.skins,'moon']};
  try {
    // Durable inventory first: a rejected storage write can never consume diamonds.
    storage.setItem(SAVE_KEY,JSON.stringify(next));
    if(!wallet.spendDiamonds(8)){storage.setItem(SAVE_KEY,JSON.stringify(save));return {save,reason:'insufficient',purchased:false};}
    return {save:next,reason:null,purchased:true};
  }catch{
    try{storage.setItem(SAVE_KEY,JSON.stringify(save));}catch{}
    return {save,reason:'saveError',purchased:false};
  }
}
