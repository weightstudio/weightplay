// Deterministic rules. Rendering and wall-clock time never decide a result.
export const MATERIALS = Object.freeze([
  { id: 'felt', width: 0.96, overlap: 0.56, perfect: 0.22, points: 100, color: '#52b9a8' },
  { id: 'linen', width: 0.84, overlap: 0.62, perfect: 0.15, points: 145, color: '#e8b957' },
  { id: 'cloud', width: 1.08, overlap: 0.67, perfect: 0.19, points: 120, color: '#e58f9b' },
]);
// name, layers, sweep, wind, landing offsets, material order. Each row is authored.
const rows = [
  ['First light','晨光第一層',4,.72,0,[0],[]],
  ['A softer landing','輕輕落下',5,.85,0,[0],[]],
  ['Little lookout','小小瞭望台',5,.95,0,[0,.12,0],[]],
  ['Golden stitches','金色縫線',6,1.05,0,[0],['linen','felt']],
  ['Meadow celebration','草地慶典',6,1.12,0,[0,.15,-.15,0],['felt','linen','cloud']],
  ['A gentle breeze','微風來訪',5,.9,.24,[0],[]],
  ['Across the pond','池塘另一端',6,1,.32,[0,.12],[]],
  ['Wind chimes','風鈴輕響',6,1.05,-.36,[0],['felt','cloud']],
  ['Follow the wind','順風而行',7,1.12,.42,[0,-.15,0],[]],
  ['Breeze festival','風之祭典',7,1.18,.48,[0,.15,-.15],['cloud','felt','linen']],
  ['Follow the lantern','跟著燈光',5,.95,0,[0,.35,-.2],[]],
  ['Stepping stones','踏石小徑',6,1,.15,[.3,-.3],[]],
  ['A winding path','蜿蜒小路',6,1.08,0,[.3,.3,-.35,-.3],['linen','felt']],
  ['Lantern crossing','燈火交會',7,1.12,-.25,[.4,-.4,0],[]],
  ['Moon bridge','月光之橋',7,1.2,.3,[.4,0,-.4,0],['felt','cloud','linen']],
  ['High above','高高在上',6,1.05,0,[0],['linen']],
  ['The slender spire','纖細塔尖',7,1.12,.18,[0,.2,-.2],['linen','felt']],
  ['Quiet balance','靜心平衡',7,1.2,-.25,[.25,-.25],['linen']],
  ['Cloud staircase','雲端階梯',8,1.22,.32,[.3,.3,-.3,-.3],['cloud','linen']],
  ['Sky garden','天空花園',8,1.3,.4,[0,.35,-.35],['linen','cloud','felt']],
  ['Taro’s fabric order','塔羅的訂單',6,1.08,0,[0],['cloud','linen','felt']],
  ['Patchwork parade','拼布遊行',7,1.15,.24,[.2,-.2],['linen','cloud','linen','felt']],
  ['Rose and gold','玫瑰與金色',7,1.22,-.32,[.35,0,-.35],['cloud','linen']],
  ['The quilted trail','縫製小徑',8,1.25,.38,[.25,.25,-.35,-.25],['felt','cloud','linen','cloud']],
  ['Atelier masterpiece','工坊代表作',8,1.35,-.44,[.4,-.4,0],['linen','cloud','felt','linen']],
  ['Into the twilight','走入暮色',7,1.18,.4,[0,.4,-.4],['felt','linen','cloud']],
  ['Starry switchback','星光折返',8,1.25,-.44,[.4,-.3,.3,-.4],['cloud','linen']],
  ['Above the clouds','雲海之上',8,1.3,.5,[.35,.35,-.35,-.35],['linen','felt','cloud']],
  ['One last lantern','最後一盞燈',9,1.35,-.52,[.4,0,-.4,0],['cloud','linen','felt','linen']],
  ['Taro’s sky palace','塔羅的天空城',10,1.4,.55,[0,.4,-.4,.25,-.25],['felt','linen','cloud','linen','felt']],
];
export const STAGES = Object.freeze(rows.map((r,i) => Object.freeze({
  id:i+1, name:r[0], zh:r[1], layers:r[2], speed:r[3], wind:r[4], offsets:r[5], order:r[6],
  arc:Math.floor(i/5), checkpoint:(i+1)%5===0, base:i>=15?3.3:3.7,
})));
export const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
export function nextCushion(supportWidth, material) {
  return clamp(supportWidth * MATERIALS[material].width, 1.35, 4.15);
}
export function landingTarget(stage, layer, supportX) {
  return clamp(supportX + stage.offsets[layer % stage.offsets.length], -2.1, 2.1);
}
export function evaluateLanding({x,width,supportX,supportWidth,material,target}) {
  const m = MATERIALS[material];
  const overlap = Math.max(0,Math.min(x+width/2,supportX+supportWidth/2)-Math.max(x-width/2,supportX-supportWidth/2));
  const fraction = overlap/width;
  const success = fraction + 1e-8 >= m.overlap;
  return {success, fraction, perfect:success && Math.abs(x-target)<=m.perfect, error:Math.abs(x-target)};
}
export function starsFor(run) {
  if (!run.won) return 0;
  return 1 + Number(run.perfects >= Math.ceil(run.goal*.4)) + Number(run.misses===0 && run.perfects>=Math.ceil(run.goal*.7));
}
export function normalizeSave(raw, legacy) {
  const finite = (v,max=999999) => clamp(Number.isFinite(Number(v))?Math.trunc(Number(v)):0,0,max);
  const input = raw?.version===2 ? raw : legacy?.version===1 ? legacy : {};
  const cleared = STAGES.map((_,i)=>input.cleared?.[i]===true);
  const prefix=cleared.findIndex(v=>!v);
  const unlocked=Math.max(1,Math.min(STAGES.length,prefix<0?STAGES.length:prefix+1,finite(input.unlocked,30)||1));
  return {version:2,unlocked,cleared,stars:STAGES.map((_,i)=>finite(raw?.stars?.[i],3)),
    bests:STAGES.map((_,i)=>finite(raw?.bests?.[i])),moonOwned:raw?.moonOwned===true,
    palette:raw?.moonOwned===true && raw.palette==='moon'?'moon':'garden',tutorialSeen:raw?.tutorialSeen===true};
}
export function recordClear(save, run) {
  const i=run.stage;
  if (!run.won || i<0 || i>=STAGES.length) return save;
  return {...save,unlocked:Math.max(save.unlocked,Math.min(30,i+2)),
    cleared:save.cleared.map((v,j)=>j===i?true:v),
    stars:save.stars.map((v,j)=>j===i?Math.max(v,starsFor(run)):v),
    bests:save.bests.map((v,j)=>j===i?Math.max(v,run.score):v)};
}
