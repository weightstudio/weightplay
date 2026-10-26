// Explicit authored rooms. No seed generator, repeated-room fallback, or global target reader.
const original=[
  {
    "badge": "◎",
    "start": [
      0,
      2
    ],
    "switches": [
      [
        2,
        1
      ],
      [
        4,
        3
      ]
    ],
    "key": [
      5,
      1
    ],
    "exit": [
      7,
      2
    ],
    "limit": 18,
    "walls": [
      [
        1,
        0
      ],
      [
        3,
        0
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        4,
        4
      ],
      [
        6,
        4
      ]
    ]
  },
  {
    "badge": "⚙",
    "start": [
      0,
      4
    ],
    "switches": [
      [
        1,
        3
      ],
      [
        3,
        1
      ],
      [
        5,
        3
      ]
    ],
    "key": [
      6,
      3
    ],
    "exit": [
      7,
      4
    ],
    "limit": 22,
    "walls": [
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        2,
        1
      ],
      [
        2,
        0
      ],
      [
        4,
        0
      ],
      [
        6,
        0
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ]
    ],
    "gates": [
      {
        "x": 2,
        "y": 3,
        "needs": 1
      },
      {
        "x": 4,
        "y": 1,
        "needs": 2
      },
      {
        "x": 6,
        "y": 3,
        "needs": 3
      }
    ]
  },
  {
    "badge": "❄",
    "start": [
      0,
      4
    ],
    "switches": [
      [
        2,
        4
      ],
      [
        4,
        2
      ],
      [
        6,
        0
      ]
    ],
    "key": [
      7,
      2
    ],
    "exit": [
      7,
      4
    ],
    "limit": 15,
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        3,
        1
      ],
      [
        3,
        2
      ],
      [
        3,
        3
      ],
      [
        5,
        1
      ],
      [
        6,
        1
      ],
      [
        5,
        2
      ],
      [
        6,
        2
      ]
    ],
    "ice": [
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        4,
        3
      ],
      [
        4,
        2
      ],
      [
        4,
        1
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ]
    ]
  },
  {
    "badge": "✦",
    "start": [
      0,
      2
    ],
    "switches": [
      [
        1,
        1
      ],
      [
        3,
        3
      ],
      [
        6,
        1
      ]
    ],
    "key": [
      6,
      3
    ],
    "exit": [
      7,
      2
    ],
    "limit": 20,
    "walls": [
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ]
    ],
    "portals": [
      [
        [
          2,
          1
        ],
        [
          5,
          3
        ]
      ]
    ]
  },
  {
    "badge": "①",
    "start": [
      0,
      4
    ],
    "switches": [
      [
        2,
        3
      ],
      [
        1,
        1
      ],
      [
        4,
        3
      ],
      [
        6,
        1
      ]
    ],
    "key": [
      7,
      1
    ],
    "exit": [
      7,
      4
    ],
    "limit": 24,
    "ordered": true,
    "walls": [
      [
        0,
        3
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ]
    ]
  },
  {
    "badge": "★",
    "start": [
      0,
      4
    ],
    "switches": [
      [
        2,
        4
      ],
      [
        3,
        1
      ],
      [
        5,
        3
      ],
      [
        6,
        1
      ]
    ],
    "key": [
      7,
      0
    ],
    "exit": [
      7,
      4
    ],
    "limit": 22,
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        4,
        3
      ],
      [
        6,
        3
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ]
    ],
    "gates": [
      {
        "x": 3,
        "y": 3,
        "needs": 1
      },
      {
        "x": 7,
        "y": 2,
        "needs": 4
      }
    ],
    "ice": [
      [
        1,
        4
      ],
      [
        2,
        4
      ]
    ],
    "portals": [
      [
        [
          4,
          1
        ],
        [
          5,
          3
        ]
      ]
    ]
  }
];
const authored=[
  [
    7,
    "First sunrise",
    1,
    13,
    false,
    [
      "########",
      "########",
      "S1.s.2KX",
      "########",
      "########"
    ],
    "Use the lantern once to cross a sun gate after lighting the first switch."
  ],
  [
    8,
    "Moon before sun",
    1,
    15,
    false,
    [
      "########",
      "1.m..###",
      "S.##s2KX",
      "..######",
      "########"
    ],
    "Visit the moon branch before committing the only charge to the sun exit."
  ],
  [
    9,
    "Sun pocket",
    2,
    15,
    false,
    [
      "########",
      "##1s2###",
      "S..m..KX",
      "########",
      "########"
    ],
    "Enter the sun pocket, then restore moon light to leave through the lower gate."
  ],
  [
    10,
    "Two wings",
    2,
    20,
    true,
    [
      "########",
      "1.m.s2##",
      "S.###.KX",
      "..m.3.##",
      "########"
    ],
    "Checkpoint: light three ordered wings while deciding where each of two phase changes occurs."
  ],
  [
    11,
    "Spare cell",
    1,
    15,
    false,
    [
      "########",
      "##1s+###",
      "S..m.2KX",
      "########",
      "########"
    ],
    "The spare battery beyond the sun gate funds the return to the moon corridor."
  ],
  [
    12,
    "Recharge detour",
    1,
    28,
    true,
    [
      "##1..###",
      "##s#.###",
      "S..#+2KX",
      "##m#.###",
      "##3..###"
    ],
    "Light the two sun switches and take the battery before returning to the ordered moon switch.",
    [
      1,
      1,
      0
    ]
  ],
  [
    13,
    "Frozen sunrise",
    1,
    17,
    false,
    [
      "########",
      "##1#####",
      "S..~~s2X",
      "######K#",
      "########"
    ],
    "Use a single charge before committing to the ice rail, then collect the key below the exit."
  ],
  [
    14,
    "Gate on ice",
    3,
    23,
    true,
    [
      "########",
      "##1m2###",
      "S..~~sKX",
      "##3#####",
      "########"
    ],
    "Stop the slide at a closed gate; order the side switches before the final sun run."
  ],
  [
    15,
    "Cold return",
    1,
    24,
    false,
    [
      "##s1+###",
      "##.#####",
      "S..~~mKX",
      "######2#",
      "########"
    ],
    "Checkpoint: light the sun switch and collect its battery, restore moon, then use the rail to reach the second switch and key.",
    [
      1,
      0
    ]
  ],
  [
    16,
    "Split portal",
    1,
    14,
    false,
    [
      "1.sA####",
      "..######",
      "S.####KX",
      "####A2..",
      "########"
    ],
    "Use the portal as the only bridge between the lit sun wing and the key chamber."
  ],
  [
    17,
    "Portal backtrack",
    2,
    19,
    true,
    [
      "1.sA####",
      "..######",
      "S.m3..KX",
      "####A2##",
      "########"
    ],
    "Return from switch two through the portal, restore moon and reach switch three."
  ],
  [
    18,
    "Battery beyond",
    1,
    21,
    true,
    [
      "1.sA####",
      "..######",
      "S.m3..KX",
      "####A2+#",
      "########"
    ],
    "The portal room supplies the second charge; fetch it before returning to the ordered moon wing."
  ],
  [
    19,
    "Ice portal exit",
    1,
    18,
    false,
    [
      "1.sA####",
      "..######",
      "S.######",
      "####A~~~",
      "#####2KX"
    ],
    "Let the destination ice corridor carry you toward the key only after both remote switches are lit."
  ],
  [
    20,
    "Three-part circuit",
    1,
    23,
    true,
    [
      "1.sA####",
      "..######",
      "S.m3..KX",
      "####A~2+",
      "########"
    ],
    "Checkpoint: switch order, a battery portal detour and a stopped ice arrival must agree."
  ],
  [
    21,
    "Second sunrise",
    3,
    18,
    true,
    [
      "1.s2m3sX",
      "..####K#",
      "S.######",
      "########",
      "########"
    ],
    "Three separated gate phases force a sun–moon–sun schedule, not repeated free switching."
  ],
  [
    22,
    "Spend or carry",
    2,
    17,
    false,
    [
      "1.s+####",
      "..######",
      "S.m2s3KX",
      "########",
      "########"
    ],
    "The optional-looking battery is required for the last sun gate after restoring moon."
  ],
  [
    23,
    "Ordered return",
    2,
    19,
    true,
    [
      "1.s2.###",
      "..##m###",
      "S.m3..KX",
      "########",
      "########"
    ],
    "Choose the moon crossing after switch two so the third switch can be reached without a third charge."
  ],
  [
    24,
    "Across the gallery",
    2,
    22,
    true,
    [
      "1.sA####",
      "..######",
      "S.m3s.KX",
      "####A2+#",
      "########"
    ],
    "Bring the portal battery home, then make the last sun commitment beyond ordered switch three."
  ],
  [
    25,
    "Reserved light",
    1,
    23,
    true,
    [
      "1.s+A###",
      "..######",
      "S.m3s4KX",
      "####A2+#",
      "########"
    ],
    "Checkpoint: collect both separate batteries and reserve the third change for the final wing."
  ],
  [
    26,
    "Frozen moon door",
    2,
    21,
    true,
    [
      "1.s2####",
      "..##.###",
      "S.~~m3KX",
      "########",
      "########"
    ],
    "Light the upper pair under sun, change back before a sliding moon approach."
  ],
  [
    27,
    "Forked battery",
    1,
    20,
    true,
    [
      "1.s+A###",
      "..######",
      "S.m3..KX",
      "####A2.#",
      "######+#"
    ],
    "A battery off the portal landing must be collected before restoring the moon route."
  ],
  [
    28,
    "Crossed circuits",
    2,
    24,
    true,
    [
      "1.sA####",
      "..######",
      "S.m3s4KX",
      "####A~2+",
      "########"
    ],
    "Order four switches across the portal and ice branches with the final battery funded sun change."
  ],
  [
    29,
    "Last reserve",
    1,
    23,
    true,
    [
      "1.s+A###",
      "..######",
      "S.m3~sKX",
      "####A2+#",
      "########"
    ],
    "Two batteries support the final ice and sun corridor; returning early strands the final charge."
  ],
  [
    30,
    "Lantern observatory",
    1,
    25,
    true,
    [
      "1.s+A###",
      "..######",
      "S.m3~s4X",
      "####A2+K",
      "########"
    ],
    "Chapter finale: reconcile four ordered switches, two one-use batteries, portal return, ice and the final key approach."
  ],
  [
    31,
    "Counterweight",
    0,
    17,
    false,
    [
      "########",
      "########",
      "S.C.PHKX",
      "..1...##",
      "########"
    ],
    "Push one crate onto the plate, keeping room to walk around it and reach the newly opened key gate."
  ],
  [
    32,
    "Side approach",
    0,
    19,
    false,
    [
      "########",
      "##1....#",
      "S..C.PHX",
      "..####K#",
      "########"
    ],
    "Approach the crate from its left after collecting the switch above it; avoid pushing it past its plate."
  ],
  [
    33,
    "Make a walkway",
    0,
    17,
    false,
    [
      "########",
      "##P1.###",
      "S.C..HKX",
      "..2..###",
      "########"
    ],
    "Walk around the crate to push upward onto its plate, freeing the central route."
  ],
  [
    34,
    "Weight and order",
    0,
    17,
    true,
    [
      "########",
      "##P2.###",
      "S.C..HKX",
      "..1..###",
      "########"
    ],
    "Light the lower switch first, then position behind the crate before the upper ordered switch."
  ],
  [
    35,
    "Shared doorway",
    0,
    21,
    true,
    [
      "########",
      "##P3.###",
      "S.C..HKX",
      "..1.2###",
      "########"
    ],
    "Checkpoint: keep access to three switches while parking the counterweight off the through route."
  ],
  [
    36,
    "Sun weight",
    1,
    22,
    false,
    [
      "########",
      "##P1####",
      "S.C..sKX",
      "..2..###",
      "########"
    ],
    "Park the crate before changing to sun; the key now requires both switches and a held plate."
  ],
  [
    37,
    "Moon service lane",
    2,
    19,
    false,
    [
      "########",
      "##P1s2##",
      "S.C..mKX",
      ".....###",
      "########"
    ],
    "Use the upper sun side room, then restore the moon service exit with the plate still held."
  ],
  [
    38,
    "Crate battery",
    1,
    25,
    true,
    [
      "########",
      "##P1s+##",
      "S.C..mKX",
      "..2..###",
      "########"
    ],
    "The battery behind sun funds the exit phase; plan the crate approach without covering switch two."
  ],
  [
    39,
    "Narrow loading bay",
    1,
    18,
    true,
    [
      "########",
      "##P2####",
      "S.C..sKX",
      "1..#.###",
      "########"
    ],
    "Use the lower left alcove before it becomes a detour; push vertically without walling off your approach."
  ],
  [
    40,
    "Counterweight shift",
    1,
    27,
    true,
    [
      "########",
      "##P1s+##",
      "S.C..mKX",
      "..2.3###",
      "########"
    ],
    "Checkpoint: three ordered switches and battery-funded sun/ moon phases with a permanently held plate."
  ],
  [
    41,
    "Portal freight",
    0,
    15,
    false,
    [
      "########",
      "##P1A###",
      "S.C..###",
      "..2..###",
      "####A.KX"
    ],
    "Park the crate locally; only the player uses the portal to reach the key room."
  ],
  [
    42,
    "Distant switch",
    0,
    23,
    true,
    [
      "########",
      "##P1A###",
      "S.C..###",
      "..3..###",
      "####A2KX"
    ],
    "Return from remote switch two, light local switch three, then revisit the key."
  ],
  [
    43,
    "Sun shipping",
    1,
    21,
    false,
    [
      "########",
      "##P1sA##",
      "S.C...##",
      "..2...##",
      "####A.KX"
    ],
    "Open the portal route with one lantern change after arranging the local pressure plate."
  ],
  [
    44,
    "Freight recharge",
    1,
    26,
    true,
    [
      "########",
      "##P1sA##",
      "S.C...##",
      "..3m.KX#",
      "####A2+#"
    ],
    "The remote battery restores moon access to switch three; the parked crate must remain in place."
  ],
  [
    45,
    "Round-trip manifest",
    2,
    27,
    true,
    [
      "########",
      "##P1sA##",
      "S.C...##",
      "..3m4KX#",
      "####A2+#"
    ],
    "Checkpoint: finish the remote ordered switch before returning through the moon passage to the last pair."
  ],
  [
    46,
    "Ice bypass",
    0,
    18,
    false,
    [
      "########",
      "##P1.###",
      "S.C..HKX",
      "...~~2##",
      "########"
    ],
    "Crates stay off ice; use the sliding lower route to walk around the parked weight."
  ],
  [
    47,
    "Frozen loading",
    1,
    17,
    true,
    [
      "########",
      "##P2.###",
      "S.C..sKX",
      "1..~~###",
      "########"
    ],
    "Collect the first switch before the ice bypass, push the crate from below and reserve sun for the exit."
  ],
  [
    48,
    "Ice relay battery",
    1,
    22,
    true,
    [
      "########",
      "##P1s+##",
      "S.C..mKX",
      "...~~2##",
      "########"
    ],
    "Combine the one-use battery return with a slide past switch two; recover a poor approach with Undo."
  ],
  [
    49,
    "Portal and ice weight",
    0,
    27,
    true,
    [
      "########",
      "##P1A###",
      "S.C..###",
      "..3.K###",
      "####A~2X"
    ],
    "Arrange the weight, visit remote switch two, then return for switch three and the key before the remote exit."
  ],
  [
    50,
    "Cold freight circuit",
    1,
    28,
    true,
    [
      "########",
      "##P1sA##",
      "S.C...##",
      "..3m.KX#",
      "####A~2+"
    ],
    "Checkpoint: the held weight, portal ice landing and battery return must all be solved before collecting the key."
  ],
  [
    51,
    "Two counterweights",
    0,
    17,
    false,
    [
      "########",
      "##P.P###",
      "S.C.CHKX",
      "..1..###",
      "########"
    ],
    "Each crate needs its own upward approach; neither may block access behind the other."
  ],
  [
    52,
    "Paired switch route",
    0,
    17,
    true,
    [
      "########",
      "##P.P###",
      "S.C.CHKX",
      "1..2.###",
      "########"
    ],
    "Light the ordered pair while reserving the two push positions for separate plates."
  ],
  [
    53,
    "Sun cargo pair",
    1,
    18,
    false,
    [
      "########",
      "##P.P###",
      "S.C.CsKX",
      "1..2.###",
      "########"
    ],
    "Park both crates, then spend the single lantern charge on the exit gate."
  ],
  [
    54,
    "Split cargo circuit",
    2,
    27,
    true,
    [
      "##1s2###",
      "##P.P###",
      "S.C.CmKX",
      ".....###",
      "########"
    ],
    "Solve the upper sun circuit, restore moon and leave both weights on their plates."
  ],
  [
    55,
    "Paired reserve",
    1,
    29,
    true,
    [
      "##1s+###",
      "##P.P###",
      "S.C.CmKX",
      "..2.3###",
      "########"
    ],
    "Checkpoint: three switches, two separate weights and the one-use battery dictate a shared service route."
  ],
  [
    56,
    "Cargo portal",
    0,
    29,
    true,
    [
      "##1.A###",
      "##P.P###",
      "S.C.C###",
      "..3..###",
      "####A2KX"
    ],
    "Arrange two weights without blocking the route used to return from remote switch two."
  ],
  [
    57,
    "Sun cargo relay",
    3,
    32,
    true,
    [
      "##1sA###",
      "##P.P###",
      "S.C.C###",
      "..3..###",
      "####A2KX"
    ],
    "Make the sun change for the remote visit, restore moon for the local third switch, then return to sun for the key."
  ],
  [
    58,
    "Paired moon return",
    1,
    31,
    true,
    [
      "##1sA###",
      "##P.P###",
      "S.C.CmKX",
      "..3..###",
      "####A2+#"
    ],
    "Get the portal battery before the final moon approach; both crate goals remain live."
  ],
  [
    59,
    "Final loading order",
    2,
    45,
    true,
    [
      "##1sA###",
      "##P.P###",
      "S.C.CmKX",
      "..3.4##+",
      "####A2+#"
    ],
    "Light four ordered switches and retrieve the exit-wing battery while leaving paths behind both crates until each final push."
  ],
  [
    60,
    "Moonlight engine",
    2,
    41,
    true,
    [
      "##1sA###",
      "##P..P##",
      "S.C.CmKX",
      "..3.4.#+",
      "####A~2+"
    ],
    "Chapter finale: an elbow push to the offset plate, four ordered lights, a frozen portal arrival and two battery detours power the engine."
  ]
];

