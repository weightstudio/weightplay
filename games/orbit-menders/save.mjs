// Orbit Menders save schema. Keep this namespace through any title change.
import {TALENTS,talentSpent} from './defense.mjs?v=orbit-v10-campaign';
export const SAVE_KEY = 'weightplay:orbit-menders:v1';
export const BACKUP_KEY = `${SAVE_KEY}:backup`;
export const MAX_SAVE_BYTES = 256 * 1024;
const LEVEL = /^W[1-6]-(?:0[1-4]|B)$/;
const ARCHIVE = /^W[1-6]-0[1-4]-(?:observation|mechanism|execution)$/;
const BLUEPRINT = /^W[1-6]-blueprint$/;
const MODE = new Set(['standard', 'assist']);
const DANGEROUS_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const TOP_KEYS = new Set(['schemaVersion', 'gameVersion', 'updatedAt', 'completed', 'archives', 'blueprints', 'badges', 'cosmetics', 'best', 'preferences', 'checkpoint', 'defense']);
const clone = value => JSON.parse(JSON.stringify(value));
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value) && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const fail = message => { throw new Error(`ORBIT_SAVE_INVALID: ${message}`); };
const byteLength = text => new TextEncoder().encode(text).byteLength;
function assertPlain(value, label) { if (!plain(value)) fail(label); }
function assertFinite(value, min, max, label) { if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) fail(label); }
function assertDate(value, label) { if (typeof value !== 'string' || value.length > 40 || !Number.isFinite(Date.parse(value))) fail(label); }
function assertKeys(value, allowed, label) { for (const key of Object.keys(value)) if (!allowed.has(key)) fail(`${label}.${key}`); }
function safeTree(value, depth = 0) {
  if (depth > 6) fail('nested data too deep');
  if (value === null || typeof value === 'boolean') return;
  if (typeof value === 'number') { assertFinite(value, -1e8, 1e8, 'number'); return; }
  if (typeof value === 'string') { if (value.length > 1024) fail('string too long'); return; }
  if (Array.isArray(value)) { if (value.length > 256) fail('array too long'); value.forEach(item => safeTree(item, depth + 1)); return; }
  assertPlain(value, 'object');
  if (Object.keys(value).length > 128) fail('too many object fields');
  for (const [key, item] of Object.entries(value)) {
    if (DANGEROUS_KEYS.has(key) || key.length > 96) fail('unsafe field');
    safeTree(item, depth + 1);
  }
}
function idSet(value, pattern, maximum, label) {
  if (!Array.isArray(value) || value.length > maximum || value.some(id => typeof id !== 'string' || !pattern.test(id))) fail(label);
  return [...new Set(value)];
}

export function freshSave() {
  return {
    schemaVersion: 1, gameVersion: '0.10.0', updatedAt: new Date().toISOString(),
    completed: [], archives: [], blueprints: [], badges: {},
    cosmetics: { equipped: 'workshop', unlocked: ['workshop'] },
    best: { standard: {}, assist: {} },
    preferences: { sensitivity: 1, invertY: false, reduceMotion: false, cameraShake: false, quality: 'medium', mode: 'standard', keyMap: {} },
    checkpoint: null,
    defense: { revision: 2, completed: [], best: {}, training: {gears:0,earned:0,ranks:{power:0,rapid:0,hull:0,blast:0,control:0,support:0},stance:'pierce',receipts:[]} },
  };
}

