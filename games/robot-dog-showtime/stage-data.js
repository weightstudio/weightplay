export const ACTIONS = Object.freeze(['N', 'E', 'S', 'W', 'WAIT', 'BOW', 'WAVE']);
const STEPS = Object.freeze({N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0]});

const authored = [
  ['First Marks', 0,11,2,11,[],false], ['First Marks', 0,11,3,9,[6],false],
  ['First Marks', 1,10,9,2,[5],false], ['First Marks', 0,11,8,3,[1,6],false],
  ['First Marks', 3,8,11,0,[5],true], ['Shared Lanes', 0,11,10,1,[4],false],
  ['Shared Lanes', 2,9,8,3,[6],false], ['Shared Lanes', 0,10,11,1,[5],true],
  ['Shared Lanes', 3,8,4,11,[6,9],false], ['Shared Lanes', 0,11,9,2,[1,6],true],
  ['Rehearsal Paths', 4,7,0,11,[5],false], ['Rehearsal Paths', 1,10,8,3,[2,6],false],
  ['Rehearsal Paths', 0,11,7,4,[10],false], ['Rehearsal Paths', 3,8,9,2,[5,6],true],
  ['Rehearsal Paths', 4,7,3,8,[1,6],true], ['Formation Changes', 0,11,11,0,[5,6],false],
  ['Formation Changes', 2,9,4,7,[5,6],false], ['Formation Changes', 3,8,0,11,[5],true],
  ['Formation Changes', 1,10,7,4,[5,6],true], ['Formation Changes', 0,11,10,1,[5,6],true],
  ['Precision Cues', 4,7,2,9,[1,5],false], ['Precision Cues', 1,10,11,0,[2,6],false],
  ['Precision Cues', 0,11,8,3,[1,6],true], ['Precision Cues', 3,8,4,7,[2,6],true],
  ['Precision Cues', 4,7,11,0,[5],true], ['Opening Night', 0,11,9,2,[1,5,6],true],
  ['Opening Night', 3,8,4,7,[5,6],true], ['Opening Night', 1,10,11,0,[2,6],true],
  ['Opening Night', 0,11,7,4,[1,6],true], ['Opening Night', 3,8,4,7,[1,2,5],true],
];

function move(cell, action) {
  if (!STEPS[action]) return cell;
  const [x, y] = [cell % 4, Math.floor(cell / 4)];
  const [dx, dy] = STEPS[action];
  const nx = x + dx, ny = y + dy;
  return nx < 0 || nx > 3 || ny < 0 || ny > 2 ? -1 : ny * 4 + nx;
}

function solve(starts, goals, walls) {
  const queue = [{p: starts, path: []}], seen = new Set([starts.join(',')]);
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const node = queue[cursor];
    if (node.p[0] === goals[0] && node.p[1] === goals[1]) return node.path;
    if (node.path.length >= 10) continue;
    for (const a of ACTIONS.slice(0, 5)) for (const b of ACTIONS.slice(0, 5)) {
      const next = [move(node.p[0], a), move(node.p[1], b)];
      if (next.some((cell, i) => cell < 0 || walls.includes(cell) || (i === 1 && cell === next[0]))) continue;
      if (next[0] === node.p[1] && next[1] === node.p[0] && next[0] !== next[1]) continue;
      const key = next.join(',');
      if (seen.has(key)) continue;
      seen.add(key); queue.push({p: next, path: [...node.path, [a, b]]});
    }
  }
  return null;
}

export const STAGES = Object.freeze(authored.map((row, index) => {
  const [arc, dogStart, foxStart, dogGoal, foxGoal, walls, bow] = row;
  const starts = [dogStart, foxStart], goals = [dogGoal, foxGoal];
  const path = solve(starts, goals, walls);
  const solution = path && bow ? [...path, ['BOW', 'BOW']] : path;
  return Object.freeze({
    id: index + 1, arc, starts: Object.freeze(starts), goals: Object.freeze(goals),
    walls: Object.freeze(walls), bow, beats: solution?.length ?? 0,
    solution: solution && Object.freeze(solution.map(pair => Object.freeze(pair))),
  });
}));

export function validateStages() {
  return STAGES.flatMap(stage => {
    const issues = [];
    if (!stage.solution) issues.push(`stage ${stage.id}: no solution`);
    if (stage.starts[0] === stage.starts[1] || stage.goals[0] === stage.goals[1]) issues.push(`stage ${stage.id}: performers share a start or goal mark`);
    if (stage.walls.some(cell => stage.starts.includes(cell) || stage.goals.includes(cell))) issues.push(`stage ${stage.id}: wall blocks a start or goal`);
    if (stage.solution) {
      let positions=[...stage.starts];
      for (const [a,b] of stage.solution) {
        const next=[move(positions[0],a),move(positions[1],b)];
        if(next.some((cell,i)=>cell<0||stage.walls.includes(cell)||(i===1&&cell===next[0])))issues.push(`stage ${stage.id}: solution has an invalid mark`);
        if(next[0]===positions[1]&&next[1]===positions[0]&&next[0]!==next[1])issues.push(`stage ${stage.id}: solution crosses actors`);
        positions=next;
      }
      if(positions[0]!==stage.goals[0]||positions[1]!==stage.goals[1])issues.push(`stage ${stage.id}: solution misses a goal`);
      if(stage.bow&&stage.solution.at(-1)?.[0]==='BOW'&&stage.solution.at(-1)?.[1]==='BOW'){}else if(stage.bow)issues.push(`stage ${stage.id}: missing final partner bow`);
    }
    return issues;
  });
}
