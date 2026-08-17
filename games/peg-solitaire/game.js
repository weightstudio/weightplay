(() => {
  "use strict";

  window.WPClassicLogic?.mount("peg-solitaire");

  const lessonCopy = {
    en: {
      success: "One peg left after {moves} moves—you reached the goal. Replay and look for a route that keeps an exit open.",
      failure: "{pegs} pegs remain; the goal is one. Replay and protect an open landing hole before your next jump.",
    },
    "zh-Hant": {
      success: "剩下 1 顆棋子，走了 {moves} 步——你達成目標了。再玩一次，試著保留一條出口路線。",
      failure: "還剩 {pegs} 顆棋子；目標是留下 1 顆。再玩一次，下一步先保留可落子的空洞。",
    },
    "zh-Hans": {
      success: "剩下 1 颗棋子，走了 {moves} 步——你达成目标了。再玩一次，试着保留一条出口路线。",
      failure: "还剩 {pegs} 颗棋子；目标是留下 1 颗。再玩一次，下一步先保留可落子的空洞。",
    },
    ja: {
      success: "{moves}手でペグが1個残り、目標を達成しました。もう一度遊び、出口を残す道を探しましょう。",
      failure: "ペグが{pegs}個残りました。目標は1個です。もう一度遊び、次のジャンプ先を残しましょう。",
    },
    ko: {
      success: "{moves}번 만에 말 1개가 남아 목표를 달성했어요. 다시 하며 출구를 남기는 경로를 찾아 보세요.",
      failure: "말이 {pegs}개 남았어요. 목표는 1개예요. 다시 하며 다음 착지 칸을 열어 두세요.",
    },
    es: {
      success: "Queda una ficha tras {moves} movimientos: has alcanzado el objetivo. Repite y busca una ruta que deje una salida abierta.",
      failure: "Quedan {pegs} fichas; el objetivo es una. Repite y conserva un hueco de llegada antes del próximo salto.",
    },
    "pt-BR": {
      success: "Restou 1 pino após {moves} movimentos — você alcançou o objetivo. Jogue de novo e procure uma rota que mantenha uma saída aberta.",
      failure: "Restaram {pegs} pinos; o objetivo é 1. Jogue de novo e preserve uma casa de chegada antes do próximo salto.",
    },
    fr: {
      success: "Il reste un pion après {moves} coups : objectif atteint. Rejouez et cherchez une route qui garde une sortie ouverte.",
      failure: "Il reste {pegs} pions ; l’objectif est d’en garder un. Rejouez et préservez une case d’arrivée avant le prochain saut.",
    },
    de: {
      success: "Nach {moves} Zügen ist ein Stein übrig — Ziel erreicht. Spiele erneut und halte einen Ausweg offen.",
      failure: "Es sind noch {pegs} Steine übrig; das Ziel ist einer. Spiele erneut und halte vor dem nächsten Sprung ein Zielfeld frei.",
    },
    it: {
      success: "È rimasto un piolo dopo {moves} mosse: hai raggiunto l’obiettivo. Rigioca e cerca un percorso che lasci un’uscita aperta.",
      failure: "Sono rimasti {pegs} pioli; l’obiettivo è uno. Rigioca e lascia libera una casella di arrivo prima del prossimo salto.",
    },
    ru: {
      success: "После {moves} ходов осталась одна фишка — цель достигнута. Сыграйте ещё раз и оставьте открытый путь.",
      failure: "Осталось фишек: {pegs}; цель — одна. Сыграйте ещё раз и оставьте свободную клетку для следующего прыжка.",
    },
    hi: {
      success: "{moves} चालों के बाद 1 गोटी बची—लक्ष्य पूरा हुआ। फिर खेलें और एक खुला रास्ता बचाने की कोशिश करें।",
      failure: "{pegs} गोटियाँ बची हैं; लक्ष्य 1 है। फिर खेलें और अगली छलांग के लिए उतरने की जगह खुली रखें।",
    },
    ar: {
      success: "تبقى حجر واحد بعد {moves} حركات — لقد حققت الهدف. أعد اللعب وابحث عن مسار يترك مخرجًا مفتوحًا.",
      failure: "تبقى {pegs} أحجار؛ الهدف حجر واحد. أعد اللعب واترك حفرة هبوط مفتوحة قبل القفزة التالية.",
    },
  };
  const locale = document.documentElement.lang || "en";
  const copy = lessonCopy[locale] || lessonCopy.en;
  const result = document.querySelector("#logicResult");
  const resultText = document.querySelector("#logicResultText");
  if (!result || !resultText) return;

  const fill = (template, values) => Object.entries(values).reduce(
    (value, [key, replacement]) => value.replace(`{${key}}`, String(replacement)),
    template,
  );
  const renderLesson = () => {
    if (result.hidden) {
      resultText.removeAttribute("data-peg-result-base");
      resultText.removeAttribute("data-peg-result-lesson");
      return;
    }
    const pegs = document.querySelectorAll(".logic-peg-board .logic-cell.peg").length;
    const base = resultText.dataset.pegResultBase || resultText.textContent || "";
    const success = pegs === 1;
    const numbers = base.match(/\d+/g) || [];
    const lesson = fill(success ? copy.success : copy.failure, {
      pegs,
      moves: numbers[numbers.length - 1] || 0,
    });
    if (resultText.dataset.pegResultLesson === lesson && resultText.textContent === `${base} · ${lesson}`) return;
    resultText.dataset.pegResultBase = base;
    resultText.dataset.pegResultLesson = lesson;
    resultText.textContent = `${base} · ${lesson}`;
  };

  new MutationObserver(renderLesson).observe(result, {
    attributes: true,
    attributeFilter: ["hidden"],
    childList: true,
    characterData: true,
    subtree: true,
  });
})();