// Returns a detached, normalized value; never executes or merges imported fields.
export function validateSave(value) {
  assertPlain(value, 'root');
  safeTree(value);
  assertKeys(value, TOP_KEYS, 'root');
  if (value.schemaVersion !== 1) fail('unsupported schemaVersion');
  if (typeof value.gameVersion !== 'string' || !/^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/.test(value.gameVersion)) fail('gameVersion');
  assertDate(value.updatedAt, 'updatedAt');
  const result = clone(value);
  // Additive v3 migration keeps the existing namespace and all legacy progress.
  const defense = value.defense ?? { revision: 1, completed: [], best: {} };
  assertPlain(defense, 'defense');
  assertKeys(defense, new Set(['revision', 'completed', 'best','training']), 'defense');
  if (![1,2].includes(defense.revision)) fail('defense revision');
  const stage=/^D(?:0[1-9]|[12][0-9]|30)$/;
  result.defense = { revision: 2, completed: idSet(defense.completed, stage, 30, 'defense completed'), best: {} };
  const legacyGrant=result.defense.completed.length*40;
  const training=defense.training??{gears:legacyGrant,earned:legacyGrant,ranks:{power:0,rapid:0,hull:0,blast:0,control:0,support:0},stance:'pierce',receipts:[]};
  assertPlain(training,'training');assertKeys(training,new Set(['gears','earned','ranks','stance','receipts']),'training');
  for(const key of ['gears','earned']){assertFinite(training[key],0,1e7,`training ${key}`);if(!Number.isSafeInteger(training[key]))fail('training integer');}
  assertPlain(training.ranks,'training ranks');assertKeys(training.ranks,new Set(Object.keys(TALENTS)),'training ranks');
  for(const [id,rule]of Object.entries(TALENTS))if(!Number.isInteger(training.ranks[id])||training.ranks[id]<0||training.ranks[id]>rule.max)fail('training rank');
  if(!['pierce','frost','chain'].includes(training.stance)||training.gears+talentSpent(training.ranks)!==training.earned)fail('training allocation');
  result.defense.training={...clone(training),receipts:idSet(training.receipts,/^[A-Za-z0-9-]{1,96}$/,128,'training receipts')};
  assertPlain(defense.best, 'defense best');
  for (const [id, record] of Object.entries(defense.best)) {
    if (!stage.test(id)) fail('defense best id');
    assertPlain(record, 'defense record');
    assertKeys(record, new Set(['score', 'health', 'time']), 'defense record');
    assertFinite(record.score, 0, 1e7, 'defense score');
    assertFinite(record.health, 0, 1, 'defense health');
    assertFinite(record.time, 0, 86400, 'defense time');
    result.defense.best[id] = clone(record);
  }
  result.completed = idSet(value.completed, LEVEL, 30, 'completed');
  result.archives = idSet(value.archives, ARCHIVE, 72, 'archives');
  result.blueprints = idSet(value.blueprints, BLUEPRINT, 6, 'blueprints');
  assertPlain(value.badges, 'badges');
  for (const [id, badge] of Object.entries(value.badges)) {
    if (!LEVEL.test(id)) fail('badge id');
    assertPlain(badge, 'badge'); assertKeys(badge, new Set(['mode', 'acquiredAt']), 'badge');
    if (!MODE.has(badge.mode)) fail('badge mode');
    assertDate(badge.acquiredAt, 'badge acquiredAt');
  }
  assertPlain(value.cosmetics, 'cosmetics');
  assertKeys(value.cosmetics, new Set(['equipped', 'unlocked']), 'cosmetics');
  result.cosmetics.unlocked = idSet(value.cosmetics.unlocked, /^[a-z0-9][a-z0-9-]{0,47}$/, 32, 'cosmetic ids');
  if (!result.cosmetics.unlocked.includes(value.cosmetics.equipped)) fail('equipped cosmetic');
  assertPlain(value.best, 'best'); assertKeys(value.best, MODE, 'best');
  for (const mode of MODE) {
    assertPlain(value.best[mode], `best ${mode}`);
    for (const [id, time] of Object.entries(value.best[mode])) {
      if (!LEVEL.test(id)) fail('best level id');
      assertFinite(time, 0, 86400, 'best time');
    }
  }
  const prefs = value.preferences;
  assertPlain(prefs, 'preferences');
  assertKeys(prefs, new Set(['sensitivity', 'invertY', 'reduceMotion', 'cameraShake', 'quality', 'mode', 'keyMap']), 'preferences');
  assertFinite(prefs.sensitivity, 0.1, 5, 'sensitivity');
  for (const key of ['invertY', 'reduceMotion', 'cameraShake']) if (typeof prefs[key] !== 'boolean') fail(key);
  if (!new Set(['low', 'medium', 'high']).has(prefs.quality) || !MODE.has(prefs.mode)) fail('quality or mode');
  assertPlain(prefs.keyMap, 'keyMap');
  const actions = new Set(['forward', 'backward', 'left', 'right', 'jump', 'dash', 'interact', 'pulse', 'recenter', 'hint', 'pause']);
  for (const [action, key] of Object.entries(prefs.keyMap)) if (!actions.has(action) || typeof key !== 'string' || !/^(?:Key[A-Z]|Digit[0-9]|Arrow(?:Up|Down|Left|Right)|Space|Shift(?:Left|Right)|Control(?:Left|Right)|Alt(?:Left|Right)|Escape|Enter|Tab)$/.test(key)) fail('key binding');
  if (value.checkpoint !== null) {
    const cp = value.checkpoint;
    assertPlain(cp, 'checkpoint');
    assertKeys(cp, new Set(['levelId', 'levelVersion', 'fieldId', 'position', 'mechanisms']), 'checkpoint');
    if (!LEVEL.test(cp.levelId) || !Number.isInteger(cp.levelVersion) || cp.levelVersion < 1 || cp.levelVersion > 1e6 || typeof cp.fieldId !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(cp.fieldId)) fail('checkpoint identity');
    if (!Array.isArray(cp.position) || cp.position.length !== 3) fail('checkpoint position');
    cp.position.forEach(number => assertFinite(number, -1e5, 1e5, 'checkpoint position'));
    assertPlain(cp.mechanisms, 'checkpoint mechanisms');
    safeTree(cp.mechanisms);
  }
  if (byteLength(JSON.stringify(result)) > MAX_SAVE_BYTES) fail('save too large');
  return result;
}

