// WeightPlay's Boom Mane Leo, authored against the golden lion poster.
// Bind coordinates are in character space, feet at y=0, face toward +Z.
// Geometry is independent of the scene, weapon, costume attachments and pose.
export function createLeoDesign() {
  const bones = [
    ['body',0,0,0], ['head',0,.87,0,10],
    ['leftArm',-.56,.57,0,10], ['rightArm',.56,.57,0,10],
    ['leftLeg',-.26,.64,0], ['rightLeg',.26,.64,0],
    ['cape',0,.72,-.34,10], ['tail',.36,.7,-.35],
    ['rightForearm',.08,-.31,.02,3], ['rightHand',0,-.21,.10,8],
    ['torso',0,.68,0], ['leftFoot',0,-.5,.12,4], ['rightFoot',0,-.5,.12,5],
    ['leftForearm',-.08,-.31,.02,2], ['leftHand',0,-.21,.10,13]
  ];
  const boxes = [];
  function block(bone,color,x,y,z,w,h,d,rx=0,ry=0,rz=0) {
    boxes.push({bone,color,x,y,z,w,h,d,rx,ry,rz});
  }
  const gold = 0xffb529, honey = 0xf2921c, cream = 0xffe5a2;
  const ink = 0x391e23, red = 0xc32732, trim = 0xffca45;
  block(0,honey,0,.69,0,.80,.22,.55);
  block(10,gold,0,1.03,0,.85,.74,.56);
  block(10,cream,0,1.00,.28,.48,.49,.12);
  block(10,red,0,1.35,.01,.94,.16,.65);
  block(10,0x723322,0,1.28,.38,.31,.31,.095,0,0,.16);
  block(10,trim,0,1.28,.43,.27,.27,.075,0,0,.16);
  block(10,0x804121,0,1.26,.475,.112,.09,.02);
  for(const x of [-.072,0,.072]) block(10,0x804121,x,1.33-Math.abs(x)*.22,.475,.049,.053,.02);

  // Staggered rows make a solid skull from above and behind. The front
  // pieces frame an open face; the highlights sit on individual outer locks.
  const rows = [
    [1.37,[-.56,-.22,.17,.53]], [1.68,[-.76,-.42,-.06,.31,.69]],
    [2.02,[-.83,-.48,-.13,.23,.58,.85]], [2.31,[-.69,-.32,.04,.40,.71]],
    [2.56,[-.48,-.11,.26,.53]], [2.74,[-.24,.12]]
  ];
  const amber = [0xd74b0e,0xfc7610,0xef5810,0xff9418,0xfab127];
  for(const [row,[y,columns]] of rows.entries()) {
    for(const [i,x] of columns.entries()) {
      const k=i+row*2, side=Math.abs(x)>.51, top=row>=4;
      const size=.32+.058*((k+1)%3);
      block(1,amber[k%5],x,y+(k%2)*.045,-.42+(i%3)*.052,size,size*.99,size*1.12,0,(k%3-1)*.13,(k%3-1)*.085);
      if(side||top) block(1,amber[(k+2)%5],x*.98,y+.025,.01+(k%2)*.055,size*.92,size,size*1.02,.02,0,(i%3-1)*.08);
      if((side||top)&&k%3===0) block(1,0xffce38,x*.99,y+.10,.03,size*.59,size*.69,size*.85,0,.07,.07);
    }
  }
  // Small detached ember cubes punctuate the crown without hiding the ears.
  for(const [x,y,z,s] of [[-.93,2.36,-.10,.15],[-.57,2.84,-.19,.12],[.35,2.96,-.27,.15],[.92,2.56,-.09,.13],[.96,1.85,-.37,.11]]) {
    block(1,0xffaa1c,x,y,z,s,s,s,.14,.22,.16);
  }
  // Forward swept locks break the straight hairline and cast a brow shadow.
  for(const [x,y,z,s,c,tilt] of [
    [-.57,2.33,.22,.32,0xf56d0b,-.17],[-.35,2.48,.20,.34,0xffa20b,.12],
    [-.075,2.43,.25,.28,0xf57809,-.15],[.22,2.49,.22,.32,0xff8f0a,.09],
    [.64,2.12,.23,.30,0xf88610,-.11],[-.66,1.84,.20,.27,0xf99312,.18]
  ]) block(1,c,x,y,z,s,s,s,.06,.08,tilt);
  // Select crown tips have a warm core on both exposed faces.
  for(const [x,y,z] of [[-.74,2.09,.29],[.47,2.64,.16],[.83,2.24,-.25],[-.34,2.70,-.52]]) {
    block(1,0xffaf12,x,y,z,.14,.14,.13,.04,.10,.09);
    block(1,0xffe572,x-.014,y+.013,z+.052,.079,.078,.05,.04,.10,.09);
  }
  block(1,gold,0,1.92,.12,1.02,.91,.69);
  block(1,0xffca46,0,1.98,.415,.86,.59,.14);
  for(const s of [-1,1]){
    block(1,0xffce59,s*.54,2.26,.21,.30,.34,.25,0,0,-s*.09);
    block(1,0x8a4022,s*.54,2.26,.35,.15,.17,.055);
    block(1,ink,s*.237,2.02,.493,.31,.37,.065,0,0,s*.045);
    block(1,0xfff3cf,s*.235,2.01,.526,.263,.308,.038);
    block(1,0xad511e,s*.212,2.005,.551,.152,.235,.036);
    block(1,ink,s*.208,2.025,.572,.096,.164,.025);
    block(1,0xfffcdf,s*.208-.023,2.078,.589,.052,.062,.018);
    block(1,0x60301c,s*.235,2.225,.50,.34,.09,.095,0,0,s*.27);
    block(1,0xffe5ae,s*.149,1.77,.522,.32,.255,.23,0,0,s*.056);
    block(1,0x784024,s*.108,1.700,.649,.18,.026,.025,0,0,s*.13);
    block(1,0x784024,s*.201,1.726,.642,.031,.063,.023,0,0,-s*.27);
    block(1,0xf4ad48,s*.408,1.748,.39,.145,.14,.11,0,0,s*.22);
  }
  block(1,cream,0,1.625,.48,.48,.11,.24);
  block(1,0x593021,0,1.873,.625,.226,.13,.091);
  block(1,0x904f33,-.027,1.904,.675,.10,.025,.012);
  block(1,0x784024,0,1.766,.647,.029,.12,.026);

  for(const [s,upper,elbow,hand,leg,foot] of [[-1,2,13,14,4,11],[1,3,8,9,5,12]]){
    block(upper,gold,s*.59,1.12,0,.31,.32,.35);
    block(upper,0xf1a122,s*.57,1.23,.01,.37,.16,.38,0,0,-s*.10);
    block(upper,trim,s*.575,1.29,.03,.35,.085,.36,0,0,-s*.10);
    block(elbow,honey,s*.64,.89,.04,.31,.29,.32);
    block(elbow,0xb85e18,s*.64,.82,.06,.335,.11,.34);
    block(elbow,trim,s*.64,.84,.068,.353,.066,.355);
    block(hand,0xffc658,s*.64,.73,.15,.32,.22,.28);
    block(leg,honey,s*.27,.43,0,.35,.47,.41);
    block(foot,gold,s*.27,.15,.105,.42,.24,.57);
    for(const toe of [-.12,0,.12]) block(foot,cream,s*.27+toe,.14,.39,.108,.14,.105);
    // Three joined folds, narrowing at the collar and catching light at the hem.
    block(6,s<0?0xa82330:0xe44339,s*.33,1.04,-.54,.57,.72,.17,.26,s*.12,s*.08);
    block(6,s<0?red:0xeb4736,s*.42,.67,-.70,.65,.28,.17,.28,s*.16,s*.11);
    block(6,trim,s*.42,.55,-.749,.65,.075,.18,.28,s*.16,s*.11);
  }
  block(6,0xd83634,0,1.0,-.625,.34,.72,.18,.28);
  block(6,trim,0,.82,-.739,.17,.17,.04,.28,0,Math.PI/4);
  for(let i=0;i<4;i++) block(7,gold,.42+i*.14,.66-i*.052,-.45-i*.12,.17,.16,.23,0,-.28);
  block(7,0xe96512,.95,.50,-.94,.28,.32,.32,0,.20,.24);
  block(7,0xffb524,1.01,.58,-1.00,.21,.24,.22,0,.12,.25);
  return {bones,boxes};
}

// The broad faces stay flat. A narrow chamfer catches the rim light in motion.
export function createLeoBlockGeometry(three) {
  const square = new three.Shape();
  square.moveTo(-.465,-.465);
  square.lineTo(.465,-.465);
  square.lineTo(.465,.465);
  square.lineTo(-.465,.465);
  square.closePath();
  const block = new three.ExtrudeGeometry(square,{
    depth:.93, bevelEnabled:true, bevelSize:.035, bevelThickness:.035,
    bevelSegments:1, steps:1
  });
  return block.translate(0,0,-.465);
}
