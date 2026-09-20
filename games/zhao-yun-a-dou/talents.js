/* Deterministic rules shared by runtime and focused tests. No storage/UI ownership. */
(() => {
  const branches=['supply','guard','charge'];
  const nodes=branches.flatMap(branch=>[1,2,3].map(tier=>({id:branch+tier,branch,tier,parent:tier>1?branch+(tier-1):null,art:{supply:'spear',guard:'blade',charge:'horse'}[branch]})));
  const points=stars=>Math.min(5,2+Math.floor((stars||[]).filter(n=>n>0).length/3));
  function normalize(value,stars){const picked=[];for(const node of nodes)if(Array.isArray(value)&&value.includes(node.id)&&(!node.parent||picked.includes(node.parent))&&picked.length<points(stars))picked.push(node.id);return picked;}
  function roll(random=Math.random,misses=0){
    const rarity=random(),unit=random();let level=rarity<.02?4:rarity<.18?2:1;
    if(misses>=7&&level===1)level=2;
    return {type:unit<.35?'spear':unit<.7?'blade':unit<.9?'bow':'horse',level,general:level===4};
  }
  window.ZhaoTalents={branches,nodes,points,normalize,roll};
})();
