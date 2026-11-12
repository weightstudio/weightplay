import { CHARTERS } from './campaign.mjs?wp-media=03cccac666c699aa';

export const REGIONS = {
  A: { want:0, amount:1 }, B:{ want:1, amount:1 },
  C: { want:0, amount:2 }, D:{ want:1, amount:2 },
};

export function policy(stage) {
  const r=stage.rule, keys=stage.districts, last=keys.at(-1), first=keys[0], second=keys[1], prior=keys.at(-2);
  const law={ handoff:0, steward:0, stock:[0,0], offer:{}, delivery:{}, bond:{}, storm:null };
  if ([6,7,10,11,18,19,20,23,24,25,26,27].includes(r)) {
    law.handoff=4; law.steward=[6,11,18,20,23,24,25,26,27].includes(r)?0:1;
  }
  if (r===10) law.stock=[1,0];
  if ([11,23,24,25,26,27].includes(r)) law.stock=[1,1];
  if ([8,9,10,11,23,24,25,26,27].includes(r)) law.offer[last]=prior;
  if ([12,16,19,22].includes(r)) law.offer[last]=first;
  if ([14,17,20].includes(r)) {law.offer[last]=second; law.delivery[last]=first;}
  if ([13,18,23,24,25,26,27].includes(r)) law.delivery[last]=first;
  if ([15,17,20,24,25,26,27].includes(r)) law.bond[last]=1;
  if ([16,19,22].includes(r)) law.bond[last]=0;
  if ([26,27].includes(r)) law.bond[second]=0;
  if (r===27) law.offer[keys[2]]=first;
  if ([1,3,5,25,26,27].includes(r)) law.storm={turn:r===5?4:3, resource:[3,26].includes(r)?1:0};
  if ([2,4,9].includes(r)) law.storm={turn:r===2?3:4, district:last, permanent:false};
  if ([21,22].includes(r)) law.storm={turn:4,district:last,permanent:true};
  return law;
}

export function start(stage, charter='plain') {
  return {
    stage, law:policy(stage), turn:0, stock:[...stage.stock], successor:false,
    charter:Object.hasOwn(CHARTERS,charter)?charter:'plain', used:false, outcome:null,
    seats:Object.fromEntries(stage.districts.map((id,i)=>[id,{trust:0,min:i===0?stage.trust:0,due:null,vote:false,blocked:false,broke:false,asked:0,bond:null}])),
    sealCount:0, missed:0, last:null, flash:[], tutorial:false
  };
}

export function check(s, type, id) {
  if(s.outcome) return 'ended';
  const d=s.seats[id], law=s.law, region=REGIONS[id];
  if(type==='harvest0'||type==='harvest1') {
    const res=Number(type.at(-1));
    if(s.successor && res!==law.steward && s.stock[1-res]<2) return 'short';
    return null;
  }
  if(type==='rest') return null;
  if(!d || !region) return 'selectDistrict';
  if(type==='aid') {
    if (!d.blocked && !d.broke && d.trust>=d.min) return 'unneeded';
    if(s.stock[region.want]<1) return 'short';
    return null;
  }
  if(d.blocked || d.broke) return 'blocked';
  if(d.vote) return 'complete';
  if(type==='extend') return s.charter==='witness' && !s.used && d.due!==null ? null:'unneeded';
  if(type==='pledge') {
    if(d.due!==null) return 'pending';
    if(d.trust<d.min) return 'trust';
    if(law.offer[id]&&!s.seats[law.offer[id]].vote) return 'witness';
    if(law.bond[id]!==undefined&&s.stock[law.bond[id]]<1) return 'short';
    return null;
  }
  if(type==='deliver') {
    if(d.due===null) return 'noPledge';
    if(law.delivery[id]&&!s.seats[law.delivery[id]].vote) return 'witness';
    if(s.stock[region.want]<d.asked) return 'short';
    return null;
  }
  return 'invalid';
}

