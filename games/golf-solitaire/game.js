(function () {
  "use strict";
  const GOLF_GUIDE_TOGGLE_COPY = {
    en: "Read the full Golf guide",
    "zh-Hant": "閱讀完整高爾夫紙牌指南",
    "zh-Hans": "阅读完整高尔夫纸牌指南",
    ja: "ゴルフソリティアの詳しいガイドを読む",
    ko: "골프 솔리테어 전체 가이드 보기",
    es: "Leer la guía completa de Golf",
    "pt-BR": "Ler o guia completo do Golf",
    fr: "Lire le guide complet du Golf",
    de: "Die vollständige Golf-Anleitung lesen",
    it: "Leggi la guida completa di Golf",
    ru: "Открыть полное руководство по Golf",
    hi: "Golf की पूरी गाइड पढ़ें",
    ar: "اقرأ دليل Golf الكامل",
  };
  const GOLF_FAILURE_REASON_COPY = {
    en: "No exposed card fits the waste, and the Stock is empty. Restart keeps this deal; New Game offers a fresh layout.",
    "zh-Hant": "沒有可接在棄牌區上的明牌，牌庫也已空。重新開始保留這副牌；新遊戲會提供新的牌局。",
    "zh-Hans": "没有可接在弃牌区上的明牌，牌库也已空。重新开始保留这副牌；新游戏会提供新的牌局。",
    ja: "捨て札につなげられる場札がなく、山札も空です。リスタートならこの配り直しを再挑戦し、新しいゲームなら別の配り方を試せます。",
    ko: "버린 카드에 이을 수 있는 공개 카드가 없고 덱도 비었습니다. 다시 시작은 이 판을 재도전하고, 새 게임은 새로운 배치를 제공합니다.",
    es: "No queda ninguna carta expuesta que encaje con el descarte y el mazo está vacío. Reiniciar conserva esta partida; Nueva partida ofrece una disposición nueva.",
    "pt-BR": "Não há carta exposta que combine com o descarte, e o monte está vazio. Reiniciar mantém esta partida; Novo jogo oferece uma nova disposição.",
    fr: "Aucune carte exposée ne peut suivre la défausse et la pioche est vide. Recommencer garde cette donne ; une nouvelle partie propose une nouvelle disposition.",
    de: "Keine offene Karte passt zur Ablage und der Stapel ist leer. Neu starten behält diese Partie; Neues Spiel bietet eine neue Anordnung.",
    it: "Nessuna carta scoperta può seguire gli scarti e il tallone è vuoto. Ricomincia conserva questa partita; Nuova partita offre una nuova disposizione.",
    ru: "Нет открытой карты, которую можно положить на сброс, и колода пуста. «Начать заново» сохранит эту раздачу, а «Новая игра» предложит новую раскладку.",
    hi: "कोई खुला कार्ड फेंकी गई गड्डी पर नहीं जा सकता और डेक खाली है। फिर शुरू करें यही बाज़ी दोहराता है; नया खेल नई व्यवस्था देता है।",
    ar: "لا توجد بطاقة مكشوفة تناسب المهملات، والرزمة فارغة. إعادة البدء تبقي هذه التوزيعة؛ اللعبة الجديدة تقدم ترتيبًا جديدًا.",
  };
  const GOLF_RESULT_ACTION_COPY = {
    en: "Restart keeps this same deal; New Game offers a fresh layout.",
    "zh-Hant": "重新開始會保留同一副牌；新遊戲會提供新的牌局。",
    "zh-Hans": "重新开始会保留同一副牌；新游戏会提供新的牌局。",
    ja: "リスタートは同じ配りを保ち、新しいゲームは別のレイアウトを配ります。",
    ko: "다시 시작은 같은 딜을 유지하고, 새 게임은 새로운 배치를 제공합니다.",
    es: "Reiniciar conserva esta partida; Nueva partida ofrece una disposición nueva.",
    "pt-BR": "Reiniciar mantém esta partida; Novo jogo oferece uma nova disposição.",
    fr: "Recommencer garde cette donne ; une nouvelle partie propose une nouvelle disposition.",
    de: "Neu starten behält diese Partie; Neues Spiel bietet eine neue Anordnung.",
    it: "Ricomincia conserva questa partita; Nuova partita offre una nuova disposizione.",
    ru: "«Начать заново» сохраняет эту раздачу, а «Новая игра» предлагает новую раскладку.",
    hi: "फिर शुरू करें यही बाज़ी रखता है; नया खेल नई व्यवस्था देता है।",
    ar: "إعادة البدء تبقي هذه التوزيعة؛ اللعبة الجديدة تقدم ترتيبًا جديدًا.",
  };
  const GOLF_REPLAY_GOAL_COPY = {
    en: "Next-deal target: reach a {target}-card chain (best: {best}).",
    "zh-Hant": "下一局目標：連出 {target} 張（最佳連鎖：{best} 張）。",
    "zh-Hans": "下一局目标：连出 {target} 张（最佳连锁：{best} 张）。",
    ja: "次の配りの目標：{target}枚連鎖を目指す（ベスト：{best}枚）。",
    ko: "다음 딜 목표: {target}장 연속 달성 (최고 기록: {best}장).",
    es: "Objetivo de la próxima partida: logra una cadena de {target} cartas (mejor: {best}).",
    "pt-BR": "Meta da próxima partida: alcance uma sequência de {target} cartas (melhor: {best}).",
    fr: "Objectif de la prochaine donne : atteindre une chaîne de {target} cartes (record : {best}).",
    de: "Ziel für die nächste Partie: eine {target}-Karten-Kette erreichen (Bestwert: {best}).",
    it: "Obiettivo della prossima partita: raggiungi una catena di {target} carte (record: {best}).",
    ru: "Цель следующей раздачи: собрать цепочку из {target} карт (лучший результат: {best}).",
    hi: "अगली बाज़ी का लक्ष्य: {target} कार्ड की चेन बनाएँ (सर्वश्रेष्ठ: {best})।",
    ar: "هدف التوزيعة التالية: كوّن سلسلة من {target} بطاقة (الأفضل: {best}).",
  };
  const GOLF_PROGRESS_COPY = {
    en: "Best chain: {best} cards · 35 tableau cards",
    "zh-Hant": "最佳連鎖：{best} 張 · 主牌共 35 張",
    "zh-Hans": "最佳连锁：{best} 张 · 主牌共 35 张",
    ja: "ベスト連鎖：{best}枚 · 場札35枚",
    ko: "최고 연속: {best}장 · 테이블 35장",
    es: "Mejor cadena: {best} cartas · 35 cartas en mesa",
    "pt-BR": "Melhor sequência: {best} cartas · 35 cartas na mesa",
    fr: "Meilleure chaîne : {best} cartes · 35 cartes sur le tableau",
    de: "Beste Kette: {best} Karten · 35 Karten auf dem Tableau",
    it: "Miglior catena: {best} carte · 35 carte sul tavolo",
    ru: "Лучшая цепочка: {best} карт · 35 карт на столе",
    hi: "सर्वश्रेष्ठ चेन: {best} कार्ड · टेबल पर 35 कार्ड",
    ar: "أفضل سلسلة: {best} بطاقة · 35 بطاقة على الطاولة",
  };
  const GOLF_INVALID_SELECTION_COPY = {
    en: "Choose an exposed card one rank above or below Waste.",
    "zh-Hant": "請選擇比棄牌區高一級或低一級的明牌。",
    "zh-Hans": "请选择比弃牌区高一级或低一级的明牌。",
    ja: "捨て札より1つ上か下の表向きカードを選びます。",
    ko: "버린 카드보다 한 단계 높거나 낮은 공개 카드를 고르세요.",
    es: "Elige una carta expuesta un rango por encima o por debajo del descarte.",
    "pt-BR": "Escolha uma carta exposta um valor acima ou abaixo do descarte.",
    fr: "Choisissez une carte visible juste au-dessus ou au-dessous de la défausse.",
    de: "Wähle eine offene Karte genau über oder unter der Ablage.",
    it: "Scegli una carta scoperta di un valore sopra o sotto lo scarto.",
    ru: "Выберите открытую карту на один ранг выше или ниже сброса.",
    hi: "डिस्कार्ड से एक रैंक ऊपर या नीचे का खुला कार्ड चुनें।",
    ar: "اختر بطاقة مكشوفة أعلى أو أدنى بدرجة من المهملات.",
  };
  const formatReplayGoal = (template, target, best) => template
    .replaceAll("{target}", String(target))
    .replaceAll("{best}", String(best));
  const formatProgress = (template, best) => template.replaceAll("{best}", String(best));
  const mount = () => {
    document.body.dataset.gameVersion = "v23";
    const compactGuide = (section = document.querySelector(".game-page-info")) => {
      if (!section || section.dataset.golfGuideCompact === "true") return;
      section.dataset.golfGuideCompact = "true";
      section.classList.add("golf-guide-compact");
      let details = section.querySelector("details.golf-guide-details");
      if (!details) {
        details = document.createElement("details");
        details.className = "golf-guide-details";
        const summary = document.createElement("summary");
        details.append(summary);
        while (section.firstChild) details.append(section.firstChild);
        section.append(details);
      }
      const selectedLocale = document.querySelector("#localeSelect")?.value || "";
      const documentLocale = document.documentElement.lang || "";
      const locale = selectedLocale && selectedLocale !== "en"
        ? selectedLocale
        : (documentLocale && documentLocale !== "en" ? documentLocale : selectedLocale || documentLocale || "en");
      details.querySelector("summary").textContent = GOLF_GUIDE_TOGGLE_COPY[locale] || GOLF_GUIDE_TOGGLE_COPY.en;
    };
    const guideObserver = new MutationObserver(() => {
      document.querySelectorAll(".game-page-info").forEach(compactGuide);
    });
    guideObserver.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll(".game-page-info").forEach(compactGuide);
    document.querySelector("#localeSelect")?.addEventListener("change", () => {
      document.querySelectorAll(".game-page-info").forEach((section) => {
        const summary = section.querySelector("summary");
        if (!summary) return;
        const locale = document.querySelector("#localeSelect")?.value || document.documentElement.lang || "en";
        summary.textContent = GOLF_GUIDE_TOGGLE_COPY[locale] || GOLF_GUIDE_TOGGLE_COPY.en;
      });
    });
    const mainReturn = document.querySelector(".main-return");
    if (mainReturn && !mainReturn.querySelector("img")) {
      const logo = document.createElement("img");
      logo.src = "../../assets/weightplay-logo.png";
      logo.alt = "";
      mainReturn.append(logo);
    }
    document.getElementById("battleBackBtn")?.setAttribute("data-wp-return", "battle");
    const view = window.WPClassicSolitaire?.mount({ variant: "golf", id: "golf-solitaire" });
    if (!view || typeof view.showResult !== "function") return;
    const invalidStyle = document.createElement("style");
    invalidStyle.dataset.wpGolfInvalidFeedback = "true";
    invalidStyle.textContent = `
      .board-status[data-state="golf-invalid"] { color: var(--classic-accent); animation: golf-invalid-selection-cue 480ms cubic-bezier(.2,.8,.3,1); }
      @keyframes golf-invalid-selection-cue {
        0% { opacity: .45; transform: scale(.96); }
        45% { opacity: 1; transform: scale(1.04); }
        100% { opacity: 1; transform: scale(1); }
      }
      .golf-guide-compact {
        width: min(1040px, calc(100% - 24px));
        margin: 12px auto calc(24px + env(safe-area-inset-bottom));
        padding: 14px 16px;
        border: 1px solid rgba(184, 211, 244, .32);
        border-radius: 16px;
        background: rgba(248, 250, 252, .96);
        box-shadow: 0 8px 20px rgba(8, 17, 31, .12);
      }
      .golf-guide-details {
        color: #0b3f63;
      }
      .golf-guide-details > summary {
        min-height: 48px;
        padding: 12px 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        cursor: pointer;
        font-weight: 800;
        list-style-position: inside;
      }
      .golf-guide-details > summary::after {
        content: "＋";
        font-size: 1.2rem;
        line-height: 1;
      }
      .golf-guide-details[open] > summary::after { content: "−"; }
      @media (max-width: 720px) {
        .golf-guide-compact {
          width: min(100% - 16px, 1040px);
          margin-top: 8px;
          padding: 12px;
        }
        .golf-guide-details > summary { padding: 10px 0; }
      }
    `;
    document.head.append(invalidStyle);
    const baseFeedback = view.feedback.bind(view);
    const showInvalidSelectionCue = () => {
      const locale = view.locale || document.documentElement.lang || "en";
      const message = GOLF_INVALID_SELECTION_COPY[locale] || GOLF_INVALID_SELECTION_COPY.en;
      const status = view.nodes?.boardStatus;
      if (status) delete status.dataset.state;
      baseFeedback(message);
      if (!status || view.game?.won || view.game?.lost) return;
      status.dataset.state = "golf-invalid";
      clearTimeout(view.statusTimer);
      view.statusTimer = setTimeout(() => {
        if (status && !view.game?.won && !view.game?.lost) {
          delete status.dataset.state;
          status.textContent = "";
        }
      }, 1800);
    };
    view.feedback = (message) => {
      if (view.config?.variant === "golf" && message === view.t("wrong")) {
        showInvalidSelectionCue();
        return;
      }
      baseFeedback(message);
    };
    const mainProgress = document.getElementById("mainProgress") || (() => {
      const copy = document.querySelector(".main-copy");
      const start = document.getElementById("startBtn");
      if (!copy || !start) return null;
      const node = document.createElement("div");
      node.id = "mainProgress";
      node.className = "main-progress";
      node.dataset.wpMainProgress = "true";
      node.setAttribute("aria-live", "polite");
      const actionGroup = start.closest(".main-actions");
      const owner = actionGroup?.parentElement || start.closest(".wp-standard-main-copy") || copy;
      const anchor = actionGroup?.parentElement === owner ? actionGroup : start;
      owner.insertBefore(node, anchor);
      return node;
    })();
    const battleHeader = document.querySelector("#battleScreen .battle-header");
    let battleUtility = document.getElementById("battleSettingsBtn");
    let battleSettingsPopover = document.getElementById("battleSettingsPopover");
    let battleSoundBtn = document.getElementById("battleSoundBtn");
    if (!battleUtility && battleHeader) {
      battleUtility = document.createElement("button");
      battleUtility.id = "battleSettingsBtn";
      battleUtility.type = "button";
      battleUtility.className = "battle-utility header-icon-btn";
      battleUtility.dataset.wpBattleUtility = "true";
      battleUtility.setAttribute("aria-expanded", "false");
      battleUtility.textContent = "⚙";
      battleHeader.append(battleUtility);
    }
    if (battleUtility && !battleSettingsPopover) {
      battleSettingsPopover = document.createElement("div");
      battleSettingsPopover.id = "battleSettingsPopover";
      battleSettingsPopover.className = "battle-settings-popover";
      battleSettingsPopover.hidden = true;
      battleSettingsPopover.setAttribute("role", "dialog");
      battleSettingsPopover.setAttribute("aria-label", "Settings");
      battleSoundBtn = document.createElement("button");
      battleSoundBtn.id = "battleSoundBtn";
      battleSoundBtn.type = "button";
      battleSoundBtn.className = "settings-row";
      battleSettingsPopover.append(battleSoundBtn);
      battleHeader.append(battleSettingsPopover);
      battleUtility.addEventListener("click", () => {
        battleSettingsPopover.hidden = !battleSettingsPopover.hidden;
        battleUtility.setAttribute("aria-expanded", String(!battleSettingsPopover.hidden));
      });
      battleSoundBtn.addEventListener("click", () => {
        view.audio?.setEnabled?.(!view.audio.enabled);
        updateBattleUtility();
      });
    }
    const updateProgress = () => {
      if (!mainProgress) return;
      const locale = view.locale || document.documentElement.lang || "en";
      const best = Math.max(0, Number(view.game?.bestCombo) || 0);
      mainProgress.textContent = formatProgress(GOLF_PROGRESS_COPY[locale] || GOLF_PROGRESS_COPY.en, best);
    };
    const updateBattleUtility = () => {
      if (!battleUtility) return;
      const locale = view.locale || document.documentElement.lang || "en";
      const soundLabel = view.audio?.enabled ? view.t("soundOn") : view.t("soundOff");
      battleUtility.setAttribute("aria-label", view.t("settings"));
      battleUtility.title = soundLabel;
      if (battleSoundBtn) {
        battleSoundBtn.textContent = soundLabel;
        battleSoundBtn.setAttribute("aria-pressed", String(Boolean(view.audio?.enabled)));
        battleSettingsPopover?.setAttribute("aria-label", view.t("settings"));
      }
      battleUtility.dataset.locale = locale;
    };
    const renderMain = view.renderMain?.bind(view);
    if (renderMain) view.renderMain = () => { renderMain(); updateProgress(); };
    const refreshCopy = view.refreshCopy?.bind(view);
    if (refreshCopy) view.refreshCopy = () => { refreshCopy(); updateProgress(); updateBattleUtility(); };
    updateProgress();
    updateBattleUtility();
    const showResult = view.showResult.bind(view);
    const resultCard = view.nodes.resultText?.closest(".result-card");
    const resultBoundary = resultCard ? (() => {
      const node = document.createElement("p");
      node.className = "golf-result-boundary";
      node.dataset.wpGolfResultBoundary = "true";
      node.setAttribute("aria-live", "polite");
      const actions = resultCard.querySelector(".result-actions");
      resultCard.insertBefore(node, actions || null);
      return node;
    })() : null;
    view.showResult = () => {
      showResult();
      if (!view.nodes?.resultText) return;
      const locale = view.locale || document.documentElement.lang || "en";
      let boundary = "";
      if (view.game?.lost) {
        const reason = GOLF_FAILURE_REASON_COPY[locale] || GOLF_FAILURE_REASON_COPY.en;
        boundary = reason;
      }
      if (view.game?.won) {
        const actions = GOLF_RESULT_ACTION_COPY[locale] || GOLF_RESULT_ACTION_COPY.en;
        boundary = actions;
      }
      if (resultBoundary) {
        resultBoundary.textContent = boundary;
        resultBoundary.hidden = !boundary;
      }
      if (!view.game?.won && !view.game?.lost) return;
      const best = Math.max(0, Number(view.game?.bestCombo) || 0);
      const target = Math.min(35, Math.max(2, best + 1));
      const goal = GOLF_REPLAY_GOAL_COPY[locale] || GOLF_REPLAY_GOAL_COPY.en;
      view.nodes.resultText.textContent = `${view.nodes.resultText.textContent} ${formatReplayGoal(goal, target, best)}`;
    };
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
