/** Game-owned progress only. Shared-wallet entitlements remain in WeightPlayWallet. */
export const SAVE_KEY = 'weightplay:bramble-rapids:progress:v1';
export const SAVE_LOCK = 'weightplay-bramble-rapids-progress-v1';
export const STAGE_COUNT = 60;
export const BOARD_IDS = Object.freeze(['brook', 'driftfin', 'reedguard']);
const MILESTONES = Object.freeze([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]);
const MAX_TIME = 86400;
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const copy = value => JSON.parse(JSON.stringify(value));
const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const integer = (value, min, max, fallback = min) => Math.min(max, Math.max(min, Math.floor(number(value, fallback))));
const stageId = value => {
  const id = Number(value);
  return Number.isInteger(id) && id >= 1 && id <= STAGE_COUNT ? id : null;
};
const time = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= MAX_TIME ? value : null;

function cleanRecord(record, legacyStars, legacyTime) {
  const source = record && typeof record === 'object' && !Array.isArray(record) ? record : {};
  const stars = integer(source.stars ?? source.bestStars ?? legacyStars, 0, 3, 0);
  const cleared = source.cleared === true || stars > 0;
  return {
    cleared,
    stars: cleared ? Math.max(1, stars) : 0,
    bestTime: cleared ? time(source.bestTime ?? source.time ?? legacyTime) : null,
  };
}

/** Normalize a copy; never repairs or deletes the caller's stored bytes. */
export function normalizeProgress(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const records = {};
  let earnedUnlock = 1;
  for (let id = 1; id <= STAGE_COUNT; id++) {
    const record = cleanRecord(source.records?.[id], source.bestStars?.[id], source.bestTimes?.[id]);
    if (record.cleared) {
      records[id] = record;
      earnedUnlock = Math.max(earnedUnlock, Math.min(STAGE_COUNT, id + 1));
    }
  }
  const unlocked = Math.max(earnedUnlock, integer(source.unlocked ?? source.unlockedStage, 1, STAGE_COUNT, 1));
  const ownedBoards = new Set(['brook']);
  if (Array.isArray(source.ownedBoards)) for (const id of source.ownedBoards) if (BOARD_IDS.includes(id)) ownedBoards.add(id);
  if (records[5]?.cleared) ownedBoards.add('driftfin');
  if (records[15]?.cleared) ownedBoards.add('reedguard');
  const equippedBoard = ownedBoards.has(source.equippedBoard) ? source.equippedBoard : 'brook';
  const oldMilestones = Array.isArray(source.claimedMilestones) ? source.claimedMilestones : [];
  const claimedMilestones = MILESTONES.filter(id => records[id]?.cleared || oldMilestones.includes(id));
  const cosmeticSelection = source.equippedCosmetic === 'coral-night' || source.cosmeticSelection === 'coral-night' ? 'coral-night' : 'default';
  return {
    schemaVersion: 1,
    unlocked,
    unlockedStage: unlocked,
    records,
    bestStars: Object.fromEntries(Object.entries(records).map(([id, record]) => [id, record.stars])),
    bestTimes: Object.fromEntries(Object.entries(records).filter(([, record]) => record.bestTime !== null).map(([id, record]) => [id, record.bestTime])),
    ownedBoards: BOARD_IDS.filter(id => ownedBoards.has(id)),
    equippedBoard,
    anchorUnlocked: source.anchorUnlocked === true || source.toolUnlocked === true || records[30]?.cleared === true,
    toolUnlocked: source.anchorUnlocked === true || source.toolUnlocked === true || records[30]?.cleared === true,
    tutorialComplete: source.tutorialComplete === true,
    claimedMilestones,
    equippedCosmetic: cosmeticSelection,
    cosmeticSelection,
    boardSelectedAt: integer(source.boardSelectedAt, 0, Number.MAX_SAFE_INTEGER, 0),
    cosmeticSelectedAt: integer(source.cosmeticSelectedAt, 0, Number.MAX_SAFE_INTEGER, 0),
    revision: integer(source.revision, 0, Number.MAX_SAFE_INTEGER, 0),
  };
}

