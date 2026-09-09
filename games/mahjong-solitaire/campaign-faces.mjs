// Single raster atlas, shared by Battle tiles, Stage previews and rule cues.
// A..P are stable rule IDs, never player-facing labels or numeric rankings.
export const MAHJONG_FACE_IDS = Object.freeze('ABCDEFGHIJKLMNOP'.split(''));
export const MAHJONG_FACE_KEYS = Object.freeze([
 'bamboo','plum','moon','lantern','coin','maple','koi','lotus',
 'turtle','ginkgo','cloud','fan','mountain','swallow','sun','knot',
]);
export const MAHJONG_FACE_ATLAS = new URL('../../assets/mahjong-solitaire-campaign-faces-v1.png',import.meta.url).href;

export function facePosition(face) {
 const index=MAHJONG_FACE_IDS.indexOf(face);
 if(index<0)throw new Error('Unknown Mahjong campaign face');
 // The generator's symbol silhouettes have an ivory margin, but neighboring
 // tips may enter the outer 5% of an equal atlas cell. Sample the central 90%
 // of each cell (all intended silhouettes remain inside), not the next cell.
 // CSS background-position is relative to image minus visible crop size.
 return {key:MAHJONG_FACE_KEYS[index],x:((index%4)+.05)*100/3.1,y:(Math.floor(index/4)+.05)*100/3.1};
}

export function createFaceElement(face,doc=document) {
 const position=facePosition(face),node=doc.createElement('span');
 node.className='mjc-face';node.setAttribute('aria-hidden','true');
 node.style.backgroundImage=`url("${MAHJONG_FACE_ATLAS}")`;
 node.style.backgroundPosition=`${position.x}% ${position.y}%`;
 node.dataset.face=face;
 return node;
}
