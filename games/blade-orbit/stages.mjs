const row = (zh,en,rule,enemies,layout='open',duration=65,goal=0) => ({zh,en,rule,enemies,layout,duration,goal});
const rows = [
 row('初生劍環','First Orbit','survive',['chaser'],'open',45),
 row('晶石小徑','Crystal Trail','caches',['chaser','chaser','stalker'],'trail',55,3),
 row('棘刺衝鋒','Thorn Charge','survive',['chaser','charger'],'pillars',60),
 row('林間烽火','Beacon Grove','beacons',['chaser','charger','stalker'],'open',65,3),
 row('荊棘王','Bramble King','boss',['chaser'],'ring',55),
 row('熔爐渡口','Forge Crossing','survive',['chaser','charger','bomber'],'lava',65),
 row('鐵甲行軍','Armored March','survive',['guard','chaser','bomber'],'pillars',65),
 row('灰燼巢穴','Ash Nests','nests',['guard','chaser','bomber'],'lava',70,3),
 row('熔金密藏','Molten Caches','caches',['charger','stalker','bomber'],'lava',70,4),
 row('鐵爐巨像','Iron Colossus','boss',['guard','bomber'],'pillars',60),
 row('霜落足跡','Frozen Steps','survive',['charger','stalker','chaser'],'ice',65),
 row('碎晶齊射','Shard Volley','survive',['ranger','chaser','stalker'],'pillars',70),
 row('冰原燈火','Ice Lanterns','beacons',['ranger','charger','bomber'],'ice',70,3),
 row('裂晶群落','Splinter Flock','survive',['splitter','ranger','bomber'],'ice',75),
 row('霜晶女王','Frost Matron','boss',['ranger','stalker'],'ice',60),
 row('雷雨庭園','Storm Garden','survive',['chaser','ranger','summoner'],'storm',70),
 row('修復巡隊','Mender Patrol','survive',['healer','guard','summoner'],'pillars',70),
 row('雷鳴蟲巢','Thunder Nests','nests',['summoner','healer','chaser'],'storm',75,4),
 row('風暴迴路','Storm Circuit','caches',['ranger','charger','summoner'],'storm',75,4),
 row('風暴守望者','Tempest Warden','boss',['charger','bomber'],'storm',65),
 row('無月之徑','Moonless Path','survive',['splitter','stalker','summoner'],'curse',75),
 row('雙影追獵','Twin Pursuit','survive',['splitter','charger','stalker'],'pillars',75),
 row('蝕月燈塔','Eclipse Beacons','beacons',['healer','ranger','bomber'],'curse',80,4),
 row('暗影鑄坊','Shadow Foundry','nests',['splitter','summoner','healer'],'curse',80,4),
 row('蟲巢君王','Brood Sovereign','boss',['splitter','bomber'],'ring',65),
 row('王庭前線','Crown Approach','survive',['ranger','guard','charger','stalker'],'pillars',80),
 row('王家劍庫','Royal Arsenal','caches',['guard','charger','bomber'],'lava',80,5),
 row('最後壁壘','Last Bastions','nests',['summoner','healer','guard','ranger'],'pillars',85,5),
 row('三座烽火','Three Fires','beacons',['charger','splitter','healer','bomber','stalker'],'storm',85,3),
 row('劍蝕王座','The Sword Eclipse','boss',['guard','ranger','charger','bomber','summoner'],'crown',75),
];
export const ARCS = [
 {zh:'蒼翠遺跡',en:'Verdant Ruins',floor:0x2c6264,accent:0x7af2ce},
 {zh:'琥珀熔爐',en:'Amber Forge',floor:0x69504b,accent:0xffb347},
 {zh:'霜晶庭院',en:'Frost Courtyard',floor:0x416879,accent:0x84eaff},
 {zh:'雷霆高地',en:'Thunder Heights',floor:0x455675,accent:0xa4a1ff},
 {zh:'蝕月聖所',en:'Eclipse Sanctuary',floor:0x554567,accent:0xe59aff},
 {zh:'劍冠王庭',en:'Crown Citadel',floor:0x486360,accent:0xffde7b},
];
export const STAGES = Object.freeze(rows.map((s,i)=>Object.freeze({...s,id:i+1,arc:Math.floor(i/5),boss:s.rule==='boss'?Math.floor(i/5)+1:0,reward:35+i*4})));
export const RULES = {
 survive:['撐過敵潮','Survive the waves'], caches:['收集劍庫並存活','Recover caches and survive'],
 beacons:['點亮烽火並存活','Light beacons and survive'], nests:['擊破巢穴並存活','Break nests and survive'],
 boss:['擊敗守關首領','Defeat the guardian'],
};
export const ENEMY_HINTS = {
 stalker:['疾影伏兵：側移閃過青色衝刺線','Shade stalker: sidestep the cyan lunge.'],
 bomber:['燼火爆甲：離開橘圈，或搶先擊破','Cinder bomber: leave the orange ring or defeat it first.'],
 summoner:['符燈召喚師：優先打斷綠色召喚','Lantern caller: defeat it before its green cast finishes.'],
};
export const HINTS = {
 open:['拖曳移動，撿起發光飛劍','Drag to move. Collect glowing swords.'],
 trail:['金色劍庫散落四周，靠近拾取','Approach the golden caches to collect them.'],
 pillars:['利用石柱分散追兵','Use the pillars to split pursuing packs.'],
 ring:['紅圈出現時向外移動','Move away when a red circle appears.'],
 lava:['橘色地面亮起前離開','Leave orange ground before it erupts.'],
 ice:['冰面會滑行，提早轉向','Ice has momentum. Turn early.'],
 storm:['雷擊會先標記位置，別停在圈內','Lightning marks its target before striking.'],
 curse:['避開移動的紫色侵蝕區','Avoid the moving violet curse zones.'],
 crown:['觀察蓄力，閃避後再接近首領','Read the wind-up. Dodge, then approach.'],
};
