/* Deterministic rules shared by runtime and focused tests. No storage/UI ownership. */
(() => {
  const branches=['fury','aegis','storm'];
  const nodes=branches.map(id=>({id,branch:id,tier:1,parent:null,art:{fury:'blade',aegis:'spear',storm:'horse'}[id]}));
  const points=()=>1;
  function normalize(value){
    const saved=Array.isArray(value)?value:[];
    const current=saved.find(id=>branches.includes(id));if(current)return [current];
    const old=[['fury','supply'],['aegis','guard'],['storm','charge']].map(([id,prefix])=>({id,count:saved.filter(key=>String(key).startsWith(prefix)).length}));
    old.sort((a,b)=>b.count-a.count);return [old[0].id];
  }
  function roll(random=Math.random,misses=0){
    const rarity=random(),unit=random();let level=rarity<.02?4:rarity<.18?2:1;
    if(misses>=7&&level===1)level=2;
    return {type:unit<.35?'spear':unit<.7?'blade':unit<.9?'bow':'horse',level,general:level===4};
  }
  window.ZhaoTalents={branches,nodes,points,normalize,roll};
})();
