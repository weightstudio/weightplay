/* Minefield-owned presentation. Never writes engine state, save data, audio,
 * shared frame transforms, control dimensions, analytics or translated text.
 * Only the square board tracks are flexible; sizes are pre-transform logical px.
 */
import { neighbours } from './engine.mjs?v=18';

export function fitBoardCell({ width, height, rows, cols }) {
  if (![width, height].every(n => Number.isFinite(n) && n > 8) ||
      ![rows, cols].every(n => Number.isInteger(n) && n > 0 && n <= 64)) return null;
  // Small boards fit whenever legible; larger fields retain internal scrolling.
  const minimum = rows <= 9 && cols <= 9 ? 28 : 40;
  const fit = Math.floor(Math.min((width - 8) / cols, (height - 8) / rows) * 4) / 4;
  return Math.max(minimum, fit);
}

export function revealDelay(index, origin, cols) {
  if (![index, origin, cols].every(Number.isInteger) || index < 0 || origin < 0 || cols <= 0) return 0;
  const distance = Math.abs(Math.floor(index / cols) - Math.floor(origin / cols)) + Math.abs(index % cols - origin % cols);
  return Math.min(160, distance * 18);
}

/** Bounded, cancellable tweens. Replacing/cancelling handles finished rejection. */
export function createMotion(isAllowed, maximum = 48) {
  const active = new Map();
  const stop = () => {
    for (const animation of active.values()) animation.cancel();
    active.clear();
  };
  return {
    stop,
    get size() { return active.size; },
    play(node, frames, duration = 220, delay = 0) {
      if (!isAllowed() || typeof node?.animate !== 'function') return;
      active.get(node)?.cancel(); active.delete(node);
      if (active.size >= maximum) {
        const [oldNode, oldAnimation] = active.entries().next().value;
        oldAnimation.cancel(); active.delete(oldNode);
      }
      const animation = node.animate(frames, { duration, delay, easing: 'cubic-bezier(.22,.75,.3,1)', fill: 'none' });
      active.set(node, animation);
      const release = () => { if (active.get(node) === animation) active.delete(node); };
      animation.finished.then(release, release);
    },
  };
}

const POP = [{ transform: 'scale(.91)', opacity: .7 }, { transform: 'scale(1)', opacity: 1 }];
const GLOW = [{ filter: 'brightness(1.38)' }, { filter: 'brightness(1)' }];
const ENTER = [{ opacity: .6, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }];
const mounts = new WeakMap();

