import { STAGES, GOODS } from './market-data.js';

export const SAVE_KEY = 'weightplay-moon-market-management-v17';
export const UPGRADE_COST = Object.freeze({ bell: 25, crate: 40, gold: 8 });
const integer = (n, lo, hi, fallback = lo) => Number.isFinite(Number(n)) ? Math.max(lo, Math.min(hi, Math.floor(Number(n)))) : fallback;

export function normalizeSave(raw = {}, legacy = {}) {
  const cleared = [...new Set((Array.isArray(raw.cleared) ? raw.cleared : Array.isArray(legacy.cleared) ? legacy.cleared : [])
    .filter(n => Number.isInteger(n) && n >= 0 && n < STAGES.length))].sort((a, b) => a - b);
  return {
    version: 1, coins: integer(raw.coins, 0, 999999),
    unlocked: Math.max(integer(raw.unlocked ?? legacy.unlocked, 1, 30), Math.min(30, (cleared.at(-1) ?? -1) + 2)),
    cleared, best: Array.from({ length: 30 }, (_, i) => integer(raw.best?.[i], 0, 3)),
    upgrades: { bell: raw.upgrades?.bell === true, crate: raw.upgrades?.crate === true, gold: raw.upgrades?.gold === true },
    goldEnabled: raw.upgrades?.gold === true && raw.goldEnabled === true,
  };
}

export function readSave(storage) {
  const read = (key, fallback) => { try { return JSON.parse(storage.getItem(key)) ?? fallback; } catch { return fallback; } };
  return normalizeSave(read(SAVE_KEY, {}), {
    unlocked: read('weightplay-moon-market-unlocked-v15', 1),
    cleared: read('weightplay-moon-market-cleared-v15', []),
  });
}

export function writeSave(storage, save) {
  // The single new record is authoritative. Legacy mirrors never roll it back.
  storage.setItem(SAVE_KEY, JSON.stringify(save));
  try {
    storage.setItem('weightplay-moon-market-unlocked-v15', String(save.unlocked));
    storage.setItem('weightplay-moon-market-cleared-v15', JSON.stringify(save.cleared));
  } catch { /* A committed v17 record preserves all progress even if a legacy mirror fails. */ }
}

export function forecast(stage, round) {
  const rule = STAGES[stage].rounds[round];
  const base = 2 + (stage >= 10 ? 1 : 0) + (stage >= 25 ? 1 : 0);
  const counts = [base, base + ((stage + round) % 2)];
  return { ...rule, counts, budget: counts[0] + counts[1] + 2 };
}

export function makePlan(stage, round) {
  const f = forecast(stage, round);
  return { shelf: [f.demand[0], GOODS.find(g => !f.demand.includes(g))], stock: [2, 2], jobs: { orla: 'stock', rux: 'checkout' } };
}

export function validatePlan(stage, round, plan) {
  const f = forecast(stage, round);
  if (new Set(plan.shelf).size !== 2 || !f.demand.every(g => plan.shelf.includes(g))) return 'badGoods';
  if (f.ordered && f.demand.some((g, i) => plan.shelf[i] !== g)) return 'badOrder';
  if (plan.jobs.orla === plan.jobs.rux || (f.jobs && Object.entries(f.jobs).some(([h, j]) => plan.jobs[h] !== j))) return 'badJobs';
  if (plan.stock.some(n => !Number.isInteger(n) || n < 1 || n > 6) || plan.stock[0] + plan.stock[1] > f.budget) return 'badBudget';
  return null;
}

export function makeOrders(stage, round) {
  const { demand, counts } = forecast(stage, round);
  const remaining = [...counts], out = [];
  for (let i = 0; remaining.some(Boolean); i++) {
    // Authored deterministic alternation with small repeated-order bursts in later chapters.
    let side = stage >= 15 ? (Math.floor(i / 2) + round) % 2 : (i + round) % 2;
    if (!remaining[side]) side = 1 - side;
    remaining[side]--; out.push(demand[side]);
  }
  return out;
}

export function makeRun(stage, upgrades) {
  return { stage, round: 0, phase: 'plan', plan: makePlan(stage, 0), orders: [], customer: 0,
    earned: 0, mistakes: 0, streak: 0, waste: 0, spent: 0, served: 0, settled: false,
    restocks: upgrades.crate ? 1 : 0, patience: 0, patienceLimit: 0 };
}

