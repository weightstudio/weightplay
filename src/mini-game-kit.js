(function () {
  const LOCALES = [
    ["en", "English"],
    ["zh-Hant", "�c��"],
    ["zh-Hans", "?��"],
  ];

  function $(id) { return document.getElementById(id); }

  function createLocaleText(keys) {
    const table = {};
    for (const [k, v] of Object.entries(keys)) table[k] = v;
    return table;
  }

  function initLocale() {
    const path = location.pathname.split('/').filter(Boolean).join('/');
    const stored = (() => {
      try {
        return localStorage.getItem('weightplay-locale') || sessionStorage.getItem('weightplay-locale') || '';
      } catch { return ''; }
    })();
    const routeLocale = /\/zh-(?:tw|hant)\//.test(path) ? 'zh-Hant'
      : /\/zh-(?:cn|hans)\//.test(path) ? 'zh-Hans'
      : 'en';
    return LOCALES.some(([code]) => code === stored) ? stored : routeLocale;
  }

  function t(locale, table, key, vars = {}) {
    let text = (table?.[key] && table[key][locale]) || table?.[key]?.en || '';
    if (!text && table && Object.prototype.hasOwnProperty.call(table, key)) {
      text = String(table[key]);
    }
    return String(text || '').replace(/\{(\w+)\}/g, (_, name) => (name in vars ? vars[name] : ''));
  }

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  class MiniPuzzleGame {
    constructor(config) {
      this.config = config;
      this.els = {
        loading: $('loading'),
        mainGroup: $('mainGroup'),
        stageScreen: $('stageScreen'),
        battleScreen: $('battleScreen'),
        localeSelect: $('localeSelect'),
        startBtn: $('startBtn'),
        stageRail: $('stageRail'),
        stageBack: $('stageBack'),
        stageText: $('stageText'),
        stageSummary: $('stageSummary'),
        battleBack: $('battleBack'),
        battleTitle: $('battleTitle'),
        hudTop: $('hudTop'),
        board: $('board'),
        status: $('statusText'),
        controls: $('controls'),
        leaveModal: $('leaveModal'),
        leaveContinue: $('leaveContinue'),
        leaveStage: $('leaveStage'),
        resultModal: $('resultModal'),
        resultTitle: $('resultTitle'),
        resultText: $('resultText'),
        resultPrimary: $('resultPrimary'),
        resultSecondary: $('resultSecondary'),
        nextBtn: $('nextBtn'),
        mainProgress: $('mainProgress')
      };
      this.locale = initLocale();
      this.save = this.loadSave();
      this.screen = 'main';
      this.stage = 0;
      this.run = null;
      this.pending = null;
      this.touch = null;
      this.stageCount = config.stageCount || 30;
      this.initLocaleUi();
      this.buildMain();
      this.bindEvents();
      this.setScreen('main');
      this.els.loading.hidden = true;
      this.focusLocale();
    }

    get key() { return `weightplay_${this.config.gameId}_save_v2`; }

    loadSave() {
      const fallback = { unlocked: 1, best: {}, score: 0, settings: { sound: true } };
      try {
        const raw = localStorage.getItem(this.key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return {
          unlocked: clamp(Number(parsed.unlocked) || 1, 1, this.stageCount),
          best: parsed.best || {},
          score: Number(parsed.score) || 0,
          settings: parsed.settings || fallback.settings,
          endlessLevel: Number(parsed.endlessLevel) || 0,
        };
      } catch { return fallback; }
    }

    persist() {
      try {
        localStorage.setItem(this.key, JSON.stringify(this.save));
      } catch {
        // ignore storage failures
      }
      this.renderMainProgress();
    }

    initLocaleUi() {
      const { localeSelect } = this.els;
      if (!localeSelect) return;
      localeSelect.innerHTML = '';
      for (const [value, label] of LOCALES) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        localeSelect.appendChild(option);
      }
      localeSelect.value = this.locale;
      localeSelect.addEventListener('change', () => {
        this.locale = localeSelect.value;
        try {
          localStorage.setItem('weightplay-locale', this.locale);
          localStorage.setItem('weightplay-game-locale', this.locale);
        } catch {}
        this.applyLocale();
      });
    }

    applyLocale() {
      const map = this.config.copy || {};
      const getText = (k) => t(this.locale, map, k);
      const title = getText('title');
      if (title) {
        document.querySelectorAll('[data-t=title]').forEach((el) => { el.textContent = title; });
        document.title = `${title} | WeightPlay`;
      }
      for (const [selector, key] of Object.entries(this.config.i18nMap || {})) {
        const el = document.querySelector(selector);
        if (el) el.textContent = getText(key);
      }
      this.renderHud();
      this.renderStages();
      this.renderBoard();
      if (this.run) this.updateStatus();
    }

    buildMain() {
      this.applyLocale();
      this.renderMainProgress();
    }

    renderMainProgress() {
      if (this.els.mainProgress) {
        const stages = Math.min(this.save.unlocked, this.stageCount);
        this.els.mainProgress.textContent = `${stages} / ${this.stageCount}`;
      }
    }

    setScreen(next) {
      this.screen = next;
      document.body.dataset.screen = next;
      this.els.mainGroup.hidden = next !== 'main';
      this.els.stageScreen.hidden = next !== 'stage';
      this.els.battleScreen.hidden = next !== 'battle';
      if (next === 'stage') {
        this.renderStages();
      }
      if (next === 'battle') {
        this.renderBattle();
        requestAnimationFrame(() => this.renderBoard());
      }
    }

    bindEvents() {
      const { battleBack, startBtn, stageBack, leaveContinue, leaveStage, resultPrimary, resultSecondary, nextBtn, localeSelect } = this.els;
      startBtn?.addEventListener('click', () => {
        this.stage = clamp(this.save.unlocked - 1, 0, this.stageCount - 1);
        this.setScreen('stage');
      });
      stageBack?.addEventListener('click', () => this.setScreen('main'));
      battleBack?.addEventListener('click', () => {
        if (!this.run || this.run.end) return this.setScreen('stage');
        if (this.els.leaveModal) {
          this.els.leaveModal.hidden = false;
          return;
        }
        this.setScreen('stage');
      });
      leaveContinue?.addEventListener('click', () => {
        if (this.els.leaveModal) this.els.leaveModal.hidden = true;
      });
      leaveStage?.addEventListener('click', () => {
        if (this.els.leaveModal) this.els.leaveModal.hidden = true;
        this.stopRun();
        this.setScreen('stage');
      });
      resultPrimary?.addEventListener('click', () => {
        this.startBattle(this.stage);
      });
      resultSecondary?.addEventListener('click', () => {
        this.setScreen('stage');
      });
      nextBtn?.addEventListener('click', () => {
        this.startBattle(Math.min(this.stageCount - 1, this.stage + 1));
      });
      localeSelect?.addEventListener('change', () => {
        const value = localeSelect.value;
        this.locale = value;
      });

      this.els.board?.addEventListener('pointerdown', (event) => {
        const idx = event.target?.dataset?.index;
        if (idx === undefined) return;
        this.handleTap(Number(idx));
      });

      this.els.board?.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp' && this.config.handleMove) {
          this.config.handleMove(this, { dir: 'up' });
        }
        if (event.key === 'ArrowDown' && this.config.handleMove) {
          this.config.handleMove(this, { dir: 'down' });
        }
        if (event.key === 'ArrowLeft' && this.config.handleMove) {
          this.config.handleMove(this, { dir: 'left' });
        }
        if (event.key === 'ArrowRight' && this.config.handleMove) {
          this.config.handleMove(this, { dir: 'right' });
        }
      });

      const swipe = this.els.board?.querySelector?.('[data-swipe-controls]');
      if (swipe) {
        swipe.querySelectorAll('button[data-dir]').forEach((btn) => {
          btn.addEventListener('click', () => {
            this.config.handleMove?.(this, { dir: btn.dataset.dir });
          });
        });
      }

      document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && this.screen === 'battle' && this.els.resultModal?.hidden === false) {
          this.closeResult();
        }
      });
    }

    renderStages() {
      this.els.stageText && (this.els.stageText.textContent = `${t(this.locale, this.config.copy, 'stagePrefix')} ${Math.min(this.save.unlocked, this.stageCount)} / ${this.stageCount}`);
      if (!this.els.stageRail) return;
      const rail = this.els.stageRail;
      rail.innerHTML = '';
      for (let i = 0; i < this.stageCount; i++) {
        const locked = i + 1 > this.save.unlocked;
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `stage-card${locked ? ' locked' : ''}`;
        card.dataset.stage = String(i);
        card.disabled = locked;
        card.innerHTML = `<small>${t(this.locale, this.config.copy, 'chapterLabel', { n: i + 1 })}</small><strong>${t(this.locale, this.config.copy, 'stageTitle', { n: i + 1 })}</strong><span>${locked ? t(this.locale, this.config.copy, 'locked') : t(this.locale, this.config.copy, 'bestLabel', { n: this.save.best[i] || 0 })}</span>`;
        card.addEventListener('click', () => {
          if (locked) return;
          this.startBattle(i);
        });
        card.addEventListener('focus', () => {
          this.stage = i;
          rail.querySelectorAll('.stage-card').forEach((el) => el.classList.remove('is-centered'));
          card.classList.add('is-centered');
        });
        card.addEventListener('mouseenter', () => {
          rail.querySelectorAll('.stage-card').forEach((el) => el.classList.remove('is-centered'));
          card.classList.add('is-centered');
        });
        rail.append(card);
      }
      const centered = rail.querySelector(`[data-stage="${clamp(this.save.unlocked - 1, 0, this.stageCount - 1)}"]`);
      centered?.scrollIntoView?.({ inline: 'center', block: 'nearest' });
      centered?.classList.add('is-centered');
      if (this.els.stageSummary) {
        const totalBest = Object.values(this.save.best || {}).reduce((acc, value) => acc + Number(value || 0), 0);
        this.els.stageSummary.textContent = `${Math.min(this.save.unlocked, this.stageCount)} / ${this.stageCount} · ${totalBest} ${t(this.locale, this.config.copy, "bestTotal")}`;
      }
    }

    renderBattle() {
      if (this.els.battleTitle) this.els.battleTitle.textContent = `${t(this.locale, this.config.copy, 'stagePrefix')} ${this.stage + 1}`;
      this.renderHud();
      this.renderBoard();
      if (this.els.status) this.els.status.textContent = t(this.locale, this.config.copy, 'ready');
    }

    renderHud() {
      if (!this.run) return;
      if (!this.els.hudTop) return;
      this.els.hudTop.textContent = `${t(this.locale, this.config.copy, 'moves')} ${this.run.moves || 0}${this.run.movesLimit ? ` / ${this.run.movesLimit}` : ''} �P ${t(this.locale, this.config.copy, 'score')} ${this.run.score || 0}`;
    }

    renderBoard() {
      if (!this.run) return;
      const { board, width, height } = this.run;
      const el = this.els.board;
      if (!el) return;
      el.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
      el.style.gridTemplateRows = `repeat(${height}, 1fr)`;
      el.innerHTML = '';
      for (let i = 0; i < board.length; i++) {
        const node = document.createElement('button');
        node.type = 'button';
        node.className = 'cell';
        node.dataset.index = String(i);
        node.style.gridRow = `${Math.floor(i / width) + 1}`;
        node.style.gridColumn = `${(i % width) + 1}`;
        this.config.renderCell(this, node, i);
        node.setAttribute('aria-label', this.cellLabel(i));
        el.appendChild(node);
      }
      if (typeof this.config.renderControls === 'function') {
        this.config.renderControls(this);
      }
    }

    cellLabel(i) {
      const { width } = this.run;
      return `${t(this.locale, this.config.copy, 'cell')} ${(Math.floor(i / width) + 1)}-${(i % width) + 1}`;
    }

    updateStatus(text) {
      if (!this.els.status) return;
      this.els.status.textContent = text;
    }

    handleTap(index) {
      if (!this.run || this.run.end || this.els.resultModal?.hidden === false) return;
      const out = this.config.handleTap?.(this, index);
      this.renderHud();
      if (out?.status) this.updateStatus(out.status);
      if (out?.updated) this.renderBoard();
      if (out?.win) this.finish(true);
      if (out?.lose) this.finish(false);
      if (this.config.onAfterTap) this.config.onAfterTap(this, out);
    }

    startBattle(index) {
      this.stopRun();
      this.stage = clamp(index, 0, this.stageCount - 1);
      this.run = this.config.createRun(this.stage);
      this.run.stage = this.stage;
      this.run.score = Number(this.run.score || 0);
      this.setScreen('battle');
      this.renderBattle();
      this.run.startTime = performance.now();
      this.els.leaveModal && (this.els.leaveModal.hidden = true);
      this.els.resultModal && (this.els.resultModal.hidden = true);
      if (this.config.onStart) this.config.onStart(this);
      this.updateStatus(t(this.locale, this.config.copy, 'ready'));
    }

    stopRun() {
      if (!this.run) return;
      this.run.end = true;
      this.run = null;
    }

    finish(win) {
      if (!this.run) return;
      const score = Number(this.run.score || 0) + (win ? 20 : 0) + (this.run.moves ? Math.floor((1 / Math.max(1, this.run.moves)) * 5) : 0);
      const reason = win ? t(this.locale, this.config.copy, 'winReason', { n: this.stage + 1 }) : t(this.locale, this.config.copy, 'loseReason', { n: this.stage + 1 });
      this.run.end = true;
      if (win) {
        const prev = this.save.best[this.stage] ?? 0;
        if (!prev || score > prev) this.save.best[this.stage] = score;
        this.save.unlocked = Math.max(this.save.unlocked, this.stage + 2);
        this.save.score += score;
        if (this.stage + 1 < this.stageCount) this.save.unlocked = Math.min(this.save.unlocked, this.stageCount);
      }
      this.persist();
      if (this.els.resultModal) {
        this.els.resultTitle.textContent = win ? t(this.locale, this.config.copy, 'win') : t(this.locale, this.config.copy, 'lose');
        this.els.resultText.textContent = `${reason} | ${t(this.locale, this.config.copy, 'stageScore', { n: score })}`;
        if (this.els.nextBtn) this.els.nextBtn.hidden = !win || this.stage + 1 >= this.stageCount;
        if (this.els.resultSecondary) this.els.resultSecondary.textContent = t(this.locale, this.config.copy, 'close');
        if (this.els.resultPrimary) this.els.resultPrimary.textContent = t(this.locale, this.config.copy, win ? 'replay' : 'retry');
        this.els.resultPrimary.onclick = () => {
          if (win && this.stage + 1 < this.stageCount) {
            this.startBattle(this.stage + 1);
          } else {
            this.startBattle(this.stage);
          }
        };
        this.els.resultModal.hidden = false;
      }
      this.updateStatus(win ? t(this.locale, this.config.copy, 'resultWin') : t(this.locale, this.config.copy, 'resultLose'));
    }

    closeResult() {
      if (!this.els.resultModal) return;
      this.els.resultModal.hidden = true;
      this.setScreen('stage');
    }

    focusLocale() {
      const { localeSelect } = this.els;
      if (!localeSelect) return;
      requestAnimationFrame(() => localeSelect.focus({ preventScroll: true }));
    }
  }

  window.createMiniPuzzleGame = function (config) {
    if (!config || !config.gameId || !config.copy) {
      throw new Error('new-puzzle-game requires gameId and copy table');
    }
    window.__activeMiniPuzzleGame = new MiniPuzzleGame(config);
    return window.__activeMiniPuzzleGame;
  };
})();

