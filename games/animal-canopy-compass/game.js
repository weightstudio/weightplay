(function () {
  "use strict";

  const copy = window.CANOPY_COMPASS_LOCALES || {};
  const standardStartLabels = { en: "Start Game", "zh-Hant": "開始遊戲", "zh-Hans": "开始游戏", ja: "ゲーム開始", ko: "게임 시작", es: "Iniciar juego", "pt-BR": "Iniciar jogo", fr: "Commencer le jeu", de: "Spiel starten", it: "Inizia gioco", ru: "Начать игру", hi: "खेल शुरू करें", ar: "ابدأ اللعبة" };
  Object.entries(standardStartLabels).forEach(([locale, label]) => { if (copy[locale]) copy[locale].start = label; });
  const supportedLocales = ["en", "zh-Hant", "zh-Hans", "ja", "ko", "es", "pt-BR", "fr", "de", "it", "ru", "hi", "ar"];
  const routeLocaleMap = { en: "en", "zh-tw": "zh-Hant", "zh-cn": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-br": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" };
  const ruleOffsets = { hold: 0, cw: 1, ccw: 3, opposite: 2 };
  const rounds = [
    { arc: 1, phases: [["E", "hold"]] },
    { arc: 1, phases: [["S", "hold"]] },
    { arc: 1, phases: [["W", "cw"]] },
    { arc: 1, phases: [["N", "ccw"]] },
    { arc: 1, checkpoint: 1, phases: [["E", "hold"], ["S", "cw"]] },
    { arc: 2, phases: [["N", "cw"]] },
    { arc: 2, phases: [["E", "ccw"]] },
    { arc: 2, phases: [["S", "opposite"]] },
    { arc: 2, phases: [["W", "cw"]] },
    { arc: 2, checkpoint: 2, phases: [["E", "opposite"], ["S", "ccw"]] },
    { arc: 3, phases: [["N", "opposite"]] },
    { arc: 3, phases: [["E", "cw"]] },
    { arc: 3, phases: [["W", "ccw"]] },
    { arc: 3, phases: [["S", "opposite"]] },
    { arc: 3, checkpoint: 3, phases: [["E", "opposite"], ["W", "cw"], ["S", "ccw"]] },
    { arc: 4, phases: [["E", "hold"], ["N", "ccw"]] },
    { arc: 4, phases: [["N", "cw"], ["W", "hold"]] },
    { arc: 4, phases: [["S", "opposite"], ["E", "cw"]] },
    { arc: 4, phases: [["N", "hold"], ["W", "opposite"]] },
    { arc: 4, checkpoint: 4, phases: [["E", "hold"], ["S", "cw"], ["N", "opposite"]] },
    { arc: 5, phases: [["W", "cw"], ["E", "opposite"]] },
    { arc: 5, phases: [["S", "ccw"], ["N", "hold"]] },
    { arc: 5, phases: [["W", "opposite"], ["E", "ccw"]] },
    { arc: 5, phases: [["S", "hold"], ["N", "cw"], ["E", "opposite"]] },
    { arc: 5, checkpoint: 5, phases: [["W", "ccw"], ["N", "hold"], ["E", "opposite"]] },
    { arc: 6, phases: [["E", "opposite"], ["N", "cw"]] },
    { arc: 6, phases: [["W", "ccw"], ["S", "opposite"]] },
    { arc: 6, phases: [["N", "hold"], ["E", "opposite"], ["W", "ccw"]] },
    { arc: 6, phases: [["E", "cw"], ["W", "hold"], ["S", "opposite"]] },
    { arc: 6, checkpoint: 6, finale: true, phases: [["E", "hold"], ["W", "cw"], ["N", "opposite"]] },
  ].map((round, index) => ({
    ...round,
    id: index + 1,
    phases: round.phases.map(([mark, rule]) => ({ mark: ["N", "E", "S", "W"].indexOf(mark), rule })),
  }));
  const names = ["north", "east", "south", "west"];
  const campaignKey = "weightplay-animal-canopy-compass-campaign-v1";
  const badgeArtFiles = { 1: "dawn-lantern.png", 2: "crosswind-bell.png", 3: "mirror-moth.png", 4: "echo-heron.png", 5: "high-bough-kite.png", 6: "moon-canopy-guide.png" };
  const $ = (id) => document.getElementById(id);
  const normalizeLocale = (value) => {
    if (value === "zh-TW") return "zh-Hant";
    if (value === "zh-CN") return "zh-Hans";
    if (value?.toLowerCase?.().startsWith("pt")) return "pt-BR";
    if (supportedLocales.includes(value)) return value;
    const short = value?.split?.("-")?.[0];
    return supportedLocales.includes(short) ? short : "en";
  };
  const routeSegment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const routeLocale = routeLocaleMap[routeSegment] || window.__WEIGHTPLAY_ROUTE_LOCALE__;
  const savedLocale = (() => { try { return localStorage.getItem("weightPlayLocale") || localStorage.getItem("weightplayLocale") || localStorage.getItem("wp-locale"); } catch (_) { return null; } })();
  const get = (key, fallback = "") => { try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; } };
  const set = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const loadCampaign = () => {
    try {
      const saved = JSON.parse(get(campaignKey, "null"));
      if (!saved || saved.schema !== 1) return { completed: [], bests: {}, badges: [] };
      const candidates = [...new Set((Array.isArray(saved.completed) ? saved.completed : []).map(Number).filter((id) => Number.isInteger(id) && id >= 1 && id <= rounds.length))].sort((a, b) => a - b);
      const completed = [];
      for (const id of candidates) { if (id !== completed.length + 1) break; completed.push(id); }
      const bests = {};
      if (saved.bests && typeof saved.bests === "object") Object.entries(saved.bests).forEach(([id, turns]) => {
        if (/^([1-9]|[12][0-9]|30)$/.test(id) && Number.isInteger(turns) && turns >= 0 && turns < 10000) bests[id] = turns;
      });
      const badges = rounds.filter((round) => round.checkpoint && completed.includes(round.id) && Array.isArray(saved.badges) && saved.badges.includes(round.id)).map((round) => round.id);
      return { completed, bests, badges };
    } catch (_) { return { completed: [], bests: {}, badges: [] }; }
  };
  const savedCampaign = loadCampaign();
  const state = { locale: normalizeLocale(routeLocale || window.WonderI18n?.localeFromPath?.() || savedLocale || document.documentElement.lang), screen: "main", round: 0, phase: 0, direction: 0, turns: 0, completed: savedCampaign.completed, bests: savedCampaign.bests, badges: savedCampaign.badges, mistakes: 0, sound: true };
  let stageRailController = null;
  let leaveDialogOpen = false;
  let leaveDialog = null;
  let leaveKeep = null;
  let leaveExit = null;
  let pendingBattleFrame = 0;
  let resultFocusFrame = 0;

  const t = (key, vars = {}) => {
    let value = (copy[state.locale] || copy.en || {})[key] || (copy.en || {})[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(replacement)); });
    return value;
  };

  const leaveCopy = {
    en: { title: "Leave this lookout?", body: "Lookout {round} · Echo {phase}/{total}: leaving discards this temporary Echo progress and your {turns} turn(s). Cleared lookouts, bests, and badges stay saved.", keep: "Continue playing", leave: "Return to Canopy map" },
    "zh-Hant": { title: "要離開目前瞭望點嗎？", body: "瞭望點 {round}・回聲 {phase}/{total}：離開會捨棄目前這段暫時回聲進度與 {turns} 次操作；已完成瞭望點、最佳成績與徽章會保留。", keep: "繼續遊玩", leave: "返回樹冠地圖" },
    "zh-Hans": { title: "要离开当前瞭望点吗？", body: "瞭望点 {round}・回声 {phase}/{total}：离开会舍弃当前这段临时回声进度与 {turns} 次操作；已完成瞭望点、最佳成绩与徽章会保留。", keep: "继续游玩", leave: "返回树冠地图" },
    ja: { title: "この見張り台を離れますか？", body: "見張り台 {round}・エコー {phase}/{total}：離れると現在の一時的なエコー進行と {turns} 手が破棄されます。クリア済みの見張り台、ベスト、バッジは保存されます。", keep: "プレイを続ける", leave: "樹冠マップへ戻る" },
    ko: { title: "현재 전망대를 나갈까요?", body: "전망대 {round} · 에코 {phase}/{total}: 나가면 현재 임시 에코 진행과 {turns}회 조작이 사라집니다. 완료한 전망대, 최고 기록, 배지는 저장됩니다.", keep: "계속 플레이", leave: "수관 지도로 돌아가기" },
    es: { title: "¿Salir de este mirador?", body: "Mirador {round} · Eco {phase}/{total}: al salir se descartan este progreso temporal y {turns} turno(s). Los miradores superados, récords e insignias permanecen guardados.", keep: "Seguir jugando", leave: "Volver al mapa" },
    "pt-BR": { title: "Sair deste mirante?", body: "Mirante {round} · Eco {phase}/{total}: sair descarta este progresso temporário e {turns} jogada(s). Mirantes concluídos, recordes e emblemas continuam salvos.", keep: "Continuar jogando", leave: "Voltar ao mapa" },
    fr: { title: "Quitter ce poste ?", body: "Poste {round} · Écho {phase}/{total} : quitter abandonne cette progression temporaire et {turns} action(s). Les postes terminés, records et badges restent enregistrés.", keep: "Continuer à jouer", leave: "Retour à la carte" },
    de: { title: "Diesen Aussichtspunkt verlassen?", body: "Aussichtspunkt {round} · Echo {phase}/{total}: Beim Verlassen gehen dieser temporäre Fortschritt und {turns} Zug/Züge verloren. Abgeschlossene Aussichtspunkte, Bestwerte und Abzeichen bleiben gespeichert.", keep: "Weiterspielen", leave: "Zur Karte zurück" },
    it: { title: "Lasciare questo punto di osservazione?", body: "Punto {round} · Eco {phase}/{total}: uscendo perderai questo progresso temporaneo e {turns} mossa/e. Punti completati, record e distintivi restano salvati.", keep: "Continua a giocare", leave: "Torna alla mappa" },
    ru: { title: "Покинуть эту смотровую точку?", body: "Точка {round} · Эхо {phase}/{total}: при выходе текущий временный прогресс и ходы ({turns}) будут сброшены. Пройденные точки, рекорды и значки сохранятся.", keep: "Продолжить игру", leave: "Вернуться к карте" },
    hi: { title: "क्या इस चौकी से बाहर जाएँ?", body: "चौकी {round} · इको {phase}/{total}: बाहर जाने पर यह अस्थायी प्रगति और {turns} चालें हट जाएँगी। पूरी की गई चौकियाँ, सर्वश्रेष्ठ स्कोर और बैज सुरक्षित रहेंगे।", keep: "खेल जारी रखें", leave: "मानचित्र पर लौटें" },
    ar: { title: "مغادرة نقطة المراقبة؟", body: "نقطة {round} · الصدى {phase}/{total}: ستؤدي المغادرة إلى إلغاء هذا التقدم المؤقت و{turns} حركة. تبقى النقاط المكتملة وأفضل النتائج والشارات محفوظة.", keep: "متابعة اللعب", leave: "العودة إلى الخريطة" },
  };

  const ensureInterface7ContentContract = () => {
    if (!document.querySelector('link[data-wp-canopy-stage-standard]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/src/stage-selector-standard.css?v=20260924-canopy-v13-i7";
      link.dataset.wpCanopyStageStandard = "";
      document.head.append(link);
    }
    if (!document.querySelector("style[data-wp-canopy-i7-content]")) {
      const style = document.createElement("style");
      style.dataset.wpCanopyI7Content = "";
      style.textContent = `
        body[data-wp-game-id="animal-canopy-compass"] .result-actions {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        body[data-wp-game-id="animal-canopy-compass"] .result-actions > button {
          min-width: 0;
          padding-inline: 8px;
        }
        .wp-canopy-leave {
          position: absolute;
          inset: 0;
          z-index: 90;
          display: grid;
          place-items: center;
          padding: 16px;
          background: rgb(15 29 49 / 78%);
          backdrop-filter: blur(3px);
        }
        .wp-canopy-leave[hidden] { display: none !important; }
        .wp-canopy-leave-card {
          width: min(100%, 460px);
          max-height: calc(100% - 24px);
          overflow: auto;
          padding: 20px;
          border: 2px solid #d6e1d9;
          border-radius: 14px;
          background: #fffdf8;
          color: #29485a;
          box-shadow: 0 18px 44px rgb(24 42 55 / 28%);
        }
        .wp-canopy-leave-card h2 { margin: 0 0 8px; font-size: 1.3rem; }
        .wp-canopy-leave-card p { margin: 0; color: #566d7e; }
        .wp-canopy-leave-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 18px; }
        .wp-canopy-leave-actions button { min-height: 48px; }
        @media (max-width: 520px) {
          .wp-canopy-leave-actions { grid-template-columns: 1fr; }
          body[data-wp-game-id="animal-canopy-compass"] .result-actions > button { font-size: .78rem; padding-inline: 4px; }
        }
        body[data-wp-game-id="animal-canopy-compass"] .compass { transition: transform 240ms cubic-bezier(.2,.8,.2,1), filter 180ms ease; }
        body[data-wp-game-id="animal-canopy-compass"] .direction { transition: transform 150ms ease, box-shadow 180ms ease, background 180ms ease; }
        body[data-wp-game-id="animal-canopy-compass"] .direction:active { transform: scale(.96); }
        body[data-wp-game-id="animal-canopy-compass"] .wp-canopy-wrong .compass { animation: wpCanopyWrong 240ms ease; filter: saturate(.72); }
        body[data-wp-game-id="animal-canopy-compass"] .wp-canopy-correct .compass { animation: wpCanopyCorrect 340ms ease; }
        body[data-wp-game-id="animal-canopy-compass"] .result-panel:not([hidden]) { animation: wpCanopyResult 320ms cubic-bezier(.2,.8,.2,1); }
        @keyframes wpCanopyWrong { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        @keyframes wpCanopyCorrect { 50% { transform: scale(1.045); filter: brightness(1.08); } }
        @keyframes wpCanopyResult { from { opacity: 0; transform: translateY(12px) scale(.985); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { body[data-wp-game-id="animal-canopy-compass"] .compass, body[data-wp-game-id="animal-canopy-compass"] .direction { transition: none; } body[data-wp-game-id="animal-canopy-compass"] .wp-canopy-wrong .compass, body[data-wp-game-id="animal-canopy-compass"] .wp-canopy-correct .compass, body[data-wp-game-id="animal-canopy-compass"] .result-panel:not([hidden]) { animation: none; } }
      `;
      document.head.append(style);
    }
    ["mapBtn", "stageHelp", "stageHeading", "battleHeading", "battleSound", "battleMap"].forEach((id) => {
      const node = $(id);
      if (node) node.hidden = true;
    });
    const stageCanvas = document.querySelector(".stage-canvas");
    if (stageCanvas) stageCanvas.dataset.wpStageArt = "/games/animal-canopy-compass/assets/animal-canopy-compass-cover.png";
    const result = $("result");
    const battleCanvas = document.querySelector(".battle-canvas");
    if (result && battleCanvas && result.parentElement !== battleCanvas) battleCanvas.append(result);
    const actions = result?.querySelector(".result-actions");
    if (actions && $("resultMap") && $("resultPrimary") && $("resultHome")) {
      actions.append($("resultMap"), $("resultPrimary"), $("resultHome"));
      $("resultHome").dataset.copy = "replay";
    }
  };
  ensureInterface7ContentContract();

  const battleCanvas = () => document.querySelector(".battle-canvas");
  const battleContent = () => document.querySelector(".battle-content");
  const battleHeader = () => $("battleBack")?.closest("header");
  const setBattleCovered = (active, hideContent = false, keepSettingsReachable = false) => {
    const content = battleContent();
    if (content) {
      content.inert = active;
      content.hidden = hideContent && active;
      if (!active) content.hidden = false;
    }
    const header = battleHeader();
    if (header) header.inert = active && !keepSettingsReachable;
    if ($("battleBack")) $("battleBack").disabled = active;
  };
  const setResultActive = (active) => {
    document.body.toggleAttribute("data-wp-canopy-result", active);
    // Keep the Battle Settings utility reachable in Result while its return is disabled.
    setBattleCovered(active, true, active);
    if (!active && $("result")) $("result").hidden = true;
  };

  const ensureLeaveDialog = () => {
    if (leaveDialog || !battleCanvas()) return;
    leaveDialog = document.createElement("section");
    leaveDialog.className = "wp-canopy-leave";
    leaveDialog.hidden = true;
    leaveDialog.setAttribute("role", "dialog");
    leaveDialog.setAttribute("aria-modal", "true");
    leaveDialog.setAttribute("aria-labelledby", "canopyLeaveTitle");
    leaveDialog.setAttribute("aria-describedby", "canopyLeaveText");
    leaveDialog.innerHTML = `<div class="wp-canopy-leave-card"><h2 id="canopyLeaveTitle"></h2><p id="canopyLeaveText"></p><div class="wp-canopy-leave-actions"><button id="canopyLeaveKeep" class="primary-btn" type="button"></button><button id="canopyLeaveExit" class="secondary-btn" type="button"></button></div></div>`;
    battleCanvas().append(leaveDialog);
    leaveKeep = $("canopyLeaveKeep");
    leaveExit = $("canopyLeaveExit");
    leaveKeep.addEventListener("click", () => closeLeaveDialog(true));
    leaveExit.addEventListener("click", () => {
      closeLeaveDialog(false);
      setScreen("stage");
    });
  };
  const openLeaveDialog = () => {
    ensureLeaveDialog();
    if (!leaveDialog || leaveDialogOpen) return;
    if (pendingBattleFrame) {
      cancelAnimationFrame(pendingBattleFrame);
      pendingBattleFrame = 0;
    }
    const labels = leaveCopy[state.locale] || leaveCopy.en;
    const round = rounds[state.round];
    $("canopyLeaveTitle").textContent = labels.title;
    $("canopyLeaveText").textContent = labels.body
      .replace("{round}", String(round.id))
      .replace("{phase}", String(Math.min(state.phase + 1, round.phases.length)))
      .replace("{total}", String(round.phases.length))
      .replace("{turns}", String(state.turns));
    leaveKeep.textContent = labels.keep;
    leaveExit.textContent = labels.leave;
    leaveDialogOpen = true;
    setBattleCovered(true, false);
    leaveDialog.hidden = false;
    leaveKeep.focus({ preventScroll: true });
  };
  function closeLeaveDialog(restoreFocus) {
    if (!leaveDialogOpen || !leaveDialog) return;
    leaveDialogOpen = false;
    leaveDialog.hidden = true;
    setBattleCovered(false, false);
    if (restoreFocus) $("battleBack")?.focus({ preventScroll: true });
  }
  const renderBadgeReward = (checkpoint) => {
    const file = badgeArtFiles[checkpoint];
    const panel = $("badgeReward");
    const image = $("badgeRewardImage");
    const label = $("badgeRewardLabel");
    if (!file) {
      panel.hidden = true;
      image.removeAttribute("src");
      image.alt = "";
      label.textContent = "";
      return;
    }
    const badgeName = t("badge" + checkpoint);
    image.src = `assets/checkpoint-badges/${file}`;
    image.alt = badgeName;
    label.textContent = t("badgeEarned", { badge: badgeName });
    panel.hidden = false;
  };
  const showToast = (message) => {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("visible"), 1600);
  };
  const revealResultAction = () => {
    cancelAnimationFrame(resultFocusFrame);
    resultFocusFrame = window.requestAnimationFrame(() => {
      resultFocusFrame = 0;
      const next = $("resultPrimary");
      const action = next?.disabled ? $("resultHome") : next;
      if (!action || $("result").hidden) return;
      action.focus({ preventScroll: true });
      action.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
    });
  };
  const setScreen = (name) => {
    if (leaveDialogOpen) closeLeaveDialog(false);
    if (state.screen === "battle" && name !== "battle") setResultActive(false);
    state.screen = name;
    document.body.dataset.screen = name;
    ["main", "stage", "battle"].forEach((screen) => { $(`${screen}Screen`).hidden = screen !== name; });
    $("settingsPanel").hidden = true;
    $("settingsBtn").setAttribute("aria-expanded", "false");
    if (name === "stage") renderStages();
    if (name === "battle") renderBattle();
    if (name === "main") applyLocale();
    window.scrollTo(0, 0);
  };
  const applyLocale = () => {
    document.documentElement.lang = state.locale === "zh-Hant" ? "zh-TW" : state.locale;
    document.documentElement.dir = state.locale === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    $("settingsBtn").setAttribute("aria-label", t("settings"));
    $("settingsPanel").setAttribute("aria-label", t("settings"));
    $("localeSelect").setAttribute("aria-label", t("language"));
    $("localeSelect").value = state.locale;
    $("soundBtn").textContent = state.sound ? t("soundOn") : t("soundOff");
    $("soundBtn").setAttribute("aria-pressed", String(state.sound));
    $("battleSound")?.setAttribute("aria-label", state.sound ? t("soundOn") : t("soundOff"));
    $("battleSound")?.setAttribute("title", state.sound ? t("soundOn") : t("soundOff"));
    $("stageHelp")?.setAttribute("aria-label", t("help"));
    $("stageHelp")?.setAttribute("title", t("help"));
    $("stageHeading")?.setAttribute("aria-label", t("map"));
    $("battleMap")?.setAttribute("aria-label", t("map"));
    $("stageScreen").setAttribute("aria-label", t("map"));
    $("directionRack").setAttribute("aria-label", t("directionChoices"));
    updateProgress();
    document.querySelector(".wp-shell-return")?.setAttribute("aria-label", t("lobbyReturn"));
    document.querySelector(".stage-tabs")?.setAttribute("aria-label", t("stageSections"));
    if ($("resultHome")) $("resultHome").textContent = t("replay");
    if (state.screen === "stage") renderStages();
    if (state.screen === "battle" && state.phase < rounds[state.round].phases.length) renderBattle();
  };
  const unlockedCount = () => {
    let count = 1;
    while (count < rounds.length && state.completed.includes(count)) count += 1;
    return count;
  };
  const highestUnlockedIndex = () => Math.min(rounds.length - 1, unlockedCount() - 1);
  const updateProgress = () => { $("progress").textContent = t("progress", { count: state.completed.length, unlocked: unlockedCount() }); };
  const saveCampaign = () => set(campaignKey, JSON.stringify({ schema: 1, completed: state.completed, bests: state.bests, badges: state.badges }));
  const renderStageCard = (card, index) => {
    const round = rounds[index];
    const unlocked = index <= highestUnlockedIndex();
    const complete = state.completed.includes(round.id);
    const content = document.createElement("div");
    content.dataset.wpItemContent = "";
    const title = document.createElement("span");
    title.className = "stage-number";
    title.textContent = t("round", { number: round.id, total: rounds.length });
    const arc = document.createElement("h3");
    arc.textContent = t("arc" + round.arc);
    const objective = document.createElement("p");
    objective.textContent = t("stageObjective", { count: round.phases.length });
    const status = document.createElement("span");
    status.className = "stage-chip";
    status.textContent = complete ? t("complete") : !unlocked ? t("lockedStage") : round.checkpoint ? t("checkpoint") : t("readyStage");
    content.append(title, arc, objective, status);
    card.className = "stage-card" + (complete ? " done" : "") + (!unlocked ? " locked" : "") + (round.checkpoint ? " checkpoint" : "");
    card.dataset.stage = String(round.id);
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-disabled", String(!unlocked));
    card.setAttribute("aria-label", [title.textContent, arc.textContent, objective.textContent, status.textContent].join(". "));
    card.replaceChildren(content);
  };
  const renderStages = () => {
    const rail = $("stageList");
    if (!window.WeightPlayStageV6?.install) {
      rail.replaceChildren();
      const unavailable = document.createElement("p");
      unavailable.className = "stage-rail-error";
      unavailable.textContent = t("stageControllerUnavailable");
      rail.append(unavailable);
      return;
    }
    if (!stageRailController) {
      stageRailController = window.WeightPlayStageV6.install(rail, {
        total: rounds.length,
        poolSize: 9,
        initialIndex: highestUnlockedIndex,
        bind: renderStageCard,
        activate: (index) => {
          if (index > highestUnlockedIndex()) return;
          startRound(index);
        },
      });
      if (!stageRailController) {
        const unavailable = document.createElement("p");
        unavailable.className = "stage-rail-error";
        unavailable.textContent = t("stageControllerUnavailable");
        rail.append(unavailable);
        return;
      }
    } else {
      stageRailController.refresh();
    }
    stageRailController.center(highestUnlockedIndex());
  };
  const renderDirectionButtons = () => {
    const rack = $("directionRack");
    const focusedDirection = document.activeElement?.dataset?.directionIndex;
    rack.replaceChildren();
    names.forEach((name, index) => {
      const button = document.createElement("button");
      button.className = `direction${state.direction === index ? " active" : ""}`;
      button.type = "button";
      button.textContent = t(name);
      button.dataset.directionIndex = String(index);
      button.setAttribute("aria-pressed", String(state.direction === index));
      button.addEventListener("click", () => { state.direction = index; state.turns += 1; renderBattle(); $("status").textContent = t("changed", { direction: t(name) }); });
      rack.append(button);
    });
    if (focusedDirection !== undefined) rack.querySelector(`[data-direction-index="${focusedDirection}"]`)?.focus({ preventScroll: true });
  };
  const renderBattle = () => {
    const round = rounds[state.round];
    const phase = round.phases[state.phase];
    const canvas = battleCanvas();
    const preservedScrollTop = canvas?.scrollTop || 0;
    setResultActive(false);
    $("battleHeading").textContent = t("title");
    $("roundLabel").textContent = t("round", { number: round.id, total: rounds.length });
    $("hint").textContent = t("arc" + round.arc) + " · " + t("phaseProgress", { current: state.phase + 1, total: round.phases.length });
    $("badge").textContent = `${state.completed.length}/${rounds.length}`;
    const ruleKey = { hold: "ruleDirect", cw: "ruleClockwise", ccw: "ruleCounterclockwise", opposite: "ruleOpposite" }[phase.rule];
    $("clueText").textContent = t(ruleKey, { mark: t(names[phase.mark]) });
    $("compass").className = `compass direction-${state.direction}`;
    $("compass").setAttribute("aria-label", t("compassLabel"));
    $("facing").textContent = t("facing", { direction: t(names[state.direction]) });
    renderDirectionButtons();
    $("result").hidden = true;
    $("checkBtn").disabled = false;
    $("resetBtn").disabled = false;
    if (canvas) canvas.scrollTop = preservedScrollTop;
  };
  const startRound = (index) => {
    const selected = Math.max(0, Math.min(rounds.length - 1, index));
    if (selected > highestUnlockedIndex()) { showToast(t("lockedStage")); return; }
    state.round = selected;
    state.phase = 0;
    state.direction = 0;
    state.turns = 0;
    state.mistakes = 0;
    setScreen("battle");
    $("status").textContent = t("ready");
  };
  const startSession = () => { setScreen("stage"); };
  const check = () => {
    const round = rounds[state.round];
    const phase = round.phases[state.phase];
    const canvas = battleCanvas();
    const preservedScrollTop = canvas?.scrollTop || 0;
    const target = (phase.mark + ruleOffsets[phase.rule]) % names.length;
    if (state.direction !== target) {
      state.mistakes += 1;
      $("status").textContent = t("wrong");
      battleCanvas()?.classList.remove("wp-canopy-correct");
      battleCanvas()?.classList.add("wp-canopy-wrong");
      setTimeout(() => battleCanvas()?.classList.remove("wp-canopy-wrong"), 260);
      if (document.activeElement === $("checkBtn")) $("checkBtn").blur();
      if (canvas) {
        canvas.scrollTop = preservedScrollTop;
        cancelAnimationFrame(pendingBattleFrame);
        pendingBattleFrame = window.requestAnimationFrame(() => {
          pendingBattleFrame = 0;
          if (state.screen === "battle" && !leaveDialogOpen && $("result").hidden) canvas.scrollTop = preservedScrollTop;
        });
      }
      return;
    }
    state.phase += 1;
    if (state.phase < round.phases.length) {
      renderBattle();
      battleCanvas()?.classList.add("wp-canopy-correct");
      setTimeout(() => battleCanvas()?.classList.remove("wp-canopy-correct"), 360);
      $("status").textContent = t("correct");
      return;
    }
    if (!state.completed.includes(round.id)) state.completed = [...state.completed, round.id].sort((a, b) => a - b);
    const previousBest = state.bests[round.id];
    if (previousBest === undefined || state.turns < previousBest) state.bests[round.id] = state.turns;
    if (round.checkpoint && !state.badges.includes(round.id)) state.badges = [...state.badges, round.id];
    saveCampaign();
    updateProgress();
    $("badge").textContent = `${state.completed.length}/${rounds.length}`;
    stageRailController?.refresh();
    $("status").textContent = t("correct");
    $("checkBtn").disabled = true;
    $("resetBtn").disabled = true;
    const final = round.finale === true;
    $("resultTitle").textContent = final ? t("finaleTitle") : round.checkpoint ? t("checkpoint") + " · " + t("complete") : t("complete");
    $("resultText").textContent = final ? t("finaleText") : t("stageClear");
    renderBadgeReward(round.checkpoint || (final ? 6 : 0));
    $("stats").textContent = t("stats", { turns: state.turns, best: state.bests[round.id] ?? state.turns }) + ` · ${state.mistakes === 0 ? "★" : "✦"} ${state.mistakes}`;
    $("resultPrimary").textContent = t("nextStage");
    $("resultPrimary").disabled = final;
    $("resultPrimary").onclick = final ? null : () => startRound(state.round + 1);
    $("resultHome").textContent = t("replay");
    $("result").hidden = false;
    setResultActive(true);
    revealResultAction();
  };

  $("startBtn").addEventListener("click", startSession);
  $("mapBtn")?.addEventListener("click", () => setScreen("stage"));
  $("stageBack").addEventListener("click", () => setScreen("main"));
  $("stageHelp")?.addEventListener("click", () => showToast(t("mapIntro")));
  $("battleBack").addEventListener("click", () => {
    if (!$("result").hidden) return;
    if (state.turns > 0 || state.phase > 0) openLeaveDialog();
    else setScreen("stage");
  });
  $("battleMap")?.addEventListener("click", () => setScreen("stage"));
  $("checkBtn").addEventListener("click", check);
  $("resetBtn").addEventListener("click", () => { state.direction = 0; state.turns += 1; renderBattle(); $("status").textContent = t("ready"); });
  $("resultMap").addEventListener("click", () => setScreen("stage"));
  $("resultHome").addEventListener("click", () => startRound(state.round));
  $("settingsBtn").addEventListener("click", () => { const panel = $("settingsPanel"); panel.hidden = !panel.hidden; $("settingsBtn").setAttribute("aria-expanded", String(!panel.hidden)); });
  $("soundBtn").addEventListener("click", () => { state.sound = !state.sound; set("weightplay-canopy-compass-sound", state.sound ? "on" : "off"); applyLocale(); });
  $("battleSound")?.addEventListener("click", () => { state.sound = !state.sound; set("weightplay-canopy-compass-sound", state.sound ? "on" : "off"); applyLocale(); });
  $("closeSettings")?.addEventListener("click", () => { $("settingsPanel").hidden = true; $("settingsBtn").setAttribute("aria-expanded", "false"); });
  $("localeSelect").addEventListener("change", (event) => { state.locale = normalizeLocale(event.target.value); set("weightPlayLocale", state.locale); set("weightplayLocale", state.locale); set("wp-locale", state.locale); applyLocale(); });
  document.addEventListener("keydown", (event) => {
    if (leaveDialogOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLeaveDialog(true);
        return;
      }
      if (event.key === "Tab") {
        const actions = [leaveKeep, leaveExit].filter(Boolean);
        if (!actions.length) return;
        const current = actions.indexOf(document.activeElement);
        event.preventDefault();
        const delta = event.shiftKey ? -1 : 1;
        actions[(current + delta + actions.length) % actions.length].focus();
      }
      return;
    }
    if (state.screen !== "battle" || !$("result").hidden) return;
    if ((event.key === "Enter" || event.key === " ") && document.activeElement === $("compass")) { event.preventDefault(); check(); return; }
    const directionMap = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
    if (!(event.key in directionMap)) return;
    event.preventDefault();
    state.direction = directionMap[event.key];
    state.turns += 1;
    renderBattle();
    $("status").textContent = t("changed", { direction: t(names[state.direction]) });
  });
  window.addEventListener("pagehide", () => {
    stageRailController?.destroy();
    cancelAnimationFrame(pendingBattleFrame);
    cancelAnimationFrame(resultFocusFrame);
  }, { once: true });
  state.sound = get("weightplay-canopy-compass-sound", "on") !== "off";
  setTimeout(() => { $("loadingPanel").hidden = true; $("mainScreen").hidden = false; applyLocale(); }, 280);
}());
