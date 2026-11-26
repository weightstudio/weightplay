const arcs = [
  [['low'], [1, 1, 2, 2, 2]],
  [['dual', 'low'], [2, 2, 2, 3, 3]],
  [['bundle', 'dual', 'low'], [2, 2, 3, 3, 3]],
  [['delivery', 'bundle', 'low'], [2, 2, 3, 3, 3]],
  [['either', 'delivery', 'dual'], [2, 3, 3, 3, 4]],
  [['dual', 'bundle', 'delivery', 'either'], [3, 3, 4, 4, 4]],
  [['edition', 'low', 'dual'], [2, 2, 3, 3, 3]],
  [['editionBundle', 'bundle', 'edition'], [2, 3, 3, 3, 4]],
  [['editionDelivery', 'delivery', 'edition'], [2, 3, 3, 3, 4]],
  [['editionEither', 'either', 'editionDelivery'], [3, 3, 3, 4, 4]],
  [['editionDelivery', 'editionBundle', 'dual', 'editionEither'], [3, 3, 4, 4, 4]],
  [['editionEither', 'editionBundle', 'editionDelivery', 'dual'], [3, 4, 4, 4, 4]]
];

export const TOOLS = { pair: 5, ruler: 20, index: 35 };
export const SOURCES = ['archive', 'counter', 'dispatch', 'catalog'];

export function outcome(tag, known) {
  const read = clause => known.has(clause.key) ? clause.passes : null;
  const comparisons = tag.clauses.filter(clause => clause.type !== 'editionMatch').map(read);
  const editions = tag.clauses.filter(clause => clause.type === 'editionMatch').map(read);
  if (tag.either && comparisons.length) {
    const any = comparisons.includes(true) ? true : comparisons.includes(null) ? null : false;
    editions.push(any);
  } else editions.push(...comparisons);
  const values = editions;
  return values.includes(false) ? false : values.includes(null) ? null : true;
}

export function makeCase(id) {
  const arc = Math.floor((id - 1) / 5);
  const variant = (id - 1) % 5;
  const [kinds, counts] = arcs[arc];
  const sourceCount = id <= 2 ? 1 : id <= 5 ? 2 : id <= 15 ? 3 : 4;
  const tags = Array.from({ length: counts[variant] }, (_, slot) => {
    const kind = kinds[slot % kinds.length];
    const now = 10 + ((id * 5 + slot * 7) % 17);
    const offset = (variant + arc * 2 + slot * (variant === 4 ? 2 : 1)) % sourceCount;
    const high = id === 1 || (id + slot + arc) % 3 !== 2;
    const secondHigh = (variant + slot + arc) % 3 === 1;
    const clauses = [];
    function add(type, lane, lhs, rhs, passes, extra = {}) {
      clauses.push({
        key: slot + ':' + clauses.length, lane: lane % sourceCount,
        type, lhs, rhs, passes, ...extra
      });
    }
    const discount = (high ? 1 : -1) * (1 + (id + slot) % 4);
    if (kind === 'low' || kind === 'dual' || kind === 'either' || kind === 'editionEither') {
      add('prior', offset, now, now + discount, discount > 0);
      if (kind !== 'low') {
        const change = secondHigh ? 4 : -(1 + variant % 3);
        add('older', offset + 1, now, now + change, change > 0);
      }
    }
    if (kind === 'bundle' || kind === 'editionBundle') {
      const first = Math.floor(now / 2) + 2;
      const second = now + discount - first;
      add('sum', offset, now, first + second, discount > 0, { parts: [first, second] });
    }
    if (kind === 'delivery' || kind === 'editionDelivery') {
      const fee = 2 + ((slot + id) % 4);
      const limit = now + fee + discount;
      add('deliveryCost', offset, now + fee, limit, discount >= 0, { parts: [now, fee] });
    }
    const edition = 'ABCD'[(id + slot) % 4];
    if (kind.startsWith('edition')) {
      const same = (id + slot) % 4 !== 0;
      const recorded = same ? edition : 'ABCD'[(id + slot + 1) % 4];
      add('editionMatch', offset + 2, edition, recorded, same);
    }
    const either = kind === 'either' || kind === 'editionEither';
    const tag = { kind, slot, item: (id * 3 + slot + variant) % 6, now, edition, clauses, either };
    const complete = new Set(clauses.map(clause => clause.key));
    tag.answer = outcome(tag, complete);
    return tag;
  });
  const clauses = tags.flatMap(tag => tag.clauses);
  const active = [...new Set(clauses.map(row => row.lane))].sort();
  const solutions = [];
  for (let mask = 1; mask < 1 << SOURCES.length; mask += 1) {
    const opened = SOURCES.map((_, lane) => lane).filter(lane => mask & (1 << lane));
    if (opened.some(lane => !active.includes(lane))) continue;
    const known = new Set(clauses.filter(row => opened.includes(row.lane)).map(row => row.key));
    if (tags.every(tag => outcome(tag, known) !== null)) solutions.push(opened);
  }
  solutions.sort((a, b) => a.length - b.length);
  const best = solutions[0].length;
  return { id, tags, active, arc, best, solutions, allowance: Math.min(active.length, best + 1) };
}

export const CASES = Array.from({ length: 60 }, (_, i) => makeCase(i + 1));

export function normalizeSave(value) {
  const record = value?.schema === 1 ? value : {};
  const stars = {};
  let unlocked = 1;
  for (const { id } of CASES) {
    const score = record.stars?.[id];
    if (id !== unlocked || !Number.isInteger(score) || score < 1 || score > 3) break;
    stars[id] = score;
    unlocked = Math.min(id + 1, CASES.length);
  }
  const tool = Object.hasOwn(TOOLS, record.tool) && stars[TOOLS[record.tool]] ? record.tool : '';
  return { schema: 1, stars, unlocked, tool, red: record.red === true };
}
