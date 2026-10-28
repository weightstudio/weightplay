import { buildStage, TOOLS } from './campaign.mjs';

const STEP = 1 / 60;
const EPS = 1e-7;
const key = (x, z) => `${x},${z}`;
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

export const NOTICE_CODES = Object.freeze(['unreachable', 'wrong-mode', 'bag-full', 'empty-bag', 'minimum-load', 'max-trips', 'depot-closed', 'dry-first',
  'portable-locked', 'invalid-pad', 'already-deployed', 'no-compression', 'compression-empty', 'compression-unchanged', 'busy', 'gate-unpowered', 'deploy-required', 'time-up']);

export function createRun(stageId, toolId = 'breeze') {
  if (!TOOLS[toolId]) throw new RangeError('Invalid tool');
  const stage = buildStage(stageId), tool = TOOLS[toolId];
  const walls = new Set(stage.walls.map(([x, z]) => key(x, z)));
  let sequence = 0, accumulator = 0, path = [], progress = 0, currentPile = null, unloading = 0, busy = 0;
  let baseDelivered = 0, dryDelivered = 0, bagDry = 0, portableDeposits = 0, maxBaseLoad = 0, gateActivatedAt = stage.rules.gateUnlockAfterBaseDelivered ? null : 0;
  let lastCompressedCargo = -1;
  const state = {
    stage, player: { x: stage.depot[0], z: stage.depot[1], angle: 0, moving: false, brushing: false }, piles: stage.piles,
    depots: [[...stage.depot]], target: null, events: [], elapsed: 0, timeLeft: stage.seconds, skin: 'moss', mode: 'vacuum', status: 'playing',
    gateStates: stage.gates.map(() => !stage.rules.gateUnlockAfterBaseDelivered), bagLoad: 0, bagCargo: 0, delivered: 0, trips: 0,
    compressionLeft: tool.compression, deploymentLeft: stage.pads.length ? 1 : 0, toolId, notice: '',
    bagDry: 0, dryDelivered: 0, baseDelivered: 0, portableDeposits: 0, capacity: tool.capacity, radius: tool.radius,
  };

  function emit(type, data = {}) {
    const e = { id: ++sequence, type, x: state.player.x, z: state.player.z, targetX: state.player.x, targetZ: state.player.z, amount: 0, code: '', ...data };
    state.events.push(e);
    if (state.events.length > 32) state.events.splice(0, state.events.length - 32);
    return e;
  }
  function reject(code) {
    if (state.notice !== code) emit('reject', { code });
    state.notice = code;
    return { ok: false, code };
  }
  function validCell(x, z) { return x >= 1 && x <= 8 && z >= 1 && z <= 6 && !walls.has(key(x, z)); }
  function cell(x, z) { return [Math.round(x), Math.round(z)]; }
  function pointClear(x, z) {
    if (x < .75 || x > 8.25 || z < .75 || z > 6.25) return false;
    // The .22-radius body must not overlap a wall even when the pointer is
    // close to a tile edge. Circle/AABB distance preserves genuine corners.
    for (const [wx, wz] of stage.walls) {
      const dx = Math.max(Math.abs(x - wx) - .5, 0), dz = Math.max(Math.abs(z - wz) - .5, 0);
      if (Math.hypot(dx, dz) < .22 - EPS) return false;
    }
    return true;
  }
  function segmentClear(sx, sz, tx, tz) {
    const count = Math.max(1, Math.ceil(Math.hypot(tx - sx, tz - sz) / .08));
    for (let i = 1; i <= count; i++) if (!pointClear(sx + (tx - sx) * i / count, sz + (tz - sz) * i / count)) return false;
    return true;
  }
  function gateIndex(x, z) { return stage.gates.findIndex(g => g.x === x && g.z === z); }
  function gateAt(x, z) { const i = gateIndex(x, z); return i < 0 || state.gateStates[i]; }
  function route(sx, sz, tx, tz) {
    const [startX, startZ] = cell(sx, sz), [endX, endZ] = cell(tx, tz);
    if (!validCell(startX, startZ) || !validCell(endX, endZ)) return null;
    // Held steering sends a short continuous target every frame. Crossing two
    // rounding boundaries must not insert an artificial L-shaped grid turn.
    // This is deliberately local: long pointer routes retain their authored
    // A* corridor and intermediate gate waypoints.
    const length = Math.hypot(tx - sx, tz - sz);
    if (length <= .5 + EPS && segmentClear(sx, sz, tx, tz)) {
      const samples = Math.max(1, Math.ceil(length / .04));
      let intermediateGate = false;
      for (let i = 1; i < samples; i++) {
        const [x, z] = cell(sx + (tx - sx) * i / samples, sz + (tz - sz) * i / samples);
        if ((x !== startX || z !== startZ) && (x !== endX || z !== endZ) && gateIndex(x, z) >= 0) { intermediateGate = true; break; }
      }
      if (!intermediateGate) return [{ x: tx, z: tz }];
    }
    const queue = [[startX, startZ]], previous = new Map([[key(startX, startZ), null]]);
    for (let n = 0; n < queue.length; n++) {
      const [x, z] = queue[n];
      if (x === endX && z === endZ) {
        const result = [];
        let c = [x, z];
        while (c) { result.push({ x: c[0], z: c[1] }); c = previous.get(key(c[0], c[1])); }
        result.reverse();
        result.push({ x: tx, z: tz });
        // A fractional goal belongs inside the final cell; its centre is not
        // another player destination. Keep that centre only when the direct
        // adjacent-cell segment needs it to clear the character's wall radius.
        // Only this final centre is pruned, so intermediate gates stay in path.
        if (result.length >= 3) {
          const incoming = result[result.length - 3];
          if (segmentClear(incoming.x, incoming.z, tx, tz)) result.splice(result.length - 2, 1);
        }
        // Repeated drag updates keep their forward movement instead of returning
        // to a cell centre on every pointer event. A turn close to a wall keeps
        // the centre waypoint when the direct segment would clip the body.
        if (result.length > 1 && segmentClear(sx, sz, result[1].x, result[1].z)) result.shift();
        return result;
      }
      const adjacent = [[x + 1, z], [x, z - 1], [x - 1, z], [x, z + 1]];
      adjacent.sort((a, b) => Math.abs(a[0] - endX) + Math.abs(a[1] - endZ) - Math.abs(b[0] - endX) - Math.abs(b[1] - endZ));
      for (const next of adjacent) {
        const k = key(next[0], next[1]);
        if (validCell(...next) && !previous.has(k)) { previous.set(k, [x, z]); queue.push(next); }
      }
    }
    return null;
  }
  function setTarget(x, z) {
    if (state.status !== 'playing') return { ok: false, code: 'ended' };
    if (busy > 0) return reject('busy');
    if (!Number.isFinite(x) || !Number.isFinite(z) || !pointClear(x, z)) return reject('unreachable');
    const next = route(state.player.x, state.player.z, x, z);
    if (!next) return reject('unreachable');
    path = next;
    state.target = { x, z };
    state.notice = '';
    return { ok: true };
  }
  function setMode(mode) {
    if (state.status !== 'playing') return { ok: false, code: 'ended' };
    if (busy > 0) return reject('busy');
    if (mode !== 'vacuum' && mode !== 'brush') return reject('wrong-mode');
    if (state.mode !== mode) { progress = 0; currentPile = null; }
    state.mode = mode; state.notice = '';
    return { ok: true };
  }
  function deploy(padIndex) {
    if (state.status !== 'playing') return { ok: false, code: 'ended' };
    if (busy > 0) return reject('busy');
    if (!stage.pads.length || (stage.rules.portableUnlockAfterBaseLoad && maxBaseLoad < stage.rules.portableUnlockAfterBaseLoad)) return reject('portable-locked');
    if (!state.deploymentLeft) return reject('already-deployed');
    if (!Number.isInteger(padIndex) || !stage.pads[padIndex]) return reject('invalid-pad');
    const [x, z] = stage.pads[padIndex];
    state.deploymentLeft = 0; state.depots.push([x, z]); state.notice = '';
    emit('deploy', { x, z, targetX: x, targetZ: z, amount: 1 });
    return { ok: true };
  }
  function compress() {
    if (state.status !== 'playing') return { ok: false, code: 'ended' };
    if (busy > 0) return reject('busy');
    if (state.compressionLeft < 1) return reject('no-compression');
    if (!state.bagCargo) return reject('compression-empty');
    if (state.bagLoad <= 1 || lastCompressedCargo === state.bagCargo) return reject('compression-unchanged');
    state.compressionLeft--; busy = 1; path = []; state.target = null; state.notice = ''; unloading = 0;
    return { ok: true };
  }
  function gateUpdate() {
    stage.gates.forEach((g, i) => {
      const powered = gateActivatedAt !== null;
      const localTime = powered ? state.elapsed - gateActivatedAt : 0;
      const open = powered && ((localTime + g.phase) % (g.openSeconds + g.closedSeconds)) < g.openSeconds;
      if (open !== state.gateStates[i]) {
        state.gateStates[i] = open;
        emit('gate', { x: g.x, z: g.z, targetX: g.x, targetZ: g.z, amount: open ? 1 : 0, code: open ? 'gate-open' : 'gate-closed' });
      }
    });
  }
  function move() {
    state.player.moving = false;
    let travel = tool.speed * STEP;
    while (path.length && travel > EPS) {
      const next = path[0];
      const [nx, nz] = cell(next.x, next.z), [cx, cz] = cell(state.player.x, state.player.z);
      // A closing gate never captures a character already inside its cell.
      if (!gateAt(nx, nz) && (cx !== nx || cz !== nz)) {
        if (gateActivatedAt === null) reject('gate-unpowered');
        break;
      }
      const dx = next.x - state.player.x, dz = next.z - state.player.z, length = Math.hypot(dx, dz);
      if (length < .001) { path.shift(); continue; }
      const step = Math.min(travel, length);
      state.player.x += dx / length * step; state.player.z += dz / length * step;
      state.player.angle = Math.atan2(dx, dz); state.player.moving = true; travel -= step;
      if (step >= length - EPS) path.shift();
    }
    if (!path.length) state.target = null;
  }
  function clearCollection() {
    if (currentPile) currentPile.collecting = 0;
    currentPile = null; progress = 0; state.player.brushing = false;
  }
  function collect() {
    const nearby = state.piles.filter(p => p.remaining > 0 && distance(p, state.player) <= tool.radius + EPS).sort((a, b) => distance(a, state.player) - distance(b, state.player));
    const pile = nearby.find(p => (p.kind === 'wet') === (state.mode === 'brush'));
    state.player.brushing = false;
    if (!pile) { clearCollection(); if (nearby.length) reject('wrong-mode'); return; }
    if (state.bagLoad >= tool.capacity) { clearCollection(); reject('bag-full'); return; }
    if (pile.kind === 'wet' && dryDelivered < (stage.rules.dryDeliveredBeforeWet || 0)) { clearCollection(); reject('dry-first'); return; }
    if (currentPile !== pile) { clearCollection(); currentPile = pile; }
    state.player.brushing = pile.kind === 'wet';
    progress += STEP;
    const duration = pile.kind === 'wet' ? .8 : .35;
    pile.collecting = Math.min(1, progress / duration);
    if (progress + EPS < duration) return;
    progress -= duration; pile.collecting = 0;
    pile.remaining--; state.bagLoad++; state.bagCargo++; if (pile.kind === 'dry') bagDry++;
    state.bagDry = bagDry; state.notice = '';
    emit(pile.kind === 'wet' ? 'brush' : 'collect', { x: pile.x, z: pile.z, targetX: state.player.x, targetZ: state.player.z, amount: 1, kind: pile.kind, pileId: pile.id });
    if (!pile.remaining) clearCollection();
  }
  function finish(status, code = '') {
    state.status = status; state.notice = code; path = []; state.target = null; state.player.moving = false; clearCollection();
    emit(status, { amount: state.delivered, code });
  }
  function unload() {
    const depotIndex = state.depots.findIndex(([x, z]) => Math.hypot(state.player.x - x, state.player.z - z) <= .65);
    if (depotIndex < 0 || !state.bagCargo) { unloading = 0; return; }
    const window = stage.rules.depotWindow;
    if (window && state.elapsed % (window.openSeconds + window.closedSeconds) >= window.openSeconds) { unloading = 0; reject('depot-closed'); return; }
    if (state.bagCargo < (stage.rules.minLoad || 1)) { unloading = 0; reject('minimum-load'); return; }
    if (stage.rules.maxTrips && state.trips >= stage.rules.maxTrips) { unloading = 0; finish('lose', 'max-trips'); return; }
    unloading += STEP;
    if (unloading + EPS < .6) return;
    const amount = state.bagCargo, [x, z] = state.depots[depotIndex];
    state.delivered += amount; dryDelivered += bagDry; state.dryDelivered = dryDelivered; state.trips++;
    if (depotIndex === 0) { baseDelivered += amount; maxBaseLoad = Math.max(maxBaseLoad, amount); state.baseDelivered = baseDelivered; }
    else { portableDeposits++; state.portableDeposits = portableDeposits; }
    state.bagLoad = 0; state.bagCargo = 0; bagDry = 0; state.bagDry = 0; unloading = 0; lastCompressedCargo = -1; state.notice = '';
    emit('deposit', { targetX: x, targetZ: z, amount, depotIndex });
    if (gateActivatedAt === null && baseDelivered >= stage.rules.gateUnlockAfterBaseDelivered) { gateActivatedAt = state.elapsed; gateUpdate(); }
    if (state.delivered === stage.target) {
      if (stage.rules.portableRequired && !portableDeposits) finish('lose', 'deploy-required');
      else finish('win');
    } else if (stage.rules.maxTrips && state.trips >= stage.rules.maxTrips) finish('lose', 'max-trips');
  }
  function tick() {
    if (state.status !== 'playing') return;
    state.elapsed += STEP; state.timeLeft = Math.max(0, stage.seconds - state.elapsed); gateUpdate();
    if (busy > 0) {
      clearCollection(); state.player.moving = false; busy -= STEP;
      if (busy <= EPS) { busy = 0; const released = state.bagLoad - Math.ceil(state.bagLoad / 2); state.bagLoad -= released; lastCompressedCargo = state.bagCargo; emit('compress', { amount: released }); }
    } else { move(); collect(); unload(); }
    // A final remainder smaller than the authored batch cannot ever be
    // delivered. Explain the failed plan immediately instead of silently
    // rejecting that same last bag until the generous deadline expires.
    if (state.status === 'playing' && stage.rules.minLoad && state.bagCargo > 0 && state.bagCargo < stage.rules.minLoad && state.piles.every(p => p.remaining === 0)) finish('lose', 'minimum-load');
    // A final successful unload on the deadline takes precedence over expiry.
    if (state.status === 'playing' && state.timeLeft <= EPS) finish('lose', 'time-up');
  }
  function update(dt) {
    if (!Number.isFinite(dt) || dt <= 0 || state.status !== 'playing') return state;
    accumulator = Math.min(accumulator + Math.min(dt, .1), STEP * 4);
    let steps = 0;
    while (accumulator + EPS >= STEP && steps++ < 4) { accumulator -= STEP; tick(); }
    return state;
  }
  function consumeEvents() { return state.events.splice(0, state.events.length); }
  return { state, setTarget, setMode, deploy, compress, update, consumeEvents };
}
