// Original WeightPlay campaign data. No generated random stage substitutes.
export const GAME_VERSION = '0.1.0';
export const INTERFACE_VERSION = 7;
export const SAVE_KEY = 'weightplay:block-apex:v1';
export const STEP = 1 / 120;
export const GATE_COUNT = 16;
export const VEHICLES = Object.freeze([
  { id: 'fox', stars: 0, speed: 31, acceleration: 12, grip: 7.0, drift: 1, mass: 1, color: 0xef7438 },
  { id: 'hare', stars: 6, speed: 34, acceleration: 10.5, grip: 6.2, drift: 1, mass: .9, color: 0x58d8c9 },
  { id: 'panda', stars: 18, speed: 29.5, acceleration: 11, grip: 8.5, drift: .9, mass: 1.3, color: 0xf3ce56 },
  { id: 'penguin', stars: 36, speed: 32, acceleration: 11.5, grip: 6.7, drift: 1.3, mass: 1, color: 0x769cf9 },
]);
export const UPGRADE_KEYS = Object.freeze(['engine', 'tires', 'tank']);
export const UPGRADE_COSTS = Object.freeze([80, 140, 220, 320, 440]);
// [x, z, elevation], metres. Catmull-Rom interpolation closes each authored loop.
export const TRACKS = Object.freeze([
  { id:'harbor', width:8.2, palette:0, points:[[0,0,0],[0,80,0],[55,125,1],[125,115,1],[155,55,0],[130,-25,0],[60,-50,0],[10,-35,0]] },
  { id:'hills', width:8, palette:1, points:[[0,0,0],[-15,90,4],[40,150,7],[125,145,11],[165,70,4],[135,5,2],[150,-65,1],[40,-65,0]] },
  { id:'canyon', width:8, palette:2, points:[[0,0,0],[20,70,1],[-5,130,3],[65,175,4],[125,130,5],[170,175,3],[220,120,1],[190,40,0],[90,40,1],[55,-35,0]] },
  { id:'switchbacks', width:7.6, palette:1, points:[[0,0,0],[-25,65,1],[15,105,2],[-20,150,4],[40,195,3],[90,160,2],[65,115,1],[110,75,0],[155,105,1],[180,25,0],[95,-30,0]] },
  { id:'coast', width:8.5, palette:0, points:[[0,0,0],[0,110,1],[60,170,2],[130,160,2],[180,100,1],[155,60,0],[210,15,1],[180,-55,3],[90,-85,1],[30,-45,0]] },
  { id:'summit', width:8, palette:3, points:[[0,0,0],[-40,80,5],[-5,145,11],[65,180,17],[145,150,13],[120,85,8],[180,30,4],[150,-40,2],[70,-65,0]] },
  { id:'neon', width:7.8, palette:4, points:[[0,0,0],[0,100,0],[55,150,1],[120,145,1],[150,85,0],[110,50,0],[160,-15,0],[115,-80,0],[45,-65,0],[-25,-35,0]] },
]);
const ringsA = [[.13,-.55],[.32,.5],[.49,-.45],[.68,.55],[.86,0]];
const ringsB = [[.1,.6],[.27,-.5],[.43,.6],[.61,-.55],[.8,.5]];
const conesA = [[.23,-.25],[.27,.25],[.61,-.1]];
const conesB = [[.16,.35],[.36,-.45],[.53,.4],[.73,-.4]];
const rain = [[.16,.39],[.61,.82]];
const pads = [[.08,0],[.44,.35],[.79,-.35]];
// Explicit columns: circuit, reverse, objective, laps, AI skill, limit, par, ace, rules.
const authored = [
  [0,false,'finish',1,.55,80,38,31,{rivals:0,lesson:'line'}],
  [0,true,'race',1,.58,85,40,33,{rivals:3,place:3,lesson:'line'}],
  [1,false,'drift',1,.60,100,49,41,{rivals:0,drift:3,lesson:'drift'}],
  [0,false,'time',1,.60,46,37,31,{rivals:0,cones:conesA,lesson:'cones'}],
  [1,true,'race',2,.64,135,88,76,{rivals:5,place:3,cones:conesA,lesson:'cup'}],
  [2,false,'drift',1,.64,115,52,44,{rivals:2,drift:5,lesson:'drift'}],
  [1,false,'time',1,.64,68,48,41,{rivals:0,wet:rain,lesson:'wet'}],
  [2,true,'race',1,.67,112,55,46,{rivals:5,place:3,wet:rain,lesson:'wet'}],
  [3,false,'drift',1,.66,120,61,52,{rivals:0,drift:6,cones:conesA,lesson:'drift'}],
  [2,false,'race',2,.69,145,99,87,{rivals:5,place:3,wet:rain,drift:5,lesson:'cup'}],
  [4,false,'collect',1,.68,120,62,53,{rivals:0,rings:ringsA,collect:3,lesson:'rings'}],
  [0,true,'collect',2,.69,125,79,68,{rivals:2,rings:ringsB,collect:6,cones:conesB,lesson:'rings'}],
  [3,false,'race',1,.74,120,60,51,{rivals:5,place:3,cones:conesA,lesson:'draft'}],
  [4,true,'collect',1,.72,120,58,49,{rivals:2,rings:ringsB,collect:3,pads,lesson:'pads'}],
  [4,false,'race',2,.75,160,112,98,{rivals:5,place:3,rings:ringsA,collect:6,pads,lesson:'cup'}],
  [5,false,'finish',1,.72,120,60,51,{rivals:0,wind:[.36,.64,2.8],lesson:'wind'}],
  [2,true,'collect',1,.74,130,60,50,{rivals:2,wind:[.42,.73,3.2],rings:ringsB,collect:3,lesson:'wind'}],
  [5,true,'time',1,.74,78,58,50,{rivals:0,wet:rain,cones:conesA,lesson:'wet'}],
  [3,false,'race',1,.80,130,60,51,{rivals:2,place:2,wind:[.18,.46,3.3],cones:conesB,lesson:'draft'}],
  [5,false,'fuel',2,.77,155,108,95,{rivals:3,place:3,fuel:.4,noRefill:true,pads,wind:[.38,.64,2.8],lesson:'fuel'}],
  [6,false,'collect',1,.76,110,53,45,{rivals:2,rings:ringsA,collect:4,cones:conesB,lesson:'rings'}],
  [4,true,'fuel',1,.78,78,57,49,{rivals:0,fuel:.35,noRefill:true,pads,lesson:'fuel'}],
  [6,true,'drift',2,.79,140,98,84,{rivals:2,drift:9,wet:rain,lesson:'drift'}],
  [5,false,'race',3,.81,215,164,143,{rivals:5,place:3,wind:[.32,.68,3.6],cones:conesB,lesson:'wind'}],
  [3,true,'race',2,.82,170,119,103,{rivals:5,place:3,fuel:.45,noRefill:true,pads,rings:ringsB,collect:6,lesson:'cup'}],
  [6,false,'race',2,.82,155,104,90,{rivals:5,place:3,wet:rain,rings:ringsA,collect:5,drift:6,lesson:'mixed'}],
  [2,true,'time',2,.82,133,103,91,{rivals:0,wind:[.4,.72,3.4],cones:conesB,fuel:.4,noRefill:true,pads,lesson:'fuel'}],
  [4,false,'collect',2,.82,175,119,103,{rivals:2,rings:ringsB,collect:7,cones:conesA,contactCap:8,lesson:'clean'}],
  [5,true,'race',3,.86,220,166,146,{rivals:5,place:3,drift:10,wind:[.35,.66,3.6],pads,lesson:'mixed'}],
  [6,true,'race',3,.87,220,158,139,{rivals:5,place:1,rings:ringsA,collect:8,drift:10,contactCap:10,wet:rain,cones:conesB,pads,wind:[.41,.57,2.6],lesson:'final'}],
];
export const STAGES = Object.freeze(authored.map((row,index) => {
  const [track,reverse,mode,laps,skill,limit,par,ace,rules] = row;
  return Object.freeze({id:index+1,arc:Math.floor(index/5),track,reverse,mode,laps,skill,limit,par,ace,
    rivals:5,place:6,drift:0,collect:0,contactCap:Infinity,wet:[],cones:[],rings:[],pads:[],wind:null,fuel:1,noRefill:false,...rules});
}));
export function vehicleStats(index = 0, tuning = {}) {
  const source = VEHICLES[Math.max(0,Math.min(VEHICLES.length-1,index))];
  const level = key => Math.max(0,Math.min(5,Number(tuning[key])||0));
  return {...source,speed:source.speed+level('engine')*.65,grip:source.grip+level('tires')*.3,tank:1+level('tank')*.1};
}
export function campaignStars(save) { return Object.values(save.records || {}).reduce((n,r)=>n+(Number(r.stars)||0),0); }