/** Monotone earned-state merge. A stale tab cannot remove another tab's clear. */
export function mergeProgress(first, second) {
  const a = normalizeProgress(first), b = normalizeProgress(second), records = {};
  for (let id = 1; id <= STAGE_COUNT; id++) {
    const left = a.records[id], right = b.records[id];
    if (!left && !right) continue;
    const values = [left?.bestTime, right?.bestTime].filter(value => value !== null && value !== undefined);
    records[id] = {
      cleared: Boolean(left?.cleared || right?.cleared),
      stars: Math.max(left?.stars || 0, right?.stars || 0),
      bestTime: values.length ? Math.min(...values) : null,
    };
  }
  const boardOwner = a.boardSelectedAt >= b.boardSelectedAt ? a : b;
  const cosmeticOwner = a.cosmeticSelectedAt >= b.cosmeticSelectedAt ? a : b;
  return normalizeProgress({
    records,
    unlocked: Math.max(a.unlocked, b.unlocked),
    ownedBoards: [...new Set([...a.ownedBoards, ...b.ownedBoards])],
    equippedBoard: boardOwner.equippedBoard,
    boardSelectedAt: Math.max(a.boardSelectedAt, b.boardSelectedAt),
    equippedCosmetic: cosmeticOwner.equippedCosmetic,
    cosmeticSelectedAt: Math.max(a.cosmeticSelectedAt, b.cosmeticSelectedAt),
    anchorUnlocked: a.anchorUnlocked || b.anchorUnlocked,
    tutorialComplete: a.tutorialComplete || b.tutorialComplete,
    claimedMilestones: [...new Set([...a.claimedMilestones, ...b.claimedMilestones])],
    revision: Math.max(a.revision, b.revision),
  });
}

function resultRecord(result) {
  if (!result || typeof result !== 'object' || result.won !== true) return null;
  const id = stageId(result.stageId ?? result.stage);
  const duration = time(result.time);
  if (id === null || duration === null) return null;
  return { stageId: id, won: true, stars: integer(result.stars, 1, 3, 1), time: duration };
}