export function openMarket(run, upgrades) {
  if (run.phase !== 'plan') return 'busy';
  const error = validatePlan(run.stage, run.round, run.plan);
  if (error) return error;
  run.orders = makeOrders(run.stage, run.round); run.customer = 0; run.phase = 'serve';
  run.patienceLimit = run.stage < 5 ? 0 : Math.max(12, 22 - Math.floor(run.stage / 5) * 2) + (upgrades.bell ? 6 : 0);
  run.patience = run.patienceLimit;
  return null;
}

export function serve(run, side) {
  if (run.phase !== 'serve' || ![0, 1].includes(side)) return { kind: 'busy' };
  if (run.plan.shelf[side] !== run.orders[run.customer]) return mistake(run, 'wrong');
  if (run.plan.stock[side] < 1) return { kind: 'empty' };
  run.plan.stock[side]--; run.customer++; run.served++; run.streak++;
  const coins = 3 + (run.streak >= 3 ? 1 : 0); run.earned += coins; run.patience = run.patienceLimit;
  if (run.customer === run.orders.length) {
    run.waste += run.plan.stock[0] + run.plan.stock[1];
    run.phase = run.round + 1 < STAGES[run.stage].rounds.length ? 'round' : 'won';
  }
  return { kind: 'served', coins, phase: run.phase };
}

export function mistake(run, kind = 'late') {
  if (run.phase !== 'serve') return { kind: 'busy' };
  run.mistakes++; run.streak = 0; run.patience = run.patienceLimit;
  if (run.mistakes >= 3) run.phase = 'lost';
  return { kind, phase: run.phase };
}

export function restock(run) {
  if (run.phase !== 'serve') return 'busy';
  const side = run.plan.shelf.indexOf(run.orders[run.customer]);
  if (side < 0 || run.plan.stock[side] >= 6) return 'full';
  if (run.restocks > 0) run.restocks--;
  // One successful sale always funds recovery, including consecutive late-game orders.
  else if (run.earned >= 3) { run.earned -= 3; run.spent += 3; }
  else return 'noCoins';
  run.plan.stock[side] = Math.min(6, run.plan.stock[side] + 2);
  return null;
}

export function nextRound(run) {
  if (run.phase !== 'round') return false;
  run.round++; run.plan = makePlan(run.stage, run.round); run.phase = 'plan'; return true;
}

export function rating(run) {
  return Math.max(1, 3 - (run.mistakes > 0 ? 1 : 0) - (run.waste > 1 || run.spent > 0 ? 1 : 0));
}

export function settle(save, run) {
  if (run.phase !== 'won' || run.settled) return null;
  const result = normalizeSave(save);
  result.coins += run.earned;
  result.unlocked = Math.max(result.unlocked, Math.min(30, run.stage + 2));
  result.cleared = [...new Set([...result.cleared, run.stage])].sort((a, b) => a - b);
  result.best[run.stage] = Math.max(result.best[run.stage], rating(run));
  return result;
}

export function buyUpgrade(storage, save, id, wallet) {
  if (!Object.hasOwn(UPGRADE_COST, id)) return { error: 'invalid' };
  // Re-read inside the synchronous transaction to avoid double purchase in another tab.
  const current = readSave(storage);
  if (current.upgrades[id]) return { save: current, already: true };
  const cost = UPGRADE_COST[id], next = normalizeSave(current);
  if (id === 'gold') {
    const before = wallet.read();
    if (before.diamonds < cost) return { error: 'noDiamonds' };
    // Verify game storage first; a quota rejection must never debit the wallet.
    try { storage.setItem(SAVE_KEY, JSON.stringify(current)); } catch { return { error: 'saveError' }; }
    try {
      if (!wallet.spendDiamonds(cost)) return { error: 'noDiamonds' };
      next.upgrades.gold = true; next.goldEnabled = true;
      writeSave(storage, next);
    } catch {
      try { wallet.save(before); } catch { return { error: 'saveError', refundPending: before.diamonds }; }
      return { error: 'saveError' };
    }
  } else {
    if (current.coins < cost) return { error: 'noCoins' };
    next.coins -= cost; next.upgrades[id] = true;
    try { writeSave(storage, next); } catch { return { error: 'saveError' }; }
  }
  return { save: next };
}
