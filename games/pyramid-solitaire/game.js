(function () {
  "use strict";

  const RESULT_SUMMARY_COPY = {
    en: "Strategy recap — Score {score} · Peak Combo ×{combo} · Stock used {stock} · Cards left {remaining}",
    "zh-Hant": "策略回顧：分數 {score}・最高連鎖 ×{combo}・使用牌庫 {stock} 張・剩餘金字塔牌 {remaining} 張",
    "zh-Hans": "策略回顾：分数 {score}・最高连锁 ×{combo}・使用牌库 {stock} 张・剩余金字塔牌 {remaining} 张",
    ja: "プレイ記録：スコア {score}・最大コンボ ×{combo}・山札使用 {stock}枚・残りのピラミッド {remaining}枚",
    ko: "플레이 요약: 점수 {score} · 최고 콤보 ×{combo} · 덱 사용 {stock}장 · 남은 피라미드 {remaining}장",
    es: "Resumen: puntuación {score} · combo máximo ×{combo} · cartas del mazo {stock} · pirámide restante {remaining}",
    "pt-BR": "Resumo: pontuação {score} · melhor combo ×{combo} · cartas do monte {stock} · pirâmide restante {remaining}",
    fr: "Bilan : score {score} · meilleur combo ×{combo} · cartes de la pioche {stock} · pyramide restante {remaining}",
    de: "Rückblick: Punkte {score} · bester Combo ×{combo} · Karten vom Stapel {stock} · Pyramide übrig {remaining}",
    it: "Riepilogo: punteggio {score} · combo massimo ×{combo} · carte dal mazzo {stock} · piramide rimanente {remaining}",
    ru: "Итоги: очки {score} · лучший комбо ×{combo} · карт из колоды {stock} · карт в пирамиде {remaining}",
    hi: "खेल सारांश: स्कोर {score} · सबसे बड़ा कॉम्बो ×{combo} · डेक से ली गई पत्तियाँ {stock} · पिरामिड में शेष {remaining}",
    ar: "ملخص اللعب: النقاط {score} · أعلى سلسلة ×{combo} · بطاقات السحب {stock} · بطاقات الهرم المتبقية {remaining}",
  };
  const STOCK_COMBO_COPY = {
    en: "Stock draw ends Combo ×{combo}. Find the next pair.",
    "zh-Hant": "翻開牌庫會結束連鎖 ×{combo}；找找下一組可配對的牌。",
    "zh-Hans": "翻开牌库会结束连锁 ×{combo}；找找下一组可配对的牌。",
    ja: "山札を引くとコンボ ×{combo} が途切れます。次のペアを探しましょう。",
    ko: "덱을 뽑으면 콤보 ×{combo}가 끊깁니다. 다음 짝을 찾아 보세요.",
    es: "Robar del mazo rompe el combo ×{combo}. Busca la próxima pareja.",
    "pt-BR": "Comprar do monte quebra o combo ×{combo}. Procure o próximo par.",
    fr: "Piocher casse le combo ×{combo}. Cherchez la prochaine paire.",
    de: "Ein Zug vom Stapel beendet die Kombo ×{combo}. Suche das nächste Paar.",
    it: "Pescare dal mazzo interrompe la combo ×{combo}. Cerca la prossima coppia.",
    ru: "Добор из колоды прерывает комбо ×{combo}. Ищите следующую пару.",
    hi: "डेक से पत्ता लेने पर कॉम्बो ×{combo} टूटता है। अगली जोड़ी खोजें।",
    ar: "سحب بطاقة من الرزمة يقطع السلسلة ×{combo}. ابحث عن الزوج التالي.",
  };

  const formatSummary = (template, values) => template.replace(/\{(score|combo|stock|remaining)\}/gu, (_, key) => String(values[key]));
  const view = window.WPClassicSolitaire?.mount({ variant: "pyramid", id: "pyramid-solitaire" });
  if (!view) return;
  let pendingStockDraw = null;
  let stockCueTimer = null;

  const PYRAMID_SUIT_LABELS = Object.freeze({
    en: { spades: "Spades", hearts: "Hearts", clubs: "Clubs", diamonds: "Diamonds" },
    "zh-Hant": { spades: "黑桃", hearts: "紅心", clubs: "梅花", diamonds: "方塊" },
    "zh-Hans": { spades: "黑桃", hearts: "红心", clubs: "梅花", diamonds: "方块" },
    ja: { spades: "スペード", hearts: "ハート", clubs: "クラブ", diamonds: "ダイヤ" },
    ko: { spades: "스페이드", hearts: "하트", clubs: "클럽", diamonds: "다이아몬드" },
    es: { spades: "picas", hearts: "corazones", clubs: "tréboles", diamonds: "diamantes" },
    "pt-BR": { spades: "espadas", hearts: "copas", clubs: "paus", diamonds: "ouros" },
    fr: { spades: "piques", hearts: "cœurs", clubs: "trèfles", diamonds: "carreaux" },
    de: { spades: "Pik", hearts: "Herz", clubs: "Kreuz", diamonds: "Karo" },
    it: { spades: "picche", hearts: "cuori", clubs: "fiori", diamonds: "quadri" },
    ru: { spades: "пики", hearts: "червы", clubs: "трефы", diamonds: "бубны" },
    hi: { spades: "हुकुम", hearts: "पान", clubs: "चिड़ी", diamonds: "ईंट" },
    ar: { spades: "البستوني", hearts: "القلوب", clubs: "النوادي", diamonds: "الماس" },
  });

  const localizedSuitLabel = (suit) => PYRAMID_SUIT_LABELS[view.locale]?.[suit] || PYRAMID_SUIT_LABELS.en[suit] || suit;
  const localizeCardAria = (node) => {
    if (!node.classList.contains("front")) return;
    let source;
    try { source = JSON.parse(node.dataset.source || ""); } catch { return; }
    const card = view.game.sourceCard(source);
    if (!card) return;
    node.setAttribute("aria-label", view.t("ariaCard", {
      rank: card.rankLabel || String(card.rank),
      suit: localizedSuitLabel(card.suit),
    }));
  };

  const updateCardInteractionSemantics = () => {
    const tableau = view.nodes?.tableauArea;
    const waste = view.nodes?.wastePile;
    [tableau, waste].filter(Boolean).forEach((region) => region.querySelectorAll(".classic-card").forEach(localizeCardAria));
    if (!tableau) return;
    tableau.querySelectorAll(".classic-card").forEach((card) => {
      const covered = card.classList.contains("covered");
      card.disabled = covered;
      card.tabIndex = covered ? -1 : 0;
      if (covered) card.setAttribute("aria-disabled", "true");
      else card.removeAttribute("aria-disabled");
    });
  };

  const updateResultSummary = () => {
    if (!view.game?.won && !view.game?.lost) return;
    const resultText = view.nodes?.resultText;
    if (!resultText) return;
    const remaining = view.game.remainingCards();
    const values = {
      score: 28 - remaining,
      combo: view.game.bestCombo || 0,
      stock: 24 - view.game.stock.length,
      remaining,
    };
    const copy = RESULT_SUMMARY_COPY[view.locale] || RESULT_SUMMARY_COPY.en;
    const outcome = view.game.won ? view.t("winText") : view.t("loseText");
    resultText.textContent = `${outcome} ${formatSummary(copy, values)}`;
  };

  const showStockComboCue = (combo) => {
    const status = view.nodes?.boardStatus;
    if (!status || view.game.won || view.game.lost || combo < 1) return;
    const copy = STOCK_COMBO_COPY[view.locale] || STOCK_COMBO_COPY.en;
    status.setAttribute("data-runtime-localize", "off");
    status.dataset.state = "stock";
    status.textContent = formatSummary(copy, { combo });
    clearTimeout(stockCueTimer);
    stockCueTimer = window.setTimeout(() => {
      if (status && status.dataset.state === "stock" && !view.game.won && !view.game.lost) {
        delete status.dataset.state;
        status.textContent = "";
      }
      status?.removeAttribute("data-runtime-localize");
    }, 1500);
  };

  view.nodes?.stockPile?.addEventListener("click", () => {
    const marker = {};
    pendingStockDraw = { marker, stockBefore: view.game.stock.length, comboBefore: view.game.combo };
    window.setTimeout(() => {
      if (pendingStockDraw?.marker === marker) pendingStockDraw = null;
    }, 0);
  }, true);

  const render = view.render.bind(view);
  view.render = (...args) => {
    render(...args);
    updateCardInteractionSemantics();
    updateResultSummary();
    const pending = pendingStockDraw;
    if (pending && view.game.stock.length < pending.stockBefore) {
      pendingStockDraw = null;
      if (pending.comboBefore > 0 && view.game.combo === 0) showStockComboCue(pending.comboBefore);
    }
  };
  updateCardInteractionSemantics();
})();
