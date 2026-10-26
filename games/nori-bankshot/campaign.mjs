export const GAME_ID='nori-bankshot';
export const POSTER='/games/nori-bankshot/art/poster.webp';
export const ARC_KEYS=['harbor','coral','echo','gates','relay','mastery'];
const ball=(x,z,kind='plain',order=0)=>({x,z,kind,order});
const b=ball;
// Each record is a designed table, not a difficulty multiplier over one layout.
const authored=[
 ['first',[0,4.8],[[b(2.8,-2.55)]],8,3],
 ['left',[.5,3.6],[[b(-2.9,-3.9)]],8,3],
 ['two',[0,2],[[b(-3.45,-4.9),b(3.45,-4.9)]],9,5],
 ['side',[-1.8,0],[[b(2.9,0),b(-2.8,-5.7)]],9,4],
 ['lighthouse',[0,4.5],[[b(3.25,-3.8),b(-3.1,-4,'lantern')]],10,5],
 ['numbers',[0,4],[[b(3.3,-4.05,'plain',1),b(-3.15,-4.2,'plain',2)]],10,5],
 ['crossing',[-.5,1],[[b(-3.15,-4.5,'plain',1),b(3.4,4.8,'plain',2)]],10,5],
 ['opening',[0,4.5],[[b(2.9,-2.9,'plain',1),b(3.5,-5.8,'plain',2),b(-3.5,-5.7,'plain',3)]],11,6],
 ['nearfar',[-1,3],[[b(2.9,1.1,'plain',1),b(-3.1,-4.9,'plain',2),b(3.3,-5.5,'lantern')]],11,6],
 ['coralcrown',[0,3.8],[[b(-3.1,-4.5,'plain',1),b(3.4,-5,'plain',2)],[b(0,-5.7,'lantern')]],12,7],
 ['firstbank',[0,3],[[b(1.8,-1,'bank')]],11,4],
 ['slant',[1.5,3],[[b(-1.8,-2,'bank')]],11,5],
 ['banks',[0,3.8],[[b(-1.7,-1.7,'bank'),b(2.2,-4,'bank')]],12,6],
 ['mixed',[-.7,3],[[b(3.2,-4.5),b(-1.6,-2.3,'bank')]],12,6],
 ['echolight',[0,4],[[b(3.15,-4.2),b(-1.8,-2,'lantern-bank')]],12,7],
 ['key',[0,3],[[b(-3.4,-5,'key'),b(3.3,-4.3)]],11,5,{open:[0,4]}],
 ['west',[0,4],[[b(-3.4,-5.4,'key'),b(3.1,3.8),b(2.8,-4.6)]],12,6,{open:[0,4]}],
 ['keybank',[0,2.8],[[b(3.4,-5.2,'key'),b(-2,-1.8,'bank')]],12,7,{open:[1,5]}],
 ['keyorder',[0,4.4],[[b(-3.2,-4.3,'key',1),b(3.25,-4.8,'plain',2),b(3.4,4.6,'plain',3)]],12,7,{open:[0,4]}],
 ['tidegate',[0,4.5],[[b(-3.2,-4.7,'key')],[b(3.2,0),b(-3.1,0)],[b(3.2,-5,'lantern')]],14,8,{open:[0,4],tide:true}],
 ['second',[0,4],[[b(3.2,-4.5)],[b(-3.25,-5),b(3.2,4.8)]],12,7],
 ['woven',[0,3],[[b(-3.4,-5.4)],[b(3.3,-4.5,'plain',1),b(-3.2,4.3,'plain',2)]],12,7],
 ['echopost',[.7,4],[[b(3.2,-4.2)],[b(-1.8,-1.7,'bank'),b(3.4,4.8)]],13,8],
 ['latewater',[-.5,4],[[b(-3.3,-4.4)],[b(2.9,0),b(-3.2,0)]],12,8,{relaySides:true}],
 ['pilot',[0,4.2],[[b(3.3,-4.7)],[b(-3.3,-4.9,'key')],[b(1.7,-1.5,'lantern-bank')]],14,8,{open:[0,1,2,3,4,5]}],
 ['lanternlines',[0,3.8],[[b(-3.1,-4.6,'plain',1),b(3.25,-4.7,'plain',2),b(3.3,4.7)]],12,8],
 ['coralbend',[-.5,4.5],[[b(3.2,-4.3,'plain',1),b(-1.7,-1.7,'bank',2),b(-3.3,-5.2,'lantern')]],14,8],
 ['harborkey',[.5,3.8],[[b(-3.4,-5.1,'key',1),b(3.3,4.6,'plain',2),b(3.2,-4.8,'lantern')]],13,9,{open:[0,4]}],
 ['threelines',[0,3],[[b(3.2,0),b(-3.25,-5),b(1.9,-2,'bank')]],13,8],
 ['grandharbor',[0,4],[[b(-3.3,-5,'key')],[b(3.2,-4.7,'plain',1),b(-3.15,4.5,'plain',2)],[b(1.8,-1.6,'lantern-bank')]],16,9,{open:[0,4]}],
];
export const TABLES=Object.freeze(authored.map(([name,cue,groups,shots,par,extra={}],i)=>Object.freeze({id:i+1,name,arc:Math.floor(i/5),checkpoint:(i+1)%5===0,cue,groups:groups.map((g,gi)=>g.map((x,j)=>({...x,id:`${gi+1}-${j+1}`,number:j+1}))),shots,par,...extra})));
export const ITEMS=Object.freeze([
 {id:'harbor',cost:0,currency:'stamp',unlock:0,color:0xd9a567,cloth:0x0d847f},
 {id:'coral',cost:5,currency:'stamp',unlock:5,color:0xe87559,cloth:0x0d847f},
 {id:'moon',cost:15,currency:'stamp',unlock:15,color:0x9ba9ed,cloth:0x253e77},
 {id:'seaglass',cost:5,currency:'diamond',unlock:0,color:0x65ddda,cloth:0x0d6a7b},
]);
