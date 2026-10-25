export const GAME_ID = 'meadow-touchdown';
export const SAVE_KEY = 'weightplay-meadow-touchdown-save-v1';
export const LANES = [-8, -4, 0, 4, 8];
export const PLAYBOOKS = [
  { id: 'P1', unlock: 0, paths: [[[-6,5],[-8,14]],[[0,16]],[[6,5],[8,14]]], delay: [0,0,0] },
  { id: 'P2', unlock: 5, paths: [[[-6,4],[6,10]],[[0,16]],[[6,4],[-6,10]]], delay: [0,0,0] },
  { id: 'P3', unlock: 10, paths: [[[-6,10],[-4,8]],[[0,5],[2,5]],[[6,10],[4,8]]], delay: [0,0,0] },
  { id: 'P4', unlock: 15, paths: [[[-8,12]],[[0,14]],[[6,4],[8,8]]], delay: [.6,.9,0] },
  { id: 'P5', unlock: 20, paths: [[[-6,7],[-8,15]],[[0,9],[-4,14]],[[6,7],[8,15]]], delay: [0,0,0] },
  { id: 'P6', unlock: 25, paths: [[[-8,0],[-8,16]],[[0,5],[4,5]],[[6,10],[2,13]]], delay: [0,0,0] }
];
const rows = [
  [12,7,100,'M2'],[22,7,110,'M2 ZD'],[24,6.5,110,'M3'],[26,6.5,115,'M2 ZC'],[24,6.5,120,'M2',0,'pair'],
  [20,6,110,'M3 ZL'],[26,6,115,'ZC ZL'],[28,6,115,'ZC ZR'],[30,6,120,'ZL ZR ZC'],[30,6,125,'ZL ZR',0,'gate'],
  [24,5.5,110,'M2 BR'],[28,5,115,'ZC BL'],[30,5,115,'ZL BR MR'],[32,5,120,'ZL ZR BL'],[32,5,125,'M3 BR',0,'change'],
  [24,6,110,'M2',2],[28,6,115,'ZL ZR',2],[30,5.5,120,'ZC BR',2],[34,5.5,125,'M2 ZC',3],[32,6,125,'ZL ZC',3,'gust'],
  [28,6,115,'S'],[32,6,120,'S ZC'],[32,5.5,120,'S BR'],[36,5.5,125,'S ZC',2],[34,6,125,'M2 ZC',0,'feint'],
  [34,5.5,125,'ZL ZR BR'],[36,5,130,'M2 ZC BL'],[36,5.5,130,'S BR',3],[40,5.5,135,'M2 ZC BL',2],[24,6,170,'ZL ZR BR',0,'relay']
];
export const STAGES = rows.map(([distance,throwTime,time,defense,wind=0,special=''],i) => Object.freeze({
  id: `meadow-${String(i+1).padStart(2,'0')}`, number:i+1, arc:Math.floor(i/5), distance, throwTime, time, defense, wind, special,
  maxBook:Math.min(6,1+Math.floor(i/5)), checkpoint:(i+1)%5===0, seed:1001+i,
  manCushion:[6,15,25].includes(i+1)?2.4:0,
  contain:[6,7,8,9,15].includes(i+1)?2.5:0,
  zoneHomes:i===6?{ZL:[-6,13]}:i===7?{ZR:[6,13]}:i===8?{ZL:[-4,7],ZR:[4,7],ZC:[0,16]}:{}
}));
export const COSMETICS = [
  {id:'aurora-kit',sku:'meadow-touchdown:aurora-kit',cost:18},
  {id:'twilight-stands',sku:'meadow-touchdown:twilight-stands',cost:24}
];
export const CAST = ['fia','mimi','panko'];
export const PORTRAITS = {
  leo:'/assets/weightplay-character-boom-mane-lion-block-v1.webp',
  fia:'/assets/weightplay-character-spark-paw-fox-block-v1.webp',
  mimi:'/assets/weightplay-character-rainbow-hop-rabbit-block-v1.webp',
  panko:'/assets/weightplay-character-drum-belly-panda-block-v1.webp',
  orla:'/assets/weightplay-character-moon-cap-owl-block-v1.webp'
};
