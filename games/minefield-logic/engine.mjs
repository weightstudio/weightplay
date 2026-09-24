/* Game-owned rules only. No DOM, audio, timers, storage or shared UI copies. */
export const LEVELS = Object.freeze({
  easy: Object.freeze({ rows: 9, cols: 9, mines: 10 }),
  medium: Object.freeze({ rows: 16, cols: 16, mines: 40 }),
  hard: Object.freeze({ rows: 16, cols: 30, mines: 99 }),
});
export function neighbours(index, rows, cols) {
  const row = Math.floor(index / cols), col = index % cols, result = [];
  for (let dr = -1; dr <= 1; dr += 1) for (let dc = -1; dc <= 1; dc += 1) {
    const r = row + dr, c = col + dc;
    if ((dr || dc) && r >= 0 && r < rows && c >= 0 && c < cols) result.push(r * cols + c);
  }
  return result;
}

/** Infer from visible numbers only. Player flags are NOT treated as facts. */
export function deduce(view) {
  const hidden = view.cells.flatMap((cell, i) => cell.open ? [] : [i]);
  const constraints = view.cells.flatMap((cell, i) => {
    if (!cell.open || cell.mine) return [];
    const cells = neighbours(i, view.rows, view.cols).filter(n => !view.cells[n].open);
    return cells.length ? [{ cells, count: cell.count, clues: [i] }] : [];
  });
  constraints.push({ cells: hidden, count: view.total, clues: [] });
  const safe = new Set(), mines = new Set(), proofs = new Map();
  const mark = (cells, mine, clues) => {
    const target = mine ? mines : safe;
    let changed = false;
    for (const i of cells) if (!target.has(i)) {
      target.add(i); proofs.set(i, clues); changed = true;
    }
    return changed;
  };
  // Each productive pass classifies at least one cell. No exponential search.
  for (let pass = 0; pass <= view.cells.length; pass += 1) {
    let changed = false;
    const reduced = constraints.map(c => ({
      cells: c.cells.filter(i => !safe.has(i) && !mines.has(i)),
      count: c.count - c.cells.filter(i => mines.has(i)).length,
      clues: c.clues,
    })).filter(c => c.cells.length);
    if (reduced.some(c => c.count < 0 || c.count > c.cells.length)) return { safe: [], mines: [], proofs, inconsistent: true };
    for (const c of reduced) {
      if (c.count === 0) changed = mark(c.cells, false, c.clues) || changed;
      else if (c.count === c.cells.length) changed = mark(c.cells, true, c.clues) || changed;
    }
    if (changed) continue;
    // Subset subtraction: B\A contains exactly count(B)-count(A) mines.
    for (let a = 0; a < reduced.length; a += 1) for (let b = 0; b < reduced.length; b += 1) {
      const small = reduced[a], big = reduced[b];
      if (small.cells.length >= big.cells.length || !small.cells.every(i => big.cells.includes(i))) continue;
      const difference = big.cells.filter(i => !small.cells.includes(i));
      const count = big.count - small.count;
      if (count === 0 || count === difference.length) changed = mark(difference, count > 0, [...new Set([...small.clues, ...big.clues])]) || changed;
    }
    if (!changed) break;
  }
  if ([...safe].some(i => mines.has(i))) return { safe: [], mines: [], proofs, inconsistent: true };
  return { safe: [...safe], mines: [...mines], proofs, inconsistent: false };
}

