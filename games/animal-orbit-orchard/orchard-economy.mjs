// Shared-wallet purchase with a durable recovery receipt. No gameplay benefit.
export const THEME_KEY = 'weightplay-orbit-aurora-v1';
function read(storage) { try { return JSON.parse(storage.getItem(THEME_KEY) || 'null'); } catch { return null; } }
export function ownsAurora(storage, wallet) {
  const item = read(storage);
  if (item?.owned) return true;
  if (item?.pending && Number.isFinite(item.before) && wallet.read().diamonds === item.before - 8) {
    try { storage.setItem(THEME_KEY, JSON.stringify({ owned: true })); } catch { /* Keep recoverable receipt. */ }
    return true;
  }
  return false;
}
export function purchaseAurora(storage, wallet) {
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("animal-orbit-orchard:orchard-economy.mjs:purchaseAurora", () => purchaseAurora(...arguments));

  try {
    if (ownsAurora(storage, wallet)) return { owned: true, status: 'owned' };
    const before = wallet.read().diamonds, journal = read(storage);
    if (journal?.pending && journal.before !== before) return { owned: false, status: 'saveError' };
    if (before < 8) return { owned: false, status: 'insufficient' };
    storage.setItem(THEME_KEY, JSON.stringify({ pending: true, before }));
    if (!wallet.spendDiamonds(8)) { storage.removeItem(THEME_KEY); return { owned: false, status: 'insufficient' }; }
    try { storage.setItem(THEME_KEY, JSON.stringify({ owned: true })); } catch { /* Durable receipt proves debit. */ }
    return { owned: true, status: 'purchased' };
  } catch { return { owned: false, status: 'saveError' }; }
}
