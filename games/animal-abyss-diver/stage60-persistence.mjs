// PROTOTYPE_NOT_IN_GAME: pure data and injected synchronous storage only.
// No rewards are issued here. The existing shared ledger remains authoritative.
export const SAVE_KEY = 'animal_abyss_diver_save';
export const STAGE_LIMIT = 60;
export const RECEIPTS_KEY = 'stage60ClearReceiptsV1';
export const ATTEMPTS_KEY = 'stage60SettlementAttemptsV1';

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const whole = (value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  Number.isFinite(value) ? Math.max(min, Math.min(max, Math.trunc(value))) : fallback;
const validStage = stage => Number.isInteger(stage) && stage >= 1 && stage <= STAGE_LIMIT;

// Matches v33's canonical field bounds while retaining unrecognised fields.
export function normalizeSave(raw) {
  const src = record(raw) ? raw : {};
  const stats = record(src.stats) ? src.stats : {};
  return {
    ...src,
    rank: whole(src.rank, 1, 1), coins: whole(src.coins, 0),
    unlocked: whole(src.unlocked, 1, 1, STAGE_LIMIT),
    level: whole(src.level, 1, 1), xp: whole(src.xp, 0, 0, 1000000),
    statPoints: whole(src.statPoints, 0),
    stats: {...stats, hp: whole(stats.hp, 0), attack: whole(stats.attack, 0), oxygen: whole(stats.oxygen, 0)},
    tutorialDone: src.tutorialDone === true
  };
}

export function stageReceiptId(stage) {
  if (!validStage(stage)) throw new RangeError('stage must be an integer from 1 to 60');
  return `stage-${stage}`;
}

// `expectedRaw` is the exact storage value on which `settledSave` is based.
// `settledSave` contains the caller's *already computed* battle and clear
// settlement (including coins/rank/stats); this module never increments it.
// `attemptId` must be unique per battle, stable across retries of that battle,
// and never reused for a different settlement. It does not identify a reward.
// Same-attempt recovery must reconstruct exactly the saved bytes from the
// original snapshot and settlement. Later unrelated writes conservatively
// prevent recovery; callers must not infer that such a mismatch paid Castle.
// Reward eligibility is only permission to ask the existing Castle ledger;
// this module cannot determine whether Castle has already paid that stage.
// A failed readback may follow a successful physical write: never assume rollback.
// Read-check-write is not a cross-tab atomic compare-and-swap.
export function commitClearedStage(storage, stage, {clear = false, expectedRaw, settledSave, attemptId} = {}) {
  const failed = (status, save = null) => ({status, save, stageId: null, receiptId: null, rewardEligible: false});
  if (!validStage(stage)) return failed('invalid-stage');
  if (clear !== true) return failed('not-cleared');
  if (!(expectedRaw === null || typeof expectedRaw === 'string') || !record(settledSave) ||
      typeof attemptId !== 'string' || !attemptId.trim() || attemptId.length > 128 ||
      (Object.hasOwn(settledSave,'stats') && !record(settledSave.stats))) return failed('invalid-settlement');
  let rawText;
  try { rawText = storage.getItem(SAVE_KEY); } catch { return failed('read-failed'); }
  let raw;
  try { raw = rawText === null ? {} : JSON.parse(rawText); } catch { return failed('corrupt-save'); }
  if (!record(raw)) return failed('corrupt-save');
  const before = normalizeSave(raw);
  const oldReceipts = raw[RECEIPTS_KEY];
  if (oldReceipts !== undefined && !record(oldReceipts)) return failed('corrupt-receipts', before);
  const oldAttempts = raw[ATTEMPTS_KEY];
  if (oldAttempts !== undefined && !record(oldAttempts)) return failed('corrupt-attempts', before);
  const receiptId = stageReceiptId(stage);
  const previousAttempt = oldAttempts?.[receiptId];
  if (previousAttempt !== undefined && (!record(previousAttempt) || typeof previousAttempt.id !== 'string' ||
      typeof previousAttempt.progressionReplay !== 'boolean')) return failed('corrupt-attempts', before);
  if (oldReceipts && Object.hasOwn(oldReceipts, receiptId)) {
    if (oldReceipts[receiptId] !== true) return failed('corrupt-receipts', before);
  }
  const replay = oldReceipts?.[receiptId] === true;
  if (previousAttempt?.id === attemptId) {
    // Do not trust the attempt token alone: reconstruct the intended write from
    // the caller's original snapshot, then confirm the entire saved value.
    let original;
    try { original = expectedRaw === null ? {} : JSON.parse(expectedRaw); }
    catch { return failed('retry-inconsistent', before); }
    if (!record(original)) return failed('retry-inconsistent', before);
    const originalReceipts = original[RECEIPTS_KEY];
    const originalAttempts = original[ATTEMPTS_KEY];
    if ((originalReceipts !== undefined && !record(originalReceipts)) ||
        (originalAttempts !== undefined && !record(originalAttempts)) ||
        (originalReceipts && Object.hasOwn(originalReceipts, receiptId) && originalReceipts[receiptId] !== true) ||
        originalAttempts?.[receiptId]?.id === attemptId) return failed('retry-inconsistent', before);
    const originalSave = normalizeSave(original);
    const originalReplay = originalReceipts?.[receiptId] === true;
    if (stage > originalSave.unlocked || previousAttempt.progressionReplay !== originalReplay || !replay ||
        !Number.isInteger(raw.unlocked) || raw.unlocked < Math.max(originalSave.unlocked, Math.min(STAGE_LIMIT, stage + 1))) {
      return failed('retry-inconsistent', before);
    }
    const { [RECEIPTS_KEY]:ignoredReceipts, [ATTEMPTS_KEY]:ignoredAttempts, unlocked:ignoredUnlocked, ...battle } = settledSave;
    const intended = normalizeSave({...originalSave, ...battle, stats:{...originalSave.stats,...battle.stats},
      unlocked:Math.max(originalSave.unlocked, Math.min(STAGE_LIMIT, stage + 1)),
      [RECEIPTS_KEY]:{...originalReceipts, [receiptId]:true},
      [ATTEMPTS_KEY]:{...originalAttempts, [receiptId]:{id:attemptId, progressionReplay:originalReplay}}});
    let intendedText;
    try { intendedText = JSON.stringify(intended); } catch { return failed('retry-inconsistent', before); }
    if (rawText !== intendedText) return failed('retry-inconsistent', before);
    // This successful read is the delayed readback of the original write.
    return {status:'confirmed-retry', save:before, stageId:stage, receiptId, progressionReplay:previousAttempt.progressionReplay, rewardEligible:true};
  }
  if (rawText !== expectedRaw) return failed('save-conflict', before);
  if (stage > before.unlocked) return failed('locked', before);
  const { [RECEIPTS_KEY]:ignoredReceipts, [ATTEMPTS_KEY]:ignoredAttempts, unlocked:ignoredUnlocked, ...battle } = settledSave;
  const candidate = normalizeSave({...before, ...battle, stats:{...before.stats,...battle.stats},
    unlocked:Math.max(before.unlocked, Math.min(STAGE_LIMIT, stage + 1)),
    [RECEIPTS_KEY]:{...oldReceipts, [receiptId]:true}, [ATTEMPTS_KEY]:{...oldAttempts, [receiptId]:{id:attemptId, progressionReplay:replay}}});
  let encoded;
  try { encoded = JSON.stringify(candidate); storage.setItem(SAVE_KEY, encoded); }
  catch { return failed('write-failed', before); }
  let readback;
  try { readback = storage.getItem(SAVE_KEY); } catch { return failed('readback-failed', before); }
  if (readback !== encoded) return failed('readback-mismatch', before);
  return {status:'confirmed', save:candidate, stageId:stage, receiptId, progressionReplay:replay, rewardEligible:true};
}