export class Minefield {
  #mines = null;
  #fixedMines = null;
  #fixedStart = 0;
  #opened = new Set();
  #flags = new Set();
  #history = [];
  #random;
  constructor(level = 'easy', random = Math.random, authoredLayout = null) {
    if (!Object.hasOwn(LEVELS, level) || typeof random !== 'function') throw new TypeError('Invalid minefield configuration');
    this.level = level;
    Object.assign(this, LEVELS[level]);
    this.total = this.mines;
    delete this.mines;
    if (authoredLayout !== null) {
      if (!authoredLayout || !Array.isArray(authoredLayout.mines)) throw new TypeError('Invalid authored minefield layout');
      const mines = authoredLayout.mines;
      const start = authoredLayout.start ?? 0;
      if (mines.length === 0 || mines.length >= this.rows * this.cols || new Set(mines).size !== mines.length ||
          mines.some(i => !Number.isInteger(i) || i < 0 || i >= this.rows * this.cols) ||
          !Number.isInteger(start) || start < 0 || start >= this.rows * this.cols || mines.includes(start) ||
          neighbours(start, this.rows, this.cols).some(i => mines.includes(i))) {
        throw new TypeError('Authored layout requires unique mines and a safe zero opening');
      }
      this.#fixedMines = new Set(mines);
      this.#fixedStart = start;
      this.total = mines.length;
    }
    this.status = 'ready'; this.moves = 0; this.assisted = false;
    this.#random = random;
  }
  #valid(i) { return Number.isInteger(i) && i >= 0 && i < this.rows * this.cols; }
  #count(i) { return neighbours(i, this.rows, this.cols).filter(n => this.#mines?.has(n)).length; }
  #generate(first) {
    if (this.#fixedMines) {
      this.#mines = new Set(this.#fixedMines);
      return;
    }
    const excluded = new Set([first, ...neighbours(first, this.rows, this.cols)]);
    const candidates = Array.from({ length: this.rows * this.cols }, (_, i) => i).filter(i => !excluded.has(i));
    // Partial Fisher-Yates: finite work even for a degenerate random source.
    for (let i = 0; i < this.total; i += 1) {
      const sample = this.#random();
      if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random value must be in [0, 1)');
      const j = i + Math.floor(sample * (candidates.length - i));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    this.#mines = new Set(candidates.slice(0, this.total));
  }
  /** Prepare the fixed, visibly-safe opening for an authored campaign stage. */
  prepareAuthoredOpening() {
    if (!this.#fixedMines || this.status !== 'ready' || this.#mines) return false;
    this.#mines = new Set(this.#fixedMines);
    this.status = 'playing';
    this.#flood([this.#fixedStart]);
    this.moves = 0;
    return this.status === 'playing';
  }
  #save() {
    this.#history.push({ opened: [...this.#opened], flags: [...this.#flags], mines: this.#mines ? [...this.#mines] : null, status: this.status, moves: this.moves });
    if (this.#history.length > 80) this.#history.shift();
  }
  #flood(indices) {
    const queue = [...indices], queued = new Set(queue);
    for (let offset = 0; offset < queue.length; offset += 1) {
      const i = queue[offset];
      if (this.#opened.has(i) || this.#flags.has(i)) continue;
      this.#opened.add(i);
      if (this.#mines.has(i)) { this.status = 'lost'; return; }
      if (this.#count(i) === 0) for (const n of neighbours(i, this.rows, this.cols)) {
        if (!queued.has(n) && !this.#flags.has(n)) { queued.add(n); queue.push(n); }
      }
    }
    if (this.#opened.size === this.rows * this.cols - this.total) this.status = 'won';
  }
  reveal(i) {
    if (!this.#valid(i) || ['won', 'lost'].includes(this.status) || this.#flags.has(i)) return false;
    if (this.#opened.has(i)) return this.chord(i);
    this.#save();
    if (!this.#mines) { this.#generate(i); this.status = 'playing'; }
    this.moves += 1; this.#flood([i]); return true;
  }
  flag(i) {
    if (!this.#valid(i) || ['won', 'lost'].includes(this.status) || this.#opened.has(i)) return false;
    if (!this.#flags.has(i) && this.#flags.size >= this.total) return false;
    this.#save();
    if (this.#flags.has(i)) this.#flags.delete(i); else this.#flags.add(i);
    this.moves += 1; return true;
  }
  chord(i) {
    if (!this.#valid(i) || this.status !== 'playing' || !this.#opened.has(i)) return false;
    const around = neighbours(i, this.rows, this.cols), count = this.#count(i);
    const targets = around.filter(n => !this.#opened.has(n) && !this.#flags.has(n));
    if (!count || !targets.length || around.filter(n => this.#flags.has(n)).length !== count) return false;
    this.#save(); this.moves += 1; this.#flood(targets); return true;
  }
  undo() {
    const previous = this.#history.pop();
    if (!previous) return false;
    this.#opened = new Set(previous.opened); this.#flags = new Set(previous.flags);
    this.#mines = previous.mines ? new Set(previous.mines) : null;
    this.status = previous.status; this.moves = previous.moves; this.assisted = true;
    return true;
  }
  hint() {
    if (['won', 'lost'].includes(this.status)) return { kind: 'none' };
    this.assisted = true;
    if (!this.#mines) {
      const i = Array.from({ length: this.rows * this.cols }, (_, n) => n).find(n => !this.#flags.has(n));
      return { kind: 'opening', index: i, clues: [] };
    }
    const proof = deduce(this.view());
    const unflag = proof.safe.find(i => this.#flags.has(i));
    if (unflag !== undefined) return { kind: 'unflag', index: unflag, clues: proof.proofs.get(unflag) };
    const safe = proof.safe.find(i => !this.#flags.has(i));
    if (safe !== undefined) return { kind: 'safe', index: safe, clues: proof.proofs.get(safe) };
    const mine = proof.mines.find(i => !this.#flags.has(i));
    if (mine !== undefined) return { kind: 'mine', index: mine, clues: proof.proofs.get(mine) };
    return { kind: 'none', clues: [] };
  }
  view() {
    const ended = this.status === 'won' || this.status === 'lost';
    return {
      level: this.level, rows: this.rows, cols: this.cols, total: this.total,
      status: this.status, moves: this.moves, assisted: this.assisted,
      flags: this.#flags.size, safe: [...this.#opened].filter(i => !this.#mines?.has(i)).length,
      canUndo: this.#history.length > 0,
      cells: Array.from({ length: this.rows * this.cols }, (_, i) => {
        const open = this.#opened.has(i), flag = this.#flags.has(i);
        // Never leak a hidden count or mine through render data/ARIA/classes.
        return { open, flag, count: open && !this.#mines?.has(i) ? this.#count(i) : null, mine: ended ? !!this.#mines?.has(i) : open && !!this.#mines?.has(i) };
      }),
    };
  }
}
