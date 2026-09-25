(() => {
  'use strict';

  if (window.__wpKiteKeeperI7CompatInit) return;
  window.__wpKiteKeeperI7CompatInit = true;

  const GAME_ID = 'animal-kite-keeper';
  const READY_EVENT = 'weightplay:kite-keeper-i7-ready';
  const signalReady = () => {
    if (window.__wpKiteKeeperI7CompatReady) return;
    window.__wpKiteKeeperI7CompatReady = true;
    window.dispatchEvent(new Event(READY_EVENT));
  };

  const UI = {
    en: { start:'Start Game', stages:'Stages', next:'Next Stage', replay:'Replay', leaveTitle:'Leave this route?', leaveCopy:'Current kite-path progress will be discarded.', continue:'Continue playing', leave:'Return to Stages' },
    'zh-Hant': { start:'開始遊戲', stages:'關卡', next:'下一關', replay:'重新挑戰', leaveTitle:'要離開這條路線嗎？', leaveCopy:'目前這條風箏路線的暫時進度將會取消。', continue:'繼續遊戲', leave:'返回關卡' },
    'zh-Hans': { start:'开始游戏', stages:'关卡', next:'下一关', replay:'重新挑战', leaveTitle:'要离开这条路线吗？', leaveCopy:'当前这条风筝路线的临时进度将会取消。', continue:'继续游戏', leave:'返回关卡' },
    ja: { start:'ゲーム開始', stages:'ステージ', next:'次のステージ', replay:'もう一度', leaveTitle:'このルートを離れますか？', leaveCopy:'このカイトルートの一時的な進行は破棄されます。', continue:'プレイを続ける', leave:'ステージへ戻る' },
    ko: { start:'게임 시작', stages:'스테이지', next:'다음 스테이지', replay:'다시 하기', leaveTitle:'이 경로를 나갈까요?', leaveCopy:'이 연 경로의 임시 진행 상황이 사라집니다.', continue:'계속 플레이', leave:'스테이지로 돌아가기' },
    es: { start:'Iniciar juego', stages:'Niveles', next:'Siguiente nivel', replay:'Repetir', leaveTitle:'¿Salir de esta ruta?', leaveCopy:'Se descartará el progreso temporal de esta ruta de cometa.', continue:'Seguir jugando', leave:'Volver a niveles' },
    'pt-BR': { start:'Iniciar jogo', stages:'Fases', next:'Próxima fase', replay:'Jogar novamente', leaveTitle:'Sair desta rota?', leaveCopy:'O progresso temporário desta rota da pipa será descartado.', continue:'Continuar jogando', leave:'Voltar às fases' },
    fr: { start:'Commencer', stages:'Niveaux', next:'Niveau suivant', replay:'Rejouer', leaveTitle:'Quitter cette route ?', leaveCopy:'La progression temporaire de cette route de cerf-volant sera perdue.', continue:'Continuer à jouer', leave:'Retour aux niveaux' },
    de: { start:'Spiel starten', stages:'Level', next:'Nächstes Level', replay:'Nochmal', leaveTitle:'Diese Route verlassen?', leaveCopy:'Der temporäre Fortschritt dieser Drachenroute wird verworfen.', continue:'Weiterspielen', leave:'Zurück zu den Leveln' },
    it: { start:'Inizia gioco', stages:'Livelli', next:'Livello successivo', replay:'Rigioca', leaveTitle:'Uscire da questo percorso?', leaveCopy:'I progressi temporanei di questa rotta dell’aquilone verranno persi.', continue:'Continua a giocare', leave:'Torna ai livelli' },
    ru: { start:'Начать игру', stages:'Уровни', next:'Следующий уровень', replay:'Повторить', leaveTitle:'Покинуть маршрут?', leaveCopy:'Временный прогресс этого маршрута будет сброшен.', continue:'Продолжить игру', leave:'К уровням' },
    hi: { start:'खेल शुरू करें', stages:'स्तर', next:'अगला स्तर', replay:'फिर खेलें', leaveTitle:'यह मार्ग छोड़ें?', leaveCopy:'इस पतंग मार्ग की अस्थायी प्रगति मिट जाएगी।', continue:'खेल जारी रखें', leave:'स्तरों पर लौटें' },
    ar: { start:'ابدأ اللعبة', stages:'المراحل', next:'المرحلة التالية', replay:'إعادة اللعب', leaveTitle:'مغادرة هذا المسار؟', leaveCopy:'سيتم إلغاء التقدم المؤقت في مسار الطائرة الورقية هذا.', continue:'متابعة اللعب', leave:'العودة إلى المراحل' }
  };

  const $ = (id) => document.getElementById(id);

  function init() {
    if (document.body?.dataset.wpGameId !== GAME_ID) { signalReady(); return; }

    const stage = $('stageScreen');
    const battle = $('battleScreen');
    const result = $('resultScreen');
    const stageList = $('stageList');
    const battleBack = $('battleBack');
    const localeSelect = $('localeSelect');
    if (!stage || !battle || !result || !stageList || !battleBack) { signalReady(); return; }

    let dirty = false;
    let allowLeave = false;
    let leaveOpen = false;
    let lastFocus = null;
    let resultWasOpen = false;
    let pendingResult = false;
    let suppressStaleSettlement = false;
    const solvedRouteStorageKey = 'weightplay-kite-keeper-solved-v1';
    function readSolvedRoutes() {
      try {
        const stored = JSON.parse(localStorage.getItem(solvedRouteStorageKey) || '[]');
        return new Set(Array.isArray(stored) ? stored.filter((id) => Number.isInteger(id) && id >= 1 && id <= 30) : []);
      } catch { return new Set(); }
    }
    function saveSolvedRoutes() {
      try { localStorage.setItem(solvedRouteStorageKey, JSON.stringify([...solvedRoutes].sort((a, b) => a - b))); } catch {}
    }
    const solvedRoutes = readSolvedRoutes();
    const leaveInerted = new Set();

    const locale = () => UI[localeSelect?.value] ? localeSelect.value : 'en';
    const ui = () => UI[locale()];

    function ensureStageStructure() {
      stage.setAttribute('data-wp-standard-stage-screen', '');
      stage.setAttribute('data-wp-stage-art', 'assets/animal-kite-keeper-cover-block-v1.webp');
      stage.style.setProperty('--wp-stage-art', "url('assets/animal-kite-keeper-cover-block-v1.webp')");

      let workspace = stage.querySelector('.wp-i7-stage-workspace');
      if (!workspace) {
        workspace = document.createElement('div');
        workspace.className = 'wp-i7-stage-workspace';
        stageList.parentNode.insertBefore(workspace, stageList);
        workspace.appendChild(stageList);
      }

      let nav = stage.querySelector('.wp-i7-stage-nav');
      if (!nav) {
        nav = document.createElement('nav');
        nav.className = 'wp-i7-stage-nav';
        nav.setAttribute('aria-label', 'Stage navigation');
        nav.innerHTML = '<span aria-hidden="true"></span><button type="button" class="wp-i7-stage-tab" aria-current="page"></button><span aria-hidden="true"></span>';
        nav.querySelector('button').addEventListener('click', () => {
          stageList.querySelector('.stage-card[aria-selected="true"]')?.focus({ preventScroll: true });
        });
        stage.appendChild(nav);
      }
    }

    function ensureBattleStructure() {
      battle.setAttribute('data-wp-logical-battle-canvas', '');
      let workspace = battle.querySelector('.wp-i7-battle-workspace');
      if (!workspace) {
        workspace = document.createElement('div');
        workspace.className = 'wp-i7-battle-workspace';
        const prompt = $('prompt');
        battle.insertBefore(workspace, prompt || null);
        [prompt, battle.querySelector('.flight-card'), battle.querySelector('.choice-card'), battle.querySelector('.battle-actions'), $('status')]
          .filter(Boolean)
          .forEach((node) => workspace.appendChild(node));
      }
      if (result.parentElement !== battle) battle.appendChild(result);
      result.setAttribute('data-wp-battle-substate', 'result');
      result.setAttribute('role', 'dialog');
      result.setAttribute('aria-modal', 'true');
    }

    function currentStageNumber() {
      const match = String($('progressPill')?.textContent || '').match(/(\d+)\s*\/\s*(\d+)/);
      return match ? Number(match[1]) : 0;
    }

    function currentStageTotal() {
      const match = String($('progressPill')?.textContent || '').match(/(\d+)\s*\/\s*(\d+)/);
      return match ? Number(match[2]) : stageList.querySelectorAll('.stage-card').length;
    }

    function ensureResultActions() {
      const actions = result.querySelector('.result-actions');
      const stages = $('resultMapBtn');
      const next = $('nextBtn');
      const home = $('homeBtn');
      if (!actions || !stages || !next) return;
      if (home) {
        home.hidden = true;
        home.disabled = true;
        home.tabIndex = -1;
        home.setAttribute('aria-hidden', 'true');
      }

      let replay = $('wpKiteReplayBtn');
      if (!replay) {
        replay = document.createElement('button');
        replay.id = 'wpKiteReplayBtn';
        replay.type = 'button';
        replay.className = 'secondary';
        replay.addEventListener('click', () => {
          const stageNumber = currentStageNumber();
          dirty = false;
          suppressStaleSettlement = false;
          stages.click();
          requestAnimationFrame(() => {
            const cards = [...stageList.querySelectorAll('.stage-card')];
            cards[Math.max(0, stageNumber - 1)]?.click();
          });
        });
      }
      actions.append(stages, next, replay);
    }

    function updateProgress() {
      const node = $('mainProgress');
      if (!node) return;
      const l = locale();
      const n = solvedRoutes.size;
      const labels = {
        en:`${n} / 30 routes`, 'zh-Hant':`${n} / 30 條路線`, 'zh-Hans':`${n} / 30 条路线`, ja:`${n} / 30 ルート`, ko:`${n} / 30개 경로`,
        es:`${n} / 30 rutas`, 'pt-BR':`${n} / 30 rotas`, fr:`${n} / 30 routes`, de:`${n} / 30 Routen`, it:`${n} / 30 rotte`,
        ru:`${n} / 30 маршрутов`, hi:`${n} / 30 मार्ग`, ar:`${n} / 30 مسارًا`
      };
      node.textContent = labels[l] || labels.en;
    }

    function normalizeLabels() {
      const t = ui();
      const start = $('startBtn');
      if (start) start.textContent = t.start;
      const stages = $('resultMapBtn');
      if (stages) stages.textContent = t.stages;
      const next = $('nextBtn');
      if (next) next.textContent = t.next;
      const replay = $('wpKiteReplayBtn');
      if (replay) replay.textContent = t.replay;
      stage.querySelector('.wp-i7-stage-tab')?.replaceChildren(document.createTextNode(t.stages));
      const dialog = $('wpKiteLeaveDialog');
      if (dialog) {
        const routeName = String($('routeTitle')?.textContent || '').trim();
        dialog.querySelector('[data-leave-title]').textContent = t.leaveTitle;
        dialog.querySelector('[data-leave-copy]').textContent = routeName ? `${routeName} — ${t.leaveCopy}` : t.leaveCopy;
        dialog.querySelector('[data-leave-continue]').textContent = t.continue;
        dialog.querySelector('[data-leave-confirm]').textContent = t.leave;
      }
      updateProgress();
    }

    function recommendHighestAvailableStage() {
      if (stage.hidden) return;
      const cards = [...stageList.querySelectorAll('.stage-card')]
        .filter((card) => !card.disabled && card.getAttribute('aria-disabled') !== 'true');
      const target = stageList.querySelector('.stage-card[aria-selected="true"]:not([disabled])') || cards[0];
      if (!target) return;
      target.scrollIntoView({ block:'nearest', inline:'center', behavior:'auto' });
    }

    function queueStageRecommendation() {
      queueMicrotask(recommendHighestAvailableStage);
    }

    function setResultState() {
      const open = !result.hidden;

      if (open && suppressStaleSettlement) {
        pendingResult = false;
        $('resultMapBtn')?.click();
        return;
      }

      if (open && leaveOpen) {
        pendingResult = true;
        result.hidden = true;
        battle.hidden = false;
        return;
      }

      if (open) {
        battle.hidden = false;
        battle.classList.add('is-result');
        battle.dataset.wpBattleSubstate = 'result';
        const workspace = battle.querySelector('.wp-i7-battle-workspace');
        const heading = battle.querySelector('.battle-heading');
        if (workspace) workspace.inert = true;
        if (heading) heading.inert = true;
        if (!resultWasOpen) {
          const n = currentStageNumber();
          if (n && !solvedRoutes.has(n)) {
            solvedRoutes.add(n);
            saveSolvedRoutes();
          }
        }
        const next = $('nextBtn');
        if (next) {
          const terminal = next.hidden || currentStageNumber() >= currentStageTotal();
          next.hidden = false;
          next.disabled = terminal;
          next.setAttribute('aria-disabled', String(terminal));
        }
        normalizeLabels();
      } else {
        battle.classList.remove('is-result');
        delete battle.dataset.wpBattleSubstate;
        const workspace = battle.querySelector('.wp-i7-battle-workspace');
        const heading = battle.querySelector('.battle-heading');
        if (workspace && !leaveOpen) workspace.inert = false;
        if (heading && !leaveOpen) heading.inert = false;
      }
      resultWasOpen = open;
    }

    function makeLeaveDialog() {
      let dialog = $('wpKiteLeaveDialog');
      if (dialog) return dialog;
      dialog = document.createElement('section');
      dialog.id = 'wpKiteLeaveDialog';
      dialog.className = 'wp-i7-leave-dialog';
      dialog.hidden = true;
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-labelledby', 'wpKiteLeaveTitle');
      dialog.innerHTML = '<div class="wp-i7-leave-card"><h2 id="wpKiteLeaveTitle" data-leave-title></h2><p data-leave-copy></p><div class="wp-i7-leave-actions"><button type="button" class="primary" data-leave-continue></button><button type="button" class="secondary" data-leave-confirm></button></div></div>';
      battle.appendChild(dialog);

      dialog.querySelector('[data-leave-continue]').addEventListener('click', () => closeLeave(true));
      dialog.querySelector('[data-leave-confirm]').addEventListener('click', () => {
        dirty = false;
        pendingResult = false;
        suppressStaleSettlement = true;
        allowLeave = true;
        closeLeave(false);
        battleBack.click();
        allowLeave = false;
      });
      dialog.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeLeave(true);
          return;
        }
        if (event.key !== 'Tab') return;
        const focusables = [...dialog.querySelectorAll('button:not([disabled])')];
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
      return dialog;
    }

    function openLeave() {
      if (leaveOpen) return;
      const dialog = makeLeaveDialog();
      leaveOpen = true;
      lastFocus = document.activeElement;
      normalizeLabels();
      leaveInerted.clear();
      [...battle.children].forEach((child) => {
        if (child === dialog || child.inert) return;
        child.inert = true;
        leaveInerted.add(child);
      });
      dialog.hidden = false;
      dialog.querySelector('[data-leave-continue]')?.focus();
    }

    function closeLeave(restoreFocus) {
      const dialog = $('wpKiteLeaveDialog');
      if (!dialog || !leaveOpen) return;
      dialog.hidden = true;
      leaveOpen = false;
      leaveInerted.forEach((node) => { node.inert = false; });
      leaveInerted.clear();
      if (restoreFocus && lastFocus instanceof HTMLElement && document.contains(lastFocus)) lastFocus.focus();
      lastFocus = null;

      if (restoreFocus && pendingResult) {
        pendingResult = false;
        requestAnimationFrame(() => {
          if (suppressStaleSettlement || battle.hidden) return;
          result.hidden = false;
          setResultState();
        });
      }
    }

    function bindFlowGuards() {
      stageList.addEventListener('click', (event) => {
        if (!event.target.closest('.stage-card')) return;
        dirty = false;
        pendingResult = false;
        suppressStaleSettlement = false;
      });
      $('windGrid')?.addEventListener('click', (event) => {
        if (event.target.closest('.wind-card:not(:disabled)')) dirty = true;
      });
      $('resetBtn')?.addEventListener('click', () => { dirty = false; });
      $('nextBtn')?.addEventListener('click', () => {
        dirty = false;
        pendingResult = false;
        suppressStaleSettlement = false;
      });

      [$('startBtn'), $('mapBtn'), $('resultMapBtn')].filter(Boolean).forEach((button) => {
        button.addEventListener('click', queueStageRecommendation);
      });
      battleBack.addEventListener('click', queueStageRecommendation);

      battleBack.addEventListener('click', (event) => {
        if (allowLeave || resultWasOpen || !dirty) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        openLeave();
      }, true);
    }

    function retirePrivateMainChrome() {
      const mapBtn = $('mapBtn');
      if (mapBtn) {
        mapBtn.hidden = true;
        mapBtn.disabled = true;
        mapBtn.tabIndex = -1;
        mapBtn.setAttribute('aria-hidden', 'true');
      }
      const best = $('best');
      if (best) best.setAttribute('aria-hidden', 'true');
    }

    ensureStageStructure();
    ensureBattleStructure();
    ensureResultActions();
    retirePrivateMainChrome();
    makeLeaveDialog();
    bindFlowGuards();
    normalizeLabels();
    setResultState();

    localeSelect?.addEventListener('change', () => queueMicrotask(normalizeLabels));
    new MutationObserver(setResultState).observe(result, { attributes:true, attributeFilter:['hidden'] });
    document.documentElement.dataset.wpKiteKeeperI7Cleanup = 'true';
    signalReady();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
