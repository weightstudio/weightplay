// Shared by the live controller and deterministic economy regression tests.
export const depthFraction = p => p < .42 ? p / .42 : p < .73 ? 1 : Math.max(0, (1 - p) / .27);
export const sonarStrength = (startedAt, now) => (Math.sin((now - startedAt) / 620) + 1) / 2;
export function sonarOutcome(dive, now) {
  if (!dive || dive.sonar) return null;
  const p = (now - dive.startedAt) / dive.durationMs;
  if (p < .2 || p >= .73) return null;
  const strength = sonarStrength(dive.startedAt, now);
  return strength >= .58 && strength <= .84 ? 'hit' : 'miss';
}
export function missingRequirements(contract, state, depth, robots) {
  const missing = [];
  for (const [field, current, label] of [['minDepth', depth, 'depth'], ['minMuseum', state.museum.length, 'museum'], ['minRobots', robots, 'robots'], ['minRare', state.rareFound, 'rare'], ['minPrestige', state.prestigeCount, 'prestige']]) {
    if (contract[field] && current < contract[field]) missing.push([label, contract[field]]);
  }
  if (contract.minUpgrade && (state.upgrades[contract.minUpgrade[0]] || 0) < contract.minUpgrade[1]) missing.push(['upgrade', ...contract.minUpgrade]);
  if (contract.minTech && (state.techLevels[contract.minTech[0]] || 0) < contract.minTech[1]) missing.push(['tech', ...contract.minTech]);
  return missing;
}
export function buyLivery({ state, wallet, persist, cost = 8 }) {
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("animal-deep-sea-salvage:expedition-rules.mjs:buyLivery", () => buyLivery(...arguments));

  if (state.auroraOwned) return 'owned';
  if (!wallet || wallet.read().diamonds < cost) return 'insufficient';
  const previous = state.livery;
  try {
    state.auroraOwned = true;
    state.livery = 'aurora';
    // Persist the permanent item before charging. A quota/storage failure
    // therefore cannot consume diamonds for an unsaved item.
    persist();
    if (!wallet.spendDiamonds(cost)) {
      state.auroraOwned = false; state.livery = previous; persist();
      return 'insufficient';
    }
    return 'purchased';
  } catch {
    state.auroraOwned = false;
    state.livery = previous;
    try { persist(); } catch { /* no charge; preserve the in-memory rollback */ }
    return 'failed';
  }
}
