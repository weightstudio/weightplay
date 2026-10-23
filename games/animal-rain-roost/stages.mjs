// Authored routes; lane numbers are physical left-to-right in every locale.
// Every rain is independently catchable with the free starting basket.
const routes = [
  ['2312432432', 'calm', 7, 0, 0, 1.65],
  ['123454321234', 'sweep', 8, 0, 0, 1.45],
  ['224331425134', 'leaves', 8, 0, 0, 1.5],
  ['324123543245', 'gold', 8, 2, 0, 1.5],
  ['123253431245432', 'garden', 10, 2, 0, 1.35],
  ['123423454321', 'east', 8, 0, 0, 1.4],
  ['543234123454', 'west', 8, 0, 0, 1.4],
  ['23454321234321', 'gust', 9, 0, 0, 1.35],
  ['13532421354213', 'windleaf', 9, 1, 0, 1.35],
  ['1234532154321234', 'weather', 10, 2, 0, 1.3],
  ['24135241352413', 'choice', 9, 0, 0, 1.3],
  ['13524315243524', 'zigzag', 9, 0, 0, 1.3],
  ['32415324153241', 'treasure', 9, 3, 0, 1.35],
  ['12343432123432', 'corridor', 9, 1, 0, 1.25],
  ['2314532143524132', 'fork', 10, 2, 0, 1.25],
  ['23432345432343', 'streak', 9, 0, 5, 1.25],
  ['123432123454321', 'rest', 10, 0, 5, 1.18],
  ['342132435243213', 'goldstreak', 10, 2, 5, 1.28],
  ['1234543215432123', 'reverse', 10, 0, 6, 1.2],
  ['2321434521234321', 'precision', 11, 2, 6, 1.2],
  ['23145324132541', 'clean', 9, 0, 0, 1.25, 1],
  ['13254312534213', 'goldroute', 9, 3, 0, 1.25, 2],
  ['23412345432123', 'windgate', 10, 0, 0, 1.2, 2],
  ['152435241352431', 'crossing', 10, 2, 0, 1.25, 1],
  ['1234532413524312', 'storm', 11, 2, 5, 1.15, 2],
  ['2134521345231243', 'dusk', 11, 2, 5, 1.15],
  ['5432132451234321', 'moon', 11, 3, 5, 1.15, 2],
  ['1234532154321234', 'aurora', 11, 2, 6, 1.12],
  ['23541325412354321', 'beacon', 12, 3, 6, 1.15, 1],
  ['234321453123453243215', 'finale', 14, 3, 7, 1.1, 2],
];
const clampLane = n => Math.max(0, Math.min(4, n));
export const STAGES = Object.freeze(routes.map(([path, rule, target, gold, streak, interval, maxLeaves = 99], index) => {
  const arc = Math.floor(index / 5), checkpoint = index % 5 === 4;
  const fall = index < 5 ? 2.7 : index < 15 ? 2.45 : 2.25;
  const events = []; let at = 3.3;
  [...path].forEach((digit, n) => {
    const lane = +digit - 1;
    const wind = arc === 0 ? 0 : rule === 'east' ? 1 : rule === 'west' ? -1 : (n % (rule === 'finale' ? 7 : 4) < 2 ? 1 : -1);
    const isGold = index >= 3 && (n % 4 === 2 || (gold >= 3 && n === path.length - 1));
    events.push(Object.freeze({id:events.length, at, born:at-fall, fall, lane, wind, kind:isGold ? 'gold' : 'rain'}));
    const leaf = index >= 2 && (arc >= 2 || n % 3 === 1);
    if (leaf) {
      const offset = arc >= 2 ? (n % 2 ? -1 : 1) : 2;
      const hazardLane = (lane + offset + 5) % 5;
      events.push(Object.freeze({id:events.length, at:at+(arc >= 2 ? 0 : .38), born:at-fall, fall:fall+(arc>=2?0:.38), lane:hazardLane, wind:-wind*.6, kind:'leaf'}));
      if (['corridor','windgate','storm','beacon','finale'].includes(rule) && n%3===1) {
        const other = (lane + (offset===1?4:1)) % 5;
        events.push(Object.freeze({id:events.length,at,born:at-fall,fall,lane:other,wind:wind*.4,kind:'leaf'}));
      }
    }
    at += interval + (rule==='rest' && n%4===3 ? 1.3 : 0) + (checkpoint && n%5===4 ? .65 : 0);
  });
  events.sort((a,b)=>a.at-b.at || (a.kind==='leaf'?1:-1));
  return Object.freeze({id:index+1,index,arc,checkpoint,rule,path,target,gold,streak,maxLeaves,fall,events:Object.freeze(events),total:path.length,duration:at+1,phases:checkpoint?3:1});
}));
export const EQUIPMENT = Object.freeze({
  reed:{unlock:0,radius:.51,goldRadius:.51,guards:0},
  net:{unlock:5,radius:.43,goldRadius:.43,guards:2},
  magnet:{unlock:10,radius:.39,goldRadius:.78,guards:0},
});
export function dropPosition(event,time) {
  const p=Math.max(0,Math.min(1,(time-event.born)/event.fall));
  return {lane:clampLane(event.lane-event.wind*(1-p)*.9), height:1-p, progress:p};
}
