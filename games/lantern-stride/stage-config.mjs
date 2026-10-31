// Authored route vocabulary. Numbers are draft tuning, not playtest results.
// Each route changes the decision sequence, not merely the timer.
const designs = [
  ['plain', 'finish', 50, 60], ['plain,slow,plain', 'steady3', 60, 55], ['slow,plain', 'balance40', 70, 55], ['plain,fast', 'combo4', 70, 50], ['slow,fast', 'steady-no-stumble', 80, 60],
  ['fork,slow,plain', 'finish', 70, 60], ['fast,plain,slow', 'finish', 70, 55], ['left', 'finish', 80, 60], ['fast,left', 'stumble2', 80, 60], ['slow,right', 'balance35', 90, 65],
  ['headwind,plain', 'finish', 75, 60], ['tailwind,slow', 'finish', 80, 60], ['headfast,plain', 'finish', 80, 65], ['fork,tailwind', 'finish', 85, 60], ['tailwind,headwind,slow', 'stumble2', 90, 70],
  ['left,headwind', 'gates', 70, 60], ['right,tailwind', 'gates', 70, 60], ['left,slow', 'gates', 80, 65], ['right,headwind', 'gates', 80, 65], ['left,right', 'gates', 90, 70],
  ['fork,tailwind,left', 'gates', 85, 65], ['slow,right,headwind', 'gates', 85, 70], ['headwind,right,left', 'gates', 95, 75], ['tailwind,right,slow', 'gates', 95, 70], ['slow,left,fast,right', 'balance30', 100, 80],
  ['headwind,tailwind,headwind', 'finish', 100, 80], ['fast,plain,slow,fast', 'finish', 100, 80], ['right,left,right', 'gates', 100, 85], ['slow,headwind,fast,tailwind', 'finish', 105, 85], ['left,fast,headwind,right,slow', 'stumble2', 110, 90],
  ['plain,bridge', 'finish', 70, 80], ['bridge,slow', 'finish', 80, 80], ['slow,bridge', 'finish', 80, 85], ['bridge,plain,bridge', 'finish', 85, 90], ['slow,bridge,fast', 'stumble2', 90, 90],
  ['bridge,left', 'gates', 85, 90], ['right,bridge', 'gates', 85, 90], ['headwind,bridge', 'finish', 90, 95], ['bridge,right,bridge', 'gates', 95, 100], ['left,bridge,right', 'gates', 100, 100],
  ['forkleft,plain', 'finish', 85, 85], ['forkright,slow', 'finish', 85, 90], ['fork', 'finish', 95, 95], ['forkwindbridge', 'finish', 100, 100], ['forkgates', 'gates', 100, 105],
  ['forkfast,bridge', 'finish', 95, 95], ['forkslow,right,left', 'gates', 100, 105], ['bridge,headwind', 'finish', 100, 105], ['left,fork', 'gates', 105, 105], ['bridge,fork,headwind', 'finish', 110, 110],
  ['headwind,bridge,right', 'gates', 105, 110], ['slow,bridge,bridge', 'finish', 105, 115], ['fast,left,right', 'gates', 110, 110], ['right,left,slow,bridge', 'gates', 110, 115], ['forkmaster', 'gates', 115, 120],
  ['fast,slow,bridge,fast', 'finish', 110, 115], ['headwind,right,slow,left', 'stumble2', 115, 120], ['bridge,fork,bridge', 'finish', 115, 125], ['right,headwind,bridge,left,fast', 'gates', 120, 130], ['fork,bridge,headwind,left,right,fast', 'stumble2', 120, 140],
];

export const STAGES = Object.freeze(designs.map(([route, objective, distance, limit], i) => Object.freeze({
  id: i + 1, chapter: i < 30 ? 1 : 2, route: Object.freeze(route.split(',')), objective, distance, limit,
  checkpoint: (i + 1) % 5 === 0,
})));
export function stageById(id) { return STAGES[id - 1] || null; }
