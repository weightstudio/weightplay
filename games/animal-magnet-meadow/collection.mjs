export const collectionKey = 'weightplay-animal-magnet-meadow-amber-v1';
export const price = 10;
export function ownsAmber(storage) {
  try { return JSON.parse(storage.getItem(collectionKey) || 'null')?.owned === true; } catch { return false; }
}
/** Deliver durably BEFORE debiting. A failed entitlement write can never lose currency.
 * Calls are synchronous inside the game's cross-tab Web Lock. If wallet storage fails,
 * roll back the entitlement. If even rollback storage is unavailable, retain the cosmetic
 * at no charge rather than risk a second debit or an undelivered purchase. */
export function unlockAmber(storage, wallet) {
  if (ownsAmber(storage)) return {ok:true, alreadyOwned:true};
  if (!wallet || wallet.read().diamonds < price) return {ok:false,reason:'insufficient'};
  try { storage.setItem(collectionKey, JSON.stringify({owned:true,price,version:1})); }
  catch { return {ok:false,reason:'storageError'}; }
  try {
    if (!wallet.spendDiamonds(price)) {
      storage.removeItem(collectionKey); return {ok:false,reason:'insufficient'};
    }
    return {ok:true,alreadyOwned:false};
  } catch {
    try {storage.removeItem(collectionKey);} catch { /* Preserve delivered cosmetic; never retry a debit. */ }
    return {ok:false,reason:'storageError'};
  }
}
