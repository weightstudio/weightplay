// Authored observation boards. Each change is an actual geometry/material delta.
export const BIOMES = [
  { sky: '#d7edce', ground: '#8fba62', edge: '#688b49', leaf: '#57964f', light: '#fff2cd', roof: '#d27656', water: '#67c8cf' },
  { sky: '#c2e9e1', ground: '#7fac70', edge: '#497b60', leaf: '#3b8566', light: '#e6fff0', roof: '#568b91', water: '#4cb9c8' },
  { sky: '#f2dfba', ground: '#baac62', edge: '#8d7849', leaf: '#d29945', light: '#fff0cf', roof: '#a65b42', water: '#6eb4ad' },
  { sky: '#acb4d8', ground: '#7c91a0', edge: '#56677d', leaf: '#6c8c88', light: '#ffdfba', roof: '#755b98', water: '#8298cd' },
  { sky: '#d9e9ed', ground: '#d6e6db', edge: '#91afa5', leaf: '#9bc7bc', light: '#f1f6ff', roof: '#7f9ba5', water: '#8fc9e0' },
  { sky: '#d8cbe0', ground: '#97ac84', edge: '#667c66', leaf: '#a68dba', light: '#ffe4ac', roof: '#b37878', water: '#85b9c9' },
];
export const OBJECTS = ['tree','cottage','pond','mushrooms','flowers','rabbit','mailbox','crate','sign','lantern'];
const rows = [
  ['A little surprise','初見小驚喜','color','flowers:color mushrooms:color cottage:color'],
  ['The curious trail','好奇心小徑','shape','tree:shape sign:shape rabbit:color'],
  ['Garden treasures','花園小寶藏','count','flowers:count crate:count pond:count'],
  ['A second glance','再看一眼','mixed','mushrooms:shape mailbox:color lantern:color cottage:shape'],
  ['Spring survey','春日觀察家','mixed','tree:shape flowers:count rabbit:color sign:shape pond:count'],
  ['Lily letters','睡蓮的來信','missing','mailbox:missing flowers:color pond:count'],
  ['The quiet shore','安靜的水岸','missing','mushrooms:missing sign:missing cottage:color'],
  ['Ripple count','水波數數看','count','pond:count flowers:count lantern:shape crate:count'],
  ['Waterway signs','水邊的路標','direction','sign:direction rabbit:direction mailbox:direction'],
  ['Pond detective','池塘小偵探','mixed','pond:count mailbox:missing flowers:shape rabbit:direction cottage:color'],
  ['Amber arrivals','琥珀色來客','color','tree:color cottage:color mushrooms:color lantern:color'],
  ['Harvest baskets','豐收的木箱','count','crate:count flowers:count mushrooms:count pond:count'],
  ['Which way home?','回家是哪邊？','direction','sign:direction mailbox:direction rabbit:direction cottage:shape'],
  ['Hidden harvest','藏起來的收成','missing','crate:missing lantern:missing flowers:shape tree:color'],
  ['Orchard keeper','果園守望者','mixed','crate:count sign:direction tree:color mushrooms:missing cottage:shape'],
  ['The first lantern','第一盞營燈','shape','lantern:shape mailbox:shape tree:shape cottage:shape'],
  ['Twilight visitors','暮色中的訪客','direction','rabbit:direction sign:direction mailbox:direction flowers:color'],
  ['Camp inventory','營地點點名','count','lantern:count crate:count mushrooms:count pond:count'],
  ['A missing parcel','不見的小包裹','missing','crate:missing mushrooms:missing sign:missing rabbit:color'],
  ['Twilight lookout','暮光巡守員','mixed','lantern:count cottage:shape mailbox:direction flowers:missing tree:color'],
  ['Winter whispers','冬日悄悄話','shape','tree:shape mushrooms:shape flowers:shape lantern:shape'],
  ['Tracks in snow','雪地裡的腳印','direction','sign:direction rabbit:direction mailbox:direction pond:count'],
  ['Frost blossoms','霜花盛開時','count','flowers:count tree:shape crate:count mushrooms:count lantern:color'],
  ['The silent garden','靜悄悄的花園','missing','flowers:missing mailbox:missing lantern:missing cottage:color'],
  ['Winter naturalist','冬日博物家','mixed','tree:shape crate:count sign:direction mushrooms:missing pond:count'],
  ['Festival invitations','花燈邀請函','mixed','mailbox:color lantern:count flowers:shape rabbit:direction'],
  ['Colours after dusk','入夜後的色彩','mixed','tree:color cottage:color flowers:count mushrooms:shape lantern:color'],
  ['One last delivery','最後一份禮物','mixed','crate:missing mailbox:direction pond:count sign:shape rabbit:color'],
  ['Almost a mirror','幾乎一模一樣','mixed','flowers:missing mushrooms:count cottage:shape lantern:count tree:color'],
  ['The grand garden','草地觀察大師','mixed','tree:shape cottage:color pond:count flowers:missing rabbit:direction lantern:count'],
];
export const LEVELS = Object.freeze(rows.map((row,i)=>Object.freeze({
  id:i+1, en:row[0], zh:row[1], lesson:row[2], biome:Math.floor(i/5), layout:i%5,
  changes:Object.freeze(Object.fromEntries(row[3].split(' ').map(v=>v.split(':')))), checkpoint:(i+1)%5===0,
})));
export const SAVE_KEY = 'weightplay-meadow-garden-v13';
export function normalizeSave(raw) {
  const value = raw && typeof raw === 'object' ? raw : {};
  const stars = Array.from({length:30},(_,i)=>Number.isInteger(value.stars?.[i]) ? Math.max(0,Math.min(3,value.stars[i])) : 0);
  // Only contiguous completed stages unlock the next; malformed values cannot skip a campaign.
  let unlocked=1;
  while(unlocked<30 && stars[unlocked-1]>0) unlocked++;
  return {schema:1,stars,unlocked};
}
export function createRun(level) { return {level,found:[],mistakes:0,hints:0,settled:false}; }
export function choose(run,id) {
  if(run.settled || run.found.includes(id)) return 'ignored';
  if(!Object.hasOwn(run.level.changes,id)){run.mistakes++;return 'miss';}
  run.found.push(id);
  return run.found.length===Object.keys(run.level.changes).length ? 'complete' : 'found';
}
export function settle(run,save) {
  if(run.settled || run.found.length!==Object.keys(run.level.changes).length)return null;
  run.settled=true;
  const stars=run.mistakes===0 && run.hints===0 ? 3 : run.mistakes<=3 && run.hints<=1 ? 2 : 1;
  save.stars[run.level.id-1]=Math.max(save.stars[run.level.id-1],stars);
  save.unlocked=normalizeSave(save).unlocked;
  return stars;
}
