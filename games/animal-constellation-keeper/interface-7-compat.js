(() => {
  "use strict";

  const GAME_ID = "animal-constellation-keeper";
  if (document.body?.dataset.wpGameId !== GAME_ID) return;

  const api = window.__ANIMAL_CONSTELLATION_KEEPER_TEST__;
  if (!api) return;

  const $ = (id) => document.getElementById(id);
  const locale = () => document.documentElement.lang || api.getState?.().locale || "en";
  const localeKey = () => {
    const value = locale().toLowerCase();
    if (value.startsWith("zh-hant") || value.startsWith("zh-tw")) return "zh-Hant";
    if (value.startsWith("zh")) return "zh-Hans";
    if (value.startsWith("pt")) return "pt-BR";
    return ["en", "ja", "ko", "es", "fr", "de", "it", "ru", "hi", "ar"].find((key) => value.startsWith(key.toLowerCase())) || "en";
  };

  const COPY = {
    en: { start: "Start Game", leaveTitle: "Leave this map?", leaveBody: "Your current constellation choice and checks for this map will be discarded.", stay: "Continue", leave: "Return to Stages", next: "Next Stage" },
    "zh-Hant": { start: "開始遊戲", leaveTitle: "要離開這張星圖嗎？", leaveBody: "目前的星座選擇與本關檢查進度將會放棄。", stay: "繼續遊戲", leave: "返回關卡", next: "下一關" },
    "zh-Hans": { start: "开始游戏", leaveTitle: "要离开这张星图吗？", leaveBody: "当前的星座选择与本关检查进度将会放弃。", stay: "继续游戏", leave: "返回关卡", next: "下一关" },
    ja: { start: "ゲーム開始", leaveTitle: "この星図を離れますか？", leaveBody: "現在の選択とこのマップでの確認回数は破棄されます。", stay: "続ける", leave: "ステージへ戻る", next: "次のステージ" },
    ko: { start: "게임 시작", leaveTitle: "이 별지도를 나갈까요?", leaveBody: "현재 선택과 이 맵의 확인 진행이 사라집니다.", stay: "계속하기", leave: "스테이지로", next: "다음 스테이지" },
    es: { start: "Iniciar juego", leaveTitle: "¿Salir de este mapa?", leaveBody: "Se descartarán tu elección actual y las comprobaciones de este mapa.", stay: "Continuar", leave: "Volver a niveles", next: "Siguiente nivel" },
    "pt-BR": { start: "Iniciar jogo", leaveTitle: "Sair deste mapa?", leaveBody: "Sua escolha atual e as verificações deste mapa serão descartadas.", stay: "Continuar", leave: "Voltar às fases", next: "Próxima fase" },
    fr: { start: "Commencer", leaveTitle: "Quitter cette carte ?", leaveBody: "Votre choix actuel et les vérifications de cette carte seront abandonnés.", stay: "Continuer", leave: "Retour aux niveaux", next: "Niveau suivant" },
    de: { start: "Spiel starten", leaveTitle: "Diese Sternkarte verlassen?", leaveBody: "Deine aktuelle Auswahl und Prüfungen dieser Karte werden verworfen.", stay: "Weiterspielen", leave: "Zu den Stufen", next: "Nächste Stufe" },
    it: { start: "Avvia gioco", leaveTitle: "Lasciare questa mappa?", leaveBody: "La scelta attuale e i controlli di questa mappa verranno annullati.", stay: "Continua", leave: "Torna ai livelli", next: "Livello successivo" },
    ru: { start: "Начать игру", leaveTitle: "Покинуть эту карту?", leaveBody: "Текущий выбор и проверки на этой карте будут сброшены.", stay: "Продолжить", leave: "К уровням", next: "Следующий уровень" },
    hi: { start: "गेम शुरू करें", leaveTitle: "इस तारामंडल से बाहर जाएँ?", leaveBody: "इस मानचित्र की मौजूदा पसंद और जाँच प्रगति हट जाएगी।", stay: "जारी रखें", leave: "स्तरों पर लौटें", next: "अगला स्तर" },
    ar: { start: "ابدأ اللعبة", leaveTitle: "هل تريد مغادرة خريطة النجوم؟", leaveBody: "سيتم تجاهل اختيارك الحالي وعمليات التحقق في هذه الخريطة.", stay: "متابعة", leave: "العودة إلى المراحل", next: "المرحلة التالية" },
  };
  const copy = () => COPY[localeKey()] || COPY.en;

  function syncMain() {
    const start = $("startBtn");
    if (start) {
      start.removeAttribute("data-copy");
      start.dataset.wpMainStart = "true";
      start.textContent = copy().start;
    }
    const mapButton = $("mapBtn");
    if (mapButton) {
      mapButton.hidden = true;
      mapButton.tabIndex = -1;
      mapButton.setAttribute("aria-hidden", "true");
    }
  }

  function installStageWorkspace() {
    const stage = $("stageScreen");
    const rail = $("stageList");
    if (!stage || !rail) return;

    if (!rail.closest(".ck-stage-workspace")) {
      const workspace = document.createElement("div");
      workspace.className = "ck-stage-workspace";
      workspace.dataset.wpStageWorkspace = "";
      rail.before(workspace);
      workspace.append(rail);
    }

    // Stage card indexing, current-card state, drag/snap and recycling are all
    // owned by the shared data-backed WeightPlayStageV6 controller. Do not
    // re-annotate pool nodes here: recycled DOM must preserve logical indices.
    rail.dataset.wpStageV6Total = String(api.maps.length);
    rail.dataset.wpStageV6PoolSize = "9";
  }

  function moveBattleControls() {
    const battle = $("battleScreen");
    const content = battle?.querySelector(".battle-content");
    const legacyHeader = battle?.querySelector(".panel-head");
    if (!battle || !content || !legacyHeader) return;

    const context = legacyHeader.querySelector(":scope > div:not(.battle-header-tools)");
    if (context && !context.classList.contains("ck-battle-context")) {
      context.classList.add("ck-battle-context");
      content.prepend(context);
    }

    const help = $("battleSettingsBtn");
    const actions = battle.querySelector(".battle-actions");
    if (help && actions && !help.classList.contains("ck-battle-help")) {
      help.className = "secondary-btn ck-battle-help";
      help.removeAttribute("data-wp-battle-utility");
      help.textContent = "?";
      actions.append(help);
    }
  }

  let resultOpen = false;
  let leavingResult = false;
  function installResultSubstate() {
    const result = $("resultScreen");
    const battle = $("battleScreen");
    const canvas = battle?.querySelector(".battle-canvas");
    if (!result || !battle || !canvas) return;

    result.removeAttribute("data-screen");
    result.dataset.wpBattleSubstate = "result";
    result.setAttribute("role", "region");
    result.hidden = true;
    canvas.append(result);

    const actions = result.querySelector(".result-actions");
    const stages = $("resultMapBtn");
    const next = $("resultPrimaryBtn");
    const replay = $("resultReplayBtn");
    const home = $("resultHomeBtn");
    if (actions && stages && next && replay) actions.append(stages, next, replay, ...(home ? [home] : []));
    if (home) home.hidden = true;

    const battleContent = battle.querySelector(".battle-content");
    const setCovered = (covered) => {
      if (battleContent) battleContent.inert = covered;
      const sharedHeader = $("wp-shared-battle-header");
      if (sharedHeader) sharedHeader.inert = covered;
      battle.toggleAttribute("data-wp-result-open", covered);
    };

    const syncResultActions = () => {
      const state = api.getState();
      const complete = state.completed >= api.maps.length;
      if (stages) {
        stages.hidden = false;
        stages.removeAttribute("aria-hidden");
      }
      if (next) {
        next.disabled = complete;
        next.textContent = copy().next;
        next.setAttribute("aria-disabled", String(complete));
      }
      if (home) home.hidden = true;
    };

    const closeResult = () => {
      if (!resultOpen) return;
      resultOpen = false;
      result.hidden = true;
      setCovered(false);
    };

    const openResult = () => {
      resultOpen = true;
      leavingResult = false;
      battle.hidden = false;
      result.hidden = false;
      setCovered(true);
      syncResultActions();
      document.body.dataset.screen = "battle";
      requestAnimationFrame(() => stages?.focus({ preventScroll: true }));
    };

    [stages, next, replay, home].filter(Boolean).forEach((button) => {
      button.addEventListener("click", () => {
        leavingResult = true;
        queueMicrotask(() => {
          const state = api.getState();
          if (state.screen !== "result") closeResult();
          leavingResult = false;
        });
      }, true);
    });

    const observer = new MutationObserver(() => {
      const state = api.getState();
      if (state.screen === "result") {
        if (!resultOpen) openResult();
        else syncResultActions();
        return;
      }
      if (resultOpen && (leavingResult || state.screen !== "result")) closeResult();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });

    window.addEventListener("wonder:locale-change", () => queueMicrotask(syncResultActions));
    $("localeSelect")?.addEventListener("change", () => queueMicrotask(syncResultActions));
  }

  function installLeaveGuard() {
    const battle = $("battleScreen");
    const canvas = battle?.querySelector(".battle-canvas");
    const back = $("battleBackBtn");
    if (!battle || !canvas || !back) return;

    const overlay = document.createElement("div");
    overlay.className = "ck-leave-dialog";
    overlay.hidden = true;
    overlay.innerHTML = `<div class="ck-leave-panel" role="dialog" aria-modal="true" aria-labelledby="ckLeaveTitle" aria-describedby="ckLeaveBody"><h2 id="ckLeaveTitle"></h2><p id="ckLeaveBody"></p><div class="ck-leave-actions"><button type="button" class="secondary-btn" data-ck-stay></button><button type="button" class="primary-btn" data-ck-leave></button></div></div>`;
    canvas.append(overlay);

    const title = overlay.querySelector("#ckLeaveTitle");
    const body = overlay.querySelector("#ckLeaveBody");
    const stay = overlay.querySelector("[data-ck-stay]");
    const leave = overlay.querySelector("[data-ck-leave]");
    let open = false;
    let allowLeave = false;
    let baselineMap = api.getState().map;
    let baselineChecks = api.getState().sessionChecks;
    let wasBattle = api.getState().screen === "battle";
    let returnFocus = null;

    const syncCopy = () => {
      const value = copy();
      title.textContent = value.leaveTitle;
      body.textContent = value.leaveBody;
      stay.textContent = value.stay;
      leave.textContent = value.leave;
    };

    const setCovered = (covered) => {
      battle.querySelector(".battle-content")?.toggleAttribute("inert", covered);
      const sharedHeader = $("wp-shared-battle-header");
      if (sharedHeader) sharedHeader.inert = covered;
    };

    const close = (focus = true) => {
      if (!open) return;
      open = false;
      overlay.hidden = true;
      setCovered(false);
      if (focus && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };

    const show = () => {
      syncCopy();
      returnFocus = document.activeElement;
      open = true;
      overlay.hidden = false;
      setCovered(true);
      requestAnimationFrame(() => stay.focus({ preventScroll: true }));
    };

    const dirty = () => {
      const state = api.getState();
      return state.screen === "battle" && (Boolean(state.selected) || state.sessionChecks > baselineChecks);
    };

    const syncBaseline = () => {
      const state = api.getState();
      const nowBattle = state.screen === "battle";
      if (nowBattle && (!wasBattle || state.map !== baselineMap)) {
        baselineMap = state.map;
        baselineChecks = state.sessionChecks;
      }
      if (!nowBattle && open) close(false);
      wasBattle = nowBattle;
    };

    back.addEventListener("click", (event) => {
      if (allowLeave || !dirty()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      show();
    }, true);

    stay.addEventListener("click", () => close(true));
    leave.addEventListener("click", () => {
      close(false);
      allowLeave = true;
      back.click();
      allowLeave = false;
    });

    document.addEventListener("keydown", (event) => {
      if (!open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close(true);
        return;
      }
      if (event.key !== "Tab") return;
      const items = [stay, leave].filter((node) => !node.disabled && !node.hidden);
      if (!items.length) return;
      const current = items.indexOf(document.activeElement);
      const nextIndex = event.shiftKey ? (current <= 0 ? items.length - 1 : current - 1) : (current >= items.length - 1 ? 0 : current + 1);
      event.preventDefault();
      items[nextIndex].focus();
    }, true);

    new MutationObserver(syncBaseline).observe(document.body, { attributes: true, attributeFilter: ["data-screen"] });
    window.addEventListener("wonder:locale-change", syncCopy);
    $("localeSelect")?.addEventListener("change", () => queueMicrotask(syncCopy));
    syncBaseline();
  }

  function init() {
    syncMain();
    installStageWorkspace();
    moveBattleControls();
    installResultSubstate();
    installLeaveGuard();

    const start = $("startBtn");
    if (start) new MutationObserver(syncMain).observe(start, { childList: true, characterData: true, subtree: true });
    window.addEventListener("wonder:locale-change", () => queueMicrotask(syncMain));
    $("localeSelect")?.addEventListener("change", () => queueMicrotask(syncMain));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(init), { once: true });
  else requestAnimationFrame(init);
})();