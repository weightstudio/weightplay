// Authored deterministic field-guide content. No browser or storage dependency.
const named = (id, en, zh) => ({ id, name: { en, 'zh-Hant': zh } });
export const FOODS = [named('greens', 'Fresh greens', '鮮嫩綠葉'), named('seeds', 'Seed mix', '綜合種子'), named('fruit', 'Orchard fruit', '果園鮮果'), named('fish', 'River fish', '溪流鮮魚')];
export const FEATURES = [named('grass', 'Soft grass', '柔軟草地'), named('water', 'Quiet water', '寧靜水邊'), named('tree', 'Sheltered tree', '遮蔭樹下'), named('rock', 'Warm stone', '溫暖岩石')];
export const APPROACHES = [named('wait', 'Wait quietly', '安靜等待'), named('offer', 'Offer gently', '輕輕遞上'), named('hum', 'Hum softly', '輕聲哼唱')];
export const PHASES = [named('day', 'Daylight', '日光'), named('dusk', 'Dusk', '黃昏'), named('night', 'Starlight', '星夜')];
export const CARE_ACTIONS = [named('feed', 'Feed', '餵食'), named('groom', 'Groom', '梳理'), named('play', 'Play', '玩耍')];
export const HABITATS = [
  { ...named('meadow', 'Clover Meadow', '三葉草原'), index: 0, cost: 0, collectedRequired: 0, adultsRequired: 0, color: '#adc87c' },
  { ...named('wetland', 'Reedwater Marsh', '蘆水濕地'), index: 1, cost: 32, collectedRequired: 3, adultsRequired: 1, color: '#78bdb5' },
  { ...named('canopy', 'Amber Canopy', '琥珀樹冠'), index: 2, cost: 65, collectedRequired: 7, adultsRequired: 2, color: '#83a972' },
  { ...named('dunes', 'Saffron Dunes', '藏金沙丘'), index: 3, cost: 95, collectedRequired: 12, adultsRequired: 4, color: '#dfba78' },
  { ...named('snowfield', 'Opal Snowfield', '蛋白石雪原'), index: 4, cost: 125, collectedRequired: 18, adultsRequired: 6, color: '#b7d4df' },
  { ...named('moon-garden', 'Moonlit Garden', '月光花園'), index: 5, cost: 160, collectedRequired: 25, adultsRequired: 8, color: '#b2a3cc' }
];
export const UPGRADES = [
  { ...named('kit-1', 'Field kit I', '野外工具一級'), kind: 'kit', level: 1, cost: 24, currency: 'supplies' },
  { ...named('kit-2', 'Field kit II', '野外工具二級'), kind: 'kit', level: 2, cost: 90, currency: 'supplies' },
  { ...named('kit-3', 'Field kit III', '野外工具三級'), kind: 'kit', level: 3, cost: 170, currency: 'supplies' },
  { ...named('notebook-1', 'Observation notebook I', '觀察筆記一級'), kind: 'notebook', level: 1, cost: 3, currency: 'crystals' },
  { ...named('notebook-2', 'Observation notebook II', '觀察筆記二級'), kind: 'notebook', level: 2, cost: 8, currency: 'crystals' },
  { ...named('notebook-3', 'Observation notebook III', '觀察筆記三級'), kind: 'notebook', level: 3, cost: 14, currency: 'crystals' }
];
const rows = [
  // id, English, Traditional Chinese, anatomy, food, feature, approach, phase, trust, need cycle, adult dependency, kit, notebook
  ['clover-rabbit', 'Clover Rabbit', '苜蓿兔', 'rabbit', 'greens', 'grass', 'offer', null, 1, ['feed','play','groom']],
  ['copper-squirrel', 'Copper Squirrel', '銅栗松鼠', 'squirrel', 'seeds', 'tree', 'wait', null, 1, ['play','feed','groom']],
  ['honey-hedgehog', 'Honey Hedgehog', '蜜棕刺蝟', 'hedgehog', 'fruit', 'rock', 'hum', 'dusk', 2, ['groom','feed','play']],
  ['daisy-mouse', 'Daisy Mouse', '雛菊田鼠', 'mouse', 'seeds', 'grass', 'wait', 'day', 2, ['feed','groom','play']],
  ['fern-tortoise', 'Fern Tortoise', '蕨葉陸龜', 'tortoise', 'greens', 'rock', 'offer', null, 2, ['groom','play','feed'], 'clover-rabbit'],
  ['rose-badger', 'Rose Badger', '薔薇獾', 'badger', 'fruit', 'tree', 'hum', 'dusk', 3, ['play','groom','feed'], null, 1],
  ['ripple-otter', 'Ripple Otter', '漣漪水獺', 'otter', 'fish', 'water', 'hum', null, 2, ['play','feed','groom']],
  ['reed-heron', 'Reed Heron', '蘆葦蒼鷺', 'heron', 'fish', 'water', 'wait', 'day', 2, ['groom','feed','play']],
  ['jade-frog', 'Jade Frog', '翡翠青蛙', 'frog', 'seeds', 'water', 'hum', 'dusk', 2, ['feed','play','groom']],
  ['brook-beaver', 'Brook Beaver', '小溪河狸', 'beaver', 'greens', 'tree', 'offer', null, 3, ['groom','play','feed'], 'copper-squirrel'],
  ['pearl-duck', 'Pearl Duck', '珍珠鴨', 'duck', 'seeds', 'water', 'offer', 'day', 2, ['play','groom','feed'], null, 1],
  ['mist-kingfisher', 'Mist Kingfisher', '霧羽翠鳥', 'kingfisher', 'fish', 'rock', 'wait', 'dusk', 3, ['feed','groom','play'], 'ripple-otter', 1, 1],
  ['mango-monkey', 'Mango Monkey', '芒果猴', 'monkey', 'fruit', 'tree', 'offer', 'day', 2, ['play','feed','groom']],
  ['moss-sloth', 'Moss Sloth', '苔絨樹懶', 'sloth', 'greens', 'tree', 'wait', null, 3, ['groom','feed','play']],
  ['ruby-parrot', 'Ruby Parrot', '紅寶鸚鵡', 'parrot', 'seeds', 'tree', 'hum', 'day', 2, ['play','groom','feed'], null, 1],
  ['orchid-toucan', 'Orchid Toucan', '蘭冠巨嘴鳥', 'toucan', 'fruit', 'rock', 'offer', 'dusk', 3, ['feed','play','groom'], 'reed-heron'],
  ['bark-pangolin', 'Bark Pangolin', '樹皮穿山甲', 'pangolin', 'seeds', 'grass', 'wait', 'night', 3, ['groom','play','feed'], null, 2, 1],
  ['velvet-lemur', 'Velvet Lemur', '絨尾狐猴', 'lemur', 'fruit', 'tree', 'hum', 'night', 4, ['feed','groom','play'], 'moss-sloth', 1, 1],
  ['saffron-fennec', 'Saffron Fennec', '番紅耳廓狐', 'fennec', 'fruit', 'rock', 'wait', 'dusk', 2, ['groom','feed','play']],
  ['dune-meerkat', 'Dune Meerkat', '沙丘狐獴', 'meerkat', 'seeds', 'grass', 'hum', 'day', 3, ['play','feed','groom']],
  ['amber-camel', 'Amber Camel', '琥珀駱駝', 'camel', 'greens', 'rock', 'offer', 'day', 3, ['feed','groom','play'], 'fern-tortoise'],
  ['sand-gecko', 'Sand Gecko', '砂紋壁虎', 'gecko', 'seeds', 'rock', 'wait', 'night', 2, ['groom','play','feed'], null, 2],
  ['oasis-ibis', 'Oasis Ibis', '綠洲朱鷺', 'ibis', 'fish', 'water', 'hum', 'dusk', 3, ['play','groom','feed'], 'pearl-duck', 1, 1],
  ['moon-jerboa', 'Moon Jerboa', '月沙跳鼠', 'jerboa', 'seeds', 'grass', 'offer', 'night', 4, ['feed','play','groom'], 'saffron-fennec', 2, 2],
  ['opal-fox', 'Opal Fox', '蛋白石雪狐', 'fox', 'fish', 'rock', 'wait', 'dusk', 3, ['groom','feed','play']],
  ['snow-penguin', 'Snow Penguin', '雪帽企鵝', 'penguin', 'fish', 'water', 'offer', 'day', 2, ['play','feed','groom']],
  ['silver-hare', 'Silver Hare', '銀絨野兔', 'hare', 'greens', 'grass', 'hum', 'day', 3, ['feed','play','groom'], 'clover-rabbit'],
  ['frost-lynx', 'Frost Lynx', '霜耳猞猁', 'lynx', 'fish', 'tree', 'wait', 'night', 4, ['groom','play','feed'], 'opal-fox', 2, 1],
  ['glacier-seal', 'Glacier Seal', '冰川海豹', 'seal', 'fish', 'water', 'hum', 'dusk', 3, ['play','groom','feed'], null, 2, 2],
  ['aurora-reindeer', 'Aurora Reindeer', '極光馴鹿', 'reindeer', 'greens', 'tree', 'offer', 'night', 4, ['feed','groom','play'], 'amber-camel', 3, 2],
  ['lunar-owl', 'Lunar Owl', '月紋貓頭鷹', 'owl', 'fish', 'tree', 'hum', 'night', 3, ['groom','feed','play']],
  ['star-raccoon', 'Star Raccoon', '星斑浣熊', 'raccoon', 'fruit', 'water', 'offer', 'night', 3, ['play','feed','groom'], 'rose-badger'],
  ['violet-bat', 'Violet Bat', '紫翼蝙蝠', 'bat', 'fruit', 'tree', 'wait', 'dusk', 3, ['feed','play','groom'], null, 2, 2],
  ['comet-peacock', 'Comet Peacock', '彗羽孔雀', 'peacock', 'seeds', 'grass', 'hum', 'day', 4, ['groom','play','feed'], 'ruby-parrot', 3, 2],
  ['moon-marten', 'Moon Marten', '月影貂', 'marten', 'fish', 'rock', 'wait', 'night', 4, ['play','groom','feed'], 'frost-lynx', 3, 2],
  ['dawn-deer', 'Dawn Deer', '晨曦鹿', 'deer', 'greens', 'grass', 'offer', 'dusk', 4, ['feed','groom','play'], 'aurora-reindeer', 3, 3]
];
const colors = ['#d8b59a','#ba7851','#b79b6d','#c9b78f','#79a68b','#957963'];
const accents = ['#e6bfbc','#f4d9ab','#dbc899','#ecdda9','#a4cba2','#e3cdb2'];
export const SPECIES = rows.map((row, i) => {
  const [id,en,zh,shape,food,feature,approach,phase,trustRequired,needs,adultRequired=null,kitRequired=0,notebookRequired=0] = row;
  return { ...named(id,en,zh), shape, food, feature, approach, phase,
    trustRequired, needs, adultRequired, kitRequired, notebookRequired, habitat: Math.floor(i / 6),
    color: colors[i % 6], accent: accents[i % 6] };
});
