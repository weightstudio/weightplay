// Isolated post-collision exit proposal, not used by the game. The host must
// set beaconInterceptorResolved only after the final swept collision has run.
// Retiring an interceptor gives no XP, loot, clear, progress or reward.
export function retireResolvedInterceptor(enemies, {practice,stage} = {}) {
  if (!Array.isArray(enemies)) throw new TypeError('INVALID_ENEMIES');
  if (practice!==true || stage!==51) return enemies;
  const resolved=enemies.filter(enemy=>enemy?.beaconInterceptorResolved===true);
  if (resolved.some(enemy=>enemy.beaconInterceptor!==true || typeof enemy.beaconInterceptorId!=='string' || !enemy.beaconInterceptorId))
    throw new Error('INVALID_INTERCEPTOR_EXIT');
  return resolved.length ? enemies.filter(enemy=>!resolved.includes(enemy)) : enemies;
}
