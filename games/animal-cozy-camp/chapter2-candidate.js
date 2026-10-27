(function (root, factory) {
  'use strict';
  const chapter = factory();
  if (typeof module === 'object' && module.exports) module.exports = chapter;
  if (root) root.AnimalCozyCampChapter2Candidate = chapter;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';

  // Candidate content is intentionally not connected to the normal campaign.
  // Seat 0 is the lantern; seats 1–3 proceed clockwise, even in RTL.
  const FRIENDS = Object.freeze(['orla','moss','taro','pip']);
  const ROWS = Object.freeze([
    [31,'lantern',['seat','orla',0],['beside','moss','pip'],'Find Orla’s lantern seat before comparing the two neighbours.'],
    [32,'lantern',['seat','pip',1],['opposite','orla','moss'],'Keep Pip beside the lantern while Orla faces Moss.'],
    [33,'lantern',['seat','moss',2],['beside','pip','taro'],'Place Moss across the fire and compare Pip with Taro.'],
    [34,'lantern',['seat','taro',3],['opposite','moss','orla'],'Match Taro’s seat before finding the facing pair.'],
    [35,'lantern',['seat','orla',0],['opposite','taro','pip'],'Checkpoint: keep the lantern seat and resolve the facing friends.'],
    [36,'direction',['clockwise','pip','orla'],['seat','moss',0],'Read the first clockwise neighbour from the lantern.'],
    [37,'direction',['clockwise','taro','moss'],['notSeat','orla',0],'Compare the arrow direction while Orla avoids the lantern.'],
    [38,'direction',['clockwise','moss','pip'],['seat','taro',2],'Face Taro across the fire and follow the clockwise pair.'],
    [39,'direction',['clockwise','orla','taro'],['notSeat','pip',2],'Reject the mirrored pair and Pip’s forbidden seat.'],
    [40,'direction',['clockwise','pip','moss'],['seat','orla',3],'Checkpoint: preserve the arrow direction with a side anchor.'],
    [41,'zones',['zone','orla','light'],['beside','moss','pip'],'Keep Orla in the lit half and find the neighbouring pair.'],
    [42,'zones',['zone','taro','shade'],['clockwise','pip','moss'],'Choose Taro’s shaded half while tracing the arrow.'],
    [43,'zones',['zone','moss','light'],['opposite','orla','pip'],'Use the light boundary to distinguish a facing pair.'],
    [44,'zones',['zone','pip','shade'],['beside','taro','orla'],'Compare the shaded side with the requested neighbours.'],
    [45,'zones',['zone','orla','shade'],['clockwise','moss','taro'],'Checkpoint: combine a half-circle with directional seating.'],
    [46,'shared',['eitherSeat','orla','pip',0],['beside','moss','taro'],'Either Orla or Pip may take the lantern; compare the other pair.'],
    [47,'shared',['eitherSeat','moss','taro',2],['clockwise','orla','pip'],'Allow either friend opposite the lantern and check direction.'],
    [48,'shared',['eitherSeat','taro','pip',1],['opposite','orla','moss'],'Choose an eligible side-seat friend while preserving the facing pair.'],
    [49,'shared',['eitherSeat','orla','moss',3],['beside','pip','taro'],'Compare two eligible shaded-side guests with the neighbours.'],
    [50,'shared',['eitherSeat','moss','pip',0],['clockwise','taro','orla'],'Checkpoint: a shared lantern choice competes with direction.'],
    [51,'boundaries',['notSeat','orla',0],['opposite','moss','pip'],'Keep Orla away from the lantern and seat Moss opposite Pip.'],
    [52,'boundaries',['notSeat','taro',1],['clockwise','orla','moss'],'Reject Taro’s forbidden seat while keeping the arrow.'],
    [53,'boundaries',['notSeat','pip',2],['beside','orla','taro'],'Find the allowed seat without breaking the neighbouring pair.'],
    [54,'boundaries',['zone','moss','shade'],['notSeat','taro',3],'Compare the shaded half and a forbidden exact seat.'],
    [55,'boundaries',['notSeat','moss',0],['clockwise','pip','taro'],'Checkpoint: eliminate a forbidden lantern seat and mirror.'],
    [56,'signals',['conditional','orla',0,'moss','pip'],['seat','taro',1],'If Orla sits by the lantern use the arrow; otherwise use facing.'],
    [57,'signals',['conditional','moss',1,'taro','orla'],['zone','pip','shade'],'Read the side-seat condition before applying its relationship.'],
    [58,'signals',['conditional','pip',2,'orla','taro'],['notSeat','moss',1],'Check Pip’s opposite seat to select the relevant relationship.'],
    [59,'signals',['conditional','taro',3,'pip','moss'],['zone','orla','light'],'Resolve the side condition while keeping Orla in the lit half.'],
    [60,'signals',['conditional','orla',0,'pip','taro'],['eitherSeat','moss','taro',2],'Final circle: combine a conditional signal and a shared seat.'],
  ]);
  const CHECKPOINTS = Object.freeze([35,40,45,50,55,60]);
  function permutations(values){
    if(values.length===0)return [[]];
    return values.flatMap((value,index)=>permutations(values.filter((_,i)=>i!==index)).map(rest=>[value,...rest]));
  }
  const ORDERS = Object.freeze(permutations(FRIENDS).map(order=>Object.freeze(order)));
  function evaluate(layout,rule){
    if(!Array.isArray(layout)||layout.length!==4||new Set(layout).size!==4||FRIENDS.some(name=>!layout.includes(name)))return false;
    const [kind,a,b,c,d]=rule,at=name=>layout.indexOf(name),distance=(left,right)=>Math.abs(at(left)-at(right));
    if(kind==='seat')return at(a)===b;
    if(kind==='notSeat')return at(a)!==b;
    if(kind==='zone')return (at(a)<2)===(b==='light');
    if(kind==='eitherSeat')return at(a)===c||at(b)===c;
    if(kind==='beside')return [1,3].includes(distance(a,b));
    if(kind==='opposite')return distance(a,b)===2;
    if(kind==='clockwise')return (at(a)+1)%4===at(b);
    if(kind==='conditional')return at(a)===b?(at(c)+1)%4===at(d):distance(c,d)===2;
    return false;
  }
  function makeStage(row){
    const [number,chapter,first,second,intent]=row;
    const good=ORDERS.filter(order=>evaluate(order,first)&&evaluate(order,second));
    const onlyFirst=ORDERS.filter(order=>evaluate(order,first)&&!evaluate(order,second));
    const onlySecond=ORDERS.filter(order=>!evaluate(order,first)&&evaluate(order,second));
    if(!good.length||!onlyFirst.length||!onlySecond.length)throw Error(`INVALID_COZY_CHAPTER2:${number}`);
    const choices=[good[0],onlyFirst[0],onlySecond[0]],offset=number%3;
    const ordered=choices.map((_,i)=>choices[(i+offset)%3]);
    return Object.freeze({number,id:`cozy-circle-${number}`,chapter,rules:Object.freeze([Object.freeze(first),Object.freeze(second)]),intent,checkpoint:CHECKPOINTS.includes(number),layouts:Object.freeze(ordered),solution:ordered.indexOf(good[0]),tool:'one temporary seat marker, resettable; no save or currency'});
  }
  const stages=Object.freeze(ROWS.map(makeStage));
  return Object.freeze({ready:false,FRIENDS,ROWS,CHECKPOINTS,stages,evaluate});
});
