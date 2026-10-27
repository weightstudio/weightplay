/* Inactive chapter candidate. The existing 30 warehouses do not load this file. */
(() => {
  'use strict';
  const stages = Object.freeze({
    31: Object.freeze({
      chapter: 6, featureTier: 6, name: 'two-seal-introduction',
      decision: 'Match each seal to its own dock while leaving both lanes open.',
      width: 7, height: 6, size: 7,
      rows: ['       ', ' ..... ', ' ..... ', ' ..... ', ' ..... ', '       '],
      walls: [], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 3, linked: false, seal: 'moon'}],
      goals: [{x: 4, y: 2, seal: 'sun'}, {x: 4, y: 3, seal: 'moon'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 0,
    }),
    32: Object.freeze({
      chapter: 6, featureTier: 6, name: 'crossed-lanes',
      decision: 'Sort the two seals into opposite lanes while preserving a passing pocket.',
      width: 7, height: 7, size: 7,
      rows: ['       ', ' ..... ', ' ..... ', ' ..... ', ' ..... ', ' ..... ', '       '],
      walls: [], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 3, linked: false, seal: 'moon'}],
      goals: [{x: 4, y: 3, seal: 'sun'}, {x: 4, y: 2, seal: 'moon'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 0,
    }),
    33: Object.freeze({
      chapter: 6, featureTier: 6, name: 'shared-passing-bay',
      decision: 'Park the moon crate without obstructing the sun crate’s approach.',
      width: 7, height: 7, size: 7,
      rows: ['       ', ' ..... ', ' ..... ', ' ..... ', ' ..... ', ' ..... ', '       '],
      walls: [{x: 3, y: 3}], player: {x: 1, y: 3},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 4, y: 3, seal: 'moon'}, {x: 4, y: 4, seal: 'sun'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 0,
    }),
    34: Object.freeze({
      chapter: 6, featureTier: 6, name: 'inside-turn',
      decision: 'Exchange the lanes and route moon around the inner obstacle to its dock.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 3, y: 3}, {x: 4, y: 4}], player: {x: 1, y: 3},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 4, y: 3, seal: 'moon'}, {x: 4, y: 2, seal: 'sun'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 0,
    }),
    35: Object.freeze({
      chapter: 6, featureTier: 6, name: 'sorting-junction',
      decision: 'Leave the shared junction open while assigning both sealed cargos.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 3, y: 3}], player: {x: 1, y: 3},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 4, seal: 'sun'}, {x: 4, y: 2, seal: 'moon'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 0,
    }),
    36: Object.freeze({
      chapter: 7, featureTier: 7, name: 'sealed-ice-lane',
      decision: 'Exchange the two cargo lanes and send moon along the ice to its dock.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 2, seal: 'moon'}, {x: 4, y: 4, seal: 'sun'}],
      ice: [{x: 3, y: 2}, {x: 4, y: 2}], switches: [], gate: null, belts: [], pulls: 0,
    }),
    37: Object.freeze({
      chapter: 7, featureTier: 7, name: 'sealed-ice-turn',
      decision: 'Slide sun to the turning bay while reserving the near turn for moon.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 4, seal: 'sun'}, {x: 4, y: 3, seal: 'moon'}],
      ice: [{x: 3, y: 2}, {x: 4, y: 2}], switches: [], gate: null, belts: [], pulls: 0,
    }),
    38: Object.freeze({
      chapter: 7, featureTier: 7, name: 'sealed-ice-brake',
      decision: 'Route moon onto the ice and use the rubble stop while keeping sun’s lane clear.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 5, y: 2}], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 4, y: 2, seal: 'moon'}, {x: 4, y: 4, seal: 'sun'}],
      ice: [{x: 3, y: 2}, {x: 4, y: 2}], switches: [], gate: null, belts: [], pulls: 0,
    }),
    39: Object.freeze({
      chapter: 7, featureTier: 7, name: 'crossing-ice',
      decision: 'Stop sun on the ice dock and route moon around the crossing.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 1, y: 3},
      boxes: [{x: 2, y: 3, linked: false, seal: 'sun'}, {x: 4, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 4, y: 3, seal: 'sun'}, {x: 4, y: 2, seal: 'moon'}],
      ice: [{x: 3, y: 3}, {x: 4, y: 3}], switches: [], gate: null, belts: [], pulls: 0,
    }),
    40: Object.freeze({
      chapter: 7, featureTier: 7, name: 'crossed-ice-docks',
      decision: 'Turn a sun slide down while reserving the upper dock for moon.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 4, seal: 'sun'}, {x: 5, y: 2, seal: 'moon'}],
      ice: [{x: 3, y: 2}, {x: 4, y: 2}], switches: [], gate: null, belts: [], pulls: 0,
    }),
    41: Object.freeze({
      chapter: 8, featureTier: 8, name: 'sealed-signal',
      decision: 'Open the gate and exchange the lanes so moon can reach its dock.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 4, y: 1}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 2, seal: 'moon'}, {x: 3, y: 4, seal: 'sun'}],
      ice: [], switches: [{x: 3, y: 1}], gate: {x: 4, y: 2, open: false}, belts: [], pulls: 0,
    }),
    42: Object.freeze({
      chapter: 8, featureTier: 8, name: 'signal-side-bay',
      decision: 'Reach the lower switch and send moon through the gate.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 4, y: 1}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 2, seal: 'moon'}, {x: 3, y: 4, seal: 'sun'}],
      ice: [], switches: [{x: 2, y: 5}], gate: {x: 4, y: 2, open: false}, belts: [], pulls: 0,
    }),
    43: Object.freeze({
      chapter: 8, featureTier: 8, name: 'seal-on-signal',
      decision: 'Move sun off the signal, then route moon through the opened gate.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 4, y: 1}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 2, seal: 'moon'}, {x: 3, y: 4, seal: 'sun'}],
      ice: [], switches: [{x: 2, y: 2}], gate: {x: 4, y: 2, open: false}, belts: [], pulls: 0,
    }),
    44: Object.freeze({
      chapter: 8, featureTier: 8, name: 'one-each-side',
      decision: 'Sort sun before the gate and send moon beyond it.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 4, y: 1}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}], player: {x: 1, y: 3},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 2, seal: 'moon'}, {x: 3, y: 4, seal: 'sun'}],
      ice: [], switches: [{x: 1, y: 5}], gate: {x: 4, y: 2, open: false}, belts: [], pulls: 0,
    }),
    45: Object.freeze({
      chapter: 8, featureTier: 8, name: 'signal-ice-dock',
      decision: 'Open the signal before sending sun along the ice to its seal.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 4, y: 1}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 6, y: 2, seal: 'sun'}, {x: 3, y: 4, seal: 'moon'}],
      ice: [{x: 5, y: 2}], switches: [{x: 3, y: 1}], gate: {x: 4, y: 2, open: false}, belts: [], pulls: 0,
    }),
    46: Object.freeze({
      chapter: 9, featureTier: 9, name: 'sealed-wall-recovery',
      decision: 'Pull wall-bound sun into the aisle, then exchange the cargo lanes.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 2, y: 2},
      boxes: [{x: 1, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 2, seal: 'moon'}, {x: 4, y: 4, seal: 'sun'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 1,
    }),
    47: Object.freeze({
      chapter: 9, featureTier: 9, name: 'pulled-turn',
      decision: 'Recover sun from the wall, then turn it into the lower matching dock.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 2, y: 2},
      boxes: [{x: 1, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 4, seal: 'sun'}, {x: 4, y: 2, seal: 'moon'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 1,
    }),
    48: Object.freeze({
      chapter: 9, featureTier: 9, name: 'one-charge-two-seals',
      decision: 'Use the only pull on wall-bound sun, then route both crates around the obstruction.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 4, y: 3}], player: {x: 2, y: 2},
      boxes: [{x: 1, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 2, seal: 'moon'}, {x: 4, y: 4, seal: 'sun'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 1,
    }),
    49: Object.freeze({
      chapter: 9, featureTier: 9, name: 'pull-and-signal',
      decision: 'Recover wall-bound sun and open the signal so moon can cross.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 4, y: 1}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}], player: {x: 2, y: 2},
      boxes: [{x: 1, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 2, seal: 'moon'}, {x: 3, y: 4, seal: 'sun'}],
      ice: [], switches: [{x: 2, y: 1}], gate: {x: 4, y: 2, open: false}, belts: [], pulls: 1,
    }),
    50: Object.freeze({
      chapter: 9, featureTier: 9, name: 'pull-to-ice',
      decision: 'Pull sun from the wall and route moon onto the ice lane.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 2, y: 2},
      boxes: [{x: 1, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 2, seal: 'moon'}, {x: 4, y: 4, seal: 'sun'}],
      ice: [{x: 3, y: 2}, {x: 4, y: 2}], switches: [], gate: null, belts: [], pulls: 1,
    }),
    51: Object.freeze({
      chapter: 10, featureTier: 10, name: 'linked-seal-pair',
      decision: 'Move the separate sun aside, then align the linked pair with their seals.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: true, seal: 'sun'}, {x: 2, y: 3, linked: true, seal: 'moon'}, {x: 2, y: 4, linked: false, seal: 'sun'}],
      goals: [{x: 4, y: 2, seal: 'sun'}, {x: 4, y: 3, seal: 'sun'}, {x: 4, y: 4, seal: 'moon'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 0,
    }),
    52: Object.freeze({
      chapter: 10, featureTier: 10, name: 'linked-turn',
      decision: 'Park the separate sun and turn the linked pair down to the matching docks.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: true, seal: 'sun'}, {x: 2, y: 3, linked: true, seal: 'moon'}, {x: 3, y: 4, linked: false, seal: 'sun'}],
      goals: [{x: 4, y: 3, seal: 'sun'}, {x: 4, y: 4, seal: 'sun'}, {x: 4, y: 5, seal: 'moon'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 0,
    }),
    53: Object.freeze({
      chapter: 10, featureTier: 10, name: 'linked-rubble',
      decision: 'Move the separate sun aside and route the linked pair around the rubble to the upper docks.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 3, y: 2}], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: true, seal: 'sun'}, {x: 2, y: 3, linked: true, seal: 'moon'}, {x: 4, y: 2, linked: false, seal: 'sun'}],
      goals: [{x: 5, y: 2, seal: 'moon'}, {x: 5, y: 3, seal: 'sun'}, {x: 5, y: 1, seal: 'sun'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 0,
    }),
    54: Object.freeze({
      chapter: 10, featureTier: 10, name: 'linked-signal',
      decision: 'Open the signal for the pair, and use the side passage to sort the separate sun.',
      width: 9, height: 7, size: 9,
      rows: ['         ', ' ....... ', ' ....... ', ' ....... ', ' ....... ', ' ....... ', '         '],
      walls: [{x: 4, y: 1}, {x: 4, y: 4}], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: true, seal: 'sun'}, {x: 2, y: 3, linked: true, seal: 'moon'}, {x: 6, y: 4, linked: false, seal: 'sun'}],
      goals: [{x: 5, y: 2, seal: 'sun'}, {x: 5, y: 3, seal: 'sun'}, {x: 5, y: 4, seal: 'moon'}],
      ice: [], switches: [{x: 2, y: 1}], gate: {x: 4, y: 2, open: false}, belts: [], pulls: 0,
    }),
    55: Object.freeze({
      chapter: 10, featureTier: 10, name: 'pair-and-single',
      decision: 'Park the separate sun above the pair’s matching lower docks.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 1, y: 2},
      boxes: [{x: 2, y: 2, linked: true, seal: 'sun'}, {x: 2, y: 3, linked: true, seal: 'moon'}, {x: 2, y: 4, linked: false, seal: 'sun'}],
      goals: [{x: 4, y: 2, seal: 'sun'}, {x: 4, y: 3, seal: 'sun'}, {x: 4, y: 4, seal: 'moon'}],
      ice: [], switches: [], gate: null, belts: [], pulls: 0,
    }),
    56: Object.freeze({
      chapter: 11, featureTier: 11, name: 'belt-to-sun',
      decision: 'Read the belt landing before pushing sun to its own dock.',
      width: 8, height: 7, size: 8,
      rows: ['        ', '        ', ' .....  ', '   ...  ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 1, y: 2},
      boxes: [{x: 4, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 2, seal: 'sun'}, {x: 4, y: 4, seal: 'moon'}],
      ice: [], switches: [], gate: null, belts: [{x: 2, y: 2, dx: 1, dy: 0}], pulls: 0,
    }),
    57: Object.freeze({
      chapter: 11, featureTier: 11, name: 'belt-to-turn',
      decision: 'Use the belt landing to exchange the two crates’ routes to their docks.',
      width: 8, height: 7, size: 8,
      rows: ['        ', '    ... ', ' .....  ', '   ...  ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 1, y: 2},
      boxes: [{x: 4, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 5, y: 4, seal: 'moon'}, {x: 4, y: 4, seal: 'sun'}],
      ice: [], switches: [], gate: null, belts: [{x: 2, y: 2, dx: 1, dy: 0}], pulls: 0,
    }),
    58: Object.freeze({
      chapter: 11, featureTier: 11, name: 'belt-signal',
      decision: 'Open the signal and use the belt to exchange the sun and moon cargo routes.',
      width: 9, height: 7, size: 9,
      rows: ['         ', ' ....... ', ' ....... ', ' ....... ', ' ....... ', ' ....... ', '         '],
      walls: [{x: 4, y: 1}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}], player: {x: 1, y: 2},
      boxes: [{x: 5, y: 2, linked: false, seal: 'sun'}, {x: 2, y: 4, linked: false, seal: 'moon'}],
      goals: [{x: 6, y: 2, seal: 'moon'}, {x: 3, y: 4, seal: 'sun'}],
      ice: [], switches: [{x: 2, y: 1}], gate: {x: 4, y: 2, open: false}, belts: [{x: 2, y: 2, dx: 1, dy: 0}], pulls: 0,
    }),
    59: Object.freeze({
      chapter: 11, featureTier: 11, name: 'belt-linked-pair',
      decision: 'Use the belt, park the separate sun and align the linked pair below it.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [], player: {x: 1, y: 2},
      boxes: [{x: 4, y: 2, linked: true, seal: 'sun'}, {x: 4, y: 3, linked: true, seal: 'moon'}, {x: 4, y: 4, linked: false, seal: 'sun'}],
      goals: [{x: 5, y: 3, seal: 'sun'}, {x: 5, y: 4, seal: 'sun'}, {x: 5, y: 5, seal: 'moon'}],
      ice: [], switches: [], gate: null, belts: [{x: 2, y: 2, dx: 1, dy: 0}], pulls: 0,
    }),
    60: Object.freeze({
      chapter: 11, featureTier: 11, name: 'sorting-deck-finale',
      decision: 'Recover the separate sun, open the gate and use the belt to route the linked pair.',
      width: 8, height: 7, size: 8,
      rows: ['        ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', ' ...... ', '        '],
      walls: [{x: 3, y: 1}, {x: 3, y: 3}, {x: 3, y: 5}], player: {x: 2, y: 4},
      boxes: [{x: 1, y: 4, linked: false, seal: 'sun'}, {x: 4, y: 2, linked: true, seal: 'sun'}, {x: 4, y: 3, linked: true, seal: 'moon'}],
      goals: [{x: 2, y: 4, seal: 'sun'}, {x: 5, y: 2, seal: 'sun'}, {x: 5, y: 3, seal: 'moon'}],
      ice: [], switches: [{x: 2, y: 1}], gate: {x: 3, y: 2, open: false}, belts: [{x: 2, y: 2, dx: 1, dy: 0}], pulls: 1,
    }),
  });
  function createPlan(stage) {
    const source = stages[stage];
    if (!source) throw new RangeError('Unknown sorting-deck warehouse');
    const plan = JSON.parse(JSON.stringify(source));
    plan.floor = [];
    plan.rows.forEach((row, y) => [...row].forEach((cell, x) => {
      if (cell === '.') plan.floor.push({x, y});
    }));
    return plan;
  }
  function allDocksMatch(boxes, goals) {
    if (!Array.isArray(boxes) || !Array.isArray(goals) || boxes.length !== goals.length || !goals.length) return false;
    const seals = new Set(['sun', 'moon', 'neutral']);
    const valid = values => values.every(v => v && Number.isInteger(v.x) && Number.isInteger(v.y) && seals.has(v.seal)) &&
      new Set(values.map(v => `${v.x},${v.y}`)).size === values.length;
    if (!valid(boxes) || !valid(goals)) return false;
    const used = new Set();
    return goals.every(goal => {
      const index = boxes.findIndex((box, i) => !used.has(i) && box && box.x === goal.x && box.y === goal.y && box.seal === goal.seal);
      if (index < 0) return false;
      used.add(index);
      return true;
    });
  }
  const copy = Object.freeze({
    en: ['Sorting Deck', 'Match the sun and moon seals to their docks.', 'Practice only: progress and rewards are not saved.'],
    'zh-Hant': ['分類甲板', '將太陽與月亮封印送到對應碼頭。', '僅供練習：不會保存進度或獎勵。'],
    'zh-Hans': ['分类甲板', '将太阳与月亮封印送到对应码头。', '仅供练习：不会保存进度或奖励。'],
    ja: ['仕分けデッキ', '太陽と月の印を同じ印の置き場へ。', '練習のみ：進行状況と報酬は保存されません。'],
    ko: ['분류 갑판', '해와 달 표식을 같은 표식의 도착점에 놓으세요.', '연습 전용: 진행과 보상은 저장되지 않습니다.'],
    es: ['Cubierta de clasificación', 'Lleva cada sello de sol o luna a su muelle.', 'Solo práctica: no se guardan el progreso ni las recompensas.'],
    'pt-BR': ['Convés de triagem', 'Leve cada selo de sol ou lua ao seu cais.', 'Apenas prática: progresso e recompensas não são salvos.'],
    fr: ['Pont de tri', 'Placez chaque sceau soleil ou lune sur son quai.', 'Entraînement : progression et récompenses ne sont pas enregistrées.'],
    de: ['Sortierdeck', 'Bringe Sonne und Mond zum passenden Dock.', 'Nur Übung: Fortschritt und Belohnungen werden nicht gespeichert.'],
    it: ['Ponte di smistamento', 'Porta i sigilli sole e luna ai moli corrispondenti.', 'Solo pratica: progressi e ricompense non vengono salvati.'],
    ru: ['Сортировочная палуба', 'Доставьте печати солнца и луны к своим причалам.', 'Тренировка: прогресс и награды не сохраняются.'],
    hi: ['छँटाई डेक', 'सूरज और चाँद की मुहरों को उनके घाट तक पहुँचाएँ।', 'केवल अभ्यास: प्रगति और इनाम सहेजे नहीं जाते।'],
    ar: ['سطح الفرز', 'طابق ختم الشمس والقمر مع المرسيين.', 'للتدريب فقط: لا يُحفظ التقدم أو المكافآت.'],
  });
  const completed=Object.freeze({en:'Stage Complete','zh-Hant':'關卡完成','zh-Hans':'关卡完成',ja:'ステージクリア',ko:'스테이지 완료',es:'Nivel completado','pt-BR':'Fase concluída',fr:'Niveau terminé',de:'Level geschafft',it:'Livello completato',ru:'Уровень пройден',hi:'चरण पूरा',ar:'اكتملت المرحلة'});
  function messages(locale) { return [...(copy[locale] || copy.en),completed[locale]||completed.en]; }
  const labels = Object.freeze({
    en:['sun','moon','crate','dock','column','row'], 'zh-Hant':['太陽','月亮','貨箱','碼頭','欄','列'], 'zh-Hans':['太阳','月亮','货箱','码头','列','行'],
    ja:['太陽','月','箱','置き場','列','行'],ko:['해','달','상자','도착점','열','행'],es:['sol','luna','caja','muelle','columna','fila'],
    'pt-BR':['sol','lua','caixa','cais','coluna','linha'],fr:['soleil','lune','caisse','quai','colonne','ligne'],de:['Sonne','Mond','Kiste','Dock','Spalte','Zeile'],
    it:['sole','luna','cassa','molo','colonna','riga'],ru:['солнце','луна','ящик','причал','столбец','строка'],hi:['सूरज','चाँद','बक्सा','घाट','स्तंभ','पंक्ति'],ar:['الشمس','القمر','صندوق','مرسى','عمود','صف'],
  });
  function boardDescription(locale, boxes, goals) {
    const [sun,moon,box,dock,column,row]=labels[locale]||labels.en;
    return [...boxes.map(item=>[item,box]),...goals.map(item=>[item,dock])].map(([item,type])=>`${type} ${item.seal==='sun'?sun:moon}: ${column} ${item.x+1}, ${row} ${item.y+1}`).join('. ');
  }
  window.WeightPlayCrateboundSortingCandidate = Object.freeze({createPlan, allDocksMatch, messages, boardDescription});
})();