export function createProgressStore(options = {}) {
  let storage;
  try { storage = own(options, 'storage') ? options.storage : globalThis.localStorage; } catch { storage = null; }
  let locks;
  try { locks = own(options, 'lockManager') ? options.lockManager : globalThis.navigator?.locks; } catch { locks = null; }
  let progress = normalizeProgress(null), persistedProgress = normalizeProgress(null), queue = Promise.resolve(), dirty = false;
  let lastError = null, lastSaved = false, corrupted = false, loaded = false;
  const pending = new Map(), subscribers = new Set();
  // Only this session's verified wallet receipt can select the paid appearance.
  let coralNightVerified = false;
  let pendingBoard = null, pendingCosmetic = null;

  function emit() {
    const snapshot = copy(progress);
    const status = { saved: lastSaved, dirty, sessionOnly: !locks?.request || !storage, error: lastError };
    for (const subscriber of subscribers) {
      try { subscriber(snapshot, { ...status }); } catch { /* A consumer cannot break saving. */ }
    }
  }
  function readStored() {
    if (!storage || typeof storage.getItem !== 'function') return { ok: false, reason: 'storage-unavailable' };
    try {
      const raw = storage.getItem(SAVE_KEY);
      if (raw === null || raw === undefined || raw === '') return { ok: true, progress: normalizeProgress(null) };
      const value = JSON.parse(raw);
      if (!value || typeof value !== 'object' || Array.isArray(value) || (value.schemaVersion !== undefined && value.schemaVersion !== 1)) {
        return { ok: false, reason: 'corrupt-save', corrupt: true };
      }
      return { ok: true, progress: normalizeProgress(value) };
    } catch (error) {
      return { ok: false, reason: error instanceof SyntaxError ? 'corrupt-save' : 'storage-unavailable', corrupt: error instanceof SyntaxError };
    }
  }
  function load() {
    const stored = readStored();
    if (stored.ok) {
      persistedProgress = copy(stored.progress);
      progress = mergeProgress(progress, stored.progress);
      corrupted = false;
      lastError = locks?.request ? null : 'locking-unavailable';
    } else {
      corrupted = Boolean(stored.corrupt);
      lastError = stored.reason;
    }
    loaded = true;
    emit();
    return copy(progress);
  }
  function response(saved, extra = {}) {
    return { ok: true, saved, sessionOnly: !locks?.request || !storage, reason: saved ? null : lastError,
      progress: copy(progress), pendingStageIds: [...pending.keys()], ...extra };
  }
  function serialized(action) {
    const operation = queue.then(action, action);
    queue = operation.catch(() => {});
    return operation;
  }
  async function persist() {
    lastSaved = false;
    if (!loaded) load();
    // A browser without Web Locks uses an explicit session save. A read/modify/write
    // race must never silently overwrite the other tab's permanent progress.
    if (!locks || typeof locks.request !== 'function') {
      const stored = readStored();
      if (stored.ok) progress = mergeProgress(stored.progress, progress);
      lastError = stored.ok ? 'locking-unavailable' : stored.reason;
      emit();
      return response(false);
    }
    try {
      return await locks.request(SAVE_LOCK, { mode: 'exclusive' }, async () => {
        const stored = readStored();
        if (!stored.ok || corrupted) {
          lastError = stored.reason || 'corrupt-save';
          emit();
          return response(false);
        }
        const merged = mergeProgress(stored.progress, progress);
        // Serialize deliberate selections against the latest persisted choice.
        // An ordinary result write has no selection intent and preserves it.
        if (pendingBoard !== null && merged.ownedBoards.includes(pendingBoard)) {
          merged.equippedBoard = pendingBoard;
          merged.boardSelectedAt = Math.max(Date.now(), stored.progress.boardSelectedAt + 1, progress.boardSelectedAt);
        }
        if (pendingCosmetic !== null) {
          merged.equippedCosmetic = merged.cosmeticSelection = pendingCosmetic;
          merged.cosmeticSelectedAt = Math.max(Date.now(), stored.progress.cosmeticSelectedAt + 1, progress.cosmeticSelectedAt);
        }
        // A stored appearance is a preference, not proof of a wallet purchase.
        if (merged.equippedCosmetic === 'coral-night' && !coralNightVerified) {
          merged.equippedCosmetic = merged.cosmeticSelection = 'default';
        }
        merged.revision = Math.max(stored.progress.revision, progress.revision) + 1;
        const serialized = JSON.stringify(merged);
        storage.setItem(SAVE_KEY, serialized);
        // A throwing/partial storage implementation cannot masquerade as saved.
        if (storage.getItem(SAVE_KEY) !== serialized) throw new Error('SAVE_READBACK_MISMATCH');
        progress = merged;
        persistedProgress = copy(merged);
        const persistedStageIds = [...pending.keys()];
        pending.clear();
        pendingBoard = pendingCosmetic = null;
        dirty = false;
        lastSaved = true;
        lastError = null;
        emit();
        return response(true, { persistedStageIds });
      });
    } catch {
      lastError = 'save-failed';
      dirty = true;
      emit();
      return response(false);
    }
  }
  function mutate(change) {
    return serialized(async () => {
      if (!loaded) load();
      const changed = change();
      if (changed === false) return response(lastSaved, { ok: false, reason: 'unavailable-selection' });
      progress = normalizeProgress(progress);
      dirty = true;
      emit();
      return persist();
    });
  }

  return {
    load,
    verifyCosmeticEntitlement(owned) { coralNightVerified = owned === true; },
    get snapshot() { if (!loaded) load(); return copy(progress); },
    // Pending/session progress never grants a durable unlock. A failed read keeps
    // the last confirmed copy; a fresh unreadable save exposes only the free start.
    get persistedSnapshot() { if (!loaded) load(); return copy(persistedProgress); },
    get saved() { return lastSaved; },
    get error() { return lastError; },
    get sessionOnly() { return !locks?.request || !storage; },
    getPending() { return { dirty, reason: lastError, results: [...pending.values()].map(copy) }; },
    subscribe(subscriber) {
      if (typeof subscriber !== 'function') throw new TypeError('Progress subscriber must be a function');
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
    recordResult(result) {
      return serialized(async () => {
        if (!loaded) load();
        const record = resultRecord(result);
        if (!record || record.stageId > progress.unlocked) return response(false, { ok: false, reason: 'invalid-result' });
        const addition = normalizeProgress({ records: { [record.stageId]: { cleared: true, stars: record.stars, bestTime: record.time } } });
        progress = mergeProgress(progress, addition);
        const prior = pending.get(record.stageId);
        pending.set(record.stageId, prior ? { ...record, stars: Math.max(prior.stars, record.stars), time: Math.min(prior.time, record.time) } : record);
        dirty = true;
        emit();
        return persist();
      });
    },
    setBoard(id) {
      return mutate(() => {
        if (!progress.ownedBoards.includes(id)) return false;
        progress.equippedBoard = id;
        pendingBoard = id;
        progress.boardSelectedAt = Math.max(Date.now(), progress.boardSelectedAt + 1);
      });
    },
    setCosmetic(id, owned = false) {
      return mutate(() => {
        if (!['default', 'coral-night'].includes(id) || (id === 'coral-night' && owned !== true)) return false;
        if (id === 'coral-night') coralNightVerified = true;
        progress.equippedCosmetic = progress.cosmeticSelection = id;
        pendingCosmetic = id;
        progress.cosmeticSelectedAt = Math.max(Date.now(), progress.cosmeticSelectedAt + 1);
      });
    },
    markTutorialComplete() { return mutate(() => { progress.tutorialComplete = true; }); },
    retryPersist() { return serialized(persist); },
    refresh() { return load(); },
  };
}
