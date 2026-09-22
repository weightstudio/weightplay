const cleanupHref = new URL('./interface-7-cleanup.css?v=20260922-grove-dominoes-i7-cleanup2', import.meta.url).href;
if (![...document.querySelectorAll('link[rel="stylesheet"]')].some((link) => link.href === cleanupHref)) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cleanupHref;
  link.dataset.wpGroveDominoesInterface7Cleanup = 'true';
  document.head.append(link);
}

const START_COPY = Object.freeze({
  en: 'Start Game',
  'zh-Hant': '開始遊戲',
  'zh-Hans': '开始游戏',
  ja: 'ゲーム開始',
  ko: '게임 시작',
  es: 'Iniciar juego',
  'pt-BR': 'Iniciar jogo',
  fr: 'Commencer',
  de: 'Spiel starten',
  it: 'Inizia gioco',
  ru: 'Начать игру',
  hi: 'खेल शुरू करें',
  ar: 'ابدأ اللعبة',
});

const LEAVE_COPY = Object.freeze({
  en: ['Leave this stage?', 'Your current attempt will be discarded. Saved progress stays.', 'Continue'],
  'zh-Hant': ['離開目前關卡？', '目前這次挑戰的進度會捨棄，已儲存的進度會保留。', '繼續遊戲'],
  'zh-Hans': ['离开当前关卡？', '本次挑战进度会被放弃，已保存的进度会保留。', '继续游戏'],
  ja: ['このステージを離れますか？', '現在の挑戦内容は破棄されます。保存済みの進行状況は残ります。', '続ける'],
  ko: ['현재 스테이지를 나갈까요?', '이번 도전의 진행은 사라지지만 저장된 진행 상황은 유지됩니다.', '계속하기'],
  es: ['¿Salir de esta fase?', 'Se descartará el intento actual. El progreso guardado se conserva.', 'Continuar'],
  'pt-BR': ['Sair desta fase?', 'A tentativa atual será descartada. O progresso salvo será mantido.', 'Continuar'],
  fr: ['Quitter ce niveau ?', 'La tentative en cours sera abandonnée. La progression enregistrée reste intacte.', 'Continuer'],
  de: ['Diese Stufe verlassen?', 'Der aktuelle Versuch wird verworfen. Gespeicherter Fortschritt bleibt erhalten.', 'Weiterspielen'],
  it: ['Uscire dal livello?', 'Il tentativo attuale verrà annullato. I progressi salvati resteranno disponibili.', 'Continua'],
  ru: ['Выйти с уровня?', 'Текущая попытка будет сброшена. Сохранённый прогресс останется.', 'Продолжить'],
  hi: ['यह स्तर छोड़ें?', 'मौजूदा प्रयास रद्द हो जाएगा। सहेजी गई प्रगति बनी रहेगी।', 'जारी रखें'],
  ar: ['مغادرة هذه المرحلة؟', 'ستُلغى المحاولة الحالية، وسيبقى التقدم المحفوظ.', 'متابعة'],
});

function localeCode() {
  const raw = document.documentElement.lang || 'en';
  if (/^zh-(tw|hant)/i.test(raw)) return 'zh-Hant';
  if (/^zh/i.test(raw)) return 'zh-Hans';
  if (/^pt/i.test(raw)) return 'pt-BR';
  return START_COPY[raw] ? raw : raw.split('-')[0];
}

function syncMainStart() {
  const start = document.getElementById('startBtn');
  if (!start) return;
  // Interface 7 owns the generic primary ingress label. Removing data-copy
  // prevents the legacy game locale pass from restoring "Start the chain".
  start.removeAttribute('data-copy');
  start.textContent = START_COPY[localeCode()] || START_COPY.en;
}

syncMainStart();
// The importing game applies its route locale after this module evaluates.
// Re-sync once the current script task completes so the first interactive
// Main frame already owns the correct localized generic Start Game label.
setTimeout(syncMainStart, 0);
window.addEventListener('wonder:locale-change', () => queueMicrotask(syncMainStart));
window.addEventListener('weightplay:shell-sync', () => queueMicrotask(syncMainStart));
document.addEventListener('change', (event) => {
  if (event.target?.id === 'localeSelect') queueMicrotask(syncMainStart);
});

function normalizeNextAvailability() {
  const next = document.getElementById('nextStage');
  if (!next) return false;
  const test = window.GROVE_CHAIN_TEST;
  const unavailable = Array.isArray(test?.rounds) && test?.state
    ? Number(test.state.roundIndex) >= test.rounds.length - 1
    : next.hidden;
  next.hidden = false;
  next.disabled = unavailable;
  next.setAttribute('aria-disabled', String(unavailable));
  return true;
}

function normalizeResultActions() {
  const actions = document.querySelector('#resultView .result-actions');
  const stages = document.getElementById('homeBtn');
  const next = document.getElementById('nextStage');
  const replay = document.getElementById('replayBtn');
  if (!actions || !stages || !next || !replay) return false;
  // Interface 7 Result order for Stage games: Stages / Next Stage / Replay.
  actions.append(stages, next, replay);
  normalizeNextAvailability();
  return true;
}

