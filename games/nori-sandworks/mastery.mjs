// Optional, demonstrably achievable targets. Existing stars and save records are unchanged.
const move=(id,dx,dy)=>({type:'move',id,dx,dy}),gate=()=>({type:'switch'}),rotate=id=>({type:'rotate',id});
export const MASTER_ROUTES={
 4:[move('B1',-4,0),move('A1',0,-2),move('A1',-4,0),move('B1',0,-1),move('C1',0,5),move('C1',1,0)],
 16:[move('C1',0,1),rotate('C1'),move('C1',0,1),move('C1',2,0),move('B1',2,0),move('B1',0,-2),move('B1',2,0),move('A1',0,-5),move('A1',-2,0)],
 22:[move('D1',0,4),move('D1',5,0),move('C1',0,1),move('C1',-3,0),move('A1',0,-2),move('A1',-1,0),move('A1',4,0),move('B1',0,-3),move('B1',-4,0),move('B1',0,-1),gate()],
 28:[move('C2',0,-2),gate(),move('A1',0,-2),move('B1',0,-2),move('D1',0,1),move('D1',4,0),move('C1',0,2),move('B1',-1,0),move('A1',0,-1),rotate('B1'),rotate('B1'),rotate('B1'),move('B1',0,-1),move('B1',2,0),gate(),move('C1',0,-3),move('A1',0,4),move('A1',-2,0),move('A1',0,1),move('A1',-1,0),gate(),move('C1',-1,0),gate()]
};
export const masteryTarget=level=>(MASTER_ROUTES[level.id]||level.witness).length;
export const mastered=(level,moves)=>moves!=null&&moves<=masteryTarget(level);
export function masteryProgress(level,best){const target=masteryTarget(level);return {target,complete:mastered(level,best),gap:best==null?null:Math.max(0,best-target)};}
export function coastChallenge(levels,best,chapter){
 const coast=levels.map((level,index)=>({level,index,...masteryProgress(level,best[index])})).filter(row=>row.level.chapter===chapter);
 if(coast.length!==5||coast.some(row=>row.gap===null))return null;
 return coast.filter(row=>row.gap>0).sort((a,b)=>a.gap-b.gap||a.index-b.index)[0]||null;
}
