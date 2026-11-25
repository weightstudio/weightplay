// Each row records the authored clockwise enemy and terrain sequence.
const routes = [
  ['s', '.'],
  ['ss', '..'],
  ['s.s', '...'],
  ['ss.', '...'],
  ['s.ss', '....'],
  ['srs', '...'],
  ['rss', '...'],
  ['ssr', '...'],
  ['r.rs', '....'],
  ['rsrs', '....'],
  ['sms', '...'],
  ['mss', '...'],
  ['ssm', '...'],
  ['rms', '....'],
  ['msrm', '....'],
  ['sgr', '.h.'],
  ['gsr', 'h..'],
  ['rgs', '..h'],
  ['gmr', '.h.'],
  ['grmg', 'h.h.'],
  ['msgr', '.h..'],
  ['rgms', 'h...'],
  ['gmsr', '..h.'],
  ['mgrg', 'h..h'],
  ['rmgmr', '.h.h.'],
  ['rsgm', 'h...'],
  ['gmsm', '..h.'],
  ['mggr', '.h.h'],
  ['rmsgm', 'h...h'],
  ['mrg.b', 'h..h.'],
  ['smr', '.t.'],
  ['mgr', 't..'],
  ['rmg', '..t'],
  ['g.sr', 't...'],
  ['rmgr', 't.t.'],
  ['rgm', 't.h'],
  ['grm', 'h.t'],
  ['mgs', '.th'],
  ['grsg', 't.h.'],
  ['mggr', '.tht'],
  ['mggs', 'th..'],
  ['grmm', '.ht.'],
  ['ggmr', '..th'],
  ['rmgg', 'h.th'],
  ['mgrmg', 'th.t.'],
  ['grgm', 'ht..'],
  ['rmgm', '..ht'],
  ['mgrg', 't..h'],
  ['gmrg', '.hth'],
  ['ggmrg', 'ht.ht'],
  ['rmgg', '.t.h'],
  ['grrg', 'h..t'],
  ['ggmm', 't.h.'],
  ['mgmgr', 'h.t.t'],
  ['grmgg', 't.ht.'],
  ['mrgmg', 'h.t.h'],
  ['ggmr', '.t.h'],
  ['gmgg', 'ht.t'],
  ['rmggm', 't.ht.'],
  ['grmgb', 'htth.'],
];

const goldTurnsByFoe = { s: 1, r: 2, m: 3, g: 3, b: 5, '.': 0 };

export const stages = routes.map(([encounters, terrain], index) => {
  const id = index + 1;
  const laps = (id >= 26 && id <= 29) || id >= 46 ? 2 : 1;
  const sites = [...encounters].map((enemy, slot) => ({ enemy, terrain: terrain[slot] }));
  const boss = encounters.includes('b');
  const total = (sites.filter(site => site.enemy !== '.' && site.enemy !== 'b').length * laps) + Number(boss);
  const goldTurns = sites.reduce((sum, { enemy }) => sum + goldTurnsByFoe[enemy] * (enemy === 'b' ? 1 : laps), 0);
  return {
    id, sites, laps, boss, total,
    required: id >= 21 && total > 2 ? total - 1 : total,
    maxHealth: id < 12 ? 10 : 11,
    goldHealth: id < 6 ? 6 : 7,
    goldTurns,
    checkpoint: id % 5 === 0,
    chapter: id <= 30 ? 1 : 2,
    arc: Math.ceil(id / 5),
  };
});