export function mountMinefieldPresentation(root) {
  if (!root) return null;
  if (mounts.has(root)) return mounts.get(root);
  const doc = root.ownerDocument, win = doc.defaultView;
  const board = root.querySelector('.mf-board'), viewport = root.querySelector('.mf-viewport');
  const overlay = root.querySelector('.mf-overlay'), dialog = root.querySelector('.mf-dialog');
  if (!board || !viewport || !overlay || !dialog) return null;
  const scenes = ['logicMain', 'logicStages', 'logicBattle'].map(id => root.querySelector(`#${id}`));
  if (scenes.some(node => !node)) return null;
  const [main, stage, battle] = scenes;
  const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new win.AbortController();
  const on = (target, name, callback, options = {}) => target?.addEventListener(name, callback, { ...options, signal: listeners.signal });
  let disposed = false, suspended = false, raf = null, needsLayout = true;
  let cells = [], snapshot = new WeakMap(), origin = 0, clue = null;
  let lastScene = null, wasCovered = overlay.hidden === false;
  const marked = new Set(), hudText = new WeakMap();
  const motion = createMotion(() => !disposed && !suspended && !doc.hidden && !reduced.matches);
  const pulse = node => motion.play(node, GLOW, 240);
  const dims = () => ({ rows: Number(board.getAttribute('aria-rowcount')), cols: Number(board.getAttribute('aria-colcount')) });
  const state = node => ({ open: node.classList.contains('is-open'), flag: node.classList.contains('is-flag'),
    mine: node.classList.contains('is-mine'), hint: node.classList.contains('is-hint'), proof: node.classList.contains('is-clue') });

  function clearClue() {
    for (const node of marked) { node.removeAttribute('data-mf-adjacent'); node.removeAttribute('data-mf-origin'); }
    marked.clear();
  }
  function showClue(node) {
    clearClue(); clue = node;
    if (suspended || battle.hidden || !overlay.hidden || !board.contains(node) ||
        !node?.classList.contains('is-open') || !(Number(node.dataset.count) > 0) || node.getAttribute('aria-disabled') === 'true') return;
    const { rows, cols } = dims();
    node.setAttribute('data-mf-origin', ''); marked.add(node);
    for (const i of neighbours(Number(node.dataset.cell), rows, cols)) {
      const adjacent = cells[i];
      if (adjacent) { adjacent.setAttribute('data-mf-adjacent', ''); marked.add(adjacent); }
    }
  }
  function layout() {
    if (battle.hidden) return;
    // client dimensions precede the shared canvas transform; never divide by
    // its scale and never write the shared canvas's own width/height/transform.
    const cell = fitBoardCell({ width: viewport.clientWidth, height: viewport.clientHeight, ...dims() });
    if (cell !== null && board.style.getPropertyValue('--mf-cell') !== `${cell}px`) {
      board.style.setProperty('--mf-cell', `${cell}px`);
    }
  }
  function refresh() {
    raf = null;
    if (disposed || suspended || doc.hidden) return;
    const scene = scenes.find(node => !node.hidden);
    const nextCells = [...board.querySelectorAll('.mf-cell')];
    const rebuilt = nextCells.length !== cells.length || nextCells[0] !== cells[0];
    if (rebuilt) { motion.stop(); snapshot = new WeakMap(); clearClue(); clue = null; needsLayout = true; }
    cells = nextCells;
    if (scene !== lastScene) {
      motion.stop(); clearClue(); clue = null; needsLayout = true;
      if (scene === main) motion.play(main.querySelector('[data-wp-frame-copy]'), ENTER);
      // Fade content, not the shared rail or canvas transform: preserve centering.
      if (scene === stage) motion.play(stage.querySelector('.mf-stage-content'), [{ opacity: .65 }, { opacity: 1 }]);
      if (scene === battle) pulse(viewport);
      lastScene = scene;
    }
    if (needsLayout) { layout(); needsLayout = false; }
    const covered = !overlay.hidden;
    if (covered && !wasCovered && scene === battle) {
      motion.stop(); clearClue(); motion.play(dialog, ENTER, 240);
      if (board.querySelector('.mf-cell.is-open.is-mine')) {
        motion.play(dialog.querySelector('h2'), [{ transform: 'translateX(-2px)' }, { transform: 'translateX(2px)' }, { transform: 'translateX(0)' }], 250);
      }
    }
    wasCovered = covered;
    const changes = [];
    for (const [index, node] of cells.entries()) {
      const previous = snapshot.get(node), current = state(node);
      snapshot.set(node, current);
      if (!previous || covered || scene !== battle) continue;
      if ((!previous.open && current.open) || previous.flag !== current.flag || (previous.open && !current.open)) {
        changes.push({ node, index, pop: true });
      } else if ((!previous.hint && current.hint) || (!previous.proof && current.proof)) {
        changes.push({ node, index, pop: false });
      }
    }
    const { cols } = dims();
    changes.sort((a, b) => revealDelay(a.index, origin, cols) - revealDelay(b.index, origin, cols));
    for (const change of changes.slice(0, 40)) {
      motion.play(change.node, change.pop ? POP : GLOW, change.pop ? 230 : 350, change.pop ? revealDelay(change.index, origin, cols) : 0);
    }
    // Do not animate the clock or retween identical HUD text every render.
    const values = [...root.querySelectorAll('.mf-hud-stat strong')];
    for (const index of [2, 3]) {
      const node = values[index]; if (!node) continue;
      const previous = hudText.get(node); hudText.set(node, node.textContent);
      if (previous !== undefined && previous !== node.textContent && !covered && scene === battle) pulse(node);
    }
    if (clue) showClue(clue);
  }
  function schedule(layoutChanged = false) {
    needsLayout ||= layoutChanged;
    if (disposed || suspended || doc.hidden || raf !== null) return;
    raf = win.requestAnimationFrame(refresh);
  }
  // Deliberately scoped to existing declared surfaces, never document/body.
  // Own data-mf-* cues and WAAPI styles are excluded to avoid observer loops.
  const boardObserver = new win.MutationObserver(records => schedule(records.some(record =>
    (record.type === 'childList' && (record.target === board || record.target.classList?.contains('mf-row'))) ||
    (record.type === 'attributes' && record.target === board))));
  const surfaceObserver = new win.MutationObserver(records => schedule(records.some(record => record.target !== overlay)));
  const hudObserver = new win.MutationObserver(() => schedule());
  const selectionObserver = new win.MutationObserver(records => {
    for (const record of records) {
      const node = record.target;
      if (node.getAttribute('aria-current') === 'true') pulse(node.querySelector('.mf-stage-number'));
      else if (node.getAttribute('aria-pressed') === 'true') pulse(node);
    }
  });
  const resizeObserver = typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(() => schedule(true)) : null;
  function observe() {
    boardObserver.observe(board, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'aria-rowcount', 'aria-colcount'] });
    for (const node of [...scenes, overlay]) surfaceObserver.observe(node, { attributes: true, attributeFilter: ['hidden'] });
    const hud = root.querySelector('.mf-hud');
    if (hud) hudObserver.observe(hud, { subtree: true, childList: true, characterData: true });
    const rail = root.querySelector('.mf-stage-grid'), tools = root.querySelector('.mf-tools');
    for (const node of [rail, tools].filter(Boolean)) selectionObserver.observe(node, { subtree: true, attributes: true, attributeFilter: ['aria-current', 'aria-pressed'] });
    resizeObserver?.observe(viewport);
  }
  function suspend() {
    suspended = true; motion.stop(); clearClue(); clue = null;
    if (raf !== null) win.cancelAnimationFrame(raf); raf = null;
    for (const observer of [boardObserver, surfaceObserver, hudObserver, selectionObserver, resizeObserver]) observer?.disconnect();
  }
  function resume() {
    if (disposed || !suspended || doc.hidden) return;
    suspended = false; snapshot = new WeakMap(); observe(); schedule(true);
  }
  const handle = {
    dispose() { if (disposed) return; suspend(); disposed = true; listeners.abort(); mounts.delete(root); },
  };
  mounts.set(root, handle);
  on(board, 'pointerdown', event => { const node = event.target.closest('[data-cell]'); if (node) origin = Number(node.dataset.cell); });
  on(board, 'keydown', event => { const node = event.target.closest('[data-cell]'); if (node) origin = Number(node.dataset.cell); });
  on(board, 'pointerover', event => { if (event.pointerType !== 'touch') showClue(event.target.closest('[data-cell]')); });
  on(board, 'pointerleave', () => showClue(board.contains(doc.activeElement) ? doc.activeElement : null));
  on(board, 'focusin', event => showClue(event.target.closest('[data-cell]')));
  on(board, 'focusout', event => { if (!board.contains(event.relatedTarget)) { clearClue(); clue = null; } });
  on(win, 'resize', () => schedule(true), { passive: true });
  on(win.visualViewport, 'resize', () => schedule(true), { passive: true });
  on(reduced, 'change', () => { motion.stop(); schedule(); });
  on(doc, 'visibilitychange', () => { if (doc.hidden) suspend(); else resume(); });
  on(win, 'pagehide', event => { if (event.persisted) suspend(); else handle.dispose(); });
  on(win, 'pageshow', resume);
  on(win, 'weightplay:interaction-state', () => {
    if (root.querySelector('.wp-frame-popover:not([hidden])')) { motion.stop(); clearClue(); }
  });
  observe(); schedule(true);
  return handle;
}
