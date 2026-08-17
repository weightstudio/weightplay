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

  const formatSummary = (template, values) => template.replace(/\{(score|combo|stock|remaining)\}/gu, (_, key) => String(values[key]));
  const view = window.WPClassicSolitaire?.mount({ variant: "pyramid", id: "pyramid-solitaire" });
  if (!view) return;

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

  const render = view.render.bind(view);
  view.render = (...args) => {
    render(...args);
    updateResultSummary();
  };
})();