export function createSaveAdapter(storage) {
  let target = storage;
  let data = freshSave();
  let status = { persistent: true, recoveredBackup: false, message: '' };
  if (target === undefined) {
    try { target = globalThis.localStorage; } catch { target = null; }
  }
  function transient(message) { status = { ...status, persistent: false, message }; }
  function parse(text) {
    if (typeof text !== 'string' || byteLength(text) > MAX_SAVE_BYTES) fail('save too large or empty');
    return validateSave(JSON.parse(text));
  }
  if (!target?.getItem || !target?.setItem) transient('無法使用本機儲存；本次進度暫存於記憶體，請匯出備份。');
  else {
    try {
      const main = target.getItem(SAVE_KEY);
      const backup = target.getItem(BACKUP_KEY);
      if (main !== null) {
        try { data = parse(main); }
        catch {
          if (backup !== null) {
            data = parse(backup);
            status = { persistent: true, recoveredBackup: true, message: '主要存檔損壞，已讀取最後有效備份。' };
          } else transient('存檔損壞且沒有有效備份；已保留原始紀錄，本次進度僅暫存，請匯出。');
        }
      } else if (backup !== null) {
        data = parse(backup);
        status = { persistent: true, recoveredBackup: true, message: '已從最後有效備份復原進度。' };
      }
    } catch { transient('無法讀取本機存檔或備份；本次進度暫存於記憶體，請匯出備份。'); }
  }
  function persist(next) {
    data = next;
    if (!target?.setItem || !target?.getItem) return false;
    const serialized = JSON.stringify(next);
    // Validate serialization before touching either durable slot.
    parse(serialized);
    try {
      const old = target.getItem(SAVE_KEY);
      if (old !== null) {
        try { parse(old); target.setItem(BACKUP_KEY, old); }
        catch (error) {
          // Invalid main is never copied over a valid backup. A storage-write
          // exception still aborts so the previous durable state stays intact.
          if (!String(error?.message).startsWith('ORBIT_SAVE_INVALID:') && !(error instanceof SyntaxError)) throw error;
        }
      }
      target.setItem(SAVE_KEY, serialized);
      const readback = target.getItem(SAVE_KEY);
      if (readback !== serialized) throw new Error('save readback mismatch');
      parse(readback);
      status = { ...status, persistent: true, message: status.recoveredBackup ? status.message : '' };
      return true;
    } catch {
      transient('本機儲存被拒絕或空間不足；本次進度仍可繼續，請匯出備份。');
      return false;
    }
  }
  return {
    get data() { return clone(data); },
    get status() { return { ...status }; },
    commit(update) {
      if (typeof update !== 'function') throw new TypeError('Save commit requires a function');
      const draft = clone(data);
      update(draft);
      draft.gameVersion = '0.10.0';
      draft.updatedAt = new Date().toISOString();
      return persist(validateSave(draft));
    },
    exportJSON() { return JSON.stringify(validateSave(data), null, 2); },
    importJSON(text) { return persist(parse(text)); },
  };
}
