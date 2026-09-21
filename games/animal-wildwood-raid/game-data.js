export const TOOLS=[
{id:'axe',unlock:1,label:'Ranger Axe',icon:'tool-ranger-axe-v1.webp',cooldown:.55,range:1.65,power:16},
{id:'bow',unlock:3,label:'Thorn Bow',icon:'tool-thorn-bow-v1.webp',cooldown:1.05,range:5.8,power:24},
{id:'lantern',unlock:8,label:'Lantern Pulse',icon:'skill-lantern-pulse-v1.webp',cooldown:8,range:4.6,power:16},
{id:'snare',unlock:13,label:'Root Snare',icon:'skill-root-snare-v1.webp',cooldown:10,range:3.2,power:0},
{id:'ward',unlock:18,label:'Acorn Ward',icon:'skill-acorn-ward-v1.webp',cooldown:14,range:0,power:0},
{id:'mastery',unlock:23,label:'Ranger Mastery',icon:'skill-ranger-mastery-v1.webp',cooldown:18,range:3.8,power:40}
];
export const ENEMIES={
thornling:{hp:28,speed:.92,damage:7,range:1.05,cooldown:1.05,behavior:'melee'},
ram:{hp:46,speed:.72,damage:14,range:1.0,cooldown:2.4,behavior:'charge'},
caster:{hp:31,speed:.52,damage:8,range:4.5,cooldown:1.8,behavior:'ranged'},
sneak:{hp:25,speed:1.05,damage:10,range:1.0,cooldown:1.3,behavior:'ambush'},
shaman:{hp:38,speed:.5,damage:5,range:3.8,cooldown:2.2,behavior:'healer'},
shield:{hp:58,speed:.58,damage:9,range:1.1,cooldown:1.4,behavior:'shield'}
};
const S=(id,name,type,target,enemies,mechanic,tool,layout,boss=null)=>({id,name,type,target,enemies,mechanic,tool,layout,boss,objective:{
gather:`Gather ${target} timber and reach the exit.`,defeat:`Defeat ${target} enemies and reach the exit.`,rescue:`Rescue ${target} forest friend${target>1?'s':''} and reach the exit.`,shrine:`Activate ${target} forest shrine${target>1?'s':''} and reach the exit.`,survive:`Survive ${target} seconds and protect the shrine.`,mixed:`Complete ${target} mission actions and reach the exit.`,boss:`Defeat ${name} and cleanse the clearing.`}[type]});
export const STAGES=[
S(1,'First Timber','gather',6,['thornling'],'move-chop','axe','open'),
S(2,'Thorn Path','defeat',4,['thornling'],'target-order','axe','fork'),
S(3,'Long Branch','mixed',6,['thornling','caster'],'range-choice','bow','long'),
S(4,'Split Clearing','rescue',1,['thornling','caster'],'route-choice','bow','split'),
S(5,'Stumpback Guardian','boss',1,['thornling'],'rear-window','bow','arena','stumpback'),
S(6,'Mudfoot Trail','gather',10,['thornling'],'mud-routing','bow','mud'),
S(7,'Ram Run','defeat',3,['ram'],'charge-dodge','bow','lanes'),
S(8,'Dark Thicket','rescue',2,['sneak','thornling'],'reveal','lantern','dark'),
S(9,'Two Fires','shrine',2,['ram','sneak'],'route-pressure','lantern','twin'),
S(10,'Hornroot Guardian','boss',1,['ram'],'charge-breaks-wall','lantern','arena','hornroot'),
S(11,'Spore Crossfire','defeat',5,['caster'],'cover-priority','bow','cover'),
S(12,'Sap Circle','defeat',5,['shaman','caster','thornling'],'healer-priority','lantern','ring'),
S(13,'Rootbound','survive',35,['thornling','ram'],'lane-control','snare','defense'),
S(14,'Bramble Gate','defeat',6,['shield','caster'],'flank-shield','snare','gate'),
S(15,'Mosswitch Guardian','boss',1,['shaman','thornling'],'totem-summon','snare','arena','mosswitch'),
S(16,'Thorn Orchard','gather',14,['caster','ram'],'harvest-hazard','snare','orchard'),
S(17,'Three Cages','rescue',3,['shield','caster'],'branch-order','snare','branches'),
S(18,'Ward Lesson','survive',45,['ram','shield'],'timed-defense','ward','defense'),
S(19,'Root Current','shrine',3,['sneak','caster'],'one-way-gates','ward','current'),
S(20,'Ironbark Guardian','boss',1,['shield'],'front-armor','ward','arena','ironbark'),
S(21,'Night Hunt','defeat',8,['sneak','caster','shaman'],'combo-priority','lantern','dark'),
S(22,'Timber Debt','gather',18,['ram','shield'],'exposure-choice','ward','dense'),
S(23,'Ranger Trial','mixed',9,['caster','ram','shield'],'loadout-limit','mastery','trial'),
S(24,'Broken Grove','shrine',2,['ram','caster'],'enemy-break-wall','mastery','switch'),
S(25,'Twinroot Guardians','boss',2,['shaman','shield'],'tank-healer-pair','mastery','arena','twinroot'),
S(26,'Blackthorn Run','defeat',10,['sneak','ram','caster','shield'],'all-environment','mastery','gauntlet'),
S(27,'Rescue Chain','rescue',4,['shaman','sneak','shield'],'rescue-sequence','mastery','chain'),
S(28,'Wildwood Siege','survive',60,['thornling','ram','caster','shaman'],'multi-lane-defense','mastery','siege'),
S(29,'Guardian Road','defeat',3,['ram','shield','shaman'],'elite-conservation','mastery','road'),
S(30,'Heartwood Warden','boss',1,['thornling','caster','shaman'],'three-phase-finale','mastery','finale','heartwood')
];
export const BOSS={
stumpback:{hp:190,damage:16,speed:.52,rule:'sweep',phases:2},
hornroot:{hp:230,damage:19,speed:.58,rule:'charge',phases:2},
mosswitch:{hp:260,damage:13,speed:.44,rule:'summon',phases:3},
ironbark:{hp:310,damage:18,speed:.42,rule:'armor',phases:3},
twinroot:{hp:220,damage:14,speed:.48,rule:'pair',phases:2,count:2},
heartwood:{hp:520,damage:21,speed:.46,rule:'finale',phases:3}
};
export const ART='./art/';