export function act(s, type, id, teaching=false) {
  const reason=check(s,type,id);
  if(reason) return {ok:false,reason,state:s};
  const n={...s,stock:[...s.stock],seats:Object.fromEntries(Object.entries(s.seats).map(([k,v])=>[k,{...v}])),flash:[],last:{type,id}};
  const r=REGIONS[id], d=n.seats[id], law=s.law;
  if(type==='aid') {
    n.stock[r.want]--; d.blocked=false; d.broke=false; d.trust++;
  } else if(type==='pledge') {
    d.due=n.turn+s.stage.term+Number(!teaching);
    d.asked=r.amount; d.bond=law.bond[id]??null;
    if(d.bond!==null) n.stock[d.bond]--;
    n.stock[1-r.want]+=2;
  } else if(type==='deliver') {
    n.stock[r.want]-=d.asked;
    if(d.bond!==null)n.stock[d.bond]++;
    d.bond=null;d.due=null;d.vote=true;d.trust++; n.sealCount++;
  } else if(type==='extend') {
    d.due++; n.used=true;
  } else if(type.startsWith('harvest')) {
    const res=Number(type.at(-1));
    if(s.successor&&res!==law.steward)n.stock[1-res]-=2;
    const extra=!n.used && n.charter===(res===0?'grower':'forester');
    if(extra)n.used=true;
    n.stock[res]+=1+Number(extra);
  }
  if(!teaching) {
    n.turn++;
    if(law.handoff && n.turn===law.handoff) {n.successor=true;n.flash.push({type:'handoff'});}
    if(law.storm?.turn===n.turn) {
      if(law.storm.district){
        n.seats[law.storm.district].blocked=true;
        n.flash.push({type:'stormDistrict',id:law.storm.district});
      } else {
        n.stock[law.storm.resource]=Math.max(0,n.stock[law.storm.resource]-1);
        n.flash.push({type:'stormStock',res:law.storm.resource});
      }
    } else if(law.storm?.district&&!law.storm.permanent&&law.storm.turn+1===n.turn) {
      n.seats[law.storm.district].blocked=false;
      n.flash.push({type:'reopened',id:law.storm.district});
    }
    for(const [key,seat] of Object.entries(n.seats)) if(seat.due!==null&&n.turn>=seat.due){
      seat.due=null;seat.bond=null;seat.broke=true;seat.trust=Math.max(0,seat.trust-1);
      n.missed++; n.flash.push({type:'breach',id:key});
    }
    if(n.sealCount===s.stage.districts.length && (!law.handoff || n.successor) &&
      n.stock.every((v,i)=>v>=law.stock[i])) n.outcome='win';
    else if(n.turn>=s.stage.turns) n.outcome='loss';
  }
  return {ok:true,state:n};
}
export function legal(s) {
  return [...s.stage.districts.flatMap(id=>['deliver','pledge','aid','extend'].map(type=>[type,id])),
    ['harvest0'],['harvest1'],['rest']].filter(([type,id])=>!check(s,type,id));
}

export function stateKey(s) {
  return JSON.stringify([s.turn,s.stock,s.used,s.missed,Object.values(s.seats).map(d=>[d.trust,d.due,d.vote,d.blocked,d.broke,d.asked,d.bond])]);
}
export function solve(startState, width=520) {
  let layer=[{state:startState,path:[]}];
  while(layer.length){
    const next=new Map();
    for(const {state,path} of layer){
      for(const args of legal(state)){
        const n=act(state,...args).state;
        if(n.outcome==='win')return [...path,args];
        if(n.outcome||n.missed>0)continue;
        const k=stateKey(n);
        if(!next.has(k))next.set(k,{state:n,path:[...path,args]});
      }
    }
    function rank(s){
      const seats=Object.entries(s.seats);
      const pending=seats.filter(([,d])=>d.due!==null);
      let score=s.sealCount*20+pending.length*5+Math.min(s.stock[0],6)+Math.min(s.stock[1],6);
      score+=seats.reduce((v,[,d])=>v+Math.min(d.min,d.trust),0)*2;
      for(const [k,d] of pending) if(s.stock[REGIONS[k].want]<d.asked)score-=4-(d.due-s.turn);
      return score;
    }
    layer=[...next.values()].sort((a,b)=>rank(b.state)-rank(a.state)).slice(0,width);
  }
  return null;
}
