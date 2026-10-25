import {normalizeSave} from './puzzles.mjs';

// Persist delivery before charging. If wallet storage fails, restore ownership.
// An unavailable rollback can grant the cosmetic for free, never lose currency.
// The caller serializes purchases using the same-origin Web Locks API.
export function purchaseInk({current, read, write, wallet}) {
    if (wallet?.withTransaction && !wallet.inTransaction()) return wallet.withTransaction("animal-footprint-folio:ink-purchase.mjs:purchaseInk", () => purchaseInk(...arguments));

  let saved;
  try {
    const latest = normalizeSave(read());
    saved = {...current, stars: current.stars.map((n, i) => Math.max(n, latest.stars[i])),
      moon: current.moon || latest.moon};
    if (saved.moon) {
      saved.theme = 'moon';
      write(saved);
      return {save: saved, status: 'owned'};
    }
    if (!wallet || wallet.read().diamonds < 12) return {save: saved, status: 'insufficient'};
    const delivered = {...saved, moon: true, theme: 'moon'};
    write(delivered);
    try {
      if (wallet.spendDiamonds(12)) return {save: delivered, status: 'purchased'};
    } catch { /* The shared wallet writes atomically before returning. */ }
    try { write(saved); } catch { return {save: delivered, status: 'storage-error'}; }
    return {save: saved, status: 'storage-error'};
  } catch {
    return {save: current, status: 'storage-error'};
  }
}
