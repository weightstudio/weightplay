export const cargo = ['L', 'K', 'S', 'P', 'B'];
const operations = ['G', 'D', 'R'];
const quantities = ['1', '2'];
const tides = ['W', 'H'];

export const lexicon = {
  A: { L:0x967, K:0xe8e, S:0x79c, P:0x2fa, B:0xf25, G:0x2ea, D:0xafb, R:0x5fc, 1:0x672, 2:0x979, W:0xe51, H:0x4ef },
  B: { L:0x3df, K:0x96e, S:0xe5b, P:0x6f4, B:0xca7, G:0x673, D:0xf6e, R:0x5e9, 1:0x4da, 2:0x3ac, W:0xf95, H:0x73b },
};

export function normalizeOrder(written) {
  const terms = written.split('');
  const item = terms.find(term => cargo.includes(term));
  const action = terms.find(term => operations.includes(term));
  const quantity = terms.find(term => quantities.includes(term));
  const tide = terms.find(term => tides.includes(term));
  if (!item || terms.length !== [item, action, quantity, tide].filter(Boolean).length) {
    throw Error('Invalid request: ' + written);
  }
  return { item, action, quantity, tide };
}

export function encode(order, port) {
  const { item, action, quantity, tide } = order;
  return (port === 'A' ? [action, quantity, tide, item] : [item, tide, quantity, action]).filter(Boolean);
}

export function parse(phrase, port) {
  try {
    const order = normalizeOrder(phrase.join(''));
    return order && encode(order, port).join('') === phrase.join('') ? order : null;
  } catch { return null; }
}

function neighbor(values, term) {
  return values[(values.indexOf(term) + 1) % values.length];
}

function cluesFor(order, stageNumber) {
  const { item, action, quantity, tide } = order;
  const clues = [{ item: neighbor(cargo,item), action, quantity, tide }];
  if (tide) clues.push({ ...order, tide: neighbor(tides,tide) });
  if (quantity) clues.push({ ...order, quantity: neighbor(quantities,quantity) });
  if (action) clues.push({ ...order, action: neighbor(operations,action) });
  clues.splice(stageNumber === 1 ? 0 : stageNumber % (clues.length + 1), 0, order);
  return clues;
}

export function createRun(stage) {
  return { stage, index:0, chosen:[], mistakes:0, hints:0, status:'playing', ledger:[] };
}

export function request(run) {
  return run.stage.orders[run.index];
}

export function evidence(run, port) {
  const brief = request(run);
  if (port !== brief.target && port !== brief.source) return [];
  return cluesFor(brief.order,run.stage.number).map(order=>({order,phrase:encode(order,port)}));
}

export function availableWords(run) {
  const brief = request(run);
  if (run.stage.number === 1 && run.index === 0) return ['L','K'];
  const order = brief.order;
  const options = [
    ...cargo.filter((item,i)=> item === order.item || i === (cargo.indexOf(order.item)+1)%cargo.length),
    ...(order.action ? (run.stage.number < 11 ? operations.filter(term=>term !== 'R') : operations) : []),
    ...(order.quantity ? quantities : []),
    ...(order.tide ? tides : []),
  ];
  const pivot = run.stage.number % options.length;
  return [...options.slice(pivot), ...options.slice(0,pivot)];
}

export function addWord(run, term) {
  if (run.status !== 'playing' || run.chosen.length >= encode(request(run).order,request(run).target).length ||
      run.chosen.includes(term) || !availableWords(run).includes(term)) return false;
  run.chosen.push(term);
  return true;
}

export function removeWord(run, index) {
  if (run.status !== 'playing' || index < 0 || index >= run.chosen.length) return false;
  run.chosen.splice(index, 1);
  return true;
}

export function dispatch(run, protectedLesson = false) {
  const { order, target } = request(run);
  const required = encode(order,target);
  if (run.status !== 'playing' || run.chosen.length !== required.length) return {kind:'incomplete'};
  const correct = required.every((term,i)=>term === run.chosen[i]);
  if (!correct) {
    const sameWords = required.every(term=>run.chosen.includes(term));
    if (!protectedLesson) run.mistakes++;
    if (run.mistakes >= 3) run.status = 'lost';
    return {kind:sameWords?'syntax':'meaning', lost:run.status === 'lost'};
  }
  run.ledger.push({ order, target });
  run.chosen.length = 0;
  run.index++;
  if (run.index === run.stage.orders.length) run.status = 'won';
  return {kind:'accepted', order, target, won:run.status === 'won'};
}

export function stars(run) {
  return run.status === 'won' ? Math.max(1, 3 - run.mistakes - run.hints) : 0;
}
