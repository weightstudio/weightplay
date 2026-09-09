import {createCampaignState} from './campaign-engine.mjs';

// Authored boards, not shuffled seeds. Rows use tile units; '.' is a gap.
// A layer can move by half a tile to create bridges. Names below are authoring
// labels, not shipped localized UI; the campaign stays unmounted until ready.
const layer = (rows, x=0, y=0) => ({rows,x,y});
const drafts = [
 {name:'Tea Pavilion', arc:1, purpose:'Learn one matching pair before two independent choices.', layers:[layer(['A A . B B','C C . D D'])]},
 {name:'Jade Corridor', arc:1, purpose:'Open both ends of a long row instead of tapping its blocked center.', layers:[layer(['A B C C B A','D E . . E D'])]},
 {name:'Roof Tiles', arc:1, purpose:'Remove a top pair to reveal a lower match; lower outer edges remain alternatives.', layers:[layer(['A B C C B A','D E F F E D']),layer(['G G'],2,.5)]},
 {name:'Twin Bridges', arc:1, purpose:'Choose which of two independent covers to remove first.', layers:[layer(['A B B A','C D D C','E F F E']),layer(['G . . G'],0,.5)]},
 {name:'Pavilion Keeper', arc:1, purpose:'Checkpoint: expose A before removing B; unrelated edge pairs remain usable.', order:['A','B'], layers:[layer(['C A . A C','D B . B D']),layer(['E E'],1.5,.5)]},
 {name:'Forked Path', arc:2, purpose:'Four identical A faces introduce pairing choice; two bottom A tiles are a trap.', layers:[layer(['A A B B','A C C A'])]},
 {name:'Long Crossing', arc:2, purpose:'Free a duplicated inner face by pairing across rows after opening the long corridor ends.', layers:[layer(['D A A B B D','E A C C A E'])]},
 {name:'Split Courtyard', arc:2, purpose:'Two separated islands share faces, so pairing decisions cross the gap.', layers:[layer(['A B . A B','C D . C D']),layer(['E . . E'],0,.5)]},
 {name:'Canopy Choice', arc:2, purpose:'A roof must be opened before the repeated-face trap can be assessed.', layers:[layer(['A A B B','A C C A']),layer(['D D'],1,.5)]},
 {name:'Bridge Warden', arc:2, purpose:'Checkpoint: A opens the jade seal while duplicate C choices still require foresight.', keys:{A:['jade']}, gates:{B:'jade'}, layers:[layer(['A B B A','C C D D','C E E C'])]},
 {name:'Jade Seal', arc:3, purpose:'Read the seal cue: remove an exposed A key pair to unlock B.', keys:{A:['jade']}, gates:{B:'jade'}, layers:[layer(['A B C C B A','D E E D'])]},
 {name:'Key Under Eaves', arc:3, purpose:'A key is physically covered; opening the roof precedes opening the seal.', keys:{A:['jade']}, gates:{B:'jade'}, layers:[layer(['A B B A','C D D C']),layer(['E . . E'],0,0)]},
 {name:'Two Courtyards', arc:3, purpose:'Two separate key pairs open different sealed islands.', keys:{A:['jade'],C:['amber']}, gates:{B:'jade',D:'amber'}, layers:[layer(['A B B A','C D D C','E F F E'])]},
 {name:'Shared Key', arc:3, purpose:'One A pair opens two seals; choosing which island to clear changes access to the lower row.', keys:{A:['jade','amber']}, gates:{B:'jade',C:'amber'}, layers:[layer(['D B B D','E C C E','F G G F']),layer(['A A'],1,.5)]},
 {name:'Seal Archivist', arc:3, purpose:'Checkpoint: chained locks require A, then B, before sealed C can be removed.', keys:{A:['jade'],B:['amber']}, gates:{B:'jade',C:'amber'}, layers:[layer(['A B C C B A','D E F F E D']),layer(['G G'],2,1)]},
 {name:'Lantern Sequence', arc:4, purpose:'Pair A, B and C in the displayed order while ordinary D remains free.', order:['A','B','C'], layers:[layer(['A . B . C','A . B . C','D D'])]},
 {name:'Hidden Lantern', arc:4, purpose:'The next ordered A pair is under a bridge; remove the neutral roof first.', order:['A','B','C'], layers:[layer(['A . B . C','A . B . C','D D']),layer(['E E'],0,0)]},
 {name:'Crossed Ribbons', arc:4, purpose:'Ordered A then B constrains which side of the neutral palindrome to open.', order:['A','B'], layers:[layer(['A C D D C A','B E F F E B']),layer(['G G'],2,.5)]},
 {name:'Sequence and Seal', arc:4, purpose:'The ordered key A opens B; a neutral roof covers the last required C.', order:['A','B','C'], keys:{A:['jade']}, gates:{B:'jade'}, layers:[layer(['A B C C B A','D E E D']),layer(['F F'],2,0)]},
 {name:'Lantern Curator', arc:4, purpose:'Checkpoint: follow C then A then B, with the first ordered pair on the highest layer.', order:['C','A','B'], layers:[layer(['A B D D B A','E F F E']),layer(['G G'],2,.5),layer(['C C'],2,.5)]},
 {name:'Terraced Grove', arc:5, purpose:'Three layers form a stepped cover; exposed low edges can also be cleared.', layers:[layer(['A B C C B A','D E F F E D','G H I I H G']),layer(['J K K J'],1,.5),layer(['L L'],2,.5)]},
 {name:'Twin Lock Tower', arc:5, purpose:'Upper C unlocks D while outer A independently unlocks B.', keys:{A:['jade'],C:['amber']}, gates:{B:'jade',D:'amber'}, layers:[layer(['A B E E B A','F D G G D F']),layer(['H H'],2,.5),layer(['C C'],2,.5)]},
 {name:'Broken Causeway', arc:5, purpose:'Separated banks share matches under two half-tile overhangs.', layers:[layer(['A B . . B A','C D . . D C','E F F E']),layer(['G G . G G'],.5,.5)]},
 {name:'Echo Chamber', arc:5, purpose:'A repeated-face trap sits under an ordered roof: clear D then E before choosing A partners.', order:['D','E'], layers:[layer(['A A B B','A C C A']),layer(['E E'],1,.5),layer(['D D'],1,.5)]},
 {name:'Twin Gate Guardian', arc:5, purpose:'Checkpoint: the C→A→B order crosses two locks, opening amber before jade.', order:['C','A','B'], keys:{C:['amber'],A:['jade']}, gates:{A:'amber',B:'jade'}, layers:[layer(['A B D D B A','E F G G F E']),layer(['C C'],2,.5)]},
 {name:'Moon Terrace', arc:6, purpose:'Broad lower edges compete with central high covers; clear an offset three-layer terrace.', layers:[layer(['A B C C B A','D E F F E D','G H I I H G','J K K J']),layer(['L M M L'],1,.5),layer(['N N'],2,.5)]},
 {name:'Keeper of Keys', arc:6, purpose:'A→B→C chained keys cross separate rows while neutral upper pairs expose each lock.', keys:{A:['jade'],B:['amber'],C:['pearl']}, gates:{B:'jade',C:'amber',D:'pearl'}, layers:[layer(['A B B A','C D D C','E F F E']),layer(['G . . G'],0,.5)]},
 {name:'Mirror Archive', arc:6, purpose:'Two repeated-face traps sit on opposite sides; an upper key unlocks their lower B faces.', keys:{D:['jade']}, gates:{B:'jade'}, layers:[layer(['A A B B','A C C A','E E F F','E G G E']),layer(['D D'],1,1.5)]},
 {name:'Ascending Lanterns', arc:6, purpose:'A→C→B order alternates top and side access while A opens the central seal.', order:['A','C','B'], keys:{A:['jade']}, gates:{B:'jade'}, layers:[layer(['C B D D B C','E F G G F E','H I I H']),layer(['J K K J'],1,.5),layer(['A A'],2,.5)]},
 {name:'Jade Palace Finale', arc:6, purpose:'Final checkpoint: highest A opens B, B opens C, C opens D; clear them in order across four layers.', order:['A','B','C','D'], keys:{A:['jade'],B:['amber'],C:['pearl']}, gates:{B:'jade',C:'amber',D:'pearl'}, layers:[layer(['C D E E D C','F G H H G F','I J K K J I']),layer(['B L L B'],1,.5),layer(['M M'],2,.5),layer(['A A'],2,.5)]},
];

export const MAHJONG_CAMPAIGN = Object.freeze(drafts.map((draft,i)=>{
 const tiles=[];
 draft.layers.forEach((l,z)=>l.rows.forEach((row,y)=>row.split(' ').forEach((face,x)=>{
  if(face!=='.') tiles.push({id:`s${i+1}-t${tiles.length+1}`,face,x:x+l.x,y:y+l.y,z,...(draft.gates?.[face]?{gate:draft.gates[face]}:{})});
 })));
 const definition={tiles,keys:draft.keys,order:draft.order};
 const initial=createCampaignState(definition);
 return Object.freeze({id:i+1,arc:draft.arc,checkpoint:(i+1)%5===0,name:draft.name,purpose:draft.purpose,
  definition:Object.freeze({tiles:initial.tiles,keys:initial.rules.keys,order:initial.rules.order})});
}));

export function startMahjongStage(id) {
 if(!Number.isInteger(id)||id<1||id>MAHJONG_CAMPAIGN.length)throw new Error('Unknown campaign stage');
 return createCampaignState(MAHJONG_CAMPAIGN[id-1].definition);
}
