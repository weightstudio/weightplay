// Authored route inventory used by the saved campaign.
import {translatedStageNames} from './campaign-names.mjs';
// Edge suffixes: ? optional, ~ reversible, ! one bridge token.
function stage(id, names, purpose, edges, rules={}) {
  const tiles=edges.split(' ').map((edge,index)=>{
    const match=/^([a-z]+)>([a-z]+)([?~!]*)$/.exec(edge);
    if(!match)throw new Error('Invalid authored edge '+edge);
    return Object.freeze({id:'tile-'+(index+1),from:match[1],to:match[2],required:!match[3].includes('?'),reversible:match[3].includes('~'),bridge:match[3].includes('!')?1:0});
  });
  return Object.freeze({id,arc:Math.ceil(id/5),checkpoint:id%5===0,names:Object.freeze({en:names[0],'zh-Hant':names[1],...Object.fromEntries(Object.entries(translatedStageNames).map(([locale,list])=>[locale,list[id-1]]))}),purpose,
    start:'den',goal:'moon',...rules,tiles:Object.freeze(tiles)});
}
export const campaign=Object.freeze([
  stage(1,['The unfinished loop','尚未閉合的環路'],'Close the creek loop before choosing the moon exit.',
    'den>creek creek>den den>moon'),
  stage(2,['Return through moss','苔地回程'],'The apparent exit branches at the creek, not at the start.',
    'den>creek creek>moss moss>creek creek>moon'),
  stage(3,['Nest before creek','先訪巢穴'],'A creek-first pattern now strands the separate nest loop.',
    'den>creek creek>moss moss>moon den>nest nest>den'),
  stage(4,['Two gathering places','兩處集散地'],'Close a local nest loop inside the larger creek detour.',
    'den>creek creek>nest nest>moss moss>nest nest>den den>moon'),
  stage(5,['Keeper of the twin loops','雙環守望者'],'Checkpoint: return to both hubs without spending the final connector early.',
    'den>creek creek>den den>nest nest>moss moss>nest nest>reef reef>moon'),

  stage(6,['A creek invitation','溪流邀請'],'Optional tiles may be left behind, but a required habitat cannot.',
    'den>moon den>creek? creek>den? den>nest? nest>den?',{visits:['creek']}),
  stage(7,['Beyond the nest','巢穴另一端'],'The required moss lies behind a detour rather than beside the start.',
    'den>moon den>nest? nest>moss? moss>den? den>creek? creek>den?',{visits:['moss']}),
  stage(8,['Two invitations','兩封邀請'],'Visit both branches; either order works but the exit ends access.',
    'den>moon den>creek? creek>den? den>nest? nest>den?',{visits:['creek','nest']}),
  stage(9,['The reef shortcut','礁岸捷徑'],'A shared return makes choosing the shorter branch sacrifice a required stop.',
    'den>moon den>creek? creek>reef? den>nest? nest>moss? moss>reef? reef>den?',{visits:['moss']}),
  stage(10,['The habitat surveyor','棲地巡查員'],'Checkpoint: a shortcut consumes the only return before all required visits.',
    'den>moon den>creek? creek>nest? nest>moss? moss>den? den>nest?',{visits:['creek','moss']}),

  stage(11,['One bridge token','一枚橋樑通行證'],'Save the token for the return; the outbound bridge is a tempting expense.',
    'den>moon den>creek?! den>moss? moss>creek? creek>den?!',{visits:['creek'],bridges:1}),
  stage(12,['The far bank','對岸'],'Reach the moss stop via the nest; the direct bridge leaves no return token.',
    'den>moon den>moss?! den>nest? nest>moss? moss>creek?! creek>den?',{visits:['moss'],bridges:1}),
  stage(13,['Split crossing','分岔渡口'],'Two required stops share a crossing; avoid paying for separate excursions.',
    'den>moon den>creek?! creek>nest? nest>den? den>nest?! nest>moss? moss>den?',{visits:['creek','nest'],bridges:1}),
  stage(14,['Keep a return token','留下回程通行證'],'A free approach to the reef leaves two tokens for the mandatory return.',
    'den>moon den>reef?! den>nest? nest>reef? reef>creek?! creek>den?!',{visits:['reef'],bridges:2}),
  stage(15,['Bridge warden','橋樑守衛'],'Checkpoint: an appealing creek circuit consumes the bridge needed by the nest route.',
    'den>moon den>creek?! creek>den? den>nest?! nest>moss? moss>creek? creek>reef? reef>den?',{visits:['nest','creek'],bridges:1}),

  stage(16,['Turn one domino','翻轉一張骨牌'],'The creek return points the wrong way; use one flip after the outbound tile.',
    'den>creek den>creek~ den>moon',{flips:1}),
  stage(17,['A reversed approach','逆向入口'],'Flip the approach instead of the return; the final exit still waits.',
    'creek>den~ creek>moss moss>den den>moon',{flips:1}),
  stage(18,['Nest hinge','巢穴轉軸'],'A reversible connection belongs inside a nested loop, not at the exit.',
    'den>nest moss>nest~ moss>creek creek>nest nest>den den>moon',{flips:1}),
  stage(19,['The second hinge','第二個轉軸'],'Two separate reversed returns must each receive one flip.',
    'den>creek den>creek~ den>nest den>nest~ den>moon',{flips:2}),
  stage(20,['Domino turnkeeper','骨牌轉向師'],'Checkpoint: a reversed local return closes the reef loop before the outer one.',
    'den>creek creek>reef reef>moss reef>moss~ creek>reef~ creek>den den>moon',{flips:2}),

  stage(21,['Creek before nest','先溪流後巢穴'],'Deliver in order; both outward moves match but the nest-first route fails.',
    'den>creek creek>den den>nest nest>den den>moon',{deliveries:['creek','nest']}),
  stage(22,['A moss appointment','苔地約定'],'A different order reverses the safe opening; do not memorize creek first.',
    'den>creek creek>den den>nest nest>moss moss>den den>moon',{deliveries:['moss','creek']}),
  stage(23,['Three deliveries','三站送達'],'Plan three loops in the prescribed order, saving the moon exit.',
    'den>creek creek>den den>nest nest>den den>reef reef>den den>moon',{deliveries:['nest','reef','creek']}),
  stage(24,['Delivery within a loop','環路中的送達'],'The first delivery unlocks a deeper loop before the final creek visit.',
    'den>nest nest>moss moss>nest nest>den den>creek creek>den den>moon',{deliveries:['moss','creek']}),
  stage(25,['Sanctuary courier','庇護所信使'],'Checkpoint: revisit the creek after the nest; a repeat destination is meaningful.',
    'den>creek creek>nest nest>creek creek>den den>moon',{deliveries:['creek','nest','creek']}),

  stage(26,['Bridge and hinge','橋樑與轉軸'],'Combine a paid outbound crossing with a reversed return and a required visit.',
    'den>moon den>creek?! den>creek?~ den>nest? nest>den?',{visits:['creek'],bridges:1,flips:1}),
  stage(27,['The ordered crossing','依序渡河'],'Visit the creek before the nest while saving the single crossing for the combined route.',
    'den>moon den>nest?! nest>den? den>creek?! creek>nest? nest>moss? moss>den?',{visits:['creek','nest'],deliveries:['creek','nest'],bridges:1}),
  stage(28,['Turn after delivery','送達後翻轉'],'A flipped approach serves the first delivery; a separate loop serves the second.',
    'den>moon creek>den?~ creek>den? den>nest? nest>moss? moss>den?',{visits:['creek','moss'],deliveries:['creek','moss'],flips:1}),
  stage(29,['A careful homecoming','謹慎歸途'],'Save the bridge for the required second stop and flip the first return.',
    'den>moon den>creek? den>creek?~ den>nest?! nest>moss? moss>den? den>reef?! reef>den?',{visits:['creek','moss'],deliveries:['creek','moss'],bridges:1,flips:1}),
  stage(30,['Moonlit sanctuary','月光庇護所'],'Final checkpoint: ordered visits, one bridge, one reverse, and a decoy that spends the only crossing.',
    'den>moon den>creek?! den>creek?~ den>nest? nest>moss? moss>den? den>reef?! reef>den?',{visits:['creek','moss'],deliveries:['creek','moss'],bridges:1,flips:1}),
]);