if (!normalizeResultActions()) {
  const resultActions = document.querySelector('#resultView .result-actions');
  if (resultActions) {
    const observer = new MutationObserver(() => {
      if (!document.getElementById('nextStage')) return;
      observer.disconnect();
      normalizeResultActions();
      watchNextAvailability();
    });
    observer.observe(resultActions, { childList: true });
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
  }
}

let nextAvailabilityObserver = null;
function watchNextAvailability() {
  if (nextAvailabilityObserver) return;
  const next = document.getElementById('nextStage');
  if (!next) return;
  nextAvailabilityObserver = new MutationObserver(() => normalizeNextAvailability());
  nextAvailabilityObserver.observe(next, { attributes: true, attributeFilter: ['hidden'] });
  window.addEventListener('pagehide', () => nextAvailabilityObserver?.disconnect(), { once: true });
}
watchNextAvailability();

let bypassLeaveGuard = false;
let leaveDialog = null;
let returnFocus = null;

function localizedLeaveCopy() {
  return LEAVE_COPY[localeCode()] || LEAVE_COPY.en;
}

function leaveLifecycle() {
  return window.GROVE_CHAIN_LEAVE_LIFECYCLE || null;
}

function closeLeaveDialog({ focus = true, resume = true } = {}) {
  if (!leaveDialog || leaveDialog.hidden) return;
  leaveDialog.hidden = true;
  const shell = document.querySelector('#battleView .logical-shell');
  if (shell) shell.inert = false;
  if (resume) leaveLifecycle()?.resume?.();
  if (focus && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  returnFocus = null;
}

function ensureLeaveDialog() {
  if (leaveDialog?.isConnected) return leaveDialog;
  const frame = document.querySelector('#battleView .grove-battle-frame')
    || document.querySelector('#battleView .battle-canvas');
  if (!frame) return null;

  leaveDialog = document.createElement('div');
  leaveDialog.className = 'grove-leave-dialog';
  leaveDialog.hidden = true;
  leaveDialog.setAttribute('role', 'dialog');
  leaveDialog.setAttribute('aria-modal', 'true');
  leaveDialog.setAttribute('aria-labelledby', 'groveLeaveTitle');
  leaveDialog.setAttribute('aria-describedby', 'groveLeaveBody');
  leaveDialog.innerHTML = '<div class="grove-leave-panel"><h2 id="groveLeaveTitle"></h2><p id="groveLeaveBody"></p><div class="grove-leave-actions"><button type="button" class="secondary-btn" data-leave-continue></button><button type="button" class="primary-btn" data-leave-confirm></button></div></div>';
  frame.append(leaveDialog);

  leaveDialog.querySelector('[data-leave-continue]').addEventListener('click', () => closeLeaveDialog());
  leaveDialog.querySelector('[data-leave-confirm]').addEventListener('click', () => {
    leaveLifecycle()?.discard?.();
    closeLeaveDialog({ focus: false, resume: false });
    const back = document.getElementById('battleBackBtn');
    if (!back) return;
    bypassLeaveGuard = true;
    try { back.click(); } finally { bypassLeaveGuard = false; }
  });
  return leaveDialog;
}

function openLeaveDialog(trigger) {
  const dialog = ensureLeaveDialog();
  if (!dialog) return false;
  const [title, body, continueLabel] = localizedLeaveCopy();
  dialog.querySelector('h2').textContent = title;
  dialog.querySelector('p').textContent = body;
  dialog.querySelector('[data-leave-continue]').textContent = continueLabel;
  dialog.querySelector('[data-leave-confirm]').textContent = document.getElementById('homeBtn')?.textContent || 'Stages';
  returnFocus = trigger;
  leaveLifecycle()?.pause?.();
  const shell = document.querySelector('#battleView .logical-shell');
  if (shell) shell.inert = true;
  dialog.hidden = false;
  dialog.querySelector('[data-leave-continue]').focus({ preventScroll: true });
  return true;
}

const battleBack = document.getElementById('battleBackBtn');
if (battleBack) {
  battleBack.addEventListener('click', (event) => {
    if (bypassLeaveGuard || document.body.dataset.screen !== 'battle') return;
    const picks = Number(window.GROVE_CHAIN_TEST?.state?.picks || 0);
    if (picks <= 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openLeaveDialog(battleBack);
  }, true);
}

document.addEventListener('keydown', (event) => {
  if (!leaveDialog || leaveDialog.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    closeLeaveDialog();
    return;
  }
  if (event.key !== 'Tab') return;
  const actions = [...leaveDialog.querySelectorAll('button:not([disabled])')];
  if (!actions.length) return;
  const first = actions[0];
  const last = actions[actions.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus({ preventScroll: true });
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  } else if (!leaveDialog.contains(document.activeElement)) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  }
}, true);

window.addEventListener('weightplay:shell-sync', () => {
  normalizeNextAvailability();
  if (document.body.dataset.screen !== 'battle') closeLeaveDialog({ focus: false, resume: false });
});
