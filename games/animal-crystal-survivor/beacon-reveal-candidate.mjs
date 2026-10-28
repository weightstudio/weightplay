// Local-practice Stage 48 reveal only; the round model owns charge and order.
export function isRevealStationVisible(round,id){
  if(round?.stage!==48||!Number.isInteger(round.completed)||round.completed<0||round.completed>2)throw new RangeError('invalid reveal round');
  if(id==='B')return true;
  return id==='C'&&round.completed>=1;
}
