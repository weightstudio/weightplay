import {STAT_KEYS,TALENTS,SKILLS} from './data.mjs';
export const TALENT_BRANCHES=Object.freeze({STR:['heavy','shatter'],AGI:['flow','hunt'],VIT:['unyield','firm'],DEX:['focus','rhythm'],INT:['glyph','resonance'],LUK:['flame','reversal']});
export const rootTalent=stat=>`seed${stat}`;
export function talentRequirements(id){const def=TALENTS[id];if(!def)return null;if(id.startsWith('seed'))return {level:1,parent:null,rank:0};return {level:id==='firm'?14:6,parent:rootTalent(def.stat),rank:2,skill:id==='firm'?'counter':id==='glyph'?'rune':null};}
export function canLearnTalent(p,id){const req=talentRequirements(id);return !!req&&(p.talents?.[id]??0)<3&&p.level>=req.level&&(!req.parent||(p.talents?.[req.parent]??0)>=req.rank)&&(!req.skill||(p.skills[req.skill]??0)>0);}
export function talentStatBonus(talents,stat){return 2*(talents?.[rootTalent(stat)]??0);}
export function migrateTalentTree(p){if(p.talentTree?.version===1)return false;const archive={current:{...p.talents},presets:(p.loadouts??[]).map(row=>row?{...row.talents}:null)};p.talentTree={version:1,archive};p.talents={};for(const row of p.loadouts??[])if(row)row.talents={};return true;}
export function validateTalentTree(p){if(p.talentTree===undefined){if(Object.keys(p.talents??{}).some(id=>id.startsWith('seed')))throw Error('INVALID_SAVE_TALENT_TREE');return;}if(p.talentTree.version!==1)throw Error('INVALID_SAVE_TALENT_TREE');
 for(const [id,rank]of Object.entries(p.talents??{})){if(!rank)continue;const req=talentRequirements(id);if(!req||p.level<req.level||req.parent&&(p.talents[req.parent]??0)<req.rank||req.skill&&!(p.skills[req.skill]>0))throw Error('INVALID_SAVE_TALENT_PREREQUISITE');}
 const archives=[p.talentTree.archive?.current,...(p.talentTree.archive?.presets??[])];if(!p.talentTree.archive||!Array.isArray(p.talentTree.archive.presets)||p.talentTree.archive.presets.length>3)throw Error('INVALID_SAVE_TALENT_ARCHIVE');for(const old of archives){if(old===null)continue;if(!old||typeof old!=='object'||Array.isArray(old)||Object.entries(old).some(([id,r])=>!Object.hasOwn(TALENTS,id)||id.startsWith('seed')||!Number.isInteger(r)||r<0||r>3)||Object.values(old).reduce((a,b)=>a+b,0)>30)throw Error('INVALID_SAVE_TALENT_ARCHIVE');}
}
export function treeEdges(){return STAT_KEYS.flatMap(stat=>TALENT_BRANCHES[stat].map(id=>[rootTalent(stat),id]));}
