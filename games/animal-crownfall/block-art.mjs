// Authored cuboid models for the approved Crownfall cover. No simulation state
// is changed here. All parts share CrownScene's owned geometry/material pool.
import * as THREE from '../animal-skyspire-drop/vendor/three/three.module.min.js';

const C = {
  fur:0xed8430, furLight:0xffb54e, furShade:0xb95126, cream:0xffebc1,
  ink:0x202e3b, eye:0x24a8dd, teal:0x147f91, tealLight:0x45c6cd,
  blue:0x217ab7, blueLight:0x55c9ef, gold:0xeab640, goldLight:0xffe18c,
  stone:0x697b88, pale:0xc4ccbd, guard:0x445768, purple:0x684c8e,
};

export function makeActor(box, enemy = null) {
  const g = new THREE.Group(), boss = !!enemy?.boss;
  const add = (...args) => box(g, ...args);
  const fur = enemy ? C.stone : C.fur;
  const armor = enemy ? (boss ? C.purple : C.guard) : C.teal;
  const trim = boss || !enemy ? C.gold : C.pale;
  // Broad cube skull and stepped cheeks, not a rounded/pixelated sprite.
  add(0,.44,0,.62,.46,.43,fur);
  add(0,.35,.22,.49,.2,.14,enemy?C.pale:C.cream);
  add(0,.31,.31,.29,.13,.15,C.cream);
  add(0,.38,.405,.12,.07,.065,C.ink);
  add(0,.27,.393,.16,.025,.02,C.furShade);
  for(const side of [-1,1]) {
    add(side*.3,.35,-.01,.12,.19,.31,fur);
    add(side*.25,.72,-.015,.2,.2,.22,fur);
    add(side*.27,.82,-.035,.13,.09,.16,enemy?C.ink:C.furShade);
    add(side*.25,.72,.108,.1,.12,.03,enemy?C.pale:0xffcf91);
    // Badger masks and fox white cheek planes remain recognizable at play size.
    if(enemy) add(side*.17,.46,.222,.13,.29,.045,C.ink);
    add(side*.165,.48,.255,.17,.13,.035,0xfffbec);
    add(side*.15,.48,.28,.075,.115,.028,enemy?0x1c354b:C.eye);
    add(side*.143,.495,.298,.026,.03,.014,0xffffff);
    add(side*.17,.58,.24,.19,.038,.028,enemy?C.ink:C.furShade);
    add(side*.25,.31,.235,.1,.095,.05,C.cream);
    // Separate boot, cuff, knee and toe planes establish contact with the cell.
    add(side*.135,-.29,0,.19,.23,.23,enemy?C.guard:C.furShade);
    add(side*.135,-.32,.14,.17,.1,.06,trim,true);
    add(side*.135,-.43,.065,.23,.13,.34,armor,true);
    add(side*.135,-.465,.17,.24,.055,.17,enemy?C.pale:C.goldLight,true);
  }
  add(0,.035,0,.43,.4,.34,armor,true);
  add(0,.08,.192,.34,.25,.08,enemy?0x8095a1:C.tealLight,true);
  add(0,-.15,.015,.46,.075,.38,trim,true);
  add(0,-.15,.223,.095,.09,.045,C.ink);
  const arms=[];
  for(const side of [-1,1]) {
    const arm = new THREE.Group();arm.position.set(side*.31,.1,0);g.add(arm);
    box(arm,0,0,0,.19,.18,.29,armor,true);
    box(arm,0,.035,.02,.23,.07,.32,trim,true);
    box(arm,0,-.13,0,.145,.19,.19,fur);
    box(arm,0,-.24,.09,.245,.225,.27,enemy?C.pale:C.gold,true);
    box(arm,0,-.235,.237,.16,.13,.045,enemy?C.guard:C.goldLight,true);
    if(!enemy) {
      box(arm,-side*.023,-.21,.264,.052,.12,.024,C.cream,true);
      box(arm,side*.02,-.26,.264,.09,.045,.024,C.cream,true);
    }
    arms.push(arm);
  }
  if(!enemy) {
    // The original fox's lightning forehead and comet scarf, not generic armor.
    add(-.025,.635,.235,.07,.08,.025,C.goldLight,true);
    add(.025,.59,.235,.1,.045,.025,C.goldLight,true);
    add(0,.54,.235,.045,.08,.025,C.goldLight,true);
    add(0,.21,.015,.5,.11,.41,C.blue);
    add(0,.16,.245,.13,.13,.035,C.gold,true);
    add(0,.16,.27,.19,.045,.024,C.goldLight,true);
    add(0,.16,.27,.045,.19,.024,C.goldLight,true);
    const scarf = new THREE.Group();g.add(scarf);
    for(const [x,y,w,h] of [[.31,.19,.25,.12],[.49,.24,.19,.13],[.62,.34,.15,.15],[.71,.41,.14,.12]])
      box(scarf,x,y,-.24,w,h,.09,C.blue);
    box(scarf,.49,.285,-.18,.2,.036,.04,C.blueLight);
    box(scarf,.72,.42,-.17,.085,.045,.03,C.goldLight);
    box(scarf,.72,.42,-.17,.035,.1,.03,C.goldLight);
    const tail = new THREE.Group();g.add(tail);
    for(const [x,y,z,w,h,d,col] of [
      [.21,-.2,-.29,.22,.16,.25,C.furShade],[.36,-.13,-.33,.25,.22,.26,C.fur],
      [.48,.02,-.34,.25,.25,.25,C.fur],[.54,.17,-.32,.23,.2,.24,C.cream],
      [.5,.28,-.3,.16,.08,.18,C.cream]]) box(tail,x,y,z,w,h,d,col);
    g.userData.scarf=scarf;
  } else {
    add(0,.67,-.02,.66,.11,.46,armor,true);
    add(0,.75,-.015,.19,.12,.32,trim,true);
    add(0,.825,-.025,.12,.05,.22,trim,true);
    add(0,.69,.25,.15,.055,.05,trim,true);
    const shield = new THREE.Group();shield.position.set(-.37,-.02,.23);g.add(shield);
    box(shield,0,0,0,.29,.4,.1,trim,true);
    box(shield,0,-.19,0,.18,.08,.1,trim,true);
    box(shield,0,0,.061,.23,.32,.045,enemy.shield?C.blue:armor,true);
    box(shield,0,0,.093,.085,.16,.025,enemy.shield?C.blueLight:trim,true);
    // Sword is held in the other gauntlet, not floating beside the hand.
    add(.37,-.075,.2,.07,.14,.075,C.ink);
    add(.37,.015,.2,.21,.055,.095,trim,true);
    add(.37,.24,.2,.065,.41,.065,C.pale,true);
    add(.37,.465,.2,.038,.07,.045,0xeaf3e9,true);
    if(boss) {
      for(const x of [-.23,0,.23]) add(x,.76,-.025,.075,.18,.07,C.gold,true);
      add(0,.72,.245,.08,.11,.04,0xd78bac,true);
      add(0,.015,-.205,.52,.55,.075,C.purple);
      add(0,-.29,-.205,.34,.09,.075,C.purple);
    }
    if(enemy.buff) {
      add(-.46,.4,-.22,.045,.9,.05,trim,true);
      add(-.32,.7,-.22,.25,.3,.055,boss?C.purple:C.teal);
      add(-.32,.69,-.18,.035,.17,.025,C.goldLight);
      add(-.32,.69,-.18,.14,.04,.025,C.goldLight);
    }
  }
  g.userData.arms=arms;
  g.scale.setScalar(boss?.81:.75);
  return g;
}

