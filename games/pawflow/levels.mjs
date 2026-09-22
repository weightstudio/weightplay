import {RULES,clone,createState,capture,dispatch,finishLap,colorRemaining} from './engine.mjs';
export const COLORS=Object.freeze(['#e96856','#edbc48','#58b994','#548ee5','#b677d5']);
export const SYMBOLS=Object.freeze(['A','B','C','D','E']);
/** Original 8x8 designs, padded to a stable 10x10 play board. Not reference assets. */
const ART=[
'...AA.../...AA.../..AAAA../...AA.../..BBBB../.BBBBBB./...BB.../...BB...',
'AA....BB/AAA..BBB/.AA..BB./..ABBA../...AB.../...BA.../..BAAB../.BA..AB.',
'AAAA..../...A..../.B.AAAA./.B....A./.BBBB.A./....B.A./.BBBB.A./.......A',
'...A..../..BAB.../.BAAAB../ABAAAABA/.BAAAB../..BAB.../...B..../..BBB...',
'AAAAAAAA/ABBBBBBA/ABCCCCBA/ABC..CBA/ABC..CBA/ABCCCCBA/ABBBBBBA/AAAAAAAA',
'..AAAA../.ABBBBA./ABBCCBBA/ABCCCCBA/ABCCCCBA/ABBCCBBA/.ABBBBA./..AAAA..',
'...A..../..AAA.../.AABAA../AABBBAA./ABBBBBA./AABBBAA./.AAAAA../..AAA...',
'..A..A../.ABAABA./ABBCBBBA/.BCCCB../.BCCCB../ABBCBBBA/.ABAABA./..A..A..',
'A..B..C./AA.B.CC./.AABBCC./..ABC.../..CBA.../.CCBBAA./CC.B.AA./C..B..A.',
'..AAAA../.ABBBBA./ABCCCCBA/ABCBB CBA/ABCCCCBA/.ABBBBA./..AAAA../...BB...',
'..AA..../.ABBA.../ABBCCA../ABBCCA../.ABBA.../..AADD../...DDDD./....DD..',
'AA....DD/ABCCCCBD/ABCCCCBD/AB....BD/ABCCCCBD/ABCCCCBD/AA....DD/.BBBBBB.',
'..AABB../.ACDDCB./ACDDDDCB/ACD..DCB/BC D..DCA/BCDDDDCA/.BCDDCA./..BBAA..',
'.AAA.BBB/ACCA.BDD/ACCA.BDD/.AAA.BBB/..C...D./.CCCCDD./..CDCD../...CD...',
'AAAAAAAA/ABBBBBBA/ABCCCCBA/ABCDDCBA/ABCDDCBA/ABCCCCBA/ABBBBBBA/AAAAAAAA',
'...AA.../...AA.../..ABBA../.ABCCBA./ABCDDCBA/.ABCCBA./..ABBA../...AA...',
'.A....A./ABA..ABA/ABC..CBA/.BCCCCB./..CDDC../.BCCCCB./ABA..ABA/.A....A.',
'AABBCCDD/ABCDABCD/BC DABCDA/CDABCDAB/DABCDABC/ABCDABCD/B CDABCDA/DDCCBBAA',
'A......./AB....../ABC...../ABCD..../ABCDDC../.BCDDCB./..CDDCBA/...DDCBA',
'AAABBAAA/ABCCCCBA/ABCDDCBA/BCCDDCCB/BCCDDCCB/ABCDDCBA/ABCCCCBA/AAABBAAA',
'...AA.../.B.AA.B./.BBCCBB./AACDDCAA/AACDDCAA/.BBCCBB./.B.AA.B./...AA...',
'A..BB..A/.A.BB.A./..ACCA../BB CDDCBB/BB CDDCBB/..ACCA../.A.BB.A./A..BB..A',
'..AABB../.ACDDCB./ACDBBDCA/ACBEEBCA/B C BEEBCB/BCDBBDCB/.BCDDCA./..BBAA..',
'.AAA..../ABCBA.../ABCDBA../ABCDEBA./.BCDECB./..BDEDB./...BEB../....B...',
'AABBCCDD/AEEDDEEB/B E ACCA EB/BDAEEADB/CD AEEADC/CEA CCAEC/DEEDDEEA/DDCCBBAA',
'A......A/AA....AA/ABA..ABA/ABCCCCBA/ABCDEDCB/.BCD DCB./..BEEB../...BB...',
'.AA..BB./ACCA BDD B/ACCA BDD B/.AEEEEB./..CEED../..CEED../.CCCCDD./..C..D..',
'..AAAA../.ABBBBA./ABCCCCBA/ABCDEDCB/ABCDEDCB/ABCCCCBA/.ABBBBA./..AAAA..',
'AABBCCDD/ABCDEABC/BCDEABCD/CDEABCDE/DEABCDEA/EABCDEAB/ABCDEABC/DDCCBBAA',
'..AAAA../.ABBBBA./ABCCCCBA/ABCDEDCB/ABCDEDCB/ABCCCCBA/.ABBBBA./..AAAA..'
];
const MODES=[0,0,0,0,0,1,1,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,5,6,6,6,6,6];
// Explicit per-stage parameters: palette, layers, reinforced stride, required keys, shutters.
const PARAMETERS=[
[2,1,0,0,0],[2,1,0,0,0],[2,1,0,0,0],[2,1,0,0,0],[3,1,0,0,0],
[3,2,0,0,0],[3,2,0,0,0],[3,2,0,0,0],[3,3,0,0,0],[3,3,0,0,0],
[4,1,5,0,0],[4,1,4,0,0],[4,2,5,0,0],[4,2,4,0,0],[4,2,3,0,0],
[4,1,0,1,0],[4,1,0,2,0],[4,2,0,1,0],[4,2,5,2,0],[4,3,5,2,0],
[4,1,0,0,1],[4,1,0,0,1],[5,2,0,0,1],[5,2,0,1,1],[5,2,5,2,1],
[5,2,4,1,0],[5,2,0,2,1],[5,3,3,1,0],[5,2,4,2,1],[5,3,3,3,1]
];
function hash(value){let h=2166136261;for(const c of JSON.stringify(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(16);}
export function authoredLevel(id) {
  if(!Number.isInteger(id)||id<1||id>30)throw RangeError('LEVEL_ID');
  const [palette,layers,armor,requiredKeys,shutters]=PARAMETERS[id-1];
  const rows=ART[id-1].split('/').map(r=>r.replaceAll(' ',''));
  const board=Array.from({length:100},()=>[]);
  rows.forEach((row,y)=>[...row.slice(0,8)].forEach((c,x)=>{
    if(c==='.')return;
    const color=(c.charCodeAt(0)-65)%palette,index=(y+1)*10+x+1;
    const depth=layers===1?1:1+Number((x+y+id)%3!==0)+(layers===3?Number((x-y+id)%4===0):0);
    for(let l=0;l<depth;l++)board[index].push({color:(color+l+Number(l>0)*Math.floor(id/5))%palette,hp:armor&&(x+2*y+l+id)%armor===0?2:1,key:false,lock:false});
  }));
  // Outer visible keys can never be sealed behind their own lock dependency.
  const outer=[];
  for(let node=0;node<40;node++){
    const side=Math.floor(node/10),lane=node%10;
    for(let k=0;k<10;k++){
      const x=side===0?k:side===1?lane:side===2?9-k:9-lane;
      const y=side===0?9-lane:side===1?k:side===2?lane:9-k;
      const index=y*10+x;if(board[index].length){if(!outer.includes(index))outer.push(index);break;}
    }
  }
  const keyIndices=[];
  for(let k=0;k<requiredKeys;k++){
    const i=outer[Math.floor((k+.25)*outer.length/requiredKeys)];keyIndices.push(i);board[i][0].key=true;
  }
  if(requiredKeys)board.forEach((cell,i)=>{
    const x=i%10,y=Math.floor(i/10);
    if(x>=3&&x<=6&&y>=3&&y<=6&&!keyIndices.includes(i))cell.forEach(v=>v.lock=true);
  });
  return {id,board,palette,requiredKeys,shutters:Boolean(shutters),gateTicks:120+(id%3)*30,
    phaseOffset:0,reverse:false,chargeSize:10+Math.floor(id/5)*2,rule:MODES[id-1],checkpoint:id%5===0};
}
/** Build finite supply with a constructive, executable solution, not untested random ammo. */
export function compileLevel(raw) {
  const level=clone(raw),supply=[],witness=[];
  let state=createState(level);
  for(let iteration=0;state.leftHP>0&&iteration<300;iteration++) {
    let best=null;
    const options=[];
    state.reserve.forEach((unit,index)=>{if(unit)options.push({source:'reserve',index,unit});});
    for(let color=0;color<level.palette;color++){
      if(state.reserve.some(u=>u?.color===color))continue;
      const remaining=colorRemaining(state,color);
      if(remaining)options.push({source:'queue',index:supply.length%3,unit:{id:`c${supply.length}`,color,ammo:Math.min(remaining,level.chargeSize)}});
    }
    // Gates may make every immediate pass unproductive. Try bounded legal waits.
    for(const wait of [0,level.gateTicks,Math.floor(level.gateTicks/2)]) {
      for(const option of options) {
        const trial={...capture(state),events:[],previous:null};trial.ticks+=wait;trial.status='running';trial.reason='';
        if(option.source==='queue')trial.queues[option.index].push(clone(option.unit));
        if(!dispatch(trial,option.source,option.index,false).ok)continue;
        finishLap(trial,false);
        if(trial.reason==='overflow')continue;
        const gain=state.leftHP-trial.leftHP;
        const merit=gain*10-(trial.reserve.filter(Boolean).length)*.12-wait*.0001;
        if(gain>0&&(!best||merit>best.merit))best={option,trial,gain,merit,wait};
      }
      if(best)break;
    }
    if(!best)throw Error(`UNSOLVABLE_AUTHORED_LEVEL:${level.id}:${state.leftHP}`);
    if(best.option.source==='queue')supply.push(clone(best.option.unit));
    witness.push({id:best.option.unit.id,wait:best.wait});
    state=best.trial;state.events=[];if(state.leftHP)state.status='running';
  }
  if(state.leftHP)throw Error(`SOLUTION_BUDGET:${level.id}`);
  level.supply=supply;level.witness=witness;level.par=witness.length+Math.max(1,Math.floor(witness.length*.1));
  level.signature=hash([level.board,level.supply,level.shutters,level.gateTicks,level.phaseOffset,level.requiredKeys,level.reverse]);return level;
}
const cache=new Map();
export function getLevel(id){if(!cache.has(id))cache.set(id,compileLevel(authoredLevel(id)));return clone(cache.get(id));}
export function dailyKey(date=new Date()){return date.toISOString().slice(0,10);}
export function dailyLevel(key=dailyKey()){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(key)||(!Number.isFinite(Date.parse(key+'T00:00:00Z'))||new Date(key+'T00:00:00Z').toISOString().slice(0,10)!==key))throw Error('DAILY_DATE');
  const seed=parseInt(hash(key),16),raw=authoredLevel(6+seed%25),offset=(seed>>>5)%raw.palette;
  raw.board=raw.board.map(cell=>cell.map(v=>({...v,color:(v.color+offset)%raw.palette})));
  if(seed%2)raw.board=raw.board.map((_,i)=>raw.board[(9-(i%10))*10+Math.floor(i/10)]);
  raw.phaseOffset=(seed>>>12)%raw.gateTicks;raw.id=31;raw.daily=key;raw.rule=6;
  const out=compileLevel(raw);out.signature=hash([out.signature,key]);return out;
}
export const STAGE_COUNT=30;