function parseRoom([id,title,charges,limit,ordered,grid,decision,switchPhases]) {
 if(grid.length!==5||grid.some(row=>row.length!==8))throw Error('WORKSHOP_ROOM_SHAPE:'+id);
 const p={id,title,chapter:id<=30?1:2,charges,limit,ordered,grid,decision,switches:[],walls:[],ice:[],phaseGates:[],batteries:[],crates:[],plates:[],pressureGates:[],portals:[]},ports={};
 for(let y=0;y<5;y++)for(let x=0;x<8;x++) { const ch=grid[y][x],v=[x,y];
  if(ch==='S')p.start=v;else if(ch==='K')p.key=v;else if(ch==='X')p.exit=v;else if(/[1-4]/.test(ch))p.switches[Number(ch)-1]=v;
  else if(ch==='#')p.walls.push(v);else if(ch==='~')p.ice.push(v);else if(ch==='m'||ch==='s')p.phaseGates.push({x,y,phase:ch==='s'?1:0});
  else if(ch==='+')p.batteries.push(v);else if(ch==='C')p.crates.push(v);else if(ch==='P')p.plates.push(v);else if(ch==='H')p.pressureGates.push(v);
  else if(ch==='A'||ch==='B')(ports[ch]??=[]).push(v);else if(ch!=='.')throw Error('WORKSHOP_ROOM_SYMBOL:'+id+':'+ch);
 }
 if(!p.start||!p.key||!p.exit||!p.switches.length||p.switches.some(v=>!v)||Object.values(ports).some(pair=>pair.length!==2))throw Error('WORKSHOP_ROOM_CONTENT:'+id);
 p.portals=Object.values(ports);if(charges>0||p.phaseGates.length)p.switchPhases=switchPhases||p.switches.map((_,i)=>i%2);
 return p;
}
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
export const profiles=freeze([...original,...authored.map(parseRoom)]);