export function makeProp(box, item) {
  const g=new THREE.Group(), add=(...p)=>box(g,...p);
  if(item.kind==='crown') {
    add(0,-.3,0,.69,.09,.54,0x6f8084);
    add(0,-.24,0,.55,.06,.43,C.pale);
    add(0,-.1,0,.49,.15,.34,C.gold,true);
    add(0,-.155,.2,.56,.055,.08,C.goldLight,true);
    for(const x of [-.2,0,.2]) {
      add(x,.075,.14,.095,x===0?.31:.22,.1,C.gold,true);
      add(x,x===0?.265:.195,.14,.115,.07,.12,C.goldLight,true);
      add(x,.04,.206,.063,.07,.035,x===0?0xd9507d:C.tealLight,true);
    }
  } else if(item.kind==='key') {
    // Hollow square bow and two teeth retain a clear key silhouette.
    for(const x of [-.14,.14])add(x,.2,0,.08,.28,.12,C.gold,true);
    for(const y of [.08,.32])add(0,y,0,.28,.08,.12,C.goldLight,true);
    add(0,-.135,0,.08,.37,.12,C.gold,true);
    for(const y of [-.2,-.31]) add(.09,y,0,.16,.07,.12,C.goldLight,true);
    add(0,.2,.073,.065,.075,.02,item.link==='2'?C.blueLight:C.fur,true);
  } else {
    const rune=item.kind==='rune';
    add(0,-.02,0,.37,.46,.16,rune?C.teal:C.gold,true);
    add(0,-.02,.098,.25,.32,.045,rune?C.blue:C.furShade);
    if(rune) {
      for(const [x,y,w,h] of [[0,.12,.1,.06],[-.065,.015,.06,.16],[.065,.015,.06,.16],[0,-.09,.1,.06]])
        add(x,y,.13,w,h,.025,C.blueLight,true);
    } else {
      const count=Math.min(3,Math.max(1,Number(item.link)||1));
      for(let i=0;i<count;i++)add((i-(count-1)/2)*.075,-.02,.13,.035,.18,.025,C.goldLight,true);
    }
  }
  return g;
}

// Dressing has no input/collision role. Batched by material by CrownScene;
// columns frame the board, while low-contrast back-wall details stay behind it.
export function makeCastle(box, rows, folded) {
  const g=new THREE.Group(), add=(...p)=>box(g,...p);
  const height=folded?Math.ceil(rows/2):rows;
  const wings=folded?[0,8.2]:[0];
  // Fill the arena behind the architecture, including spare portrait height.
  // A single shared-geometry instance avoids a visible rectangular backdrop.
  add(3,-(height-1)/2,-2.65,200,200,.12,0x243c48);
  for(const offset of wings) {
    add(offset+3,-(height-1)/2,-2.5,8.15,height+4,.3,0x243c48);
    // Quiet recessed walls, varied courses and inset windows, not a flat grid.
    for(let row=-1;row<=height;row++) {
      for(let col=0;col<4;col++) {
        const x=offset-.2+col*2+(row%2?.5:0);
        add(x,-row,-2.21,1.9,.91,.14,(row+col)%3===0?0x314b55:0x2a424d);
      }
    }
    for(const x of [offset-.85,offset+6.85]) {
      add(x,-(height-1)/2,-1.16,.48,height+1.5,.72,0x8a958c);
      for(let y=-1;y<=height;y+=2) {
        add(x,-y,-.94,.57,.16,.8,0xb6b7a0);
        add(x-.06,-y-.55,-.735,.14,.82,.06,0xa7af9f);
      }
      add(x,.86,-1,.8,.23,.9,0xc7c5aa);
      for(const dx of [-.25,.25])add(x+dx,1.06,-1,.23,.24,.85,0xb6b7a0);
    }
    for(const x of [offset+1.2,offset+4.8]) {
      add(x,-height*.38,-2,.84,1.65,.13,0x172d3c);
      add(x,-height*.38-.74,-1.85,.96,.12,.3,0x536c73);
      add(x,-height*.38+.83,-1.91,.48,.15,.2,0x62757a);
      for(const side of [-1,1]) {
        add(x+side*.43,-height*.38,-1.9,.13,1.65,.18,0x51676f);
        add(x+side*.28,-height*.38+.72,-1.9,.19,.17,.18,0x51676f);
      }
      add(x,-height*.38,-1.85,.065,1.5,.045,0x3a6074);
      add(x,-height*.38+.13,-1.85,.7,.06,.045,0x3a6074);
    }
    // Teal pennants echo the poster; no animated clutter behind touch cells.
    for(const x of [offset-.38,offset+6.38]) {
      add(x,-.22,-1.72,.34,1.15,.05,C.teal);
      add(x,-.85,-1.72,.2,.17,.05,C.teal);
      add(x,.36,-1.67,.43,.075,.08,0xbaa35c,true);
      add(x,-.12,-1.67,.045,.28,.02,0xc0b176,true);
      add(x,-.12,-1.67,.17,.05,.02,0xc0b176,true);
    }
  }
  return g;
}
